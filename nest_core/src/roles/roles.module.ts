import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UsersModule } from 'src/users/users.module';
import { RoleEntity } from './role.entity';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), UsersModule],
  controllers: [RolesController],
  providers: [RolesService, DatabaseService],
  exports: [RolesService],
})
export class RolesModule {}
