import {
  Table,
  Column,
  Model,
  BelongsToMany,
  DataType,
  Scopes,
} from 'sequelize-typescript';

import { UsersRoles } from 'src/database/users-roles.entity';
import { Role } from 'src/roles/role.entity';
import { Resource } from 'src/resources/resource.entity';
import { PUBLIC, WITH_ROLES } from 'libs/constants';
import { CreateGoogleUserFields, CreateUserFields, IUser } from './users.types';

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
        model: Role,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: Resource,
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
export class User
  extends Model<User, CreateUserFields | CreateGoogleUserFields>
  implements IUser
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({ type: DataType.STRING(100), allowNull: true, unique: true })
  email?: string | null;

  @Column({ type: DataType.STRING(100), allowNull: true })
  password?: string | null;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(100), allowNull: true, unique: true })
  googleId?: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  enabled: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  verified: boolean;

  @Column({ type: DataType.CHAR(4), allowNull: true })
  verificationCode?: string | null;

  @Column({ type: DataType.CHAR(4), allowNull: true })
  resetPasswordCode?: string | null;

  @Column({ type: DataType.CHAR(4), allowNull: true })
  changeEmailCode?: string | null;

  @Column({ type: DataType.STRING(100), allowNull: true })
  temporaryEmail?: string | null;

  @BelongsToMany(() => Role, () => UsersRoles)
  roles?: Role[];
}
