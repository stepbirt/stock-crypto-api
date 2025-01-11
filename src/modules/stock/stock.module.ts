import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';

import { HttpModule } from '@nestjs/axios';
import { StockApiFactory } from './stock.factory';
import { YahooFinanceAdapter } from './adapters/yahoo-finance.adapter';
import { CustomCacheModule } from '@libs/cache';

@Module({
  imports: [HttpModule, CustomCacheModule],
  controllers: [StockController],
  providers: [StockService, StockApiFactory, YahooFinanceAdapter],
})
export class StockModule {}
