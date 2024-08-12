import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { UsersModule } from 'src/users/users.module';
import { RESOURCES_REPOSITORY } from 'libs/constants';
import { Resource } from './resource.entity';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ResourcesController],
  providers: [
    {
      provide: RESOURCES_REPOSITORY,
      useValue: Resource,
    },
    ResourcesService,
  ],
  exports: [ResourcesService],
})
export class ResourcesModule {}
