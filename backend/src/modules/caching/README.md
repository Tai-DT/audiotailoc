# Advanced Caching System

High-performance Redis-based caching system with intelligent cache management, tagging, and invalidation strategies.

## Features

### ✅ **Implemented:**
- **Redis Integration** - High-performance Redis caching with connection management
- **Intelligent Cache Keys** - Automatic key generation with hashing
- **Cache Tagging** - Tag-based cache invalidation for related data
- **Multi-level Cache** - Support for multiple cache layers
- **Cache Analytics** - Hit rate tracking and performance metrics
- **Graceful Degradation** - Continue working when Redis is unavailable
- **Cache Warming** - Preload frequently accessed data

### 📋 **Cache Types Supported:**

1. **HTTP Response Cache** - Automatic caching of GET requests
2. **Method Result Cache** - Cache results of service methods
3. **Database Query Cache** - Cache database query results
4. **Computed Value Cache** - Cache expensive calculations
5. **Session Cache** - Cache user session data
6. **API Response Cache** - Cache external API responses

## Quick Start

### 1. Basic Method Caching

```typescript
import { Cache } from './cache.decorators';

@Injectable()
export class ProductService {
  constructor(private cacheService: CacheService) {}

  @Cache(3600, 'products') // Cache for 1 hour with 'products' prefix
  async getProductById(productId: string) {
    // This result will be cached automatically
    return await this.database.findProduct(productId);
  }
}
```

### 2. Cache with Tags

```typescript
import { Cache, productTags } from './cache.decorators';

@Injectable()
export class ProductService {
  @Cache(3600, 'products', productTags('productId'))
  async getProductById(productId: string) {
    return await this.database.findProduct(productId);
  }

  // When product is updated, invalidate related cache
  @InvalidateCacheByTags((productId) => productTags(productId))
  async updateProduct(productId: string, data: any) {
    await this.database.updateProduct(productId, data);
    // Cache for this product will be invalidated
  }
}
```

### 3. HTTP Response Caching

```typescript
// GET requests are automatically cached
// No additional code needed for basic HTTP caching

@Controller('products')
export class ProductController {
  @Get(':id')
  // This response will be cached automatically
  getProduct(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }
}
```

## Cache Configuration

### Environment Variables

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_password
REDIS_DB=0

# Cache Configuration
CACHE_TTL=3600                    # Default TTL in seconds
CACHE_PREFIX=audiotailoc          # Default cache key prefix
CACHE_ENABLED=true               # Enable/disable caching
```

### Module Configuration

```typescript
// In app.module.ts
CacheModule.forRoot({
  ttl: 3600,        // Default TTL: 1 hour
  isGlobal: true,   // Make CacheService available globally
}),
```

## Cache Decorators

### Basic Caching

```typescript
@Cache(ttl, keyPrefix, tags)
```

### Custom Key Generation

```typescript
@CacheWithKey((userId, category) => `user:${userId}:category:${category}`, {
  ttl: 1800,
  tags: ['user_preferences']
})
```

### Dynamic TTL

```typescript
@CacheWithDynamicTTL((result) => {
  // Cache fresh data longer
  return result.isPopular ? 7200 : 1800;
}, {
  keyPrefix: 'products'
})
```

### Conditional Caching

```typescript
@ConditionalCache((result) => {
  // Only cache if product is active
  return result.status === 'active';
}, {
  ttl: 3600,
  tags: ['products']
})
```

### Cache Invalidation

```typescript
@InvalidateCache((productId) => `product:${productId}`)
async updateProduct(productId: string) {
  // Cache will be invalidated after update
}

@InvalidateCacheByTags((categoryId) => [`category:${categoryId}`, 'products'])
async updateCategory(categoryId: string) {
  // All related cache entries will be invalidated
}
```

### Fallback Cache

```typescript
@CacheWithFallback(
  { error: 'Service unavailable', data: [] }, // Fallback value
  { ttl: 300 } // Cache fallback for 5 minutes
)
async getExternalData() {
  // If this fails, return cached fallback
}
```

## Cache Service API

### Basic Operations

```typescript
// Set cache entry
await cacheService.set('myKey', data, {
  ttl: 3600,
  tags: ['tag1', 'tag2']
});

