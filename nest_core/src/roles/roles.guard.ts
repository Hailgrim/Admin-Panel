import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from 'libs/constants';
import { UserEntity } from 'src/users/user.entity';
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

    let user: UserEntity | null = null;
    const request = context
      .switchToHttp()
      .getRequest<Partial<TFastifyRequestWithToken>>();
    const token = request.user;

    if (token?.userId) {
      user = await this.usersService.getOneProfile(token.userId);
    }

    if (user === null) {
      return false;
    }

    request.originalUser = user;

    return Boolean(
      user.roles?.some(
        (role) =>
          role.admin ||
          role.rights?.some(
            (right) =>
              right.resource?.path === roleConditions.path &&
              right[roleConditions.action] === true,
          ),
      ),
    );
  }
}
