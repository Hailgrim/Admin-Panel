import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

import { REDIS_DB, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from 'libs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
      password: REDIS_PASSWORD,
      database: REDIS_DB,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
