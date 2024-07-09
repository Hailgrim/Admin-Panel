import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../users/user.entity';
import { UsersRoles } from '../database/users-roles.entity';
import { Resource } from '../resources/resource.entity';
import { RolesResources } from '../database/roles-resources.entity';
import { PUBLIC, WITH_RESOURCES } from 'libs/constants';
import d from 'locales/dictionary';
import { CreateRoleFields, IRole, IUsersRoles } from './roles.types';

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
    description: d['en'].name,
  })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @ApiProperty({
    example: 'Service client',
    description: d['en'].description,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  description: string | null;

  @ApiProperty({ example: true, description: d['en'].status })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  enabled: boolean;

  @ApiProperty({ example: true, description: d['en'].adminStatus })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  admin: boolean;

  @ApiProperty({ example: true, description: d['en'].default })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  default: boolean;

  @ApiProperty({ example: ['profile'], description: d['en'].users })
  @BelongsToMany(() => User, () => UsersRoles)
  users?: User[];

  @ApiProperty({ example: ['profile'], description: d['en'].resources })
  @BelongsToMany(() => Resource, () => RolesResources)
  resources?: Resource[];

  UsersRoles?: IUsersRoles;
}
