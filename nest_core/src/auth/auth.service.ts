import {
  ForbiddenException,
  GoneException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { CookieSerializeOptions } from '@fastify/cookie';
import { v4 as uuidv4 } from 'uuid';

import { UsersService } from '../users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { ResourcesService } from 'src/resources/resources.service';
import { User } from 'src/users/user.entity';
import { SignInDto } from './dto/sign-in-auth.dto';
import { MAIL_SERVER } from 'libs/constants';
import {
  ACCESS_TOKEN_LIFETIME,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  NGINX_HOST,
} from 'libs/config';
import { Role } from 'src/roles/role.entity';
import { CreateResourceDto } from 'src/resources/dto/create-resource.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/sign-up.dts';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RedisService } from 'src/redis/redis.service';
import d from 'locales/dictionary';
import { ISession, IToken, ITokensPair } from './auth.types';
import { IUser } from 'src/users/users.types';
import { ExternalSessionDto } from './dto/external-session.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MAIL_SERVER)
    private mailClient: ClientProxy,
    private jwtService: JwtService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private resourcesService: ResourcesService,
    private redisService: RedisService,
  ) {}

  generateCode(): string {
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  }

  prepareCookie(
    maxAge: number = ACCESS_TOKEN_LIFETIME,
  ): CookieSerializeOptions {
    return {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      maxAge,
      domain: `.${NGINX_HOST}`,
    };
  }

  async createTokens<T extends Buffer | object>(
    payload: T,
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

  async validateUser(signInDto: SignInDto) {
    try {
      const user = await this.usersService.findOneAuth(signInDto.username);

      if (await argon2.verify(user.password, signInDto.password)) {
        const result: Partial<User> = { ...user.dataValues };
        delete result.password;
        result.roles = user.roles;
        return result;
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

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
          description: d['en'].defaultResource(value) || null,
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
    const user = await this.usersService.create(
      { ...signUpDto, enabled: true },
      [defaultRole],
    );
    return user;
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
      const code = this.generateCode();
      await this.usersService.updateVerificationCode(user.email, code);
      this.mailClient
        .send({ method: 'registration' }, { email: user.email, code })
        .subscribe();
      throw new ForbiddenException();
    }

    const sessionId = uuidv4();
    const sessionHash = await argon2.hash(crypto.randomBytes(10));
    const sessionData: ISession = {
      hash: sessionHash,
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

    const tokens = await this.createTokens<IToken>(
      { userId: user.id, sessionId, sessionHash },
      sessionTtl,
    );

    return { ...tokens };
  }

  verifyUser(verifyUserDto: VerifyUserDto): Promise<boolean> {
    return this.usersService.updateVerificationCode(
      verifyUserDto.email,
      verifyUserDto.code,
      true,
    );
  }

  async forgotPassword(email: string): Promise<boolean> {
    const code = this.generateCode();

    if (await this.usersService.updateResetPasswordCode(email, code)) {
      this.mailClient
        .send({ method: 'forgotPassword' }, { email, code })
        .subscribe();
    }

    return true;
  }

  resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    return this.usersService.updatePassword(
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
    const newHash = await argon2.hash(crypto.randomBytes(10));
    const session = await this.redisService.get<ISession>(
      `sessions:${token.userId}:${token.sessionId}`,
    );

    if (
      session?.userId === token.userId &&
      session?.hash === token.sessionHash
    ) {
      const sessionData: ISession = {
        hash: newHash,
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

    return this.createTokens<IToken>(
      {
        userId: token.userId,
        sessionId: token.sessionId,
        sessionHash: newHash,
      },
      sessionTtl,
    );
  }

  getProfile(token: IToken): Promise<User> {
    return this.usersService.findOnePublic(token.userId);
  }

  async updateProfile(
    token: IToken,
    updateProfileDto: UpdateProfileDto,
  ): Promise<boolean> {
    return this.usersService.updateFields(token.userId, updateProfileDto);
  }

  async getSessions(token: IToken): Promise<ExternalSessionDto[]> {
    const keys = await this.redisService.keys(`sessions:${token.userId}:*`);
    const current = `sessions:${token.userId}:${token.sessionId}`;
    return (await this.redisService.mget<ISession>(keys)).map(
      (session, index) => ({
        ...session,
        id: keys[index],
        current: current === keys[index],
      }),
    );
  }

  async deleteSessions(token: IToken, remove: string[]): Promise<boolean> {
    const keys = await this.redisService.keys(`sessions:${token.userId}:*`);
    await this.redisService.mdel(remove.filter((key) => keys.includes(key)));
    return true;
  }

  async signOut(token: IToken): Promise<boolean> {
    await this.redisService.del(`sessions:${token.userId}:${token.sessionId}`);
    return true;
  }
}
