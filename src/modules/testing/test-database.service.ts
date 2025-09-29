import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TestDatabaseService {
  private readonly logger = new Logger(TestDatabaseService.name);
  private prisma: PrismaClient;

  constructor(private configService: ConfigService) {
    this.prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
  }

  // Create test data
  async createTestUser(overrides: Partial<any> = {}) {
    const userData = {
      email: `test${Date.now()}@example.com`,
      password: 'hashedpassword123',
      name: 'Test User',
      phone: '0123456789',
      role: 'USER',
      ...overrides,
    };

    const user = await this.prisma.users.create({ data: userData as any });
    this.logger.log(`Created test user: ${user.id}`);
    return user;
  }

  async createTestProduct(overrides: Partial<any> = {}) {
    const productData = {
      name: `Test Product ${Date.now()}`,
      description: 'This is a test product',
      price: 100000,
      originalPrice: 120000,
      stock: 10,
      images: 'https://example.com/image1.jpg',
      isActive: true,
      isFeatured: false,
      seoTitle: `Test Product ${Date.now()}`,
      seoDescription: 'Test product description',
      slug: `test-product-${Date.now()}`,
      priceCents: 10000000,
      ...overrides,
    };

    const product = await this.prisma.products.create({ data: productData as any });
    this.logger.log(`Created test product: ${product.id}`);
    return product;
  }

  async createTestCategory(overrides: Partial<any> = {}) {
    const categoryData = {
      name: `Test Category ${Date.now()}`,
      slug: `test-category-${Date.now()}`,
      description: 'This is a test category',
      image: 'https://example.com/category.jpg',
      isActive: true,
      sortOrder: 0,
      seoTitle: `Test Category ${Date.now()}`,
      seoDescription: 'Test category description',
      ...overrides,
    };

    const category = await this.prisma.categories.create({ data: categoryData as any });
    this.logger.log(`Created test category: ${category.id}`);
    return category;
  }

  async createTestOrder(userId: string, productIds: string[] = [], overrides: Partial<any> = {}) {
    const total = productIds.length * 100000;

    const orderData = {
      userId,
      subtotalCents: total,
      totalCents: total,
      discountCents: 0,
      shippingCents: 0,
      status: 'PENDING',
      shippingAddress: '123 Test Street, Test City',
      orderNo: `ORDER-${Date.now()}`,
      ...overrides,
    } as any;

    const order = await this.prisma.orders.create({ data: orderData });
    this.logger.log(`Created test order: ${order.id}`);
    return order;
  }

  async createTestService(overrides: Partial<any> = {}) {
    const serviceName = `Test Service ${Date.now()}`;
    const serviceData = {
      name: serviceName,
      slug: serviceName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      description: 'This is a test service',
      price: 50000,
      basePriceCents: 50000 * 100,
      duration: 60,
      images: 'https://example.com/service.jpg',
      isActive: true,
      isFeatured: false,
      seoTitle: serviceName,
      seoDescription: 'Test service description',
      priceType: 'FIXED',
      ...overrides,
    };

    const service = await this.prisma.services.create({ data: serviceData as any });
    this.logger.log(`Created test service: ${service.id}`);
    return service;
  }

  async cleanupTestData() {
    try {
      await this.prisma.testimonials.deleteMany({ where: { name: { contains: 'Test ' } } });
      await this.prisma.site_stats.deleteMany({ where: { key: { contains: 'test-' } } });
      await this.prisma.categories.deleteMany({ where: { name: { contains: 'Test Category' } } });
      await this.prisma.products.deleteMany({ where: { name: { contains: 'Test Product' } } });
      await this.prisma.services.deleteMany({ where: { name: { contains: 'Test Service' } } });
      await this.prisma.users.deleteMany({ where: { email: { contains: '@example.com' } } });

      this.logger.log('Test data cleanup completed');
    } catch (error) {
      this.logger.error('Error during test data cleanup', error);
      throw error;
    }
  }

  // Get test data counts
  async getTestDataCounts() {
    const [users, products, categories, orders, services] = await Promise.all([
      this.prisma.users.count({ where: { email: { contains: '@example.com' } } }),
      this.prisma.products.count({ where: { name: { contains: 'Test Product' } } }),
      this.prisma.categories.count({ where: { name: { contains: 'Test Category' } } }),
      this.prisma.orders.count(),
      this.prisma.services.count({ where: { name: { contains: 'Test Service' } } }),
    ]);

    return { users, products, categories, orders, services };
  }

  // Create comprehensive test dataset
  async createTestDataset(options: {
    users?: number;
    categories?: number;
    products?: number;
    services?: number;
    orders?: number;
  } = {}) {
    const { users = 3, categories = 2, products = 5, services = 3, orders = 2 } = options;

    this.logger.log(
      `Creating test dataset: ${users} users, ${categories} categories, ${products} products, ${services} services, ${orders} orders`
    );

    // Create categories first
    const categoryIds: string[] = [];
    for (let i = 0; i < categories; i++) {
      const category = await this.createTestCategory({
        name: `Test Category ${i + 1}`,
        slug: `test-category-${i + 1}`,
      });
      categoryIds.push(category.id);
    }

    // Create users
    const userIds: string[] = [];
    for (let i = 0; i < users; i++) {
      const user = await this.createTestUser({
        email: `testuser${i + 1}@example.com`,
        name: `Test User ${i + 1}`,
        phone: `012345678${i}`,
      });
      userIds.push(user.id);
    }

    // Create products
    const productIds: string[] = [];
    for (let i = 0; i < products; i++) {
      const product = await this.createTestProduct({
        name: `Test Product ${i + 1}`,
        price: (i + 1) * 50000,
      });
      productIds.push(product.id);
    }

    // Create services
    const serviceIds: string[] = [];
    for (let i = 0; i < services; i++) {
      const service = await this.createTestService({
        name: `Test Service ${i + 1}`,
        basePriceCents: (i + 1) * 30000,
        duration: 30 + i * 30,
      });
      serviceIds.push(service.id);
    }

    // Create orders
    for (let i = 0; i < orders; i++) {
      const userId = userIds[i % userIds.length];
      const orderProducts = productIds.slice(0, Math.min(3, productIds.length));
      await this.createTestOrder(userId, orderProducts, {
        subtotalCents: orderProducts.length * 100000,
        totalCents: orderProducts.length * 100000,
        status: i % 2 === 0 ? 'PENDING' : 'COMPLETED',
      });
    }

    this.logger.log('Test dataset creation completed');
    return { userIds, categoryIds, productIds, serviceIds };
  }

  // Database health check for tests
  async checkDatabaseHealth(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }

  // Reset database state
  async resetDatabase() {
    try {
      // Clean up all test data
      await this.cleanupTestData();

      this.logger.log('Database reset completed');
    } catch (error) {
      this.logger.error('Error during database reset', error);
      throw error;
    }
  }

  // Get database connection for direct queries in tests
  getPrismaClient(): PrismaClient {
    return this.prisma;
  }

  // Close database connection
  async closeConnection() {
    await this.prisma.$disconnect();
  }
}
