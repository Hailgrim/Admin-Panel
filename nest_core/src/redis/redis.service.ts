import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async get<T = unknown>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async set(key: string, value: unknown, ttl = 0): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
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
}
