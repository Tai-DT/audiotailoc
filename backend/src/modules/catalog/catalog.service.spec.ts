import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../caching/cache.service';
import { NotFoundException } from '@nestjs/common';

describe('CatalogService', () => {
  let service: CatalogService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    products: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    categories: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn().mockResolvedValue(null), // Always return null for cache misses in tests
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listProducts', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          name: 'Test Product 1',
          slug: 'test-product-1',
          priceCents: 100000,
          originalPriceCents: null,
          isActive: true,
          images: [],
          specifications: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'product-2',
          name: 'Test Product 2',
          slug: 'test-product-2',
          priceCents: 200000,
          originalPriceCents: null,
          isActive: true,
          images: [],
          specifications: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.$transaction.mockResolvedValue([2, mockProducts]);

      const result = await service.listProducts({ page: 1, pageSize: 10 });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('items');
      expect(Array.isArray(result.items)).toBe(true);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should filter products by featured', async () => {
      mockPrismaService.$transaction.mockResolvedValue([0, []]);

      const result = await service.listProducts({ page: 1, pageSize: 10, featured: true });

      expect(result).toBeDefined();
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });
  });

  describe('getBySlug', () => {
    it('should return a product by slug', async () => {
      const mockProduct = {
        id: 'product-1',
        name: 'Test Product',
        slug: 'test-product',
        priceCents: 100000,
        originalPriceCents: null,
        isActive: true,
        images: [],
        specifications: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.products.findUnique.mockResolvedValue(mockProduct);

      const result = await service.getBySlug('test-product');

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.products.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-product' },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.products.findUnique.mockResolvedValue(null);

      await expect(service.getBySlug('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('listCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Category 1', slug: 'category-1', parentId: null },
        { id: 'cat-2', name: 'Category 2', slug: 'category-2', parentId: null },
      ];

      mockPrismaService.categories.findMany.mockResolvedValue(mockCategories);

      const result = await service.listCategories();

      expect(result).toEqual(mockCategories);
      expect(mockPrismaService.categories.findMany).toHaveBeenCalled();
    });
  });
});
