import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { CryptoApiFactory } from './crypto.factory';
import { CacheService } from '@libs/cache';
import { ConfigModule } from '@nestjs/config';

describe('CryptoService', () => {
  let service: CryptoService;
  let cacheService: CacheService;
  let cryptoApiFactory: CryptoApiFactory;

  const mockCryptoApiFactory = {
    getProvider: jest.fn().mockReturnValue({
      getCryptoPrice: jest.fn(),
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
        CryptoService,
        {
          provide: CryptoApiFactory,
          useValue: mockCryptoApiFactory,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
    cryptoApiFactory = module.get<CryptoApiFactory>(CryptoApiFactory);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCryptoPrice', () => {
    it('should return cached price if available', async () => {
      const symbol = 'BTC';
      const cachedPrice = 45000.5;
      mockCacheService.get.mockResolvedValueOnce(cachedPrice);

      const result = await service.getCryptoPrice(symbol);

      expect(result).toEqual({ symbol, price: cachedPrice });
      expect(cacheService.get).toHaveBeenCalledWith(`crypto:${symbol}`);
      expect(
        mockCryptoApiFactory.getProvider().getCryptoPrice,
      ).not.toHaveBeenCalled();
    });

    it('should fetch and cache price if not cached', async () => {
      const symbol = 'BTC';
      const price = 45000.5;
      mockCacheService.get.mockResolvedValueOnce(null);
      mockCryptoApiFactory
        .getProvider()
        .getCryptoPrice.mockResolvedValueOnce(price);

      const result = await service.getCryptoPrice(symbol);

      expect(result).toEqual({ symbol, price });
      expect(cacheService.get).toHaveBeenCalledWith(`crypto:${symbol}`);
      expect(
        mockCryptoApiFactory.getProvider().getCryptoPrice,
      ).toHaveBeenCalledWith(symbol);
      expect(cacheService.set).toHaveBeenCalledWith(
        `crypto:${symbol}`,
        price,
        10000,
      );
    });

    it('should get price', async () => {
      const symbol = 'BTC';
      const price = 45000.5;

      mockCacheService.get.mockResolvedValueOnce(null);
      mockCryptoApiFactory
        .getProvider()
        .getCryptoPrice.mockResolvedValueOnce(price);

      const result = await service.getCryptoPrice(symbol);

      expect(result).toEqual({ symbol, price });
      expect(cacheService.get).toHaveBeenCalledWith(`crypto:${symbol}`);
      expect(
        mockCryptoApiFactory.getProvider().getCryptoPrice,
      ).toHaveBeenCalledWith(symbol);
      expect(cacheService.set).toHaveBeenCalledWith(
        `crypto:${symbol}`,
        price,
        10000,
      );
    });

    it('should handle errors from the API', async () => {
      const symbol = 'INVALID';
      mockCacheService.get.mockResolvedValueOnce(null);
      mockCryptoApiFactory
        .getProvider()
        .getCryptoPrice.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.getCryptoPrice(symbol)).rejects.toThrow('API Error');
    });
  });
});
