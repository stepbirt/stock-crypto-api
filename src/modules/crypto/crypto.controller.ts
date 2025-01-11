import { Controller, Get, Query } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { GetCryptoPriceDto } from './dtos/get-crypto.dto';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('price')
  @ApiResponse({
    status: 200,
    description: 'Successfully get crypto price',
  })
  @ApiResponse({
    status: 404,
    description: 'Crypto not found',
  })
  getCryptoPrice(@Query() query: GetCryptoPriceDto) {
    return this.cryptoService.getCryptoPrice(query.symbol);
  }
}
