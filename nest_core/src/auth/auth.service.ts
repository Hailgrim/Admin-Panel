import {
  ForbiddenException,
  GoneException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { CookieSerializeOptions } from '@fastify/cookie';

import { UsersService } from '../users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { ResourcesService } from 'src/resources/resources.service';
import {
  ICookiesResponse,
  IRequestUser,
  ISession,
  ITokensResponse,
  IUser,
} from 'libs/types';
import { User } from 'src/users/user.entity';
import { SignInDto } from './dto/sign-in-auth.dto';
import { MAIL_SERVER, SESSION_REPOSITORY } from 'libs/constants';
import {
  ACCESS_TOKEN_LIFETIME,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_LIFETIME,
  REFRESH_TOKEN_SECRET_KEY,
  NGINX_HOST,
} from 'libs/config';
import { Session } from './session.entity';
import { Role } from 'src/roles/role.entity';
import { CreateResourceDto } from 'src/resources/dto/create-resource.dto';
import lang from 'libs/lang';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/sign-up.dts';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MAIL_SERVER)
    private mailClient: ClientProxy,
    @Inject(SESSION_REPOSITORY)
    private sessionsRepository: typeof Session,
    private jwtService: JwtService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private resourcesService: ResourcesService,
    private redisService: RedisService,
  ) {}

  async validateUser(signInDto: SignInDto) {
    try {
      const user = await this.usersService.findOneAuth(signInDto.username);
      if (await argon2.verify(user.password, signInDto.password)) {
        const result: Partial<User> = { ...user.dataValues };
        delete result.password;
        result.roles = user.roles;
        return result;
      }
      return null;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async checkDefaultData(): Promise<Role> {
    try {
      // Verify the existence of the default resources
      const defaultResources = await this.resourcesService.findAllPublic(
        undefined,
        true,
      );
      const checkedResources: CreateResourceDto[] = [
        'profile',
        'users',
        'roles',
        'resources',
      ]
        .filter(
          (value) =>
            !defaultResources.find((resource) => resource.path === value),
        )
        .map((value) => {
          return {
            path: value,
            name: value.replace(value[0], value[0].toUpperCase()),
            description: lang.get('en')?.defaultResource(value) || null,
            enabled: true,
          };
        });
      if (checkedResources.length > 0) {
        await this.resourcesService.createMany(checkedResources);
      }

      // Verify the existence of the administrator role
      const adminRole = await this.rolesService.findOrCreateDefault(
        'Administrator',
        lang.get('en')?.defaultAdminRole,
        true,
      );

      // Verify the existence of the user role
      const userRole = await this.rolesService.findOrCreateDefault(
        'User',
        lang.get('en')?.defaultUserRole,
      );

      // Verify the existence of the administrator users
      const adminUsers = await this.usersService.countByRole(adminRole.id);

      return adminUsers == 0 ? adminRole : userRole;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const defaultRole = await this.checkDefaultData();
    const user = await this.usersService.create(
      { ...signUpDto, enabled: true },
      [defaultRole],
    );
    return user;
  }

  prepareCookie(maxAge = ACCESS_TOKEN_LIFETIME): CookieSerializeOptions {
    return {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      maxAge,
      domain: `.${NGINX_HOST}`,
    };
  }

  async createTokens(
    payload: IRequestUser,
    remember?: boolean,
  ): Promise<ITokensResponse> {
    try {
      return {
        accessToken: await this.jwtService.signAsync(payload, {
          secret: ACCESS_TOKEN_SECRET_KEY,
          expiresIn: ACCESS_TOKEN_LIFETIME,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          secret: REFRESH_TOKEN_SECRET_KEY,
          expiresIn: remember
            ? REFRESH_TOKEN_LIFETIME
            : ACCESS_TOKEN_LIFETIME * 2,
        }),
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async signIn(
    user: IUser,
    remember?: boolean,
    oldSessionId?: string,
  ): Promise<ICookiesResponse> {
    if (!user.enabled) {
      throw new GoneException();
    }

    if (!user.verified) {
      const code = crypto.randomBytes(10).toString('hex');
      await this.usersService.updateVerificationCode(user.email, code);
      this.mailClient
        .send({ method: 'registration' }, { email: user.email, code })
        .subscribe();
      throw new ForbiddenException();
    }

    let sessionId: number;
    let sessionHash: string;

    try {
      sessionHash = await argon2.hash(crypto.randomBytes(10));
      const expirationTime = new Date();
      expirationTime.setTime(
        remember
          ? expirationTime.getTime() + REFRESH_TOKEN_LIFETIME * 1000
          : expirationTime.getTime() + ACCESS_TOKEN_LIFETIME * 2000,
      );

      const sessionData: ISession = {
        userId: user.id,
        hash: sessionHash,
        expires: expirationTime,
      };

      let updatedRows = 0;
      if (oldSessionId) {
        [updatedRows] = await this.sessionsRepository.update(
          { hash: sessionHash, expires: expirationTime },
          { where: { id: oldSessionId, userId: user.id } },
        );
      }

      if (updatedRows > 0) {
        sessionId = Number(oldSessionId);
      } else {
        const session = await this.sessionsRepository.create(sessionData);
        sessionId = session.id;
      }

      await this.redisService.set(`sessions:${sessionId}`, sessionData);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    const tokens = await this.createTokens(
      { id: user.id, email: user.email, sessionId, sessionHash },
      remember,
    );

    return { ...tokens, sessionId };
  }

  async verifyUser(verifyUserDto: VerifyUserDto): Promise<boolean> {
    return await this.usersService.updateVerificationCode(
      verifyUserDto.email,
      verifyUserDto.code,
      true,
    );
  }

  async forgotPassword(email: string): Promise<boolean> {
    const code = crypto.randomBytes(10).toString('hex');
    if (await this.usersService.updateResetPasswordCode(email, code)) {
      this.mailClient
        .send({ method: 'forgotPassword' }, { email, code })
        .subscribe();
    }
    return true;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    return await this.usersService.updatePassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.password,
    );
  }

  async refresh(
    reqUser: IRequestUser,
    remember?: boolean,
  ): Promise<ITokensResponse> {
    let newHash: string;
    try {
      newHash = await argon2.hash(crypto.randomBytes(10));
    } catch (error) {
      throw new InternalServerErrorException();
    }

    let updatedRows = 0;
    if (reqUser.sessionId && reqUser.sessionHash) {
      const expirationTime = new Date();
      expirationTime.setTime(
        remember
          ? expirationTime.getTime() + REFRESH_TOKEN_LIFETIME * 1000
          : expirationTime.getTime() + ACCESS_TOKEN_LIFETIME * 2000,
      );

      try {
        const session = await this.redisService.get<ISession>(
          `sessions:${reqUser.sessionId}`,
          true,
        );

        if (
          session &&
          session.userId == reqUser.id &&
          session.hash == reqUser.sessionHash
        ) {
          await this.redisService.set(`sessions:${reqUser.sessionId}`, {
            userId: reqUser.id,
            hash: newHash,
            expires: expirationTime,
          });
          updatedRows = 1;
        }
      } catch (error) {
        try {
          [updatedRows] = await this.sessionsRepository.update(
            { hash: newHash, expires: expirationTime },
            {
              where: {
                id: reqUser.sessionId,
                userId: reqUser.id,
                hash: reqUser.sessionHash,
              },
            },
          );
        } catch (error) {
          throw new InternalServerErrorException();
        }
      }
    }

    if (updatedRows === 0) {
      throw new UnauthorizedException();
    }

    return this.createTokens(
      {
        id: reqUser.id,
        email: reqUser.email,
        sessionId: reqUser.sessionId,
        sessionHash: newHash,
      },
      remember,
    );
  }

  async getProfile(reqUser: IRequestUser): Promise<User> {
    return await this.usersService.findOnePublic(reqUser.id);
  }

  async updateProfile(
    reqUser: IRequestUser,
    updateProfileDto: UpdateProfileDto,
  ): Promise<boolean> {
    return this.usersService.updateFields(reqUser.id, updateProfileDto);
  }

  async signOut(reqUser: IRequestUser): Promise<boolean> {
    const sessionId = reqUser.sessionId;
    const sessionHash = reqUser.sessionHash;

    try {
      if (sessionId && sessionHash) {
        await this.sessionsRepository.destroy({
          where: { id: sessionId, hash: sessionHash },
        });
        await this.redisService.del(`sessions:${sessionId}`);
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return true;
  }
}
