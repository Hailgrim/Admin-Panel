import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import lang from 'libs/lang';
import { User } from '../users/user.entity';
import { UsersRoles } from '../database/users-roles.entity';
import { Resource } from '../resources/resource.entity';
import { RolesResources } from '../database/roles-resources.entity';
import { CreateRoleFields, IRole, IUsersRoles } from 'libs/types';
import { PUBLIC, WITH_RESOURCES } from 'libs/constants';

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
  @ApiProperty({
    example: 'Client',
    description: lang.get('en')?.name,
  })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @ApiProperty({
    example: 'Service client',
    description: lang.get('en')?.description,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  description: string | null;

  @ApiProperty({ example: true, description: lang.get('en')?.adminStatus })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  admin: boolean;

  @ApiProperty({ example: true, description: lang.get('en')?.default })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  default: boolean;

  @ApiProperty({ example: ['profile'], description: lang.get('en')?.users })
  @BelongsToMany(() => User, () => UsersRoles)
  users?: User[];

  @ApiProperty({ example: ['profile'], description: lang.get('en')?.resources })
  @BelongsToMany(() => Resource, () => RolesResources)
  resources?: Resource[];

  UsersRoles?: IUsersRoles;
}
