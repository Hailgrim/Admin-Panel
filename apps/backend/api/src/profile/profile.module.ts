import { Module } from '@nestjs/common';

import { ProfileService } from './profile.service';
import { UsersModule } from '../users/users.module';
import { ProfileController } from './profile.controller';
import { CacheModule } from 'src/cache/cache.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [CacheModule, QueueModule, UsersModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