// Get cache entry
const data = await cacheService.get('myKey');

// Delete cache entry
await cacheService.del('myKey');

// Cache with automatic fallback
const data = await cacheService.getOrSet(
  'myKey',
  async () => await this.fetchData(),
  { ttl: 3600 }
);
```

### Advanced Operations

```typescript
// Multi-get
const results = await cacheService.mget(['key1', 'key2', 'key3']);

// Multi-set
await cacheService.mset([
  { key: 'key1', value: 'value1' },
  { key: 'key2', value: 'value2' }
]);

// Clear by prefix
await cacheService.clearByPrefix('products:*');

// Invalidate by tags
await cacheService.invalidateByTags(['products', 'categories']);

// Get cache statistics
const stats = cacheService.getStats();
// { hits: 150, misses: 25, hitRate: 85.71, totalRequests: 175 }
```

## Cache Key Strategies

### 1. **Structured Keys**

```typescript
// Good: Structured and predictable
const key = `user:${userId}:profile`;

// Bad: Too generic
const key = `${userId}_profile`;
```

### 2. **Hash-based Keys**

```typescript
// For complex objects, use hashing
const keyData = {
  userId,
  filters: { category: 'electronics', priceRange: [100, 500] },
  sort: 'price_asc'
};

const key = cacheService.generateKeyFromObject(keyData, 'search');
```

### 3. **Versioned Keys**

```typescript
// Include version in key for cache invalidation
const key = `v2:user:${userId}:preferences`;
```

## Cache Invalidation Strategies

### 1. **Tag-based Invalidation**

```typescript
// Tag cache entries for bulk invalidation
@Cache(3600, 'products', ['products', `product:${productId}`])
async getProduct(productId: string) {
  return await this.db.findProduct(productId);
}

// Invalidate all product-related cache
await cacheService.invalidateByTags(['products']);
```

### 2. **Time-based Expiration**

```typescript
// Set different TTL for different data types
@Cache(300, 'volatile')      // 5 minutes for volatile data
@Cache(3600, 'stable')       // 1 hour for stable data
@Cache(86400, 'static')      // 24 hours for static data
```

### 3. **Event-based Invalidation**

```typescript
// Invalidate cache when database changes
@Post('products')
async createProduct(@Body() product: any) {
  const newProduct = await this.db.createProduct(product);

  // Invalidate product list cache
  await this.cacheService.invalidateByTags(['products']);

  return newProduct;
}
```

## Performance Optimization

### 1. **Cache Warming**

```typescript
// Preload frequently accessed data
async onModuleInit() {
  const popularProducts = await this.db.getPopularProducts();
  await this.cacheService.warmUp([
    ...popularProducts.map(p => ({
      key: `product:${p.id}`,
      value: p,
      options: { ttl: 3600, tags: productTags(p.id) }
    }))
  ]);
}
```

### 2. **Smart TTL**

```typescript
// Longer TTL for popular items
@CacheWithDynamicTTL((product) => {
  return product.views > 1000 ? 7200 : 1800; // 2 hours vs 30 minutes
})
async getProduct(productId: string) {
  // Implementation
}
```

### 3. **Batch Operations**

```typescript
// Cache multiple items at once
const products = await this.db.getProducts([1, 2, 3, 4, 5]);

await this.cacheService.mset(
  products.map(p => ({
    key: `product:${p.id}`,
    value: p,
    options: { tags: productTags(p.id) }
  }))
);
```

## Monitoring & Analytics

### Cache Metrics

```typescript
// Get cache statistics
const stats = await this.cacheService.getStats();
console.log(`Cache Hit Rate: ${stats.hitRate}%`);

