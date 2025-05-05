import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { UserModel } from '../users/user.entity';
import { RoleModel } from '../roles/role.entity';
import { IUsersRoles } from './database.types';
import { IUser } from 'src/users/users.types';
import { IRole } from 'src/roles/roles.types';

@Table({ tableName: 'users_roles' })
export class UsersRolesModel
  extends Model<UsersRolesModel, IUsersRoles>
  implements IUsersRoles
{
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID })
  declare userId: IUser['id'];

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.UUID })
  declare roleId: IRole['id'];
}
