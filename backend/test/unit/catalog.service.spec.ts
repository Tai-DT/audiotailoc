import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from '../../src/modules/catalog/catalog.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { SearchService } from '../../src/modules/search/search.service';
import { CacheService } from '../../src/modules/cache/cache.service';
import { NotFoundException } from '@nestjs/common';

describe('CatalogService', () => {
  let service: CatalogService;
  let prismaService: PrismaService;
  let searchService: SearchService;
  let cacheService: CacheService;

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockSearchService = {
    indexDocuments: jest.fn(),
    deleteDocument: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    deletePattern: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    prismaService = module.get<PrismaService>(PrismaService);
    searchService = module.get<SearchService>(SearchService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listProducts', () => {
    it('should list products with default parameters', async () => {
      const mockProducts = [
        {
          id: 'product_1',
          slug: 'test-product-1',
          name: 'Test Product 1',
          description: 'Test description',
          priceCents: 100000,
          imageUrl: 'test-image-1.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockTotal = 1;

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.$transaction.mockResolvedValue([mockTotal, mockProducts]);
      mockCacheService.set.mockResolvedValue(undefined);

      const result = await service.listProducts();

      expect(mockCacheService.get).toHaveBeenCalled();
      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        mockPrismaService.product.count({ where: {} }),
        mockPrismaService.product.findMany({
          where: {},
          orderBy: { createdAt: 'desc' },
          skip: 0,
          take: 20,
        }),
      ]);
      expect(result).toEqual({
        items: mockProducts,
        total: mockTotal,
        page: 1,
        pageSize: 20,
      });
    });

    it('should return cached results when available', async () => {
      const cachedResult = {
        items: [],
        total: 0,
        page: 1,
        pageSize: 20,
      };

      mockCacheService.get.mockResolvedValue(cachedResult);

      const result = await service.listProducts();

      expect(mockCacheService.get).toHaveBeenCalled();
      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
      expect(result).toEqual(cachedResult);
    });

    it('should apply search query filter', async () => {
      const mockProducts: any[] = [];
      const mockTotal = 0;

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.$transaction.mockResolvedValue([mockTotal, mockProducts]);
      mockCacheService.set.mockResolvedValue(undefined);

      await service.listProducts({ q: 'test query' });

      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        mockPrismaService.product.count({
          where: {
            OR: [
              { name: { contains: 'test query', mode: 'insensitive' } },
              { description: { contains: 'test query', mode: 'insensitive' } },
            ],
          },
        }),
        mockPrismaService.product.findMany({
          where: {
            OR: [
              { name: { contains: 'test query', mode: 'insensitive' } },
              { description: { contains: 'test query', mode: 'insensitive' } },
            ],
          },
          orderBy: { createdAt: 'desc' },
          skip: 0,
          take: 20,
        }),
      ]);
    });

    it('should apply price range filters', async () => {
      const mockProducts: any[] = [];
      const mockTotal = 0;

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.$transaction.mockResolvedValue([mockTotal, mockProducts]);
      mockCacheService.set.mockResolvedValue(undefined);

      await service.listProducts({ minPrice: 100000, maxPrice: 500000 });

      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        mockPrismaService.product.count({
          where: {
            priceCents: {
              gte: 100000,
              lte: 500000,
            },
          },
        }),
        mockPrismaService.product.findMany({
          where: {
            priceCents: {
              gte: 100000,
              lte: 500000,
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: 0,
          take: 20,
        }),
      ]);
    });

    it('should apply featured filter', async () => {
      const mockProducts: any[] = [];
      const mockTotal = 0;

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.$transaction.mockResolvedValue([mockTotal, mockProducts]);
      mockCacheService.set.mockResolvedValue(undefined);

      await service.listProducts({ featured: true });

      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        mockPrismaService.product.count({
          where: {
            featured: true,
          },
        }),
        mockPrismaService.product.findMany({
          where: {
            featured: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: 0,
          take: 20,
        }),
      ]);
    });

    it('should handle pagination correctly', async () => {
      const mockProducts: any[] = [];
      const mockTotal = 100;

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.$transaction.mockResolvedValue([mockTotal, mockProducts]);
      mockCacheService.set.mockResolvedValue(undefined);

      await service.listProducts({ page: 3, pageSize: 10 });

      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        mockPrismaService.product.count({ where: {} }),
        mockPrismaService.product.findMany({
          where: {},
          orderBy: { createdAt: 'desc' },
          skip: 20,
          take: 10,
        }),
      ]);
    });

    it('should handle custom sorting', async () => {
      const mockProducts: any[] = [];
      const mockTotal = 0;

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.$transaction.mockResolvedValue([mockTotal, mockProducts]);
      mockCacheService.set.mockResolvedValue(undefined);

      await service.listProducts({ sortBy: 'name', sortOrder: 'asc' });

      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        mockPrismaService.product.count({ where: {} }),
        mockPrismaService.product.findMany({
          where: {},
          orderBy: { name: 'asc' },
          skip: 0,
          take: 20,
        }),
      ]);
    });
  });

  describe('getBySlug', () => {
    it('should return product by slug', async () => {
      const mockProduct = {
        id: 'product_1',
        slug: 'test-product',
        name: 'Test Product',
        description: 'Test description',
        priceCents: 100000,
        imageUrl: 'test-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.getBySlug('test-product');

      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-product' },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.getBySlug('non-existent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('create', () => {
    it('should create product successfully', async () => {
      const productData = {
        slug: 'new-product',
        name: 'New Product',
        description: 'New product description',
        priceCents: 150000,
        imageUrl: 'new-image.jpg',
      };

      const mockProduct = {
        id: 'product_new',
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.findUnique.mockResolvedValue(null);
      mockPrismaService.product.create.mockResolvedValue(mockProduct);
      mockCacheService.deletePattern.mockResolvedValue(undefined);

      const result = await service.create(productData);

      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { slug: productData.slug },
      });
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: productData,
      });
      expect(mockCacheService.deletePattern).toHaveBeenCalledWith('products:list:*');
      expect(result).toEqual(mockProduct);
    });

    it('should throw error when price is not positive', async () => {
      const productData = {
        slug: 'new-product',
        name: 'New Product',
        priceCents: 0,
      };

      await expect(service.create(productData)).rejects.toThrow(
        'Price must be greater than 0'
      );
    });

    it('should throw error when slug already exists', async () => {
      const productData = {
        slug: 'existing-product',
        name: 'New Product',
        priceCents: 100000,
      };

      const existingProduct = {
        id: 'existing',
        slug: 'existing-product',
        name: 'Existing Product',
        priceCents: 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.findUnique.mockResolvedValue(existingProduct);

      await expect(service.create(productData)).rejects.toThrow(
        'Product with this slug already exists'
      );
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      const updateData = {
        name: 'Updated Product',
        priceCents: 200000,
      };

      const mockProduct = {
        id: 'product_1',
        slug: 'test-product',
        name: 'Updated Product',
        description: 'Test description',
        priceCents: 200000,
        imageUrl: 'test-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.update.mockResolvedValue(mockProduct);
      mockCacheService.deletePattern.mockResolvedValue(undefined);

      const result = await service.update('test-product', updateData);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { slug: 'test-product' },
        data: updateData,
      });
      expect(mockCacheService.deletePattern).toHaveBeenCalledWith('products:list:*');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('remove', () => {
    it('should remove product successfully', async () => {
      const mockProduct = {
        id: 'product_1',
        slug: 'test-product',
        name: 'Test Product',
        priceCents: 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.delete.mockResolvedValue(mockProduct);
      mockCacheService.deletePattern.mockResolvedValue(undefined);

      const result = await service.remove('test-product');

      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { slug: 'test-product' },
      });
      expect(mockCacheService.deletePattern).toHaveBeenCalledWith('products:list:*');
      expect(result).toEqual({ deleted: true });
    });
  });

  describe('listCategories', () => {
    it('should return cached categories when available', async () => {
      const cachedCategories = [
        {
          id: 'category_1',
          slug: 'electronics',
          name: 'Electronics',
          parentId: null,
        },
      ];

      mockCacheService.get.mockResolvedValue(cachedCategories);

      const result = await service.listCategories();

      expect(mockCacheService.get).toHaveBeenCalledWith('categories:list');
      expect(mockPrismaService.category.findMany).not.toHaveBeenCalled();
      expect(result).toEqual(cachedCategories);
    });

    it('should fetch categories from database when not cached', async () => {
      const mockCategories = [
        {
          id: 'category_1',
          slug: 'electronics',
          name: 'Electronics',
          parentId: null,
        },
        {
          id: 'category_2',
          slug: 'phones',
          name: 'Phones',
          parentId: 'category_1',
        },
      ];

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);
      mockCacheService.set.mockResolvedValue(undefined);

      const result = await service.listCategories();

      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(mockCacheService.set).toHaveBeenCalledWith(
        'categories:list',
        mockCategories,
        { ttl: 300 }
      );
      expect(result).toEqual(mockCategories);
    });
  });

  describe('removeMany', () => {
    it('should remove multiple products successfully', async () => {
      const slugs = ['product-1', 'product-2', 'product-3'];
      const mockProducts = [
        { id: 'product_1' },
        { id: 'product_2' },
        { id: 'product_3' },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.removeMany(slugs);

      expect(mockPrismaService.product.deleteMany).toHaveBeenCalledWith({
        where: { slug: { in: slugs } },
      });
      expect(result).toEqual({ deleted: 3 });
    });

    it('should handle empty slugs array', async () => {
      const result = await service.removeMany([]);

      expect(mockPrismaService.product.findMany).not.toHaveBeenCalled();
      expect(mockPrismaService.product.deleteMany).not.toHaveBeenCalled();
      expect(result).toEqual({ deleted: 0 });
    });

    it('should handle null slugs', async () => {
      const result = await service.removeMany(null as any);

      expect(mockPrismaService.product.findMany).not.toHaveBeenCalled();
      expect(mockPrismaService.product.deleteMany).not.toHaveBeenCalled();
      expect(result).toEqual({ deleted: 0 });
    });
  });
});
