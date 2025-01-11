export interface StockApiAdapter {
  searchCompany(companyName: string): Promise<string>;
  getStockPrice(symbol: string): Promise<number>;
}
