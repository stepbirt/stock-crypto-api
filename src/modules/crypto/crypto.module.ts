import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CryptoController } from './crypto.controller';
import { HttpModule } from '@nestjs/axios';

import { CryptoApiFactory } from './crypto.factory';
import { BinanceAdapter } from './adapters/binanace.adapter';
import { CustomCacheModule } from '@libs/cache';

@Module({
  imports: [HttpModule, CustomCacheModule],
  controllers: [CryptoController],
  providers: [CryptoService, CryptoApiFactory, BinanceAdapter],
})
export class CryptoModule {}
