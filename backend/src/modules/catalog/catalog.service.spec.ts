import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchService } from '../search/search.service';
import { TestUtils } from '../../test/test-utils';

describe('CatalogService', () => {
  let service: CatalogService;
  let prismaService: PrismaService;
  let searchService: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await TestUtils.createTestingModule(
      [],
      [
        CatalogService,
        {
          provide: SearchService,
          useValue: {
            index: jest.fn(),
            search: jest.fn(),
            remove: jest.fn(),
          },
        },
      ]
    );

    service = module.get<CatalogService>(CatalogService);
    prismaService = module.get<PrismaService>(PrismaService);
    searchService = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listProducts', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        TestUtils.createMockProduct({ id: '1', name: 'Product 1' }),
        TestUtils.createMockProduct({ id: '2', name: 'Product 2' }),
      ];

      const mockCount = 2;

      (prismaService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      (prismaService.product.count as jest.Mock).mockResolvedValue(mockCount);

      const result = await service.listProducts({
        page: 1,
        pageSize: 10,
      });

      expect(result).toEqual({
        items: mockProducts,
        totalCount: mockCount,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });

      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter products by search query', async () => {
      const mockProducts = [TestUtils.createMockProduct()];
      const mockSearchResults = {
        hits: mockProducts,
        estimatedTotalHits: 1,
        page: 1,
        pageSize: 10,
      };

      (searchService.search as jest.Mock).mockResolvedValue(mockSearchResults);

      const result = await service.listProducts({
        page: 1,
        pageSize: 10,
        q: 'test query',
      });

      expect(searchService.search).toHaveBeenCalledWith('test query', 1, 10, {}, {});
      expect(result.items).toEqual(mockProducts);
    });

    it('should filter products by price range', async () => {
      const mockProducts = [TestUtils.createMockProduct()];
      const mockCount = 1;

      (prismaService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      (prismaService.product.count as jest.Mock).mockResolvedValue(mockCount);

      await service.listProducts({
        page: 1,
        pageSize: 10,
        minPrice: 50000,
        maxPrice: 200000,
      });

      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: { category: true },
        where: {
          priceCents: {
            gte: 50000,
            lte: 200000,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getProduct', () => {
    it('should return a product by slug', async () => {
      const mockProduct = TestUtils.createMockProduct();
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.getProduct('test-product');

      expect(result).toEqual(mockProduct);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-product' },
        include: { category: true },
      });
    });

    it('should throw error if product not found', async () => {
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getProduct('non-existent')).rejects.toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Description',
        priceCents: 150000,
        categoryId: 'category-id',
      };

      const mockProduct = TestUtils.createMockProduct(productData);
      (prismaService.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.createProduct(productData);

      expect(result).toEqual(mockProduct);
      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...productData,
          slug: expect.any(String),
        }),
      });
      expect(searchService.index).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updateData = { name: 'Updated Product' };
      const mockProduct = TestUtils.createMockProduct(updateData);

      (prismaService.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.updateProduct('product-id', updateData);

      expect(result).toEqual(mockProduct);
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: { id: 'product-id' },
        data: updateData,
      });
      expect(searchService.index).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const mockProduct = TestUtils.createMockProduct();
      (prismaService.product.delete as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.deleteProduct('product-id');

      expect(result).toEqual(mockProduct);
      expect(prismaService.product.delete).toHaveBeenCalledWith({
        where: { id: 'product-id' },
      });
      expect(searchService.remove).toHaveBeenCalledWith('product-id');
    });
  });

  describe('listCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        TestUtils.createMockCategory({ id: '1', name: 'Category 1' }),
        TestUtils.createMockCategory({ id: '2', name: 'Category 2' }),
      ];

      (prismaService.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const result = await service.listCategories();

      expect(result).toEqual(mockCategories);
      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        include: { _count: { select: { products: true } } },
      });
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'New Category',
        description: 'New Description',
      };

      const mockCategory = TestUtils.createMockCategory(categoryData);
      (prismaService.category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.createCategory(categoryData);

      expect(result).toEqual(mockCategory);
      expect(prismaService.category.create).toHaveBeenCalledWith({
        data: categoryData,
      });
    });
  });
});
