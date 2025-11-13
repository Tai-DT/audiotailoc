# Monitoring & Performance Optimization System

Complete production-ready monitoring and performance optimization system for Audio Tài Lộc backend.

## Overview

This system provides comprehensive monitoring, health checking, performance tracking, and query optimization capabilities for the NestJS backend application.

### Components

1. **Monitoring Module** (`/src/common/monitoring/`)
   - Prometheus metrics collection
   - Comprehensive health checks
   - Performance tracking interceptor
   - REST API endpoints for monitoring data

2. **Performance Module** (`/src/common/performance/`)
   - Advanced caching strategies (LRU, LFU, FIFO, TTL)
   - Database query optimization utilities
   - N+1 query detection
   - Query performance analysis

---

## Monitoring Module

### 1. Metrics Service (`metrics.service.ts`)

Production-ready Prometheus metrics service with comprehensive metric categories.

#### Key Features

- **HTTP Metrics**: Request duration, size, response size, request/error counts
- **Database Metrics**: Query duration, query count, connection pool, slow query tracking
- **Cache Metrics**: Hit/miss rates, operation duration, cache size
- **Business Metrics**: Bookings, orders, payments, user registrations
- **System Metrics**: Active connections, queue depth, error rate
- **Memory Metrics**: Heap usage, external memory, garbage collection tracking

#### Usage

```typescript
import { MetricsService } from 'src/common/monitoring';

// Inject into your service
constructor(private readonly metricsService: MetricsService) {}

// Record HTTP request
this.metricsService.recordHttpRequest(
  'GET',
  'api/products',
  200,
  145, // duration in ms
  1024, // request size
  5120, // response size
);

// Record database query
this.metricsService.recordDatabaseQuery(
  'findMany',
  'Product',
  89, // duration in ms
  'success'
);

// Record cache operations
this.metricsService.recordCacheHit('redis', 'products');
this.metricsService.recordCacheMiss('memory', 'user:123');
this.metricsService.recordCacheOperation('set', 'redis', 5);

// Record business events
this.metricsService.recordBooking('confirmed');
this.metricsService.recordPayment('success', 'card');

// Update memory metrics
this.metricsService.updateMemoryMetrics();

// Export metrics
const prometheusMetrics = await this.metricsService.getMetrics();
const jsonMetrics = await this.metricsService.getMetricsAsJson();
```

#### Prometheus Endpoints

All metrics are available at `/api/v1/monitoring/metrics` in Prometheus format.

**Import format:**
```
# HELP http_request_duration_seconds HTTP request latency in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",route="api/products",status_code="200",le="0.001"} 15
```

---

### 2. Health Service (`health.service.ts`)

Comprehensive health checking system with liveness and readiness probes.

#### Health Check Types

1. **Database Check**: Verifies database connectivity and performance
2. **Cache Check**: Validates Redis/in-memory cache availability
3. **Memory Check**: Monitors heap usage and potential memory leaks
4. **Database Performance Check**: Analyzes multi-query performance
5. **External APIs Check**: Validates PayOS, Cloudinary integration
6. **Event Loop Lag Check**: Detects blocking operations

#### Health Status Levels

- `UP`: Service is healthy and responding normally
- `DEGRADED`: Service is running but experiencing issues
- `DOWN`: Service is unavailable

#### Usage

```typescript
import { HealthService, HealthStatus } from 'src/common/monitoring';

// Inject into your service or controller
constructor(private readonly healthService: HealthService) {}

// Get full health status
const health = await this.healthService.getFullHealthStatus();
// Returns: { status, timestamp, uptime, checks, systemMetrics }

// Liveness probe (quick check)
const liveness = await this.healthService.getLivenessProbe();
// Use for: K8s liveness probes, basic availability checks

// Readiness probe (thorough check)
const readiness = await this.healthService.getReadinessProbe();
// Use for: K8s readiness probes, load balancer health checks

// Dashboard metrics
const dashboard = await this.healthService.getDashboardMetrics();
// Returns formatted metrics for dashboard display

// Individual checks
const dbHealth = await this.healthService.checkDatabase();
const cacheHealth = await this.healthService.checkCache();
const dbPerf = await this.healthService.checkDatabasePerformance();
const externalApis = await this.healthService.checkExternalApis();
```

