import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { Quote } from '../interfaces/stock.interface';
import { StockApiAdapter } from '../interfaces/stock-api.adapter';

@Injectable()
export class YahooFinanceAdapter implements StockApiAdapter {
  constructor() {
    yahooFinance.suppressNotices(['yahooSurvey']);
  }

  async getStockPrice(symbol: string): Promise<any> {
    try {
      const { price } = await yahooFinance.quoteSummary(symbol, {
        modules: ['price'],
      });
      return price.regularMarketPrice;
    } catch (error) {
      if (error.message.includes('Quote not found')) {
        throw new NotFoundException(error.message);
      }
      throw new HttpException(error.message, error.status);
    }
  }

  async searchCompany(companyName: string): Promise<any> {
    const searchResult = await yahooFinance.search(companyName);
    const quotes = searchResult.quotes as Quote[];

    if (quotes.length > 0) {
      return quotes[0].symbol;
    }
    throw new NotFoundException('Company not found');
  }
}
