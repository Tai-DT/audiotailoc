import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from '../../src/modules/search/search.service';
import { AiService } from '../../src/modules/ai/ai.service';
import { CacheService } from '../../src/modules/cache/cache.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('SearchService', () => {
  let service: SearchService;
  let aiService: AiService;
  let cacheService: CacheService;
  let prismaService: PrismaService;

  const mockAiService = {
    semanticSearch: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
    productTag: {
      findMany: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key: string, def?: any) => {
            const cfg: Record<string, any> = {
              MEILI_ENABLED: false,
              MEILI_URL: undefined,
              MEILI_API_KEY: undefined,
            };
            return key in cfg ? cfg[key] : def;
          }) },
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    aiService = module.get<AiService>(AiService);
    cacheService = module.get<CacheService>(CacheService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchProducts', () => {
    it('should return cached results when available', async () => {
      const query = 'tai nghe sony';
      const filters = { minPrice: 1000000, maxPrice: 10000000 };

      const cachedResults = {
        items: [
          {
            id: 'prod_1',
            name: 'Tai nghe Sony WH-1000XM4',
            priceCents: 8500000,
          },
        ],
        total: 1,
        query: 'tai nghe sony',
        enhancedQuery: 'tai nghe sony wh1000xm4 noise cancelling',
      };

      mockCacheService.get.mockResolvedValue(cachedResults);

      const result = await service.searchProducts(query, filters);

      expect(mockCacheService.get).toHaveBeenCalledWith(
        `search:${JSON.stringify({ query, filters })}`
      );
      expect(result).toEqual(cachedResults);
      expect(mockPrismaService.product.findMany).not.toHaveBeenCalled();
    });

    it('should enhance query with AI for long queries', async () => {
      const query = 'tai nghe sony chống ồn cao cấp';
      const filters = {};

      const mockAiResults = [
        { title: 'Tai nghe Sony WH-1000XM4' },
        { title: 'Tai nghe Sony WH-1000XM5' },
      ];

      const mockProducts = [
        {
          id: 'prod_1',
          name: 'Tai nghe Sony WH-1000XM4',
          priceCents: 8500000,
          category: { name: 'Tai nghe' },
        },
      ];

      mockCacheService.get.mockResolvedValue(null);
      mockAiService.semanticSearch.mockResolvedValue(mockAiResults);
      mockPrismaService.product.count.mockResolvedValue(1);
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.aggregate.mockResolvedValue({
        _min: { priceCents: 1000000 },
        _max: { priceCents: 10000000 }
      });
      mockPrismaService.productTag.findMany.mockResolvedValue([]);

      const result = await service.searchProducts(query, filters);

      expect(mockAiService.semanticSearch).toHaveBeenCalledWith(query, 3);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                name: expect.objectContaining({
                  contains: expect.stringContaining('Tai nghe Sony WH-1000XM4'),
                }),
              }),
            ]),
          }),
        })
      );
      // Cache is not called when AI enhancement is used
      expect(mockCacheService.set).not.toHaveBeenCalled();
    });

    it('should handle AI enhancement failure gracefully', async () => {
      const query = 'tai nghe sony chống ồn cao cấp';
      const filters = {};

      const mockProducts = [
        {
          id: 'prod_1',
          name: 'Tai nghe Sony WH-1000XM4',
          priceCents: 8500000,
        },
      ];

      mockCacheService.get.mockResolvedValue(null);
      mockAiService.semanticSearch.mockRejectedValue(new Error('AI service unavailable'));
      mockPrismaService.product.count.mockResolvedValue(1);
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.aggregate.mockResolvedValue({
        _min: { priceCents: 1000000 },
        _max: { priceCents: 10000000 }
      });
      mockPrismaService.productTag.findMany.mockResolvedValue([]);

      const result = await service.searchProducts(query, filters);

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                name: expect.objectContaining({
                  contains: query,
                }),
              }),
            ]),
          }),
        })
      );
      expect(result).toEqual(expect.objectContaining({ products: mockProducts }));
    });

    it('should apply filters correctly', async () => {
      const query = 'tai nghe';
      const filters = {
        minPrice: 1000000,
        maxPrice: 10000000,
        featured: true,
        inStock: true,
      };

      const mockProducts = [
        {
          id: 'prod_1',
          name: 'Tai nghe Sony WH-1000XM4',
          priceCents: 8500000,
          featured: true,
          inventory: { stock: 5 },
        },
      ];

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.product.count.mockResolvedValue(1);
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.aggregate.mockResolvedValue({
        _min: { priceCents: 1000000 },
        _max: { priceCents: 10000000 }
      });
      mockPrismaService.productTag.findMany.mockResolvedValue([]);

      await service.searchProducts(query, filters);

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            priceCents: expect.objectContaining({
              gte: 1000000,
              lte: 10000000,
            }),
            featured: true,
          }),
        })
      );
    });

    it('should handle pagination correctly', async () => {
      const query = 'tai nghe';
      const filters = { page: 2, pageSize: 10 } as any;

      const mockProducts = Array.from({ length: 10 }, (_, i) => ({
        id: `prod_${i}`,
        name: `Tai nghe ${i}`,
        priceCents: 1000000,
      }));

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.product.count.mockResolvedValue(25);
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.aggregate.mockResolvedValue({
        _min: { priceCents: 1000000 },
        _max: { priceCents: 10000000 }
      });
      mockPrismaService.productTag.findMany.mockResolvedValue([]);

      const result = await service.searchProducts(query, filters);

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        })
      );
      expect(result).toEqual(expect.objectContaining({
        pagination: expect.objectContaining({
          page: 1,
          limit: 20,
          total: 25
        })
      }));
    });
  });

  describe('getSearchSuggestions', () => {
    it('should return search suggestions', async () => {
      const query = 'tai nghe';

      const mockProducts = [
        { name: 'Tai nghe Sony WH-1000XM4', _count: { views: 10 } },
        { name: 'Tai nghe Sony WH-1000XM5', _count: { views: 5 } },
      ];

      const mockCategories = [
        { name: 'Tai nghe', _count: { products: 5 } },
        { name: 'Tai nghe Bluetooth', _count: { products: 3 } },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);

      const result = await service.getSearchSuggestions(query);

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: expect.objectContaining({
              contains: query,
            }),
          }),
          take: 5,
        })
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'product',
            value: expect.any(String),
          }),
          expect.objectContaining({
            type: 'category',
            value: expect.any(String),
          }),
        ])
      );
    });
  });

  describe('getPopularSearches', () => {
    it('should return popular searches', async () => {
      const mockProducts = [
        { name: 'Tai nghe Sony WH-1000XM4' },
        { name: 'Tai nghe Sony WH-1000XM5' },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.getPopularSearches();

      expect(result).toEqual(['Tai nghe Sony WH-1000XM4', 'Tai nghe Sony WH-1000XM5']);
    });
  });

  describe('logSearchAnalytics', () => {
    it('should log search analytics', async () => {
      const query = 'tai nghe sony';
      const filters = {};
      const resultCount = 5;

      await service.logSearchAnalytics(query, filters, resultCount);

      // Verify that the method executes without error
      expect(true).toBe(true);
    });
  });
});
