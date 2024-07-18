import {
  Table,
  Column,
  Model,
  BelongsToMany,
  DataType,
  Scopes,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { UsersRoles } from 'src/database/users-roles.entity';
import { Role } from 'src/roles/role.entity';
import { Resource } from 'src/resources/resource.entity';
import { PUBLIC, WITH_ROLES } from 'libs/constants';
import d from 'locales/dictionary';
import { CreateUserFields, IUser } from './users.types';

@Scopes(() => ({
  [PUBLIC]: {
    attributes: {
      exclude: [
        'password',
        'verificationCode',
        'resetPasswordCode',
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
export class User extends Model<User, CreateUserFields> implements IUser {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: d['en'].userId,
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @ApiProperty({ example: 'user@mail.com', description: d['en'].email })
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  email: string;

  @ApiProperty({ example: '1q2w3e4r5', description: d['en'].password })
  @Column({ type: DataType.STRING(100), allowNull: false })
  password: string;

  @ApiProperty({ example: 'Linus Torvalds', description: d['en'].name })
  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @ApiProperty({ example: true, description: d['en'].status })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  enabled: boolean;

  @ApiProperty({ example: true, description: d['en'].verified })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  verified: boolean;

  @ApiProperty({
    example: 'iOPASdjk28dJO278',
    description: d['en'].verificationCode,
  })
  @Column({ type: DataType.CHAR(4), allowNull: true, defaultValue: null })
  verificationCode: string | null;

  @ApiProperty({
    example: 'Aska!jdl2KWJ87i',
    description: d['en'].resetPasswordCode,
  })
  @Column({ type: DataType.CHAR(4), allowNull: true, defaultValue: null })
  resetPasswordCode: string | null;

  @ApiProperty({ example: true, description: d['en'].roles })
  @BelongsToMany(() => Role, () => UsersRoles)
  roles?: Role[];
}
