import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../roles/role.entity';
import { RolesResources } from '../database/roles-resources.entity';
import { PUBLIC } from 'libs/constants';
import d from 'locales/dictionary';
import {
  CreateResourceFields,
  IResource,
  IRolesResources,
} from './resources.types';

@Scopes(() => ({
  [PUBLIC]: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
}))
@Table({ tableName: 'resources' })
export class Resource
  extends Model<Resource, CreateResourceFields>
  implements IResource
{
  @ApiProperty({
    example: 'Users',
    description: d['en'].name,
  })
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  name: string;

  @ApiProperty({
    example: 'users',
    description: d['en'].path,
  })
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  path: string;

  @ApiProperty({
    example: 'Users resource',
    description: d['en'].description,
  })
  @Column({ type: DataType.STRING(1000), allowNull: true })
  description: string | null;

  @ApiProperty({ example: true, description: d['en'].status })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  enabled: boolean;

  @ApiProperty({ example: true, description: d['en'].default })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  default: boolean;

  @BelongsToMany(() => Role, () => RolesResources)
  roles?: Role[];

  RolesResources?: IRolesResources;
}
