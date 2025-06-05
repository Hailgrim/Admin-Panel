import { Entity, PrimaryColumn } from 'typeorm';

import { IRole, IUser, IUsersRoles } from '@ap/shared';
import { USERS_ROLES_TABLE } from 'libs/constants';

@Entity(USERS_ROLES_TABLE)
export class UsersRolesEntity implements IUsersRoles {
  @PrimaryColumn('uuid')
  userId: IUser['id'];

  @PrimaryColumn('uuid')
  roleId: IRole['id'];
}