#### Health Check Response

```json
{
  "status": "UP",
  "timestamp": "2024-11-11T10:30:00.000Z",
  "uptime": 3600.5,
  "checks": [
    {
      "status": "UP",
      "name": "database",
      "message": "Database is healthy",
      "responseTime": 23,
      "details": {
        "responseTime": "23ms"
      }
    },
    {
      "status": "UP",
      "name": "cache",
      "message": "Cache is healthy",
      "responseTime": 5,
      "details": {
        "responseTime": "5ms",
        "memory": {
          "used": "125.45 MB",
          "percentage": 45.2
        }
      }
    }
  ],
  "systemMetrics": {
    "memory": {
      "heapUsed": 52428800,
      "heapTotal": 104857600,
      "percentage": 50.0
    },
    "eventLoopLag": 0.45
  }
}
```

#### API Endpoints

- `GET /api/v1/monitoring/health` - Full health check
- `GET /api/v1/monitoring/health/live` - Liveness probe
- `GET /api/v1/monitoring/health/ready` - Readiness probe
- `GET /api/v1/monitoring/health/dashboard` - Dashboard metrics

---

### 3. Performance Tracking Interceptor (`performance.interceptor.ts`)

Automatically tracks all HTTP requests and records performance metrics.

#### Features

- **Automatic Request Tracking**: Records all HTTP requests without configuration
- **Memory Delta Tracking**: Measures memory usage change per request
- **Slow Request Detection**: Logs requests exceeding thresholds
- **Active Connection Tracking**: Monitors concurrent requests
- **Memory Leak Detection**: Alerts on unexpected memory growth
- **Request Normalization**: Groups similar requests for better metrics

#### Configuration

The interceptor is automatically registered globally in `MonitoringModule` and doesn't require additional configuration. It works seamlessly with all routes.

#### Performance Thresholds

- **Slow Request**: > 1000ms (warning), > 2000ms (error)
- **Error Response**: Any 4xx or 5xx status code
- **Memory Leak Detection**: > 10MB increase per check
- **Memory Monitoring**: Every 30 seconds

#### Request ID Format

Each request is assigned a unique ID: `{timestamp}-{random}`

This ID is used throughout the request lifecycle for tracing.

---

### 4. Monitoring Module (`monitoring.module.ts`)

Global module that registers all monitoring components.

#### Features

- **Global Registration**: Automatically available application-wide
- **Auto-Metrics Endpoint**: `/api/v1/monitoring/metrics`
- **Health Check Endpoints**: Multiple health check endpoints
- **Automatic Interceptor**: Performance tracking on all routes
- **Export Capabilities**: Export services for use in other modules

#### Module Setup

The module is already set up with global scope and should be imported in your main `AppModule`:

```typescript
import { MonitoringModule } from 'src/common/monitoring';

@Module({
  imports: [
    // ... other imports
    MonitoringModule,
  ],
})
export class AppModule {}
```

#### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/monitoring/metrics` | GET | Prometheus format metrics |
| `/api/v1/monitoring/health` | GET | Full health check |
| `/api/v1/monitoring/health/live` | GET | Liveness probe |
| `/api/v1/monitoring/health/ready` | GET | Readiness probe |
| `/api/v1/monitoring/health/dashboard` | GET | Dashboard metrics |
| `/api/v1/monitoring/metrics/json` | GET | JSON format metrics |

---

## Performance Optimization Module

### 1. Cache Strategy Service (`cache-strategy.service.ts`)

Advanced in-memory caching with multiple eviction strategies.

#### Supported Strategies

1. **LRU (Least Recently Used)**: Evicts least recently accessed items
2. **LFU (Least Frequently Used)**: Evicts least frequently accessed items
3. **FIFO (First In First Out)**: Evicts oldest items first
4. **TTL (Time To Live)**: Evicts expired entries

#### Configuration

Set strategy via environment variables:

```bash
CACHE_STRATEGY=LRU              # LRU, LFU, FIFO, or TTL
CACHE_MAX_SIZE=100MB            # Max cache size (B, KB, MB, GB)
CACHE_DEFAULT_TTL=3600000       # Default TTL in milliseconds (1 hour)
```

