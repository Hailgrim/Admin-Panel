import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from 'libs/constants';
import { UserModel } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { IRoleConditions } from './roles.types';
import { TFastifyRequestWithToken } from 'src/auth/auth.types';

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

    let user: UserModel | null = null;
    const request = context
      .switchToHttp()
      .getRequest<Partial<TFastifyRequestWithToken>>();
    const token = request.user;

    if (token?.userId) {
      user = await this.usersService.getOnePublic(token.userId);
    }

    if (user === null) {
      return false;
    }

    user = user.get({ plain: true });
    request.originalUser = user;

    return Boolean(
      user.roles?.some(
        (role) =>
          role.admin ||
          role.resources?.some(
            (resource) =>
              resource.path === roleConditions.path &&
              resource.RightsModel?.[roleConditions.action] === true,
          ),
      ),
    );
  }
}
