import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  async get<T = unknown>(
    key: string,
    enableErrors = false,
  ): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      if (enableErrors) {
        throw new InternalServerErrorException();
      }
    }
  }

  async set(key: string, value: unknown, enableErrors = false): Promise<void> {
    try {
      await this.cacheManager.set(key, value, 0);
    } catch (error) {
      if (enableErrors) {
        throw new InternalServerErrorException();
      }
    }
  }

  async del(key: string, enableErrors = false): Promise<void> {
    try {
      return await this.cacheManager.del(key);
    } catch (error) {
      if (enableErrors) {
        throw new InternalServerErrorException();
      }
    }
  }
}
