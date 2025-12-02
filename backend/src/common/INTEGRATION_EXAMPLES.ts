/**
 * Integration Examples
 * Real-world examples of using the database optimization and caching systems together
 */

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  QueryPatterns,
  TransactionManager,
  DatabaseHealthCheck,
  getPrismaClient,
} from '@common/database';

import {
  CacheManager,
  CacheInvalidation,
  CacheKeyBuilder,
  CACHE_PRESETS,
} from '@common/cache';

/**
 * Example 1: Product Service with Full Optimization
 * Demonstrates caching, invalidation, and query optimization
 */
@Injectable()
export class OptimizedProductService {
  private queryPatterns: QueryPatterns;
  private transactionManager: TransactionManager;

  constructor(
    private prisma: PrismaClient,
    private cacheManager: CacheManager,
    private cacheInvalidation: CacheInvalidation,
    private eventEmitter: EventEmitter2,
    private healthCheck: DatabaseHealthCheck
  ) {
    this.queryPatterns = new QueryPatterns(prisma);
    this.transactionManager = new TransactionManager(prisma);

    // Register cache invalidation rules
    this.registerInvalidationRules();

    // Setup cache warming
    this.setupCacheWarming();
  }

  /**
   * Get single product with caching
   */
  async getProduct(id: string) {
    return this.cacheManager.getOrCompute(
      CacheKeyBuilder.product(id),
      () =>
        this.prisma.products.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            imageUrl: true,
            description: true,
            reviews: { take: 5, orderBy: { createdAt: 'desc' } },
          },
        }),
      { ttl: 3600000, tags: ['products'] }
    );
  }

  /**
   * List products with pagination and caching
   */
  async listProducts(page: number = 1, filters: any = {}) {
    const cacheKey = CacheKeyBuilder.productList(`page:${page}:${JSON.stringify(filters)}`);

    return this.cacheManager.getOrCompute(
      cacheKey,
      () =>
        this.queryPatterns.paginate(
          this.prisma.product,
          {
            page,
            pageSize: 20,
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              imageUrl: true,
            },
          },
          this.buildWhereClause(filters)
        ),
      { ttl: 1800000, tags: ['products', 'product-list'] }
    );
  }

  /**
   * Search products with caching
   */
  async searchProducts(query: string, page: number = 1) {
    const cacheKey = CacheKeyBuilder.search(query, page);

    return this.cacheManager.getOrCompute(
      cacheKey,
      () =>
        this.queryPatterns.search(
          this.prisma.product,
          query,
          ['name', 'description', 'tags'],
          { isActive: true },
          limit: 20
        ),
      { ttl: 600000, tags: ['search'] }
    );
  }

  /**
   * Get featured products (frequently accessed)
   */
  async getFeaturedProducts() {
    const cacheKey = 'featured-products';

    return this.cacheManager.getOrCompute(
      cacheKey,
      () =>
        this.queryPatterns.getPopular(
          this.prisma.product,
          10,
          'viewCount',
          { featured: true, isActive: true }
        ),
      { ttl: 3600000, tags: ['products', 'featured'] }
    );
  }

  /**
   * Update product with transaction and cache invalidation
   */
  async updateProduct(id: string, data: any) {
    const result = await this.transactionManager.execute(
      async (tx) => {
        // Update product
        const product = await tx.products.update({
          where: { id },
          data,
        });

        // Update related data if needed
        if (data.categoryId) {
          // Update category product count, etc.
        }

        return product;
      },
      { maxRetries: 3, name: 'updateProduct' }
    );

    if (result.success) {
      // Invalidate all related caches
      await this.cacheManager.delete(CacheKeyBuilder.product(id));
      await this.cacheInvalidation.invalidateByTag('products');

      // Emit event for other services
      this.eventEmitter.emit('product.updated', { id, data: result.data });
    } else {
      throw result.error;
    }

    return result.data;
  }

  /**
   * Bulk update products efficiently
   */
  async bulkUpdateProducts(updates: Array<{ id: string; data: any }>) {
    const updateData = updates.map((u) => ({
      where: { id: u.id },
      data: u.data,
    }));

    // Execute in transaction
    await this.transactionManager.execute(async (tx) => {
      await this.queryPatterns.bulkUpdate(
        tx.product,
        updateData,
        batchSize: 100
      );
    });

    // Invalidate all product caches
    await this.cacheInvalidation.invalidateByTag('products');
    this.eventEmitter.emit('product.bulk-updated', { count: updates.length });
  }

  /**
   * Create product with transaction
   */
  async createProduct(data: any) {
    const result = await this.transactionManager.execute(async (tx) => {
      return tx.products.create({
        data: {
          ...data,
          slug: this.generateSlug(data.name),
        },
      });
    });

    if (result.success) {
      // Invalidate list caches
      await this.cacheInvalidation.invalidateByTag('product-list');
      this.eventEmitter.emit('product.created', { id: result.data.id });
    }

    return result.data;
  }

  /**
   * Get product analytics with caching
   */
  async getProductAnalytics(id: string) {
    return this.cacheManager.getOrCompute(
      `analytics:product:${id}`,
      async () => {
        const product = await this.prisma.products.findUnique({
          where: { id },
          select: { viewCount: true, id: true },
        });

        const reviews = await this.prisma.product_reviews.groupBy({
          by: ['rating'],
          where: { productId: id },
          _count: true,
        });

        const sales = await this.prisma.order_items.aggregate({
          where: { productId: id },
          _sum: { quantity: true },
        });

        return {
          views: product?.viewCount,
          reviews,
          sales: sales._sum.quantity,
        };
      },
      { ttl: 1800000, tags: ['analytics'] }
    );
  }

  // Helper methods

  private buildWhereClause(filters: any) {
    return this.queryPatterns.buildOptimizedWhere({
      isActive: filters.isActive !== false,
      isDeleted: false,
      categoryId: filters.categoryId,
      featured: filters.featured,
    });
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  private registerInvalidationRules() {
    this.cacheInvalidation.registerRule({
      id: 'product_update_rule',
      pattern: /^cache:product:.*/,
      triggers: ['product.updated', 'product.deleted'],
      enabled: true,
    });
  }

  private setupCacheWarming() {
    this.cacheInvalidation.setupCacheWarming({
      enabled: true,
      interval: 300000,
      items: [
        {
          key: 'featured-products',
          compute: () => this.getFeaturedProducts(),
          ttl: 3600000,
        },
      ],
    });
  }
}

