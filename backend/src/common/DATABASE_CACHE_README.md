# Database & Cache Optimization System

This directory contains a comprehensive database optimization and caching system for the AudioTaiLoc backend, providing production-ready solutions for performance, scalability, and reliability.

## Directory Structure

```
src/common/
├── database/                          # Database optimization system
│   ├── prisma-accelerate.config.ts   # Prisma connection pooling
│   ├── query-patterns.ts              # Optimized query patterns
│   ├── transaction-manager.ts         # Transaction with retry logic
│   ├── database-healthcheck.ts        # Health monitoring
│   └── index.ts                       # Exports
│
├── cache/                             # Caching system
│   ├── cache-manager.ts               # Unified cache interface
│   ├── cache-invalidation.ts          # Smart invalidation strategies
│   ├── cache.module.ts                # NestJS module
│   └── index.ts                       # Exports
│
├── DATABASE_AND_CACHE_GUIDE.md        # Comprehensive usage guide
├── CONFIGURATION_TEMPLATE.md          # Configuration examples
└── DATABASE_CACHE_README.md          # This file
```

## Quick Start

### 1. Database Optimization

#### Initialize Prisma Accelerate

```typescript
import { getPrismaClient } from '@common/database';

// In your service
const prisma = getPrismaClient();

const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

#### Use Query Patterns

```typescript
import { QueryPatterns } from '@common/database';

const patterns = new QueryPatterns(prisma);

// Optimized pagination
const products = await patterns.paginate(
  prisma.product,
  { page: 1, pageSize: 20 },
  { isActive: true }
);
```

#### Transactional Operations

```typescript
import { TransactionManager } from '@common/database';

const txManager = new TransactionManager(prisma);

const result = await txManager.execute(async (tx) => {
  // Atomic operations here
});
```

#### Database Health Checks

```typescript
import { DatabaseHealthCheck } from '@common/database';

const healthCheck = new DatabaseHealthCheck(prisma);

// Check database health
const health = await healthCheck.check();

// Start continuous monitoring
healthCheck.startContinuousCheck(60000);
```

### 2. Cache Management

#### Setup Cache Module

```typescript
import { CacheModule } from '@common/cache';

@Module({
  imports: [
    CacheModule.register({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
      },
      defaultTtl: 3600000
    })
  ]
})
export class AppModule {}
```

#### Use Cache Manager

```typescript
import { CacheManager, CacheKeyBuilder } from '@common/cache';

constructor(private cacheManager: CacheManager) {}

async getProduct(id: string) {
  const key = CacheKeyBuilder.product(id);

  return this.cacheManager.getOrCompute(
    key,
    () => this.prisma.product.findUnique({ where: { id } }),
    { ttl: 3600000, tags: ['products'] }
  );
}
```

#### Setup Cache Invalidation

```typescript
import { CacheInvalidation } from '@common/cache';

constructor(private cacheInvalidation: CacheInvalidation) {
  // Register invalidation rules
  this.cacheInvalidation.registerRule({
    id: 'product_update',
    pattern: /^cache:product:.*/,
    triggers: ['product.updated'],
    enabled: true
  });
}

