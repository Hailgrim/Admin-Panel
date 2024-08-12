import { Module } from '@nestjs/common';

import { ProfileService } from './profile.service';
import { UsersModule } from '../users/users.module';
import { ProfileController } from './profile.controller';
import { RedisModule } from 'src/redis/redis.module';
import { RmqModule } from 'src/rmq/rmq.module';

@Module({
  imports: [RedisModule, RmqModule, UsersModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