/**
 * Example 2: Order Service with Transactional Operations
 * Demonstrates transaction management with retry logic
 */
@Injectable()
export class OptimizedOrderService {
  private transactionManager: TransactionManager;

  constructor(
    private prisma: PrismaClient,
    private cacheManager: CacheManager,
    private cacheInvalidation: CacheInvalidation
  ) {
    this.transactionManager = new TransactionManager(prisma);
  }

  /**
   * Create order with inventory management (transactional)
   */
  async createOrder(userId: string, items: Array<{ productId: string; quantity: number }>) {
    const result = await this.transactionManager.execute(
      async (tx) => {
        // Create order
        const order = await tx.orders.create({
          data: {
            userId,
            totalCents: 0, // Will be calculated
            status: 'PENDING',
          },
        });

        let total = 0;

        // Add items and update inventory
        for (const item of items) {
          const product = await tx.products.findUnique({
            where: { id: item.productId },
            select: { id: true, price: true, stockQuantity: true },
          });

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          if (product.stockQuantity < item.quantity) {
            throw new Error(`Insufficient stock for product ${item.productId}`);
          }

          // Add order item
          await tx.order_items.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            },
          });

          // Update inventory
          await tx.inventory.update({
            where: { productId: item.productId },
            data: { stock: { decrement: item.quantity } },
          });

          total += Number(product.price) * item.quantity;
        }

        // Update order total
        return tx.orders.update({
          where: { id: order.id },
          data: { totalCents: total },
        });
      },
      { maxRetries: 5, timeout: 30000, name: 'createOrder' }
    );

    if (result.success) {
      // Invalidate user's cart and orders
      await this.cacheManager.delete(CacheKeyBuilder.cart(userId));
      await this.cacheInvalidation.invalidateByTag(`user:${userId}:orders`);

      return result.data;
    } else {
      throw result.error;
    }
  }

  /**
   * Get user orders with caching
   */
  async getUserOrders(userId: string) {
    return this.cacheManager.getOrCompute(
      `orders:${userId}`,
      () =>
        this.prisma.orders.findMany({
          where: { userId },
          include: { items: true },
          orderBy: { createdAt: 'desc' },
          take: 50,
        }),
      { ttl: 1800000, tags: [`user:${userId}:orders`] }
    );
  }
}

/**
 * Example 3: Admin Dashboard Service with Health Monitoring
 * Demonstrates health checks and metrics
 */
@Injectable()
export class AdminDashboardService {
  constructor(
    private prisma: PrismaClient,
    private cacheManager: CacheManager,
    private healthCheck: DatabaseHealthCheck
  ) {}

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics() {
    return this.cacheManager.getOrCompute(
      'admin:dashboard:metrics',
      async () => {
        const [totalProducts, totalOrders, totalUsers, totalRevenue] = await Promise.all([
          this.prisma.products.count(),
          this.prisma.orders.count(),
          this.prisma.users.count(),
          this.prisma.orders.aggregate({
            _sum: { totalCents: true },
          }),
        ]);

        return {
          totalProducts,
          totalOrders,
          totalUsers,
          totalRevenue: totalRevenue._sum.totalCents || 0,
          timestamp: new Date(),
        };
      },
      { ttl: 300000, tags: ['admin'] }
    );
  }

