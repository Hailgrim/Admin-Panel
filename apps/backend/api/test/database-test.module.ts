import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseService } from 'src/database/database.service';
import { UserEntity } from 'src/users/user.entity';
import { RoleEntity } from 'src/roles/role.entity';
import { UsersRolesEntity } from 'src/database/users-roles.entity';
import { ResourceEntity } from 'src/resources/resource.entity';
import { RightsEntity } from 'src/database/rights.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: ':memory:',
        logging: false,
        synchronize: true,
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
export class DatabaseTestModule {}
