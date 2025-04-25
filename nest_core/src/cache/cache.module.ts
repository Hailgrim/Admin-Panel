import { Module } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import Redis from 'ioredis';

import {
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USER,
} from 'libs/config';
import { CacheService } from './cache.service';
import { REDIS } from 'libs/constants';

@Module({
  providers: [
    // NOTE: The raw Redis connection is necessary because without it we will not have access to the "keys"
    {
      provide: REDIS,
      useFactory: () => {
        return new Redis(
          `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
        );
      },
    },
    {
      provide: CACHE_MANAGER,
      useFactory: () => {
        const secondary = createKeyv(
          `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
        );
        return new Cacheable({ secondary });
      },
    },
    CacheService,
  ],
  exports: [REDIS, CACHE_MANAGER, CacheService],
})
export class CacheModule {}