// Invalidate when data changes
async updateProduct(id: string, data: UpdateProductDto) {
  await this.prisma.product.update({ where: { id }, data });
  await this.cacheInvalidation.invalidateByTag('products');
}
```

## Key Features

### Database Optimization

- **Connection Pooling**: Efficient connection management via Prisma Accelerate
- **Query Optimization**: Helper methods for efficient queries
- **Pagination**: Both offset and cursor-based pagination
- **Bulk Operations**: Efficient batch create/update/delete
- **Transactions**: Automatic retry logic with exponential backoff
- **Health Monitoring**: Real-time database metrics and alerts

### Caching

- **Multi-Layer**: In-memory + Redis for distributed caching
- **Automatic Serialization**: Transparent object handling
- **Smart Invalidation**: Tag-based, pattern-based, dependency-based
- **Cache Warming**: Pre-populate critical data
- **Metrics**: Hit rate, performance tracking
- **Graceful Degradation**: Fallback if Redis unavailable

### Performance

- **Fast Access**: In-memory cache for frequently accessed data
- **Distributed**: Redis for cache sharing across instances
- **Selective Invalidation**: Only invalidate affected caches
- **Compression**: Optional compression for large objects
- **Batch Operations**: Reduce individual round-trips

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴───────────┐
        │                      │
        ▼                      ▼
   ┌─────────────┐      ┌──────────────┐
   │ CacheManager│◄────►│ EventEmitter │
   └────┬────────┘      └──────────────┘
        │
   ┌────┴─────────────────────────┬─────────────┐
   │                              │             │
   ▼                              ▼             ▼
┌──────────────┐           ┌──────────┐   ┌────────┐
│ Local Cache  │           │  Redis   │   │ NestJS │
│  (In-Memory) │           │  Cache   │   │ Cache  │
└──────────────┘           └──────────┘   └────────┘
   │
   └──────────────────────────┐
                              │
                    ┌─────────▼──────┐
                    │  Invalidation  │
                    │   Strategies   │
                    └────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
         ┌────────┐     ┌─────────┐   ┌──────────┐
         │ Tag    │     │ Pattern  │   │Dependency│
         │ Based  │     │  Based   │   │ Based    │
         └────────┘     └─────────┘   └──────────┘


┌─────────────────────────────────────────────────────────────┐
│              Transaction Manager Layer                      │
└──────────┬─────────────────────────────────────┬────────────┘
           │                                     │
           ▼                                     ▼
      ┌──────────────┐               ┌──────────────────┐
      │   Prisma     │               │  Health Check    │
      │   Database   │               │  & Monitoring    │
      └──────────────┘               └──────────────────┘
           │                                 │
           └─────────┬───────────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   PostgreSQL    │
            │   (Production)  │
            └─────────────────┘
```

## Performance Metrics

### Expected Performance

- **Cache Hit Rate**: 80-95% (depending on TTL settings)
- **Average Query Time**: 5-50ms (with caching)
- **Cache Lookup Time**: <1ms (in-memory)
- **Database Connection Pool**: 10-50 concurrent connections
- **Invalidation Time**: <100ms for tag-based invalidation

### Benchmark Results (Example)

```
Without Optimization:
- Average Response Time: 250ms
- Database Hits: 100%
- Concurrent Connections: 50+

With Database Optimization:
- Average Response Time: 80ms (68% improvement)
- Database Hits: 20%
- Concurrent Connections: 10-15

With Full Optimization:
- Average Response Time: 15ms (94% improvement)
- Cache Hit Rate: 85%
- Database Hits: 5%
- Concurrent Connections: 5-8
```

## Configuration Options

### Cache Presets

```typescript
// Aggressive caching (5 min TTL)
CACHE_PRESETS.AGGRESSIVE

// Moderate caching (1 hour TTL)
CACHE_PRESETS.MODERATE

// Light caching (30 min TTL, memory only)
CACHE_PRESETS.LIGHT

// Distributed caching (2 hour TTL, Redis only)
CACHE_PRESETS.DISTRIBUTED

// Memory only (1 hour TTL)
CACHE_PRESETS.MEMORY_ONLY
```

### Environment Variables

```bash
# Core Database
DATABASE_URL=postgresql://...
DIRECT_DATABASE_URL=postgresql://...

# Prisma Accelerate
ENABLE_PRISMA_ACCELERATE=true
PRISMA_ACCELERATE_URL=https://accelerate.prisma.io/...
PRISMA_ACCELERATE_API_KEY=...

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Cache
CACHE_TTL=3600
ENABLE_LOCAL_CACHE=true
ENABLE_REDIS_CACHE=true
CACHE_COMPRESSION=false

# Health Check
ENABLE_DB_HEALTH_CHECK=true
DB_HEALTH_CHECK_INTERVAL=60000
SLOW_QUERY_THRESHOLD=1000
```

## Common Use Cases

### 1. Product Catalog

```typescript
// Cache frequently accessed products
const product = await cacheManager.getOrCompute(
  CacheKeyBuilder.product(id),
  () => this.getProductFromDB(id),
  { ttl: 3600000, tags: ['products'] }
);

// Invalidate when product changes
await cacheInvalidation.invalidateByTag('products');
```

### 2. User Sessions

```typescript
// Cache user data with shorter TTL
const user = await cacheManager.getOrCompute(
  CacheKeyBuilder.user(userId),
  () => this.getUserFromDB(userId),
  { ttl: 1800000 } // 30 minutes
);
```

### 3. Search Results

