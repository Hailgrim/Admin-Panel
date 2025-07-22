import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseService } from './database.service';
import { UserEntity } from 'src/users/user.entity';
import { RoleEntity } from 'src/roles/role.entity';
import { UsersRolesEntity } from './users-roles.entity';
import { ResourceEntity } from 'src/resources/resource.entity';
import { RightsEntity } from './rights.entity';
import { cfg } from 'config/configuration';
import { DEV } from '@ap/shared/src/libs';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: cfg.postgres.host,
        port: cfg.postgres.port,
        username: cfg.postgres.user,
        password: cfg.postgres.password,
        database: cfg.postgres.db,
        synchronize: cfg.mode === DEV,
        logging: cfg.mode === DEV,
        entities: [
          UserEntity,
          RoleEntity,
          UsersRolesEntity,
          ResourceEntity,
          RightsEntity,
        ],
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
