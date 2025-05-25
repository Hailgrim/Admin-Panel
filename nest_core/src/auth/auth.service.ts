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
import {
  ACCESS_TOKEN_LIFETIME,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  MAIL_FORGOT_PASSWORD,
  MAIL_REGISTRATION,
} from 'libs/config';
import { RoleEntity } from 'src/roles/role.entity';
import { CacheService } from 'src/cache/cache.service';
import { IToken, ITokensPair } from './auth.types';
import { QueueService } from 'src/queue/queue.service';
import { generateCode, verifyHash } from 'libs/utils';
import { d, ISession, IUser, TCreateResource, TSignUp } from '@ap/shared';

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

  async checkDefaultData(): Promise<RoleEntity> {
    // Verify the existence of the Administrator Role
    const adminRole = await this.rolesService.findOrCreateDefault(
      'Administrator',
      d['en'].defaultAdminRole,
      true,
    );

    // Verify the existence of the User Role
    const userRole = await this.rolesService.findOrCreateDefault(
      'User',
      d['en'].defaultUserRole,
    );

    // Verify the existence of the Default Resources
    const defaultResources = await this.resourcesService
      .getList(undefined, true)
      .then((result) => result.rows);

    const missingResources: TCreateResource[] = [
      'profile',
      'users',
      'roles',
      'resources',
    ]
      .filter(
        (value) =>
          !defaultResources.some((resource) => resource.path === value),
      )
      .map((value) => {
        return {
          path: value,
          name: value.replace(value[0], value[0].toUpperCase()),
          description: d['en'].defaultResource(value),
          enabled: true,
        };
      });

    const createdResources =
      await this.resourcesService.createManyDefault(missingResources);

    // Open the Profile Resource for the User Role
    if (!userRole.rights?.some((right) => right.resource?.path === 'profile')) {
      const profileResource = createdResources
        .concat(defaultResources)
        .find((resource) => resource.path === 'profile');

      if (profileResource) {
        await this.rolesService.updateRights(
          userRole.id,
          [
            {
              roleId: userRole.id,
              resourceId: profileResource.id,
              creating: false,
              reading: true,
              updating: true,
              deleting: true,
            },
          ],
          true,
        );
      }
    }

    // Verify the existence of the Administrator Users
    const adminUsers = await this.usersService.countByRole(adminRole.id);

    return adminUsers === 0 ? adminRole : userRole;
  }

  async signUp(signUpFields: TSignUp): Promise<IUser> {
    const defaultRole = await this.checkDefaultData();
    return this.usersService.create({ ...signUpFields, enabled: true }, [
      defaultRole,
    ]);
  }

  async forgotPassword(email: string): Promise<void> {
    const code = generateCode();

    await this.usersService.updateResetPasswordCode(email, code);
    this.queueService.sendEmail({ cmd: MAIL_FORGOT_PASSWORD }, { email, code });
  }

  async resetPassword(
    email: string,
    code: string,
    password: string,
  ): Promise<void> {
    await this.usersService.updatePasswordWithCode(email, code, password);
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

  async validateUser(email: string, password: string): Promise<IUser | false> {
    try {
      const user: IUser = await this.usersService.getOneAuth(email);

      if (!user.password || !(await verifyHash(user.password, password))) {
        return false;
      }

      return user;
    } catch {
      return false;
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
          { cmd: MAIL_REGISTRATION },
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

  async verifyUser(email: string, code: string): Promise<void> {
    await this.usersService.updateVerificationStatus(email, code);
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

      if (!googleUser || !googleUser['id'] || !googleUser['name']) {
        throw new Error();
      }
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
      user,
    };
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

  async signOut(userId: string, sessionId: string): Promise<void> {
    await this.cacheService.del(`sessions:${userId}:${sessionId}`);
  }
}