```typescript
// Cache search results with short TTL
const results = await cacheManager.getOrCompute(
  CacheKeyBuilder.search(query, page),
  () => this.search(query, page),
  { ttl: 600000 } // 10 minutes
);
```

### 4. Configuration/Settings

```typescript
// Cache static configuration
const settings = await cacheManager.getOrCompute(
  CacheKeyBuilder.config('site-settings'),
  () => this.getSiteSettings(),
  { ttl: 7200000 } // 2 hours
);
```

## Monitoring and Debugging

### Check Cache Performance

```typescript
const metrics = cacheManager.getMetrics();
console.log(`Hit Rate: ${metrics.hitRate.toFixed(2)}%`);
console.log(`Total Hits: ${metrics.hits}`);
console.log(`Total Misses: ${metrics.misses}`);
```

### Monitor Database Health

```typescript
const health = await healthCheck.check();
console.log(JSON.stringify(health.details, null, 2));
```

### View Transaction Stats

```typescript
const stats = transactionManager.getStats();
console.log(stats);
```

### Check Cache Invalidation Stats

```typescript
const invalidationStats = cacheInvalidation.getStats();
console.log(invalidationStats);
```

## Best Practices

1. **Use Cache Keys Consistently**: Follow the `CacheKeyBuilder` patterns
2. **Set Appropriate TTLs**: Balance freshness vs. performance
3. **Tag Related Caches**: Enable efficient batch invalidation
4. **Implement Warming**: Pre-populate critical data
5. **Monitor Hit Rates**: Adjust TTLs based on metrics
6. **Use Transactions**: For multi-step operations
7. **Handle Errors**: Implement fallback strategies
8. **Test Invalidation**: Ensure cache stays in sync
9. **Load Balance**: Distribute across multiple instances with Redis
10. **Document Patterns**: Keep team in sync on cache strategy

## Troubleshooting

### Low Cache Hit Rate

1. Check TTL settings - increase if data is not changing frequently
2. Verify cache keys are consistent
3. Ensure invalidation rules aren't too aggressive
4. Monitor for unexpected invalidations

### Slow Queries

1. Use `QueryPatterns` for optimization
2. Check database indexes
3. Use query selection to fetch only needed fields
4. Enable query caching

### Redis Connection Issues

1. Verify Redis is running
2. Check credentials and connection parameters
3. Monitor Redis memory usage
4. Implement fallback to memory-only caching

### Memory Issues

1. Monitor local cache size
2. Reduce TTLs for large objects
3. Enable compression for large objects
4. Implement LRU eviction policy

## Integration Examples

### With TypeORM

See `CONFIGURATION_TEMPLATE.md` for examples of integrating with other ORMs.

### With GraphQL

The cache system works seamlessly with GraphQL field resolvers:

```typescript
@Resolver()
export class ProductResolver {
  @Query()
  async product(@Args('id') id: string) {
    return this.cacheManager.getOrCompute(
      CacheKeyBuilder.product(id),
      () => this.productService.findOne(id),
      { tags: ['products'] }
    );
  }
}
```

### With REST API

Use with NestJS controllers:

```typescript
@Controller('products')
export class ProductController {
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.cacheManager.getOrCompute(
      CacheKeyBuilder.product(id),
      () => this.productService.findOne(id),
      { tags: ['products'] }
    );
  }
}
```

## Performance Tuning Checklist

- [ ] Configure Prisma Accelerate
- [ ] Setup Redis cache
- [ ] Configure appropriate TTLs
- [ ] Register invalidation rules
- [ ] Setup cache warming
- [ ] Implement health checks
- [ ] Configure monitoring
- [ ] Test failover scenarios
- [ ] Optimize slow queries
- [ ] Load test the application

## Support and Documentation

- **Main Guide**: See `DATABASE_AND_CACHE_GUIDE.md`
- **Configuration**: See `CONFIGURATION_TEMPLATE.md`
- **Prisma Docs**: https://www.prisma.io/docs/
- **Redis Docs**: https://redis.io/documentation/
- **NestJS Caching**: https://docs.nestjs.com/techniques/caching

## Contributing

When adding new cache patterns:

1. Add to `CacheKeyBuilder` if it's a common pattern
2. Register invalidation rules in `CacheInvalidation`
3. Add usage examples to this document
4. Test cache hit rates
5. Document TTL recommendations

## License

Part of AudioTaiLoc Backend
