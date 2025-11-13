# Database Optimization & Caching System Guide

## Overview

This guide covers the comprehensive database optimization and caching system integrated into the AudioTaiLoc backend. The system provides:

- **Database Optimization**: Connection pooling, query optimization, and performance monitoring
- **Advanced Caching**: Multi-layer caching with Redis integration
- **Smart Invalidation**: Event-driven and dependency-based cache invalidation
- **Health Monitoring**: Real-time database health checks and metrics

---

## Table of Contents

1. [Database Optimization](#database-optimization)
2. [Cache Management](#cache-management)
3. [Cache Invalidation](#cache-invalidation)
4. [Health Monitoring](#health-monitoring)
5. [Usage Examples](#usage-examples)
6. [Performance Tuning](#performance-tuning)
7. [Troubleshooting](#troubleshooting)

---

## Database Optimization

### Prisma Accelerate Configuration

Optimizes database connections through pooling and caching at the Prisma layer.

#### Setup

```typescript
import { getPrismaClient, prismaAccelerateManager } from '@common/database';

// Get Prisma client (with Accelerate extension if configured)
const prisma = getPrismaClient();

// Or use the manager directly
await prismaAccelerateManager.connect();
```

#### Environment Variables

```bash
ENABLE_PRISMA_ACCELERATE=true
PRISMA_ACCELERATE_URL=https://accelerate.prisma.io/<API_KEY>
PRISMA_ACCELERATE_API_KEY=<your-api-key>
DATABASE_URL=postgresql://user:password@host:5432/dbname
DIRECT_DATABASE_URL=postgresql://user:password@host:5432/dbname
```

#### Connection Pooling

```typescript
const manager = prismaAccelerateManager;

// Get connection status
const status = await manager.getConnectionStatus();
// { connected: true, poolSize: 10, activeConnections: 5 }

// Optimize pool size based on workload
manager.configurePooling(20); // Increase for high-load scenarios
```

#### Transaction Management

```typescript
// Execute with automatic retry logic
const result = await manager.executeTransaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'user@example.com', password: 'hashed' }
  });

  const order = await tx.order.create({
    data: { userId: user.id, totalCents: 10000 }
  });

  return { user, order };
}, { maxRetries: 3 });
```

### Query Patterns

Provides optimized query patterns for common database operations.

#### Pagination

```typescript
import { QueryPatterns } from '@common/database';

const patterns = new QueryPatterns(prisma);

// Standard offset-based pagination
const result = await patterns.paginate(
  prisma.product,
  {
    page: 1,
    pageSize: 20,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, price: true }
  },
  { isActive: true, isDeleted: false }
);

// Returns:
// {
//   data: [...],
//   total: 500,
//   page: 1,
//   pageSize: 20,
//   totalPages: 25,
//   hasNextPage: true,
//   hasPreviousPage: false
// }
```

#### Cursor-Based Pagination

Better for large datasets:

```typescript
const result = await patterns.paginateWithCursor(
  prisma.product,
  {
    take: 20,
    cursor: 'last-product-id', // From previous request
    orderBy: { id: 'asc' },
    select: { id: true, name: true }
  },
  { isActive: true }
);

// Returns:
// {
//   data: [...],
//   nextCursor: 'next-product-id',
//   previousCursor: 'prev-product-id',
//   hasNextPage: true,
//   hasPreviousPage: true
// }
```

#### Bulk Operations

```typescript
// Bulk create with batching
const products = await patterns.bulkCreate(
  prisma.product,
  productsData,
  batchSize: 100 // Process 100 at a time
);

// Bulk update
const updates = productsData.map(p => ({
  where: { id: p.id },
  data: { stock: p.newStock }
}));
await patterns.bulkUpdate(prisma.product, updates, 50);

// Bulk delete (with soft delete support)
const deleted = await patterns.bulkDelete(
  prisma.product,
  whereConditions,
  softDelete: true, // Mark as isDeleted instead of removing
  batchSize: 100
);
```

#### Search Patterns

```typescript
// Efficient search with limit
const results = await patterns.search(
  prisma.product,
  'audio cable',
  ['name', 'description', 'tags'],
  { isActive: true },
  limit: 20,
  select: { id: true, name: true, slug: true }
);

// Get recent items
const recent = await patterns.getRecent(
  prisma.product,
  n: 10,
  where: { isActive: true },
  select: { id: true, name: true, createdAt: true }
);

// Get popular items
const popular = await patterns.getPopular(
  prisma.product,
  n: 10,
  field: 'viewCount', // Sort by view count
  where: { isActive: true }
);
```

#### Aggregations

```typescript
// Group by and aggregate
const stats = await patterns.aggregate(
  prisma.order,
  ['status', 'userId'],
  { createdAt: { gte: lastMonth } },
  { _sum: { totalCents: true }, _count: true }
);

// Returns: [
//   { status: 'PENDING', userId: 'user1', _count: 5, _sum: { totalCents: 50000 } },
//   { status: 'COMPLETED', userId: 'user1', _count: 10, _sum: { totalCents: 100000 } }
// ]
```

#### Query Optimization

```typescript
// Select only needed fields
const select = patterns.getOptimizedSelect([
  'id', 'name', 'slug', 'price'
]);

const product = await prisma.product.findUnique({
  where: { id: 'prod-123' },
  select
});

// Build efficient WHERE clause
const where = patterns.buildOptimizedWhere({
  isActive: true,
  featured: true,
  categoryId: ['cat1', 'cat2'], // Will use IN query
  name: '%search%' // Will use LIKE with insensitive match
});
```

---

## Cache Management

### Setup

```typescript
import { CacheModule, CacheManager } from '@common/cache';

// In app.module.ts
@Module({
  imports: [
    CacheModule.register({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: 0
      },
      defaultTtl: 3600000, // 1 hour
      enableCompression: true,
      enableWarming: true,
      warmingInterval: 300000 // 5 minutes
    })
  ]
})
export class AppModule {}
```

### Basic Cache Operations

```typescript
import { CacheManager } from '@common/cache';

constructor(private cacheManager: CacheManager) {}

async getProduct(id: string) {
  // Try cache first
  let product = await this.cacheManager.get<Product>(`product:${id}`);

  if (!product) {
    // Not in cache, fetch from DB
    product = await this.prisma.product.findUnique({
      where: { id }
    });

    // Store in cache for future requests
    await this.cacheManager.set(`product:${id}`, product, {
      ttl: 3600000, // 1 hour
      tags: ['products', `product:${id}`]
    });
  }

  return product;
}
```

### Cache-Aside Pattern (Recommended)

```typescript
// Automatically get from cache or compute
const product = await this.cacheManager.getOrCompute(
  `product:${id}`,
  async () => {
    return this.prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true, price: true }
    });
  },
  {
    ttl: 3600000,
    tags: ['products']
  }
);
```

### Batch Operations

```typescript
// Get multiple items efficiently
const ids = ['prod-1', 'prod-2', 'prod-3'];
const cached = await this.cacheManager.getBatch<Product>(
  ids.map(id => `product:${id}`)
);

// Set multiple items
await this.cacheManager.setBatch(
  [
    { key: 'product:1', value: product1, ttl: 3600000 },
    { key: 'product:2', value: product2, ttl: 3600000 },
    { key: 'product:3', value: product3, ttl: 3600000 }
  ],
  tags: ['products']
);
```

### Counters and Sets

```typescript
// Increment view count
await this.cacheManager.increment(`product:${id}:views`, 1);

// Get current count
const views = await this.cacheManager.get<number>(`product:${id}:views`);

// Add to set (for tracking unique visitors, etc.)
await this.cacheManager.addToSet(`product:${id}:visitors`, [userId]);

// Get set members
const visitors = await this.cacheManager.getSet(`product:${id}:visitors`);
```

### Cache Presets

```typescript
import { CACHE_PRESETS } from '@common/cache';

// Aggressive caching (5 min TTL, compression enabled)
cacheManager.initialize(CACHE_PRESETS.AGGRESSIVE);

// Light caching (memory only, 30 min TTL)
cacheManager.initialize(CACHE_PRESETS.LIGHT);

// Distributed caching (Redis only, 2 hour TTL)
cacheManager.initialize(CACHE_PRESETS.DISTRIBUTED);

// Memory only (no Redis, 1 hour TTL)
cacheManager.initialize(CACHE_PRESETS.MEMORY_ONLY);
```

### Cache Key Builders

```typescript
import { CacheKeyBuilder } from '@common/cache';

// Use predefined key patterns
const productKey = CacheKeyBuilder.product('prod-123');
// Result: 'product:prod-123'

const cartKey = CacheKeyBuilder.cart(userId);
// Result: 'cart:user-123'

const searchKey = CacheKeyBuilder.search('audio cables', 1);
// Result: 'search:audio cables:1'

// Use in cache operations
const product = await this.cacheManager.get(productKey);
await this.cacheManager.set(productKey, productData);
```

### Cache Metrics

```typescript
// Get cache performance metrics
const metrics = this.cacheManager.getMetrics();

console.log(`Cache Hit Rate: ${metrics.hitRate.toFixed(2)}%`);
console.log(`Total Hits: ${metrics.hits}`);
console.log(`Total Misses: ${metrics.misses}`);
console.log(`Average Size: ${metrics.averageSize} bytes`);

// Get local cache stats
const localStats = this.cacheManager.getLocalCacheStats();
console.log(`Local Cache Size: ${localStats.totalSize} bytes`);
console.log(`Local Cache Entries: ${localStats.entries}`);
```

---

## Cache Invalidation

### Event-Driven Invalidation

```typescript
import { CacheInvalidation } from '@common/cache';

constructor(
  private cacheInvalidation: CacheInvalidation,
  private eventEmitter: EventEmitter2
) {}

async updateProduct(id: string, data: UpdateProductDto) {
  const product = await this.prisma.product.update({
    where: { id },
    data
  });

  // Automatically invalidates caches tagged with 'product:updated'
  // via registered invalidation rules
  this.eventEmitter.emit('product.updated', { id });

  return product;
}
```

### Tag-Based Invalidation

```typescript
// Clear all caches with a specific tag
await this.cacheInvalidation.invalidateByTag('products');

// Or by pattern
await this.cacheInvalidation.invalidateByPattern(/^cache:product:.*/);

// Or glob pattern
await this.cacheInvalidation.invalidateByPattern('cache:product:*');
```

### Dependency-Based Invalidation

```typescript
// Register dependencies
this.cacheInvalidation.registerDependency(
  'product:123', // Parent key
  'cart:user-456:items' // Dependent key
);

// When product changes, dependent caches are automatically invalidated
await this.cacheInvalidation.invalidateByDependency('product:123');
```

### Cache Warming

```typescript
// Setup automatic cache warming
this.cacheInvalidation.setupCacheWarming({
  enabled: true,
  interval: 300000, // 5 minutes
  items: [
    {
      key: 'featured-products',
      compute: () => this.prisma.product.findMany({
        where: { featured: true },
        take: 10
      }),
      ttl: 3600000
    },
    {
      key: 'categories',
      compute: () => this.prisma.category.findMany({
        where: { isActive: true }
      }),
      ttl: 7200000 // 2 hours
    }
  ]
});

// Or manually warm specific caches
await this.cacheInvalidation.warmCacheEntry(
  'featured-products',
  () => this.getFeaturedProducts(),
  3600000
);
```

### Invalidation Rules

```typescript
// Register custom invalidation rule
this.cacheInvalidation.registerRule({
  id: 'product_update_rule',
  pattern: /^cache:product:.*/,
  triggers: ['product.updated', 'product.deleted'],
  dependencies: ['cache:product:list'],
  enabled: true
});

// Get registered rules
const rules = this.cacheInvalidation.getRules();

// View dependency graph
const dependencies = this.cacheInvalidation.getDependencyGraph();
```

---

## Health Monitoring

### Database Health Checks

```typescript
import { DatabaseHealthCheck } from '@common/database';

constructor(
  private healthCheck: DatabaseHealthCheck,
  private prisma: PrismaClient
) {}

// Perform immediate health check
const health = await this.healthCheck.check();

// Check result structure:
// {
//   status: 'healthy' | 'degraded' | 'unhealthy',
//   connected: boolean,
//   responseTime: number,
//   details: {
//     connectionPool: { ... },
//     slowQueries: [ ... ],
//     errors: { ... },
//     performance: { ... },
//     database: { ... }
//   },
//   timestamp: Date
// }
```

### Continuous Monitoring

```typescript
// Start continuous health checks
this.healthCheck.startContinuousCheck(60000); // Every 60 seconds

// Get last health check result
const lastCheck = this.healthCheck.getLastHealthCheck();

// Generate health report
const report = this.healthCheck.generateReport();
console.log(report);

// Stop monitoring
this.healthCheck.stopContinuousCheck();
```

### Query Metrics

```typescript
// Record query metrics
this.healthCheck.recordQueryMetric(150); // Query took 150ms

// Record errors
try {
  // Database operation
} catch (error) {
  this.healthCheck.recordError(error);
}

// Get performance metrics
const metrics = await this.healthCheck.check();
console.log(`Average Query Time: ${metrics.details.performance.averageQueryTime}ms`);
console.log(`P95 Query Time: ${metrics.details.performance.p95QueryTime}ms`);
console.log(`P99 Query Time: ${metrics.details.performance.p99QueryTime}ms`);
```

### Health Check Endpoint

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor(private healthCheck: DatabaseHealthCheck) {}

  @Get('db')
  async checkDatabase() {
    const health = await this.healthCheck.check();
    return {
      status: health.status,
      connected: health.connected,
      responseTime: health.responseTime,
      timestamp: health.timestamp
    };
  }

  @Get('db/detailed')
  async getDetailedHealth() {
    const health = await this.healthCheck.check();
    return health;
  }

  @Get('db/report')
  getHealthReport() {
    return this.healthCheck.generateReport();
  }
}
```

---

## Usage Examples

### Example 1: Product Service with Caching

```typescript
import { Injectable } from '@nestjs/common';
import { CacheManager, CacheKeyBuilder } from '@common/cache';
import { QueryPatterns } from '@common/database';

@Injectable()
export class ProductService {
  private queryPatterns: QueryPatterns;

  constructor(
    private prisma: PrismaClient,
    private cacheManager: CacheManager
  ) {
    this.queryPatterns = new QueryPatterns(prisma);
  }

  async getProduct(id: string): Promise<Product> {
    const key = CacheKeyBuilder.product(id);

    return this.cacheManager.getOrCompute(
      key,
      () => this.prisma.product.findUnique({
        where: { id },
        include: {
          reviews: { take: 5, orderBy: { createdAt: 'desc' } }
        }
      }),
      { ttl: 3600000, tags: ['products'] }
    );
  }

  async listProducts(page: number = 1, pageSize: number = 20) {
    const cacheKey = CacheKeyBuilder.productList(`page:${page}:size:${pageSize}`);

    return this.cacheManager.getOrCompute(
      cacheKey,
      () => this.queryPatterns.paginate(
        this.prisma.product,
        {
          page,
          pageSize,
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true
          }
        },
        { isActive: true, isDeleted: false }
      ),
      { ttl: 1800000, tags: ['products', 'product-list'] }
    );
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data
    });

    // Invalidate related caches
    await this.cacheManager.delete(CacheKeyBuilder.product(id));
    await this.cacheManager.invalidateByTag('products');

    return product;
  }

  async bulkUpdateStock(updates: Array<{ id: string; stock: number }>) {
    const updateData = updates.map(u => ({
      where: { id: u.id },
      data: { stockQuantity: u.stock }
    }));

    await this.queryPatterns.bulkUpdate(this.prisma.product, updateData);

    // Invalidate all product caches
    await this.cacheManager.invalidateByTag('products');
  }

  async searchProducts(query: string) {
    const cacheKey = CacheKeyBuilder.search(query, 1);

    return this.cacheManager.getOrCompute(
      cacheKey,
      () => this.queryPatterns.search(
        this.prisma.product,
        query,
        ['name', 'description', 'tags'],
        { isActive: true },
        limit: 20
      ),
      { ttl: 600000, tags: ['search'] } // 10 minutes
    );
  }
}
```

### Example 2: Transactional Order Creation

```typescript
import { TransactionManager } from '@common/database';

@Injectable()
export class OrderService {
  private transactionManager: TransactionManager;

  constructor(private prisma: PrismaClient) {
    this.transactionManager = new TransactionManager(prisma);
  }

  async createOrder(userId: string, cartId: string) {
    const result = await this.transactionManager.execute(
      async (tx) => {
        // Get cart with items
        const cart = await tx.cart.findUnique({
          where: { id: cartId },
          include: { items: true }
        });

        if (!cart) throw new Error('Cart not found');

        // Calculate totals
        const total = cart.items.reduce((sum, item) => sum + item.price, 0);

        // Create order
        const order = await tx.order.create({
          data: {
            userId,
            totalCents: total,
            items: {
              create: cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
              }))
            }
          }
        });

        // Update inventory
        for (const item of cart.items) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              stock: { decrement: item.quantity },
              reserved: { decrement: item.quantity }
            }
          });
        }

        // Clear cart
        await tx.cartItem.deleteMany({
          where: { cartId }
        });

        return order;
      },
      {
        maxRetries: 3,
        timeout: 30000,
        isolationLevel: 'ReadCommitted',
        name: 'createOrder'
      }
    );

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }
}
```

---

## Performance Tuning

### Database Optimization Tips

1. **Connection Pooling**: Adjust pool size based on expected concurrent connections
   ```typescript
   manager.configurePooling(20); // For high-traffic scenarios
   ```

2. **Query Selection**: Use `select` to fetch only needed fields
   ```typescript
   await prisma.product.findMany({
     select: { id: true, name: true, price: true }
   });
   ```

3. **Batch Operations**: Use bulk operations for multiple items
   ```typescript
   await patterns.bulkCreate(prisma.product, items, batchSize: 100);
   ```

4. **Pagination**: Use cursor-based pagination for large datasets
   ```typescript
   await patterns.paginateWithCursor(model, options);
   ```

### Cache Optimization Tips

1. **TTL Strategy**: Set appropriate TTLs based on data freshness needs
   - User data: 1 hour
   - Product catalogs: 2-4 hours
   - Categories: 4-8 hours
   - Search results: 10 minutes
   - Real-time data: 5 minutes or less

2. **Key Naming**: Use consistent, hierarchical key patterns
   ```typescript
   `${entity}:${id}` // product:123
   `${entity}:${operation}:${params}` // product:search:audio
   ```

3. **Multi-Layer Caching**: Enable both local and Redis caching
   - Local cache: Fast access to frequently used items
   - Redis cache: Shared across instances, larger capacity

4. **Batch Operations**: Reduce individual operations
   ```typescript
   await cacheManager.setBatch([...], tags);
   ```

### Monitor and Alert

```typescript
// Setup health monitoring with alerts
const healthCheck = new DatabaseHealthCheck(prisma);

