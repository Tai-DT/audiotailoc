# Monitoring & Performance System - Quick Start Guide

Get the monitoring and performance optimization system running in 5 minutes.

## Step 1: Verify Files (30 seconds)

All files should already be created:

```bash
# Check monitoring files
ls -la src/common/monitoring/

# Check performance files
ls -la src/common/performance/
```

Expected files:
```
monitoring/
├── metrics.service.ts
├── health.service.ts
├── performance.interceptor.ts
├── monitoring.module.ts
└── index.ts

performance/
├── cache-strategy.service.ts
├── query-optimizer.ts
└── index.ts
```

## Step 2: Import Module (1 minute)

Update your `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MonitoringModule } from './common/monitoring';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MonitoringModule, // Add this line
    AuthModule,
    // ... other modules
  ],
})
export class AppModule {}
```

## Step 3: Set Environment Variables (1 minute)

Add to `.env` or `.env.local`:

```bash
# Monitoring
METRICS_ENABLED=true
HEALTH_CHECK_INTERVAL=60000

# Caching
CACHE_STRATEGY=LRU
CACHE_MAX_SIZE=100MB
CACHE_DEFAULT_TTL=3600000

# Database
DATABASE_SLOW_QUERY_THRESHOLD=100
```

## Step 4: Start Application (2 minutes)

```bash
npm run start:dev
# or
yarn start:dev
```

You should see in logs:
```
[Nest] ... Metrics service initialized
[Nest] ... MonitoringModule registered
```

## Step 5: Test Endpoints

### Test Health Check
```bash
curl http://localhost:3010/api/v1/monitoring/health
```

Response:
```json
{
  "status": "UP",
  "timestamp": "2024-11-11T10:30:00.000Z",
  "uptime": 125.5,
  "checks": [
    {
      "status": "UP",
      "name": "database",
      "message": "Database is healthy",
      "responseTime": 23
    }
  ]
}
```

### Test Metrics
```bash
curl http://localhost:3010/api/v1/monitoring/metrics
```

Response:
```
# HELP http_request_duration_seconds HTTP request latency in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",route="api/health",status_code="200",le="0.001"} 15
```

### Test Dashboard Metrics
```bash
curl http://localhost:3010/api/v1/monitoring/health/dashboard
```

---

## Usage Examples

### 1. Using in Services

```typescript
import { MetricsService } from 'src/common/monitoring';
import { CacheStrategyService } from 'src/common/performance';

@Injectable()
export class ProductService {
  constructor(
    private readonly metrics: MetricsService,
    private readonly cache: CacheStrategyService,
  ) {}

  async getProducts() {
    // Check cache first
    const cached = this.cache.get('products');
    if (cached) return cached;

    // Get from database
    const products = await this.prisma.product.findMany();

    // Cache result
    this.cache.set('products', products, 3600000);

    return products;
  }
}
```

### 2. Recording Database Queries

```typescript
import { QueryOptimizer } from 'src/common/performance';

async getUser(id: string) {
  const start = Date.now();

  const user = await this.prisma.user.findUnique({
    where: { id },
  });

  const duration = Date.now() - start;
  QueryOptimizer.recordQuery('User', 'findUnique', duration);

  return user;
}
```

### 3. Checking Cache Statistics

```typescript
const stats = this.cache.getStatistics();
console.log(`Cache hit rate: ${stats.hitRate.toFixed(2)}%`);
console.log(`Memory usage: ${stats.memoryUsage}`);
```

### 4. Analyzing Query Performance

```typescript
const analysis = QueryOptimizer.analyzeQueryPatterns();
console.log('Top slow queries:', analysis.slowestQueries);
console.log('Recommendations:', analysis.recommendations);
```

---

## API Endpoints Reference

| Endpoint | Use Case |
|----------|----------|
| `GET /api/v1/monitoring/health` | Full system health check |
| `GET /api/v1/monitoring/health/live` | Kubernetes liveness probe |
| `GET /api/v1/monitoring/health/ready` | Kubernetes readiness probe |
| `GET /api/v1/monitoring/health/dashboard` | Dashboard display metrics |
| `GET /api/v1/monitoring/metrics` | Prometheus scraping |
| `GET /api/v1/monitoring/metrics/json` | JSON format metrics |

---

## Monitoring Dashboard (Optional)

### Set Up Prometheus

Create `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'audiotailoc-api'
    static_configs:
      - targets: ['localhost:3010']
    metrics_path: '/api/v1/monitoring/metrics'
```

