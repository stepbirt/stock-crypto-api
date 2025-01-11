import { Injectable, NotFoundException } from '@nestjs/common';
import { BinanceAdapter } from './adapters/binanace.adapter';
import { CryptoProvider } from './enums/crypto.enum';

@Injectable()
export class CryptoApiFactory {
  constructor(private readonly binanceAdapter: BinanceAdapter) {}
  getProvider(apiProvider?: string) {
    const provider =
      apiProvider || process.env.CRYPTO_API_PROVIDER || 'Binance';
    switch (provider) {
      case CryptoProvider.BINANCE:
        return this.binanceAdapter;

      default:
        throw new NotFoundException('Invalid API provider');
    }
  }
}