healthCheck.startContinuousCheck(60000);

setInterval(() => {
  const status = healthCheck.getLastHealthCheck();

  if (status?.status === 'unhealthy') {
    // Send alert
    console.error('Database health degraded!');
    // Could send to monitoring service (Sentry, DataDog, etc.)
  }
}, 60000);
```

---

## Troubleshooting

### Common Issues

#### 1. Cache Miss Rate Too High

**Problem**: Cache hit rate below 70%

**Solutions**:
- Increase TTL values
- Ensure cache keys are consistent
- Use cache warming for frequently accessed data
- Check if cache invalidation rules are too aggressive

```typescript
// Monitor hit rate
const metrics = cacheManager.getMetrics();
console.log(`Hit Rate: ${metrics.hitRate}%`);

// Adjust TTLs
cacheManager.initialize({ ttl: 7200000 }); // Increase to 2 hours
```

#### 2. Redis Connection Issues

**Problem**: Redis connection failures

**Solutions**:
- Check Redis server is running
- Verify credentials and connection parameters
- Enable fallback to memory-only caching

```typescript
// Check Redis connection
const redis = /* Redis client */;
redis.on('error', (err) => {
  console.error('Redis error:', err);
  // Fall back to memory-only caching
});
```

#### 3. Slow Database Queries

**Problem**: Queries taking > 1 second

**Solutions**:
- Use query patterns and selection optimization
- Add database indexes
- Use explain to analyze queries
- Enable query caching

```typescript
const health = await healthCheck.check();
const slowQueries = health.details.slowQueries;

