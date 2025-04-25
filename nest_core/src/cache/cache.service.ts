import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cacheable } from 'cacheable';
import Redis from 'ioredis';

import { REDIS } from 'libs/constants';

@Injectable()
export class CacheService {
  constructor(
    @Inject(REDIS)
    private redis: Redis,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cacheable,
  ) {}

  async get<T = unknown>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async mget<T = unknown>(keys: string[]): Promise<T[]> {
    try {
      return (await this.cacheManager.getMany<T>(keys)) as T[];
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async set(key: string, value: unknown, ttl = 0): Promise<boolean> {
    try {
      return await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      return await this.cacheManager.delete(key);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async mdel(keys: string[]): Promise<boolean> {
    try {
      return await this.cacheManager.deleteMany(keys);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
