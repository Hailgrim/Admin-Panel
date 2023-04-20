import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Role } from '../roles/role.entity';
import { Resource } from '../resources/resource.entity';
import { IRolesResources } from 'libs/types';

@Table({ tableName: 'roles_resources' })
export class RolesResources
  extends Model<RolesResources, IRolesResources>
  implements IRolesResources
{
  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @ForeignKey(() => Resource)
  @Column({ type: DataType.INTEGER })
  resourceId: number;

  @Column({ type: DataType.BOOLEAN })
  creating: boolean;

  @Column({ type: DataType.BOOLEAN })
  listing: boolean;

  @Column({ type: DataType.BOOLEAN })
  reading: boolean;

  @Column({ type: DataType.BOOLEAN })
  updating: boolean;

  @Column({ type: DataType.BOOLEAN })
  deleting: boolean;
}
