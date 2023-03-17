import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { RolesService } from 'src/roles/roles.service';
import { rolesProviders } from 'src/roles/roles.providers';
import { ResourcesService } from 'src/resources/resources.service';
import { resourcesProviders } from 'src/resources/resources.providers';
import { rolesResourcesProviders } from 'src/database/roles-resources.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ...usersProviders,
    RolesService,
    ...rolesProviders,
    ResourcesService,
    ...resourcesProviders,
    ...rolesResourcesProviders,
  ],
  exports: [UsersService],
})
export class UsersModule {}
