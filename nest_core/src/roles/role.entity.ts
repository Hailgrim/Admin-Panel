import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({ type: String, description: d['en'].name })
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  name: string;

  @ApiPropertyOptional({ type: String, description: d['en'].description })
  @Column({ type: DataType.STRING(1000), allowNull: true })
  description?: string | null;

  @ApiProperty({ type: Boolean, description: d['en'].status })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  enabled: boolean;

  @ApiProperty({ type: Boolean, description: d['en'].adminStatus })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  admin: boolean;

  @ApiProperty({ type: Boolean, description: d['en'].default })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  default: boolean;

  @ApiPropertyOptional({ type: [User], description: d['en'].users })
  @BelongsToMany(() => User, () => UsersRoles)
  users?: User[];

  @ApiPropertyOptional({ type: [Resource], description: d['en'].resources })
  @BelongsToMany(() => Resource, () => RolesResources)
  resources?: Resource[];

  @ApiPropertyOptional({ type: IUsersRoles })
  UsersRoles?: IUsersRoles;
}
