import { Entity, PrimaryColumn } from 'typeorm';

import { USERS_ROLES_TABLE } from 'libs/constants';
import { IRole, IUser, IUsersRoles } from '@ap/shared/src/types';

@Entity(USERS_ROLES_TABLE)
export class UsersRolesEntity implements IUsersRoles {
  @PrimaryColumn('uuid')
  userId: IUser['id'];

  @PrimaryColumn('uuid')
  roleId: IRole['id'];
}
