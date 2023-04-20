import { Module } from '@nestjs/common';

import { RolesController } from './roles.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from 'src/users/users.service';
import { usersProviders } from 'src/users/users.providers';
import { RolesService } from './roles.service';
import { rolesProviders } from './roles.providers';
import { ResourcesService } from 'src/resources/resources.service';
import { resourcesProviders } from 'src/resources/resources.providers';
import { rolesResourcesProviders } from 'src/database/roles-resources.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController],
  providers: [
    UsersService,
    ...usersProviders,
    RolesService,
    ...rolesProviders,
    ResourcesService,
    ...resourcesProviders,
    ...rolesResourcesProviders,
  ],
  exports: [RolesService],
})
export class RolesModule {}
