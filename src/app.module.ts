import { Module } from '@nestjs/common';
import { StockModule } from './modules/stock/stock.module';
import { ConfigModule } from '@nestjs/config';

import { CryptoModule } from './modules/crypto/crypto.module';

import { CustomThrottlerModule } from '@libs/throttler';
import { CustomCacheModule } from '@libs/cache';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomCacheModule.register({
      store: 'redis',
      redisConfig: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: Number(process.env.CACHE_DURATION),
      },
    }),
    CustomThrottlerModule.register({
      ttl: Number(process.env.RATE_LIMIT_TTL),
      limit: Number(process.env.RATE_LIMIT_LIMIT),
    }),
    StockModule,
    CryptoModule,
  ],
})
export class AppModule {}
