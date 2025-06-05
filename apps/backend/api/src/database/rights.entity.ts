import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { IResource, IRole, IRights } from '@ap/shared';
import { RoleEntity } from 'src/roles/role.entity';
import { ResourceEntity } from 'src/resources/resource.entity';

@Entity('rights')
export class RightsEntity implements IRights {
  @PrimaryColumn('uuid')
  roleId: IRole['id'];

  @ManyToOne(() => RoleEntity, (role) => role.rights, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role?: RoleEntity;

  @PrimaryColumn('uuid')
  resourceId: IResource['id'];

  @ManyToOne(() => ResourceEntity, (resource) => resource.rights, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resourceId' })
  resource?: ResourceEntity;

  @Column({ type: 'boolean', default: false })
  creating: boolean;

  @Column({ type: 'boolean', default: false })
  reading: boolean;

  @Column({ type: 'boolean', default: false })
  updating: boolean;

  @Column({ type: 'boolean', default: false })
  deleting: boolean;
}
