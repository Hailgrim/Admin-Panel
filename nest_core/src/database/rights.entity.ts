import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { RoleModel } from '../roles/role.entity';
import { ResourceModel } from '../resources/resource.entity';
import { IResource, IRole, IRights } from '@ap/shared';

@Table({ tableName: 'rights' })
export class RightsModel
  extends Model<RightsModel, IRights>
  implements IRights
{
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.UUID })
  declare roleId: IRole['id'];

  @ForeignKey(() => ResourceModel)
  @Column({ type: DataType.UUID })
  declare resourceId: IResource['id'];

  @Column({ type: DataType.BOOLEAN })
  declare creating: boolean;

  @Column({ type: DataType.BOOLEAN })
  declare reading: boolean;

  @Column({ type: DataType.BOOLEAN })
  declare updating: boolean;

  @Column({ type: DataType.BOOLEAN })
  declare deleting: boolean;
}
