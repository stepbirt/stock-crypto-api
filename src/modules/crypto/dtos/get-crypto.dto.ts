import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCryptoPriceDto {
  @ApiProperty({
    description: 'The crypto symbol',
    example: 'BTC',
  })
  @IsNotEmpty()
  symbol: string;
}
