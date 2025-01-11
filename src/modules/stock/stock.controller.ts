import { Controller, Get, Query } from '@nestjs/common';
import { StockService } from './stock.service';

import { GetStockPriceDto } from './dto/get-stock.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('price')
  @ApiResponse({
    status: 200,
    description: 'Successfully get stock price',
  })
  @ApiResponse({
    status: 404,
    description: 'Stock not found',
  })
  // @Throttle({
  //   default: {
  //     ttl: Environments.RATE_LIMIT_TTL,
  //     limit: Environments.RATE_LIMIT_LIMIT,
  //   },
  // })
  getStockPrice(@Query() query: GetStockPriceDto) {
    return this.stockService.getStockPrice(query.input, query.type);
  }
}
