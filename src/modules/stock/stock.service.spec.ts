import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from './stock.service';
import { StockApiFactory } from './stock.factory';

import { StockApiType } from './enums/stock.enum';
import { CacheService } from '@libs/cache';
import { ConfigModule } from '@nestjs/config';

describe('StockService', () => {
  let service: StockService;
  let cacheService: CacheService;
  let stockApiFactory: StockApiFactory;

  const mockStockApiFactory = {
    getProvider: jest.fn().mockReturnValue({
      getStockPrice: jest.fn(),
      searchCompany: jest.fn(),
    }),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        StockService,
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

    service = module.get<StockService>(StockService);
    stockApiFactory = module.get<StockApiFactory>(StockApiFactory);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStockPrice', () => {
    it('should return cached price if available', async () => {
      const symbol = 'AAPL';
      const cachedPrice = 150.5;
      mockCacheService.get.mockResolvedValueOnce(cachedPrice);

      const result = await service.getStockPrice(symbol, StockApiType.SYMBOL);

      expect(result).toEqual({ symbol, price: cachedPrice });
      expect(cacheService.get).toHaveBeenCalledWith(`stock:${symbol}`);
      expect(
        mockStockApiFactory.getProvider().getStockPrice,
      ).not.toHaveBeenCalled();
    });

    it('should fetch and cache price if not cached', async () => {
      const symbol = 'AAPL';
      const price = 150.5;
      mockCacheService.get.mockResolvedValueOnce(null);
      mockStockApiFactory
        .getProvider()
        .getStockPrice.mockResolvedValueOnce(price);

      const result = await service.getStockPrice(symbol, StockApiType.SYMBOL);

      expect(result).toEqual({ symbol, price });
      expect(cacheService.get).toHaveBeenCalledWith(`stock:${symbol}`);
      expect(
        mockStockApiFactory.getProvider().getStockPrice,
      ).toHaveBeenCalledWith(symbol);
      expect(cacheService.set).toHaveBeenCalledWith(
        `stock:${symbol}`,
        price,
        10000,
      );
    });

    it('should search company and get stock price when type is COMPANY', async () => {
      const companyName = 'Apple';
      const symbol = 'AAPL';
      const price = 150.5;

      mockStockApiFactory
        .getProvider()
        .searchCompany.mockResolvedValueOnce(symbol);
      mockCacheService.get.mockResolvedValueOnce(null);
      mockStockApiFactory
        .getProvider()
        .getStockPrice.mockResolvedValueOnce(price);

      const result = await service.getStockPrice(
        companyName,
        StockApiType.COMPANY,
      );

      expect(result).toEqual({ symbol, price });
      expect(
        mockStockApiFactory.getProvider().searchCompany,
      ).toHaveBeenCalledWith(companyName);
      expect(cacheService.get).toHaveBeenCalledWith(`stock:${symbol}`);
      expect(
        mockStockApiFactory.getProvider().getStockPrice,
      ).toHaveBeenCalledWith(symbol);
      expect(cacheService.set).toHaveBeenCalledWith(
        `stock:${symbol}`,
        price,
        10000,
      );
    });

    it('should handle errors from the API', async () => {
      const symbol = 'INVALID';
      mockCacheService.get.mockResolvedValueOnce(null);
      mockStockApiFactory
        .getProvider()
        .getStockPrice.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        service.getStockPrice(symbol, StockApiType.SYMBOL),
      ).rejects.toThrow('API Error');
    });
  });
});
