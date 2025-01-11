import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CryptoApiAdapter } from '../interfaces/crypto-api.adapter';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class BinanceAdapter implements CryptoApiAdapter {
  private readonly API_URL = process.env.CRYPTO_BINANCE_API_URL;
  private readonly logger = new Logger(BinanceAdapter.name);
  constructor(private readonly httpService: HttpService) {}

  async getCryptoPrice(symbol: string): Promise<number> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.API_URL}?symbol=${symbol}USDT`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error?.response?.data);
          throw new HttpException(error?.response?.data['msg'], error?.status);
        }),
      ),
    );
    return Number(data.price);
  }
}
