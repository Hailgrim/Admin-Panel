import {
  ForbiddenException,
  GoneException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

import { UsersService } from '../users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { ResourcesService } from 'src/resources/resources.service';
import { IRequestUser, ITokensResponse, IUser } from 'libs/types';
import { User } from 'src/users/user.entity';
import { SignInDto } from './dto/sign-in-auth.dto';
import { SESSION_REPOSITORY } from 'libs/constants';
import {
  ACCESS_TOKEN_LIFETIME,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_LIFETIME,
  REFRESH_TOKEN_SECRET_KEY,
} from 'libs/config';
import { Session } from './session.entity';
import { Role } from 'src/roles/role.entity';
import { CreateResourceDto } from 'src/resources/dto/create-resource.dto';
import lang from 'libs/lang';
import { MailService } from 'src/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/sign-up.dts';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(SESSION_REPOSITORY)
    private sessionsRepository: typeof Session,
    private usersService: UsersService,
    private rolesService: RolesService,
    private resourcesService: ResourcesService,
    private mailService: MailService,
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
      const checkedКesources: CreateResourceDto[] = [
        'profile',
        'users',
        'roles',
        'resources',
        'files',
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
          };
        });
      if (checkedКesources.length > 0) {
        await this.resourcesService.createMany(checkedКesources);
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

  async signIn(user: IUser, remember?: boolean): Promise<ITokensResponse> {
    if (!user.enabled) {
      throw new GoneException();
    }

    if (!user.verified) {
      const code = crypto.randomBytes(10).toString('hex');
      await this.usersService.updateVerification(user.email, code);
      await this.mailService.registration(user.email, code);
      throw new ForbiddenException();
    }

    let sessionId: number;
    let sessionHash: string;

    try {
      sessionHash = await argon2.hash(crypto.randomBytes(10));
      const refreshTokenExpiration = new Date();
      refreshTokenExpiration.setTime(
        remember
          ? refreshTokenExpiration.getTime() + REFRESH_TOKEN_LIFETIME * 1000
          : refreshTokenExpiration.getTime() + ACCESS_TOKEN_LIFETIME * 2000,
      );

      const session = await this.sessionsRepository.create({
        userId: user.id,
        hash: sessionHash,
        expires: refreshTokenExpiration,
      });
      sessionId = session.id;
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return this.createTokens(
      { id: user.id, email: user.email, sessionId, sessionHash },
      remember,
    );
  }

  async verifyUser(verifyUserDto: VerifyUserDto): Promise<boolean> {
    return await this.usersService.updateVerification(
      verifyUserDto.email,
      verifyUserDto.code,
      true,
    );
  }

  async forgotPassword(email: string): Promise<boolean> {
    const code = crypto.randomBytes(10).toString('hex');
    await this.usersService.updatePassword(email, code);
    await this.mailService.forgotPassword(email, code);
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
    const sessionId = reqUser.sessionId;
    let sessionHash: string;
    let updatedRows = 0;

    try {
      sessionHash = await argon2.hash(crypto.randomBytes(10));
      const refreshTokenExpiration = new Date();
      refreshTokenExpiration.setTime(
        remember
          ? refreshTokenExpiration.getTime() + REFRESH_TOKEN_LIFETIME * 1000
          : refreshTokenExpiration.getTime() + ACCESS_TOKEN_LIFETIME * 2000,
      );

      if (sessionId !== undefined && reqUser.sessionHash !== undefined) {
        [updatedRows] = await this.sessionsRepository.update(
          { hash: sessionHash, expires: refreshTokenExpiration },
          { where: { userId: reqUser.id, hash: reqUser.sessionHash } },
        );
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (updatedRows === 0) {
      throw new UnauthorizedException();
    }

    return this.createTokens(
      { id: reqUser.id, email: reqUser.email, sessionId, sessionHash },
      remember,
    );
  }

  async getProfile(reqUser: IRequestUser): Promise<User> {
    if (reqUser?.id) {
      const user = await this.usersService.findOnePublic(reqUser.id);
      if (user) {
        return user;
      }
    }
    throw new UnauthorizedException();
  }

  async updateProfile(
    reqUser: IRequestUser,
    updateProfileDto: UpdateProfileDto,
  ): Promise<boolean> {
    if (reqUser?.id) {
      return this.usersService.updateFields(reqUser.id, updateProfileDto);
    }
    throw new UnauthorizedException();
  }

  async signOut(reqUser: IRequestUser): Promise<boolean> {
    const sessionId = reqUser.sessionId;
    const sessionHash = reqUser.sessionHash;
    let destroyedRows = 0;

    try {
      if (sessionId && sessionHash) {
        destroyedRows = await this.sessionsRepository.destroy({
          where: { id: sessionId, hash: sessionHash },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (destroyedRows === 0) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