// Get detailed analytics
const analytics = await this.cacheService.getAnalytics();
console.log('Redis Memory Usage:', analytics.redis.usedMemory);
```

### Health Checks

```typescript
// Check cache health
const isHealthy = this.cacheService.isHealthy();
const pingResult = await this.cacheService.ping();
```

## Best Practices

### 1. **Cache Key Design**

```typescript
// ✅ Good: Descriptive and structured
const key = `user:${userId}:orders:status:${status}`;

// ❌ Bad: Too vague
const key = `u${userId}o${status}`;
```

### 2. **TTL Strategy**

```typescript
// Different TTL for different data types
const TTL = {
  USER_SESSION: 3600,        // 1 hour
  PRODUCT_LIST: 300,         // 5 minutes
  PRODUCT_DETAIL: 1800,      // 30 minutes
  STATIC_CONTENT: 86400,     // 24 hours
};
```

### 3. **Error Handling**

```typescript
// Always handle cache failures gracefully
try {
  const cached = await this.cacheService.get(key);
  if (cached) return cached;
} catch (error) {
  // Log error but continue with database query
  this.logger.error('Cache error:', error);
}

const data = await this.database.query();
return data;
```

### 4. **Cache Invalidation**

```typescript
// Invalidate related cache entries
@Post('products')
async createProduct(@Body() product: any) {
  const newProduct = await this.db.createProduct(product);

  // Invalidate product list cache
  await this.cacheService.invalidateByTags(['products', 'product_list']);

  return newProduct;
}
```

### 5. **Memory Management**

```typescript
// Set appropriate memory limits
// Monitor memory usage
// Implement cache size limits
// Use Redis memory policies (LRU, LFU, etc.)
```

## Integration Examples

### Service Layer Caching

```typescript
@Injectable()
export class UserService {
  @Cache(1800, 'users', userTags())
  async getUserProfile(userId: string) {
    return await this.db.getUserProfile(userId);
  }

  @InvalidateCacheByTags((userId) => userTags(userId))
  async updateUserProfile(userId: string, data: any) {
    await this.db.updateUserProfile(userId, data);
    // Cache will be invalidated automatically
  }
}
```

### Controller Layer Caching

```typescript
@Controller('api')
export class ApiController {
  @Get('dashboard')
  @Cache(300, 'dashboard', ['dashboard', 'user_data'])
  async getDashboard(@Request() req: any) {
    const userId = req.user.id;
    return await this.dashboardService.getUserDashboard(userId);
  }
}
```

### External API Caching

```typescript
@Injectable()
export class WeatherService {
  @Cache(600, 'weather') // Cache weather data for 10 minutes
  async getWeather(city: string) {
    const response = await this.httpService.get(
      `https://api.weather.com/${city}`
    );
    return response.data;
  }
}
```

## Troubleshooting

### Common Issues:

1. **Cache Misses**
   - Check TTL values
   - Verify cache key generation
   - Monitor Redis connection

2. **Memory Issues**
   - Set appropriate memory limits
   - Implement cache size limits
   - Monitor Redis memory usage

3. **Invalidation Problems**
   - Check tag naming conventions
   - Verify tag assignments
   - Monitor invalidation patterns

4. **Performance Issues**
   - Use connection pooling
   - Implement pipelining for multiple operations
   - Monitor Redis performance metrics

### Debugging:

```typescript
// Enable debug logging
const debug = require('debug')('cache');
debug.enabled = true;

// Log cache operations
this.cacheService.set('debug', true);
```

## Production Deployment

### Redis Configuration

```yaml
# docker-compose.yml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
  volumes:
    - redis_data:/data

# With sentinel for high availability
redis-sentinel:
  image: redis:7-alpine
  command: redis-sentinel /etc/redis/sentinel.conf
  volumes:
    - ./redis/sentinel.conf:/etc/redis/sentinel.conf
```

### Environment Variables

```env
# Production settings
REDIS_URL=redis://redis-cluster:6379
CACHE_TTL=7200                    # 2 hours in production
CACHE_ENABLED=true
REDIS_MAX_CONNECTIONS=20
REDIS_LAZY_CONNECT=true
```

This comprehensive caching system provides enterprise-grade performance optimization with intelligent cache management, monitoring, and maintenance capabilities.
