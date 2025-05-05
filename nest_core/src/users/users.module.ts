import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CacheModule } from 'src/cache/cache.module';
import { USERS_REPOSITORY } from 'libs/constants';
import { UserModel } from './user.entity';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [UsersController],
  providers: [
    {
      provide: USERS_REPOSITORY,
      useValue: UserModel,
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
