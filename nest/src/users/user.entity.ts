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
import { CreateUserFields, IUser } from 'libs/types';
import lang from 'libs/lang';
import { Resource } from 'src/resources/resource.entity';
import { PUBLIC, WITH_ROLES } from 'libs/constants';

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
  @ApiProperty({ example: 'user@mail.com', description: lang.get('en')?.email })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @ApiProperty({ example: '1q2w3e4r5', description: lang.get('en')?.password })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: 'Linus Torvalds', description: lang.get('en')?.name })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: true, description: lang.get('en')?.status })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  enabled: boolean;

  @ApiProperty({ example: true, description: lang.get('en')?.verified })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  verified: boolean;

  @ApiProperty({
    example: 'iOPASdjk28dJO278',
    description: lang.get('en')?.verificationCode,
  })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  verificationCode: string | null;

  @ApiProperty({
    example: 'Aska!jdl2KWJ87i',
    description: lang.get('en')?.resetPasswordCode,
  })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  resetPasswordCode: string | null;

  @ApiProperty({ example: true, description: lang.get('en')?.roles })
  @BelongsToMany(() => Role, () => UsersRoles)
  roles?: Role[];
}