  /**
   * Get database health status
   */
  async getHealthStatus() {
    const health = await this.healthCheck.check();
    const cacheMetrics = this.cacheManager.getMetrics();

    return {
      database: {
        status: health.status,
        responseTime: health.responseTime,
        connected: health.connected,
        details: health.details,
      },
      cache: cacheMetrics,
      timestamp: new Date(),
    };
  }

  /**
   * Get performance report
   */
  async getPerformanceReport() {
    const health = await this.healthCheck.check();
    const cacheMetrics = this.cacheManager.getMetrics();

    return {
      database: {
        averageQueryTime: health.details.performance.averageQueryTime,
        p95QueryTime: health.details.performance.p95QueryTime,
        p99QueryTime: health.details.performance.p99QueryTime,
        slowQueries: health.details.slowQueries.length,
      },
      cache: {
        hitRate: cacheMetrics.hitRate,
        totalHits: cacheMetrics.hits,
        totalMisses: cacheMetrics.misses,
      },
      summary: {
        status: this.getOverallStatus(health, cacheMetrics),
      },
    };
  }

  private getOverallStatus(health: any, cacheMetrics: any): string {
    if (health.status !== 'healthy' || cacheMetrics.hitRate < 70) {
      return 'DEGRADED';
    }
    return 'HEALTHY';
  }
}

/**
 * Example 4: Service Booking with Multi-Entity Transactions
 * Demonstrates complex transactional scenarios
 */
@Injectable()
export class OptimizedServiceBookingService {
  private transactionManager: TransactionManager;

  constructor(
    private prisma: PrismaClient,
    private cacheManager: CacheManager
  ) {
    this.transactionManager = new TransactionManager(prisma);
  }

  /**
   * Create booking with technician assignment
   */
  async createBooking(userId: string, serviceId: string, scheduledAt: Date) {
    const result = await this.transactionManager.execute(
      async (tx) => {
        // Get service details
        const service = await tx.services.findUnique({
          where: { id: serviceId },
          select: { id: true, price: true },
        });

        if (!service) {
          throw new Error('Service not found');
        }

        // Create booking
        const booking = await tx.service_bookings.create({
          data: {
            userId,
            serviceId,
            scheduledAt,
            status: 'PENDING',
            estimatedCosts: service.price,
          },
        });

        // Find available technician
        const technician = await tx.technicians.findFirst({
          where: { isActive: true },
        });

        if (technician) {
          // Update booking with technician
          return tx.service_bookings.update({
            where: { id: booking.id },
            data: { technicianId: technician.id },
          });
        }

        return booking;
      },
      { maxRetries: 3, name: 'createServiceBooking' }
    );

    if (result.success) {
      // Clear cache for user bookings
      await this.cacheManager.delete(`service:bookings:${userId}`);
      return result.data;
    }

    throw result.error;
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(userId: string) {
    return this.cacheManager.getOrCompute(
      `service:bookings:${userId}`,
      () =>
        this.prisma.service_bookings.findMany({
          where: { userId },
          include: { service: true, technician: true },
          orderBy: { scheduledAt: 'desc' },
        }),
      { ttl: 1800000, tags: [`user:${userId}:bookings`] }
    );
  }
}

/**
 * Usage in Controller Example
 */
export class ExampleController {
  constructor(
    private productService: OptimizedProductService,
    private orderService: OptimizedOrderService,
    private adminService: AdminDashboardService
  ) {}

  // GET /products/:id
  async getProduct(id: string) {
    return this.productService.getProduct(id);
  }

  // GET /products?page=1
  async listProducts(page: number) {
    return this.productService.listProducts(page);
  }

  // POST /orders
  async createOrder(userId: string, items: any[]) {
    return this.orderService.createOrder(userId, items);
  }

  // GET /admin/dashboard
  async getDashboard() {
    return this.adminService.getDashboardMetrics();
  }

  // GET /admin/health
  async getHealth() {
    return this.adminService.getHealthStatus();
  }
}

/**
 * Configuration Example for Module Setup
 */
export const DatabaseCacheModuleSetup = `
import { Module } from '@nestjs/common';
import { CacheModule } from '@common/cache';
import { DatabaseHealthCheck, TransactionManager } from '@common/database';
import { PrismaService } from '@prisma/prisma.service';

@Module({
  imports: [
    CacheModule.register({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      defaultTtl: 3600000,
      enableCompression: true,
      enableWarming: true,
    }),
  ],
  providers: [
    PrismaService,
    TransactionManager,
    DatabaseHealthCheck,
    OptimizedProductService,
    OptimizedOrderService,
    AdminDashboardService,
  ],
  exports: [
    PrismaService,
    TransactionManager,
    DatabaseHealthCheck,
  ],
})
export class DatabaseCacheModule {}
`;

export default OptimizedProductService;
