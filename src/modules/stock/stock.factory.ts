import { Injectable, NotFoundException } from '@nestjs/common';
import { YahooFinanceAdapter } from './adapters/yahoo-finance.adapter';
import { StockApiAdapter } from './interfaces/stock-api.adapter';

import { StockProvider } from './enums/stock.enum';

@Injectable()
export class StockApiFactory {
  constructor(private readonly yahooFinanceAdapter: YahooFinanceAdapter) {}

  getProvider(apiProvider?: string): StockApiAdapter {
    const provider =
      apiProvider || process.env.STOCK_API_PROVIDER || 'YahooFinance';
    switch (provider) {
      case StockProvider.YAHOO_FINANCE:
        return this.yahooFinanceAdapter;
      // Note: Add more providers here
      default:
        throw new NotFoundException('Invalid API provider');
    }
  }
}
