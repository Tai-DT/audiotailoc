import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { SearchService } from '../search/search.service';
import { TestUtils } from '../../test/test-utils';

describe('CatalogController (Integration)', () => {
  let app: INestApplication;
  let catalogService: CatalogService;

  beforeEach(async () => {
    const module: TestingModule = await TestUtils.createTestingModule(
      [],
      [
        CatalogController,
        {
          provide: CatalogService,
          useValue: {
            listProducts: jest.fn(),
            getProduct: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
            listCategories: jest.fn(),
            createCategory: jest.fn(),
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(),
          },
        },
        {
          provide: SearchService,
          useValue: {
            search: jest.fn(),
            getSuggestions: jest.fn(),
            getPopularSearches: jest.fn(),
            getFacets: jest.fn(),
          },
        },
      ]
    );

    app = await TestUtils.createTestApp(module);
    catalogService = module.get<CatalogService>(CatalogService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /catalog/products', () => {
    it('should return paginated products', async () => {
      const mockResponse = {
        items: [TestUtils.createMockProduct()],
        totalCount: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      };

      (catalogService.listProducts as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .get('/catalog/products')
        .expect(200);

      expect(response.body).toEqual(mockResponse);
      expect(catalogService.listProducts).toHaveBeenCalledWith({
        page: 1,
        pageSize: 20,
      });
    });

    it('should handle query parameters', async () => {
      const mockResponse = {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      };

      (catalogService.listProducts as jest.Mock).mockResolvedValue(mockResponse);

      await request(app.getHttpServer())
        .get('/catalog/products?page=1&pageSize=10&q=test&minPrice=100&maxPrice=1000')
        .expect(200);

      expect(catalogService.listProducts).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        q: 'test',
        minPrice: 100,
        maxPrice: 1000,
      });
    });

    it('should validate query parameters', async () => {
      await request(app.getHttpServer())
        .get('/catalog/products?page=0&pageSize=0')
        .expect(400);
    });
  });

  describe('GET /catalog/products/:slug', () => {
    it('should return a product by slug', async () => {
      const mockProduct = TestUtils.createMockProduct();
      (catalogService.getProduct as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app.getHttpServer())
        .get('/catalog/products/test-product')
        .expect(200);

      expect(response.body).toEqual(mockProduct);
      expect(catalogService.getProduct).toHaveBeenCalledWith('test-product');
    });

    it('should return 404 for non-existent product', async () => {
      (catalogService.getProduct as jest.Mock).mockRejectedValue(new Error('Product not found'));

      await request(app.getHttpServer())
        .get('/catalog/products/non-existent')
        .expect(404);
    });
  });

  describe('POST /catalog/products', () => {
    it('should create a new product with admin auth', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Description',
        priceCents: 150000,
        categoryId: 'category-id',
      };

      const mockProduct = TestUtils.createMockProduct(productData);
      (catalogService.createProduct as jest.Mock).mockResolvedValue(mockProduct);

      const token = TestUtils.generateJwtToken({ role: 'ADMIN' });

      const response = await TestUtils.makeAuthenticatedRequest(
        app,
        'post',
        '/catalog/products',
        token,
        productData
      ).expect(201);

      expect(response.body).toEqual(mockProduct);
      expect(catalogService.createProduct).toHaveBeenCalledWith(productData);
    });

    it('should reject request without admin auth', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Description',
        priceCents: 150000,
        categoryId: 'category-id',
      };

      await request(app.getHttpServer())
        .post('/catalog/products')
        .send(productData)
        .expect(401);
    });

    it('should validate product data', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        priceCents: -100, // Invalid: negative price
      };

      const token = TestUtils.generateJwtToken({ role: 'ADMIN' });

      await TestUtils.makeAuthenticatedRequest(
        app,
        'post',
        '/catalog/products',
        token,
        invalidData
      ).expect(400);
    });
  });

  describe('GET /catalog/categories', () => {
    it('should return all categories', async () => {
      const mockCategories = [TestUtils.createMockCategory()];
      (catalogService.listCategories as jest.Mock).mockResolvedValue(mockCategories);

      const response = await request(app.getHttpServer())
        .get('/catalog/categories')
        .expect(200);

      expect(response.body).toEqual(mockCategories);
      expect(catalogService.listCategories).toHaveBeenCalled();
    });
  });

  describe('POST /catalog/categories', () => {
    it('should create a new category with admin auth', async () => {
      const categoryData = {
        name: 'New Category',
        description: 'New Description',
      };

      const mockCategory = TestUtils.createMockCategory(categoryData);
      (catalogService.createCategory as jest.Mock).mockResolvedValue(mockCategory);

      const token = TestUtils.generateJwtToken({ role: 'ADMIN' });

      const response = await TestUtils.makeAuthenticatedRequest(
        app,
        'post',
        '/catalog/categories',
        token,
        categoryData
      ).expect(201);

      expect(response.body).toEqual(mockCategory);
      expect(catalogService.createCategory).toHaveBeenCalledWith(categoryData);
    });
  });

  describe('GET /catalog/search/advanced', () => {
    it('should perform advanced search', async () => {
      const mockSearchResults = {
        hits: [TestUtils.createMockProduct()],
        estimatedTotalHits: 1,
        page: 1,
        pageSize: 20,
        facetDistribution: {},
      };

      const searchService = app.get(SearchService);
      (searchService.search as jest.Mock).mockResolvedValue(mockSearchResults);

      const response = await request(app.getHttpServer())
        .get('/catalog/search/advanced?q=test&categoryId=cat1&minPrice=100&maxPrice=1000')
        .expect(200);

      expect(response.body).toEqual(mockSearchResults);
      expect(searchService.search).toHaveBeenCalledWith(
        'test',
        1,
        20,
        {
          categoryId: 'cat1',
          minPrice: 100,
          maxPrice: 1000,
        },
        {
          sortBy: 'relevance',
        }
      );
    });
  });

  describe('GET /catalog/search/suggestions', () => {
    it('should return search suggestions', async () => {
      const mockSuggestions = ['suggestion 1', 'suggestion 2'];
      const searchService = app.get(SearchService);
      (searchService.getSuggestions as jest.Mock).mockResolvedValue(mockSuggestions);

      const response = await request(app.getHttpServer())
        .get('/catalog/search/suggestions?q=test')
        .expect(200);

      expect(response.body).toEqual(mockSuggestions);
      expect(searchService.getSuggestions).toHaveBeenCalledWith('test', undefined);
    });
  });
});
