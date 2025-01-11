import { Test, TestingModule } from '@nestjs/testing';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { CryptoApiFactory } from './crypto.factory';
import { CacheService } from '@libs/cache';

describe('CryptoController', () => {
  let controller: CryptoController;

  const mockCryptoService = {
    getCryptoPrice: jest
      .fn()
      .mockResolvedValue({ symbol: 'BTC', price: 45000.5 }),
  };

  const mockCryptoApiFactory = {
    getProvider: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoController],
      providers: [
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
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

    controller = module.get<CryptoController>(CryptoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return crypto price data', async () => {
    const result = await controller.getCryptoPrice({
      symbol: 'BTC',
    });
    expect(result).toEqual({ symbol: 'BTC', price: 45000.5 });
    expect(mockCryptoService.getCryptoPrice).toHaveBeenCalledWith('BTC');
  });

  it('should handle error when getting crypto price', async () => {
    mockCryptoService.getCryptoPrice.mockRejectedValueOnce(
      new Error('API Error'),
    );

    await expect(
      controller.getCryptoPrice({
        symbol: 'INVALID',
      }),
    ).rejects.toThrow('API Error');
  });
});
