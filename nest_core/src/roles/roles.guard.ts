import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from 'libs/constants';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { IRoleConditions } from './roles.types';
import { FastifyRequestWithToken } from 'src/auth/auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roleConditions = this.reflector.getAllAndOverride<IRoleConditions>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roleConditions) {
      return true;
    }

    let user: User | null = null;
    const request = context
      .switchToHttp()
      .getRequest<Partial<FastifyRequestWithToken>>();
    const token = request.user;

    if (token?.userId) {
      user = await this.usersService.findOnePublic(token.userId);
    }

    if (user === null) {
      return false;
    }

    request.originalUser = user;
    return Boolean(
      user.roles?.some(
        (role) =>
          role.admin ||
          role.resources?.some(
            (resource) =>
              resource.path === roleConditions.path &&
              resource.RolesResources?.[roleConditions.action] === true,
          ),
      ),
    );
  }
}
