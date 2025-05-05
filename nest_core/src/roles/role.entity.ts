import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { UserModel } from '../users/user.entity';
import { UsersRolesModel } from '../database/users-roles.entity';
import { ResourceModel } from '../resources/resource.entity';
import { PUBLIC, WITH_RESOURCES } from 'libs/constants';
import { TCreateRole, IRole } from './roles.types';
import { RightsModel } from '../database/rights.entity';

@Scopes(() => ({
  [PUBLIC]: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
  [WITH_RESOURCES]: {
    include: [
      {
        model: ResourceModel,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
  },
}))
@Table({ tableName: 'roles' })
export class RoleModel extends Model<RoleModel, TCreateRole> implements IRole {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  declare description?: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare enabled: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare admin: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare default: boolean;

  @BelongsToMany(() => UserModel, () => UsersRolesModel)
  declare users?: UserModel[];

  @BelongsToMany(() => ResourceModel, () => RightsModel)
  declare resources?: ResourceModel[];

  declare UsersRolesModel?: UsersRolesModel;
}
