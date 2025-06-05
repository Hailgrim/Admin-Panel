import { Module } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import Redis from 'ioredis';

import { CacheService } from './cache.service';
import { REDIS } from 'libs/constants';
import { cfg } from 'config/configuration';

@Module({
  providers: [
    // NOTE: The raw Redis connection is necessary because without it we will not have access to the "keys"
    {
      provide: REDIS,
      useFactory: () => {
        return new Redis(
          `redis://${cfg.redis.user}:${cfg.redis.password}@${cfg.redis.host}:${cfg.redis.port}/${cfg.redis.db}`,
        );
      },
    },
    {
      provide: CACHE_MANAGER,
      useFactory: () => {
        const secondary = createKeyv(
          `redis://${cfg.redis.user}:${cfg.redis.password}@${cfg.redis.host}:${cfg.redis.port}/${cfg.redis.db}`,
        );
        return new Cacheable({ secondary });
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