#### Usage

```typescript
import { CacheStrategyService } from 'src/common/performance';

constructor(private readonly cache: CacheStrategyService) {}

// Set cache entry
this.cache.set('user:123', userData, 3600000); // 1 hour TTL

// Get cache entry
const data = this.cache.get<User>('user:123');

// Check if exists
if (this.cache.has('user:123')) {
  // ...
}

// Delete entry
this.cache.delete('user:123');

// Delete by pattern
this.cache.deleteByPattern(/^user:/);

// Get entries by pattern
const allUsers = this.cache.getByPattern(/^user:/);

// Get all keys
const keys = this.cache.keys();

// Clear entire cache
this.cache.clear();

// Warm cache
this.cache.warmCache([
  { key: 'products:all', value: products, ttl: 3600000 },
  { key: 'categories:all', value: categories, ttl: 3600000 },
]);

// Get statistics
const stats = this.cache.getStatistics();
// Returns: { hits, misses, hitRate, size, entries, averageEntrySize, memoryUsage }
```

#### Cache Statistics Response

```json
{
  "hits": 1250,
  "misses": 156,
  "hitRate": 88.9,
  "size": 5242880,
  "entries": 342,
  "averageEntrySize": 15323,
  "memoryUsage": "5.00 MB"
}
```

#### Features

- **Automatic Cleanup**: Expired entries removed every minute
- **Memory Management**: Automatic eviction when max size reached
- **Pattern Matching**: Delete/query using regex patterns
- **Metrics Integration**: Automatic tracking with MetricsService
- **Memory Leak Prevention**: Tracks entry sizes and total memory

---

### 2. Query Optimizer (`query-optimizer.ts`)

Database query optimization utilities and analysis tools.

#### QueryOptimizer Class

Record and analyze database queries for performance issues.

```typescript
import { QueryOptimizer, DatabaseOptimizer, IndexOptimizer } from 'src/common/performance';

// Record query execution
QueryOptimizer.recordQuery(
  'Product',           // model
  'findMany',         // operation
  45,                 // duration in ms
  this.metricsService // optional metrics service
);

// Get query statistics
const stats = QueryOptimizer.getQueryStats();
// Returns: {
//   totalQueries: 1523,
//   slowQueries: 87,
//   averageDuration: 42.5,
//   slowQueryPercentage: 5.7,
//   queryBreakdown: { ... }
// }

// Get top slow queries
const slowest = QueryOptimizer.getTopSlowQueries(10);

// Analyze patterns
const analysis = QueryOptimizer.analyzeQueryPatterns();
// Returns: {
//   mostUsedQueries: [...],
//   slowestQueries: [...],
//   recommendations: [...]
// }

// Generate performance report
const report = QueryOptimizer.generatePerformanceReport();
console.log(report);
```

#### DatabaseOptimizer Class

```typescript
// Calculate optimal batch size
const batchSize = DatabaseOptimizer.calculateOptimalBatchSize(
  1024, // item size in bytes
  10 * 1024 * 1024 // max memory (10MB)
);

// Detect N+1 query patterns
const hasNPlusOne = DatabaseOptimizer.detectNPlusOnePattern(queries);

// Estimate performance impact
const impact = DatabaseOptimizer.estimatePerformanceImpact(queries);
// Returns: { total, wasted, improvement }

// Get database health score (0-100)
const score = DatabaseOptimizer.getHealthScore(queries);
```

#### IndexOptimizer Class

```typescript
// Get index suggestions
const suggestions = IndexOptimizer.suggestIndexes(queries);
// Returns: [
//   {
//     model: 'Product',
//     field: 'findMany_index',
//     reason: 'Query Product.findMany is slow',
//     estimatedImprovement: '20-40%'
//   }
// ]

// Check for missing indexes
const missing = IndexOptimizer.checkMissingIndexes('User');
```

#### Query Optimization Utilities

