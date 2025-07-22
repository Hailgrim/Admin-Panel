import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RoleEntity } from 'src/roles/role.entity';
import { USERS_ROLES_TABLE } from 'libs/constants';
import { IRole, IUser, IUsersRoles } from '@ap/shared/src/types';

@Entity('users')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 320, unique: true, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string | null;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  googleId?: string | null;

  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'varchar', length: 4, nullable: true })
  verificationCode?: string | null;

  @Column({ type: 'varchar', length: 4, nullable: true })
  resetPasswordCode?: string | null;

  @Column({ type: 'varchar', length: 4, nullable: true })
  changeEmailCode?: string | null;

  @Column({ type: 'varchar', length: 320, nullable: true })
  temporaryEmail?: string | null;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: USERS_ROLES_TABLE,
    joinColumn: {
      name: 'userId' satisfies keyof IUsersRoles,
      referencedColumnName: 'id' satisfies keyof IUser,
    },
    inverseJoinColumn: {
      name: 'roleId' satisfies keyof IUsersRoles,
      referencedColumnName: 'id' satisfies keyof IRole,
    },
  })
  roles?: RoleEntity[];
}
