export interface CryptoApiAdapter {
  getCryptoPrice(symbol: string): Promise<number>;
}
