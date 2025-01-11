import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { StockApiFactory } from './stock.factory';

import { StockApiType } from './enums/stock.enum';
import { CacheService } from '@libs/cache';

describe('StockController', () => {
  let controller: StockController;

  const mockStockService = {
    getStockPrice: jest.fn().mockResolvedValue({ symbol: 'AAPL', price: 100 }),
  };

  const mockStockApiFactory = {
    getProvider: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        {
          provide: StockService,
          useValue: mockStockService,
        },
        {
          provide: StockApiFactory,
          useValue: mockStockApiFactory,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    controller = module.get<StockController>(StockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return stock data', async () => {
    const result = await controller.getStockPrice({
      input: 'AAPL',
      type: StockApiType.SYMBOL,
    });
    expect(result).toEqual({ symbol: 'AAPL', price: 100 });
    expect(mockStockService.getStockPrice).toHaveBeenCalledWith(
      'AAPL',
      StockApiType.SYMBOL,
    );
  });
});
