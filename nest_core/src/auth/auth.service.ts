import {
  ForbiddenException,
  GoneException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  MAIL_FORGOT_PASSWORD,
  MAIL_REGISTRATION,
} from 'libs/config';
import { Role } from 'src/roles/role.entity';
import { CreateResourceDto } from 'src/resources/dto/create-resource.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/sign-up.dts';
import { CacheService } from 'src/cache/cache.service';
import d from 'locales/dictionary';
import { ISession, IToken, ITokensPair } from './auth.types';
import { IUser } from 'src/users/users.types';
import { QueueService } from 'src/queue/queue.service';
import { generateCode, verifyHash } from 'libs/utils';

@Injectable()
export class AuthService {
  constructor(
    private queueService: QueueService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private resourcesService: ResourcesService,
    private cacheService: CacheService,
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
          !defaultResources.find((resource) => resource.get('path') === value),
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

  async createTokens(
    payload: IToken,
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

  async validateUser(signInDto: SignInDto): Promise<IUser> {
    try {
      const user: IUser = await this.usersService
        .findOneAuth(signInDto.username)
        .then((result) => result.get({ plain: true }));

      if (
        !user.password ||
        !(await verifyHash(user.password, signInDto.password))
      ) {
        throw new Error();
      }

      delete user.password;
      return user;
    } catch {
      throw new UnauthorizedException();
    }
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
        this.queueService.sendEmail(
          { method: MAIL_REGISTRATION },
          { email: user.email, code },
        );
      }

      throw new ForbiddenException();
    }

    const sessionId = uuidv4();
    const sessionData: ISession = {
      ip,
      userAgent,
      updatedAt: new Date(),
    };

    await this.cacheService.set(
      `sessions:${user.id}:${sessionId}`,
      sessionData,
      sessionTtl * 1000,
    );

    return this.createTokens({ userId: user.id, sessionId }, sessionTtl);
  }

  verifyUser(verifyUserDto: VerifyUserDto): Promise<boolean> {
    return this.usersService.updateVerificationStatus(
      verifyUserDto.email,
      verifyUserDto.code,
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
      googleUser = (await googleRes.json()) as Record<string, string>;

      if (!googleUser || !googleUser['id'] || !googleUser['name'])
        throw new Error();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    const defaultRole = await this.checkDefaultData();
    const user = await this.usersService
      .createByGoogle(googleUser['id'], googleUser['name'], [defaultRole])
      .then((result) => result.get({ plain: true }));

    return {
      ...(await this.signIn(user, sessionTtl, ip, userAgent)),
      user,
    };
  }

  async forgotPassword(email: string): Promise<boolean> {
    const code = generateCode();

    if (await this.usersService.updateResetPasswordCode(email, code)) {
      this.queueService.sendEmail(
        { method: MAIL_FORGOT_PASSWORD },
        { email, code },
      );
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
    userId: string,
    sessionId: string,
    sessionTtl: number,
    ip: string,
    userAgent?: string,
  ): Promise<ITokensPair> {
    const session = await this.cacheService.get<ISession>(
      `sessions:${userId}:${sessionId}`,
    );

    if (session) {
      const sessionData: ISession = {
        ip,
        userAgent,
        updatedAt: new Date(),
      };

      await this.cacheService.set(
        `sessions:${userId}:${sessionId}`,
        sessionData,
        sessionTtl * 1000,
      );
    } else {
      throw new UnauthorizedException();
    }

    return this.createTokens({ userId, sessionId }, sessionTtl);
  }

  async signOut(userId: string, sessionId: string): Promise<boolean> {
    await this.cacheService.del(`sessions:${userId}:${sessionId}`);
    return true;
  }
}
