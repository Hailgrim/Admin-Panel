import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { Role } from '../roles/role.entity';
import { PUBLIC } from 'libs/constants';
import { CreateResourceFields, IResource } from './resources.types';
import { RolesResources } from 'src/database/roles-resources.entity';

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
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  path: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  description?: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  enabled: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  default: boolean;

  @BelongsToMany(() => Role, () => RolesResources)
  roles?: Role[];

  RolesResources?: RolesResources;
}
