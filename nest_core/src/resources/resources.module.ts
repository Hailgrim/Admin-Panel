import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { UsersModule } from 'src/users/users.module';
import { ResourceEntity } from './resource.entity';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceEntity]), UsersModule],
  controllers: [ResourcesController],
  providers: [ResourcesService, DatabaseService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
