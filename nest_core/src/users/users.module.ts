import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RedisModule } from 'src/redis/redis.module';
import { USERS_REPOSITORY } from 'libs/constants';
import { User } from './user.entity';

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [UsersController],
  providers: [
    {
      provide: USERS_REPOSITORY,
      useValue: User,
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
