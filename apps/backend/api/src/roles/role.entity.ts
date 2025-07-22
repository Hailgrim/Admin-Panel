import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';
import { RightsEntity } from 'src/database/rights.entity';
import { IRole } from '@ap/shared/src/types';

@Entity('roles')
export class RoleEntity implements IRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description?: string | null;

  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @Column({ type: 'boolean', default: false })
  admin: boolean;

  @Column({ type: 'boolean', default: false })
  default: boolean;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users?: UserEntity[];

  @OneToMany(() => RightsEntity, (rights) => rights.role)
  rights?: RightsEntity[];
}
