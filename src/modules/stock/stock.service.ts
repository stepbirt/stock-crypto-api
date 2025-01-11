import { Injectable } from '@nestjs/common';

import { StockApiFactory } from './stock.factory';
import { StockApiType } from './enums/stock.enum';
import { CacheService } from '@libs/cache';

@Injectable()
export class StockService {
  private CACHE_SYMBOL_KEY = `stock:`;
  private CACHE_COMPANY_KEY = `company:`;
  constructor(
    private readonly stockApiFactory: StockApiFactory,
    private readonly cacheService: CacheService,
  ) {}

  private getCacheKey(input: string, type: StockApiType) {
    return type === StockApiType.SYMBOL
      ? `${this.CACHE_SYMBOL_KEY}${input}`
      : `${this.CACHE_COMPANY_KEY}${input}`;
  }

  async getStockPrice(
    input: string,
    type: StockApiType,
  ): Promise<{ symbol: string; price: number }> {
    if (type === StockApiType.COMPANY) {
      const symbol = await this.stockApiFactory
        .getProvider()
        .searchCompany(input);

      return this.getStockPrice(symbol, StockApiType.SYMBOL);
    }

    const cacheKey = this.getCacheKey(input, type);
    const cachedPrice = await this.cacheService.get<number>(cacheKey);

    if (cachedPrice) return { symbol: input, price: cachedPrice };

    return this.fetchAndCacheStockPrice(input, cacheKey);
  }

  private async fetchAndCacheStockPrice(
    symbol: string,
    cacheKey: string,
  ): Promise<{ symbol: string; price: number }> {
    const price = await this.stockApiFactory
      .getProvider()
      .getStockPrice(symbol);
    await this.cacheService.set(
      cacheKey,
      price,
      parseInt(process.env.CACHE_DURATION),
    );
    return { symbol, price };
  }
}
