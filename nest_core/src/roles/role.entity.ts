import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { User } from '../users/user.entity';
import { UsersRoles } from '../database/users-roles.entity';
import { Resource } from '../resources/resource.entity';
import { PUBLIC, WITH_RESOURCES } from 'libs/constants';
import { CreateRoleFields, IRole } from './roles.types';
import { RolesResources } from '../database/roles-resources.entity';

@Scopes(() => ({
  [PUBLIC]: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
  [WITH_RESOURCES]: {
    include: [
      {
        model: Resource,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
  },
}))
@Table({ tableName: 'roles' })
export class Role extends Model<Role, CreateRoleFields> implements IRole {
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  description?: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  enabled: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  admin: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  default: boolean;

  @BelongsToMany(() => User, () => UsersRoles)
  users?: User[];

  @BelongsToMany(() => Resource, () => RolesResources)
  resources?: Resource[];

  UsersRoles?: UsersRoles;
}