```typescript
// Optimize SELECT clause
const optimized = QueryOptimizer.optimizeSelect(
  { id: true, name: true, email: true, password: true },
  false // includeRelations
);
// Result: { id: true, name: true, email: true }

// Create pagination query
const { skip, take } = QueryOptimizer.createPaginationQuery(
  2,    // page number
  20    // page size
);

// Optimize WHERE clause
const where = QueryOptimizer.optimizeWhereClause({
  status: 'active',
  tags: ['featured', 'new'],
  archived: null
});

// Get default select fields
const select = QueryOptimizer.getDefaultSelect(
  ['password', 'refreshToken'] // exclude fields
);

// Execute batch queries (prevent memory overload)
const results = await QueryOptimizer.executeBatchQueries(
  queries,
  10 // batch size
);

// Create prefetch config for relations
const prefetch = QueryOptimizer.createPrefetchConfig(
  ['bookings', 'orders', 'reviews'],
  1 // depth
);
```

---

## Integration Guide

### 1. In Main Module

```typescript
// src/app.module.ts
import { MonitoringModule } from 'src/common/monitoring';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MonitoringModule, // Add this
    // ... other modules
  ],
})
export class AppModule {}
```

### 2. Using in Services

```typescript
import {
  MetricsService,
  HealthService,
} from 'src/common/monitoring';
import {
  CacheStrategyService,
  QueryOptimizer,
} from 'src/common/performance';

@Injectable()
export class ProductService {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly healthService: HealthService,
    private readonly cache: CacheStrategyService,
    private readonly prisma: PrismaService,
  ) {}

  async getProducts(page: number = 1) {
    // Try cache first
    const cacheKey = `products:page:${page}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    // Query optimization
    const { skip, take } = QueryOptimizer.createPaginationQuery(page, 20);

    const startTime = Date.now();
    const products = await this.prisma.product.findMany({
      skip,
      take,
      select: QueryOptimizer.getDefaultSelect(['password']),
      include: {
        category: true,
      },
    });
    const duration = Date.now() - startTime;

    // Record metrics
    QueryOptimizer.recordQuery('Product', 'findMany', duration, this.metricsService);

    // Cache result
    this.cache.set(cacheKey, products, 3600000);

    return products;
  }

  async getHealth() {
    return await this.healthService.getFullHealthStatus();
  }
}
```

### 3. Using in Controllers

```typescript
import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MetricsService } from 'src/common/monitoring';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly metricsService: MetricsService,
  ) {}

  @Get()
  async getProducts(@Query('page') page: number = 1) {
    return await this.productService.getProducts(page);
  }

  @Get('cache-stats')
  getCacheStats() {
    return this.cache.getStatistics();
  }

  @Get('query-analysis')
  getQueryAnalysis() {
    return QueryOptimizer.analyzeQueryPatterns();
  }
}
```

---

## Kubernetes Integration

### Health Check Configuration

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: audiotailoc-api
spec:
  template:
    spec:
      containers:
      - name: api
        image: audiotailoc/api:latest
        ports:
        - containerPort: 3010

        # Liveness probe: checks if container is running
        livenessProbe:
          httpGet:
            path: /api/v1/monitoring/health/live
            port: 3010
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3

        # Readiness probe: checks if container is ready for traffic
        readinessProbe:
          httpGet:
            path: /api/v1/monitoring/health/ready
            port: 3010
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 5
          failureThreshold: 2

        # Startup probe: checks if container startup is complete
        startupProbe:
          httpGet:
            path: /api/v1/monitoring/health/live
            port: 3010
          initialDelaySeconds: 0
          periodSeconds: 5
          timeoutSeconds: 5
          failureThreshold: 30
```

---

## Performance Tuning

### Environment Variables

```bash
# Monitoring
METRICS_ENABLED=true
HEALTH_CHECK_INTERVAL=60000

# Caching
CACHE_STRATEGY=LRU
CACHE_MAX_SIZE=500MB
CACHE_DEFAULT_TTL=3600000
CACHE_CLEANUP_INTERVAL=60000

# Database
DATABASE_CONNECTION_POOL_SIZE=20
DATABASE_SLOW_QUERY_THRESHOLD=100
DATABASE_MAX_QUERY_TIME=5000

# Memory
MEMORY_HEAP_MAX=512m
MEMORY_MONITORING_ENABLED=true
```

### Recommended Settings

**Development:**
```bash
CACHE_STRATEGY=LRU
CACHE_MAX_SIZE=100MB
CACHE_DEFAULT_TTL=600000  # 10 minutes
```

