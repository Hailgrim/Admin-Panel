import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Role } from '../roles/role.entity';
import { Resource } from '../resources/resource.entity';
import { IRolesResources } from './database.types';

@Table({ tableName: 'roles_resources' })
export class RolesResources
  extends Model<RolesResources, IRolesResources>
  implements IRolesResources
{
  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID })
  roleId: string;

  @ForeignKey(() => Resource)
  @Column({ type: DataType.UUID })
  resourceId: string;

  @Column({ type: DataType.BOOLEAN })
  creating: boolean;

  @Column({ type: DataType.BOOLEAN })
  reading: boolean;

  @Column({ type: DataType.BOOLEAN })
  updating: boolean;

  @Column({ type: DataType.BOOLEAN })
  deleting: boolean;
}
