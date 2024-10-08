import {
  ForbiddenException,
  GoneException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { UsersService } from '../users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { ResourcesService } from 'src/resources/resources.service';
import { User } from 'src/users/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import {
  ACCESS_TOKEN_LIFETIME,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from 'libs/config';
import { Role } from 'src/roles/role.entity';
import { CreateResourceDto } from 'src/resources/dto/create-resource.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/sign-up.dts';
import { RedisService } from 'src/redis/redis.service';
import d from 'locales/dictionary';
import { ISession, IToken, ITokensPair } from './auth.types';
import { IUser } from 'src/users/users.types';
import { generateCode } from './auth.utils';
import { RmqService } from 'src/rmq/rmq.service';

@Injectable()
export class AuthService {
  constructor(
    private rmqService: RmqService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private resourcesService: ResourcesService,
    private redisService: RedisService,
  ) {}

  async checkDefaultData(): Promise<Role> {
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
          description: d['en'].defaultResource(value),
          enabled: true,
        };
      });

    if (checkedResources.length > 0) {
      await this.resourcesService.createManyDefault(checkedResources);
    }

    // Verify the existence of the administrator role
    const adminRole = await this.rolesService.findOrCreateDefault(
      'Administrator',
      d['en'].defaultAdminRole,
      true,
    );

    // Verify the existence of the user role
    const userRole = await this.rolesService.findOrCreateDefault(
      'User',
      d['en'].defaultUserRole,
    );

    // Verify the existence of the administrator users
    const adminUsers = await this.usersService.countByRole(adminRole.id);

    return adminUsers === 0 ? adminRole : userRole;
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const defaultRole = await this.checkDefaultData();
    return this.usersService.create({ ...signUpDto, enabled: true }, [
      defaultRole,
    ]);
  }

  async validateUser(signInDto: SignInDto) {
    try {
      const user = await this.usersService.findOneAuth(signInDto.username);

      if (
        !user.password ||
        !(await argon2.verify(user.password, signInDto.password))
      ) {
        throw null;
      }

      const result: Partial<User> = { ...user.dataValues };
      delete result.password;
      result.roles = user.roles;
      return result;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async createTokens(
    payload: Buffer | object,
    sessionTtl: number,
  ): Promise<ITokensPair> {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: ACCESS_TOKEN_SECRET_KEY,
        expiresIn: ACCESS_TOKEN_LIFETIME,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: REFRESH_TOKEN_SECRET_KEY,
        expiresIn: sessionTtl,
      }),
    };
  }

  async signIn(
    user: IUser,
    sessionTtl: number,
    ip: string,
    userAgent?: string,
  ): Promise<ITokensPair> {
    if (!user.enabled) {
      throw new GoneException();
    }

    if (!user.verified) {
      if (user.email) {
        const code = generateCode();
        await this.usersService.updateVerificationCode(user.email, code);
        this.rmqService.sendEmail(
          { method: 'registration' },
          { email: user.email, code },
        );
      }

      throw new ForbiddenException();
    }

    const sessionId = uuidv4();
    const sessionPayload = await argon2.hash(crypto.randomBytes(10));
    const sessionData: ISession = {
      payload: sessionPayload,
      expires: new Date(Date.now() + sessionTtl * 1000),
      userId: user.id,
      ip,
      userAgent,
      updatedAt: new Date(),
    };

    await this.redisService.set(
      `sessions:${user.id}:${sessionId}`,
      sessionData,
      sessionTtl * 1000,
    );

    return this.createTokens(
      { userId: user.id, sessionId, sessionPayload },
      sessionTtl,
    );
  }

  async signInGoogle(
    googleAccessToken: string,
    sessionTtl: number,
    ip: string,
    userAgent?: string,
  ): Promise<ITokensPair & { user: IUser }> {
    let googleUser: Record<string, string> | null = null;

    try {
      const googleRes = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleAccessToken}`,
      );
      googleUser = await googleRes.json();

      if (!googleUser || !googleUser['id'] || !googleUser['name'])
        throw new InternalServerErrorException();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    const defaultRole = await this.checkDefaultData();
    const user = await this.usersService.createByGoogle(
      googleUser['id'],
      googleUser['name'],
      [defaultRole],
    );

    return {
      ...(await this.signIn(user, sessionTtl, ip, userAgent)),
      user: { ...user.dataValues, roles: user.roles },
    };
  }

  verifyUser(verifyUserDto: VerifyUserDto): Promise<boolean> {
    return this.usersService.updateVerificationStatus(
      verifyUserDto.email,
      verifyUserDto.code,
    );
  }

  async forgotPassword(email: string): Promise<boolean> {
    const code = generateCode();

    if (await this.usersService.updateResetPasswordCode(email, code)) {
      this.rmqService.sendEmail({ method: 'forgotPassword' }, { email, code });
    }

    return true;
  }

  resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    return this.usersService.updatePasswordWithCode(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.password,
    );
  }

  async refresh(
    token: IToken,
    sessionTtl: number,
    ip: string,
    userAgent?: string,
  ): Promise<ITokensPair> {
    const newPayload = await argon2.hash(crypto.randomBytes(10));
    const session = await this.redisService.get<ISession>(
      `sessions:${token.userId}:${token.sessionId}`,
    );

    if (
      session?.userId === token.userId &&
      session.payload === token.sessionPayload
    ) {
      const sessionData: ISession = {
        payload: newPayload,
        expires: new Date(Date.now() + sessionTtl * 1000),
        userId: token.userId,
        ip,
        userAgent,
        updatedAt: new Date(),
      };

      await this.redisService.set(
        `sessions:${token.userId}:${token.sessionId}`,
        sessionData,
        sessionTtl * 1000,
      );
    } else {
      throw new UnauthorizedException();
    }

    return this.createTokens(
      {
        userId: token.userId,
        sessionId: token.sessionId,
        sessionPayload: newPayload,
      },
      sessionTtl,
    );
  }

  async signOut(token: IToken): Promise<boolean> {
    await this.redisService.del(`sessions:${token.userId}:${token.sessionId}`);
    return true;
  }
}