for (const query of slowQueries) {
  console.warn(`Slow query: ${query.duration}ms`);
  // Add caching or index
}
```

#### 4. Connection Pool Exhaustion

**Problem**: "Too many connections" errors

**Solutions**:
- Increase pool size
- Optimize query duration
- Add connection timeouts
- Use connection pooling

```typescript
// Increase pool
manager.configurePooling(30);

// Monitor connections
const status = await manager.getConnectionStatus();
console.log(`Active connections: ${status.activeConnections}`);
```

### Debug Mode

```typescript
// Enable debug logging
process.env.NODE_ENV = 'development';

// Get detailed metrics
const health = await healthCheck.check();
console.log(JSON.stringify(health.details, null, 2));

// Get cache stats
const metrics = cacheManager.getMetrics();
console.log(metrics);

// Get transaction stats
const txStats = transactionManager.getStats();
console.log(txStats);
```

---

## Best Practices

1. **Always use tags** for cache entries to enable efficient invalidation
2. **Set appropriate TTLs** based on data freshness requirements
3. **Use cache-aside pattern** for automatic cache management
4. **Monitor cache hit rates** and adjust TTLs accordingly
5. **Implement cache warming** for critical data
6. **Use bulk operations** for better database performance
7. **Implement health checks** for proactive monitoring
8. **Test transaction retry logic** under failure conditions
9. **Use pagination** for large result sets
10. **Log and monitor slow queries** for optimization

---

## Additional Resources

- Prisma Documentation: https://www.prisma.io/docs/
- Redis Documentation: https://redis.io/documentation
- NestJS Caching: https://docs.nestjs.com/techniques/caching
- Database Performance: https://www.postgresql.org/docs/current/performance.html
