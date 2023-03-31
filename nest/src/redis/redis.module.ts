import { CacheModule, Module } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

import {
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME,
} from 'libs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
      database: REDIS_DB,
      name: 'next',
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
