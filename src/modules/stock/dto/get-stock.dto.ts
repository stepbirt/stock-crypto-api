import { IsEnum, IsNotEmpty } from 'class-validator';
import { StockApiType } from '../enums/stock.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetStockPriceDto {
  @ApiProperty({
    description: 'The stock symbol',
    example: 'AAPL',
  })
  @IsNotEmpty()
  input: string;

  @ApiProperty({
    description: 'The stock type',
    enum: StockApiType,
    example: StockApiType.SYMBOL,
  })
  @IsNotEmpty()
  @IsEnum(StockApiType)
  type: StockApiType;
}
