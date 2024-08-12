import { Module } from '@nestjs/common';

import { RolesController } from './roles.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RolesService } from './roles.service';
import { UsersModule } from 'src/users/users.module';
import { ROLES_REPOSITORY, ROLES_RESOURCES_REPOSITORY } from 'libs/constants';
import { RolesResources } from '../database/roles-resources.entity';
import { Role } from './role.entity';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [RolesController],
  providers: [
    {
      provide: ROLES_REPOSITORY,
      useValue: Role,
    },
    {
      provide: ROLES_RESOURCES_REPOSITORY,
      useValue: RolesResources,
    },
    RolesService,
  ],
  exports: [RolesService],
})
export class RolesModule {}
