import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseService } from './database.service';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  MODE,
} from 'libs/config';
import { UserEntity } from 'src/users/user.entity';
import { RoleEntity } from 'src/roles/role.entity';
import { UsersRolesEntity } from './users-roles.entity';
import { ResourceEntity } from 'src/resources/resource.entity';
import { RightsEntity } from './rights.entity';
import { DEV } from '@ap/shared';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        synchronize: MODE === DEV,
        logging: MODE === DEV,
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
