import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache<RedisStore>,
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
      return (
        ((await this.cacheManager.store.mget(...keys)) as T[] | undefined) || []
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.cacheManager.store.keys(pattern);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async set(key: string, value: unknown, ttl = 0): Promise<void> {
    try {
      return await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async del(key: string): Promise<void> {
    try {
      return await this.cacheManager.del(key);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async mdel(keys: string[]): Promise<void> {
    try {
      return await this.cacheManager.store.mdel(...keys);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
