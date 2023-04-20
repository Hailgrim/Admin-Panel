import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { ResourcesController } from './resources.controller';
import { UsersService } from 'src/users/users.service';
import { usersProviders } from 'src/users/users.providers';
import { RolesService } from 'src/roles/roles.service';
import { rolesProviders } from 'src/roles/roles.providers';
import { ResourcesService } from './resources.service';
import { resourcesProviders } from './resources.providers';
import { rolesResourcesProviders } from 'src/database/roles-resources.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ResourcesController],
  providers: [
    UsersService,
    ...usersProviders,
    RolesService,
    ...rolesProviders,
    ResourcesService,
    ...resourcesProviders,
    ...rolesResourcesProviders,
  ],
  exports: [ResourcesService],
})
export class ResourcesModule {}
