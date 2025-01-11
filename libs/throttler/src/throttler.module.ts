import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { CustomThrottlerGuard } from './throttler.guard';

@Module({})
export class CustomThrottlerModule {
  static register(options?: { ttl?: number; limit?: number }): DynamicModule {
    const throttlerModule = ThrottlerModule.forRoot([
      {
        ttl: options?.ttl || 300,
        limit: options?.limit || 200,
      },
    ]);
    return {
      module: CustomThrottlerModule,
      imports: [throttlerModule],
      providers: [{ provide: APP_GUARD, useClass: CustomThrottlerGuard }],
    };
  }
}
