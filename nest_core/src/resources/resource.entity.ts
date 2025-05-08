import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { RoleModel } from '../roles/role.entity';
import { PUBLIC } from 'libs/constants';
import { TCreateResource, IResource } from '@ap/shared';
import { RightsModel } from 'src/database/rights.entity';

@Scopes(() => ({
  [PUBLIC]: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
}))
@Table({ tableName: 'resources' })
export class ResourceModel
  extends Model<ResourceModel, TCreateResource>
  implements IResource
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare path: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  declare description?: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare enabled: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare default: boolean;

  @BelongsToMany(() => RoleModel, () => RightsModel)
  declare roles?: RoleModel[];

  declare RightsModel?: RightsModel;
}
