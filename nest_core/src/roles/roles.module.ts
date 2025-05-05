import { Module } from '@nestjs/common';

import { RolesController } from './roles.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RolesService } from './roles.service';
import { UsersModule } from 'src/users/users.module';
import { ROLES_REPOSITORY, ROLES_RESOURCES_REPOSITORY } from 'libs/constants';
import { RightsModel } from '../database/rights.entity';
import { RoleModel } from './role.entity';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [RolesController],
  providers: [
    {
      provide: ROLES_REPOSITORY,
      useValue: RoleModel,
    },
    {
      provide: ROLES_RESOURCES_REPOSITORY,
      useValue: RightsModel,
    },
    RolesService,
  ],
  exports: [RolesService],
})
export class RolesModule {}
