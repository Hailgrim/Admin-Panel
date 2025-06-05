import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CacheModule } from 'src/cache/cache.module';
import { UserEntity } from './user.entity';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CacheModule],
  controllers: [UsersController],
  providers: [UsersService, DatabaseService],
  exports: [UsersService],
})
export class UsersModule {}