**Production:**
```bash
CACHE_STRATEGY=LRU
CACHE_MAX_SIZE=500MB
CACHE_DEFAULT_TTL=3600000  # 1 hour
DATABASE_CONNECTION_POOL_SIZE=20
```

**High Load:**
```bash
CACHE_STRATEGY=LFU
CACHE_MAX_SIZE=1GB
CACHE_DEFAULT_TTL=7200000  # 2 hours
DATABASE_CONNECTION_POOL_SIZE=30
```

---

## Monitoring Dashboard Integration

### Prometheus Scrape Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'audiotailoc-api'
    static_configs:
      - targets: ['localhost:3010']
    metrics_path: '/api/v1/monitoring/metrics'
```

### Grafana Dashboard Queries

```
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_errors_total[5m])

# Database query performance
histogram_quantile(0.95, db_query_duration_seconds)

# Cache hit rate
rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m]))

# Memory usage
process_resident_memory_bytes

# Active connections
active_connections
```

---

## Troubleshooting

### High Memory Usage

1. Check heap size: `GET /api/v1/monitoring/health`
2. Review cache statistics: Check `memoryUsage` in cache stats
3. Clear cache if needed: Use cache pattern delete
4. Adjust `CACHE_MAX_SIZE` environment variable

### Slow Queries

1. Run analysis: `QueryOptimizer.analyzeQueryPatterns()`
2. Check recommendations: `getIndexRecommendations()`
3. Review `getTopSlowQueries(10)`
4. Add appropriate database indexes

### Event Loop Lag

1. Check in health response: `systemMetrics.eventLoopLag`
2. If > 100ms: application is blocking
3. Move heavy operations to background jobs
4. Consider increasing Node.js memory allocation

### Cache Hit Rate Too Low

1. Check: `cache.getStatistics().hitRate`
2. If < 70%: Increase `CACHE_MAX_SIZE` or TTL
3. Switch cache strategy: LFU for hot data
4. Warm cache on startup

---

## Best Practices

1. **Always Use Cache Patterns**: Query by pattern for bulk operations
2. **Batch Database Queries**: Use `QueryOptimizer.executeBatchQueries()` for bulk imports
3. **Monitor Regularly**: Check health and metrics daily
4. **Tune Cache Strategy**: Start with LRU, switch to LFU if needed
5. **Index Strategically**: Follow recommendations from `IndexOptimizer`
6. **Set Appropriate TTLs**: Balance freshness vs cache efficiency
7. **Monitor Memory Growth**: Check for leaks using monitoring endpoints
8. **Use Pagination**: Always paginate large result sets
9. **Profile Slow Queries**: Use query analysis regularly
10. **Implement Circuit Breakers**: For external API calls

---

## File Locations

### Monitoring Module
- `/src/common/monitoring/metrics.service.ts` - Prometheus metrics
- `/src/common/monitoring/health.service.ts` - Health checks
- `/src/common/monitoring/performance.interceptor.ts` - Performance tracking
- `/src/common/monitoring/monitoring.module.ts` - Module definition
- `/src/common/monitoring/index.ts` - Exports

### Performance Module
- `/src/common/performance/cache-strategy.service.ts` - Caching strategies
- `/src/common/performance/query-optimizer.ts` - Query optimization
- `/src/common/performance/index.ts` - Exports

---

## Production Checklist

- [ ] Enable monitoring in production
- [ ] Configure Prometheus scraping
- [ ] Set up Grafana dashboards
- [ ] Configure appropriate cache strategies
- [ ] Add database indexes as recommended
- [ ] Set memory limits appropriately
- [ ] Configure health checks for load balancer
- [ ] Set up alerts for high error rates
- [ ] Monitor memory growth patterns
- [ ] Review slow queries regularly
- [ ] Test failover scenarios
- [ ] Document cache invalidation strategy

---

## Support & Further Documentation

For additional support:
- Check MetricsService for available metrics
- Review HealthService for health check details
- Use QueryOptimizer for database optimization
- Consult CacheStrategyService for caching strategies

---

**Last Updated**: November 11, 2024
**Version**: 1.0.0
**Status**: Production Ready
