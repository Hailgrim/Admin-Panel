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
import { Role } from '../roles/role.entity';
import { RolesResources } from '../database/roles-resources.entity';
import { CreateResourceFields, IResource, IRolesResources } from 'libs/types';
import { PUBLIC } from 'libs/constants';

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
    description: lang.get('en')?.name,
  })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @ApiProperty({
    example: 'users',
    description: lang.get('en')?.path,
  })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  path: string;

  @ApiProperty({
    example: 'Users resource',
    description: lang.get('en')?.description,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  description: string | null;

  @ApiProperty({ example: true, description: lang.get('en')?.status })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  enabled: boolean;

  @ApiProperty({ example: true, description: lang.get('en')?.default })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  default: boolean;

  @BelongsToMany(() => Role, () => RolesResources)
  roles?: Role[];

  RolesResources?: IRolesResources;
}
