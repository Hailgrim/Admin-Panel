import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from 'libs/constants';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { IRoleConditions } from './roles.types';
import { IRequestUser } from 'src/auth/auth.types';

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
    const reqUser: IRequestUser | undefined = context
      .switchToHttp()
      .getRequest().user;

    if (reqUser?.id) {
      user = await this.usersService.findOnePublic(reqUser.id);
    }

    if (user === null) {
      return false;
    }

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
