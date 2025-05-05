import {
  Table,
  Column,
  Model,
  BelongsToMany,
  DataType,
  Scopes,
} from 'sequelize-typescript';

import { UsersRolesModel } from 'src/database/users-roles.entity';
import { RoleModel } from 'src/roles/role.entity';
import { ResourceModel } from 'src/resources/resource.entity';
import { PUBLIC, WITH_ROLES } from 'libs/constants';
import { TCreateGoogleUser, TCreateUser, IUser } from './users.types';

@Scopes(() => ({
  [PUBLIC]: {
    attributes: {
      exclude: [
        'password',
        'verificationCode',
        'resetPasswordCode',
        'changeEmailCode',
        'temporaryEmail',
        'updatedAt',
      ],
    },
  },
  [WITH_ROLES]: {
    include: [
      {
        model: RoleModel,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        through: { attributes: [] },
        include: [
          {
            model: ResourceModel,
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      },
    ],
  },
}))
@Table({ tableName: 'users' })
export class UserModel
  extends Model<UserModel, TCreateUser | TCreateGoogleUser>
  implements IUser
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ type: DataType.STRING(100), allowNull: true, unique: true })
  declare email?: string | null;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare password?: string | null;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(100), allowNull: true, unique: true })
  declare googleId?: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare enabled: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare verified: boolean;

  @Column({ type: DataType.CHAR(4), allowNull: true })
  declare verificationCode?: string | null;

  @Column({ type: DataType.CHAR(4), allowNull: true })
  declare resetPasswordCode?: string | null;

  @Column({ type: DataType.CHAR(4), allowNull: true })
  declare changeEmailCode?: string | null;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare temporaryEmail?: string | null;

  @BelongsToMany(() => RoleModel, () => UsersRolesModel)
  declare roles?: RoleModel[];
}
