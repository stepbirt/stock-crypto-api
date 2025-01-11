import { DynamicModule, Global, Module } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Global()
@Module({})
export class CustomCacheModule {
  static register(options?: {
    store?: 'memory' | 'redis';
    redisConfig?: any;
  }): DynamicModule {
    const cacheModule = CacheModule.register(
      options?.store === 'redis'
        ? {
            host: options.redisConfig?.host || 'localhost',
            port: options.redisConfig?.port || 6379,
            ttl: options.redisConfig?.ttl || 300,
          }
        : {
            ttl: 300,
          },
    );

    return {
      module: CustomCacheModule,
      imports: [cacheModule],
      providers: [CacheService],
      exports: [CacheService],
    };
  }
}
