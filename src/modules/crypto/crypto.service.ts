import { Injectable } from '@nestjs/common';
import { CryptoApiFactory } from './crypto.factory';
import { CacheService } from '@libs/cache';

@Injectable()
export class CryptoService {
  private CACHE_SYMBOL_KEY = `crypto:`;
  constructor(
    private readonly cryptoApiFactory: CryptoApiFactory,
    private readonly cacheService: CacheService,
  ) {}

  async getCryptoPrice(symbol: string) {
    const cachedPrice = await this.cacheService.get(
      `${this.CACHE_SYMBOL_KEY}${symbol}`,
    );
    if (cachedPrice) return { symbol, price: cachedPrice };

    const price = await this.cryptoApiFactory
      .getProvider()
      .getCryptoPrice(symbol);
    await this.cacheService.set(
      `${this.CACHE_SYMBOL_KEY}${symbol}`,
      price,
      Number(process.env.CACHE_DURATION),
    );
    return { symbol, price };
  }
}