Run Prometheus:
```bash
docker run -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

### Set Up Grafana

```bash
docker run -p 3000:3000 grafana/grafana
```

Add Prometheus data source:
- URL: `http://localhost:9090`

---

## Troubleshooting

### Module Import Error
```
Cannot find module 'src/common/monitoring'
```

**Solution**: Verify files exist in `src/common/monitoring/` and `src/common/performance/`

### Health Check Returns DOWN

Check the specific check that failed:
```bash
curl http://localhost:3010/api/v1/monitoring/health | jq '.checks[]'
```

### Metrics Endpoint Returns Empty

```bash
curl http://localhost:3010/api/v1/monitoring/metrics
```

Should return Prometheus format. If empty, check if `prom-client` is installed:
```bash
npm list prom-client
```

### Cache Not Working

1. Check strategy setting:
   ```bash
   echo $CACHE_STRATEGY
   ```

2. Clear cache and try again:
   ```typescript
   this.cache.clear();
   ```

3. Check cache stats:
   ```typescript
   console.log(this.cache.getStatistics());
   ```

---

## Common Tasks

### Clear Cache Programmatically

```typescript
// Clear entire cache
this.cache.clear();

// Clear specific pattern
this.cache.deleteByPattern(/^product:/);

// Delete single entry
this.cache.delete('products');
```

### Get Performance Report

```typescript
const report = QueryOptimizer.generatePerformanceReport();
console.log(report);
```

### Export Metrics

```typescript
// Prometheus format
const metrics = await this.metricsService.getMetrics();

// JSON format
const jsonMetrics = await this.metricsService.getMetricsAsJson();
```

### Warm Cache on Startup

```typescript
async onModuleInit() {
  this.cache.warmCache([
    {
      key: 'categories:all',
      value: await this.getCategories(),
      ttl: 3600000
    },
    {
      key: 'settings:config',
      value: await this.getSettings(),
      ttl: 7200000
    },
  ]);
}
```

---

## Performance Tips

### 1. Use Appropriate Cache TTL

```typescript
// Short-lived data (pages)
this.cache.set('products:page:1', data, 600000); // 10 minutes

// Long-lived data (categories)
this.cache.set('categories', data, 3600000); // 1 hour

// Very persistent data (settings)
this.cache.set('settings', data, 86400000); // 24 hours
```

### 2. Choose Right Cache Strategy

- **LRU**: General purpose (recommended default)
- **LFU**: Hot data sets (e-commerce products)
- **FIFO**: Time-series data
- **TTL**: Expiring data

### 3. Optimize Database Queries

```typescript
// Use pagination
const { skip, take } = QueryOptimizer.createPaginationQuery(page, 20);

// Optimize SELECT
const select = QueryOptimizer.getDefaultSelect(['password']);

// Batch operations
await QueryOptimizer.executeBatchQueries(queries, 10);
```

### 4. Monitor Memory

```typescript
const stats = this.cache.getStatistics();
if (stats.size > 500 * 1024 * 1024) { // 500MB
  this.cache.deleteByPattern(/^temp:/); // Clear temporary data
}
```

---

## Configuration Profiles

### Development
```bash
CACHE_STRATEGY=LRU
CACHE_MAX_SIZE=100MB
CACHE_DEFAULT_TTL=600000    # 10 minutes
```

### Production
```bash
CACHE_STRATEGY=LRU
CACHE_MAX_SIZE=500MB
CACHE_DEFAULT_TTL=3600000   # 1 hour
```

### High Load
```bash
CACHE_STRATEGY=LFU
CACHE_MAX_SIZE=1GB
CACHE_DEFAULT_TTL=7200000   # 2 hours
DATABASE_CONNECTION_POOL_SIZE=30
```

---

## Next Steps

1. ✅ Import MonitoringModule
2. ✅ Test health endpoints
3. ✅ Verify metrics export
4. ✅ Use cache in services
5. ✅ Record database queries
6. ✅ Review performance reports
7. ✅ Tune cache strategy
8. ✅ Set up Prometheus (optional)
9. ✅ Create Grafana dashboards (optional)
10. ✅ Monitor in production

---

## Support

- **Full Documentation**: See `MONITORING_OPTIMIZATION_GUIDE.md`
- **System Summary**: See `MONITORING_SYSTEM_SUMMARY.md`
- **API Docs**: Visit `/docs` in browser
- **Metrics Endpoint**: `GET /api/v1/monitoring/metrics`

---

**You're all set! The monitoring system is ready to use.**
