# Database & Cache Configuration Template

## Environment Variables

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/audiotailoc
DIRECT_DATABASE_URL=postgresql://user:password@localhost:5432/audiotailoc

# Prisma Accelerate
ENABLE_PRISMA_ACCELERATE=true
PRISMA_ACCELERATE_URL=https://accelerate.prisma.io/YOUR_API_KEY
PRISMA_ACCELERATE_API_KEY=YOUR_API_KEY

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_URL=redis://localhost:6379

# Cache Configuration
CACHE_TTL=3600
CACHE_MAX_SIZE=100000
ENABLE_LOCAL_CACHE=true
ENABLE_REDIS_CACHE=true
CACHE_COMPRESSION=false

# Database Health Check
ENABLE_DB_HEALTH_CHECK=true
DB_HEALTH_CHECK_INTERVAL=60000
SLOW_QUERY_THRESHOLD=1000

# Application Environment
NODE_ENV=development
LOG_LEVEL=debug
```

## Module Configuration

### Cache Module Setup

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@common/cache';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Cache Module Configuration
    CacheModule.register({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
      },
      defaultTtl: parseInt(process.env.CACHE_TTL || '3600') * 1000,
      enableCompression: process.env.CACHE_COMPRESSION === 'true',
      enableWarming: true,
      warmingInterval: 300000, // 5 minutes
    }),

    // Other modules...
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### Database Configuration

```typescript
// src/modules/database/database.module.ts
import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { TransactionManager } from '@common/database';
import { DatabaseHealthCheck } from '@common/database';

@Global()
@Module({
  providers: [
    PrismaService,
    TransactionManager,
    DatabaseHealthCheck,
  ],
  exports: [
    PrismaService,
    TransactionManager,
    DatabaseHealthCheck,
  ],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private prisma: PrismaService,
    private healthCheck: DatabaseHealthCheck,
  ) {}

  async onModuleInit() {
    // Connect to database
    await this.prisma.$connect();

    // Start health monitoring
    this.healthCheck.startContinuousCheck(
      parseInt(process.env.DB_HEALTH_CHECK_INTERVAL || '60000')
    );
  }

  async onModuleDestroy() {
    // Disconnect from database
    await this.prisma.$disconnect();

    // Stop health monitoring
    this.healthCheck.stopContinuousCheck();
  }
}
```

## Performance Presets

### Development Environment

```typescript
const devConfig = {
  cache: {
    ttl: 600000, // 10 minutes
    enableCompression: false,
    enableLocalCache: true,
    enableRedisCache: false, // Optional in dev
  },
  database: {
    connectionPoolSize: 5,
    enableMetrics: true,
  },
};
```

### Production Environment

```typescript
const prodConfig = {
  cache: {
    ttl: 3600000, // 1 hour
    enableCompression: true,
    enableLocalCache: true,
    enableRedisCache: true,
  },
  database: {
    connectionPoolSize: 25,
    enableMetrics: true,
    slowQueryThreshold: 500, // Alert on queries > 500ms
  },
};
```

### High-Traffic Environment

```typescript
const highTrafficConfig = {
  cache: {
    ttl: 7200000, // 2 hours
    enableCompression: true,
    enableLocalCache: true,
    enableRedisCache: true,
    prefix: 'ht:',
  },
  database: {
    connectionPoolSize: 50,
    enableMetrics: true,
    slowQueryThreshold: 1000,
  },
};
```

## Cache Key Patterns

### Recommended Naming Conventions

```typescript
// User-related
user:{userId}
user:profile:{userId}
user:preferences:{userId}
user:sessions:{sessionId}

// Product-related
product:{productId}
product:list:{filters}
product:search:{query}:{page}
product:reviews:{productId}
product:catalog:{categoryId}:{page}

// Service-related
service:{serviceId}
service:list
service:bookings:{userId}
service:calendar:{technicianId}

// Cart and Order
cart:{userId}
cart:items:{userId}
order:{orderId}
order:list:{userId}

// Category and Navigation
category:{categoryId}
category:list
category:tree

// Analytics and Stats
analytics:views:{period}
analytics:sales:{period}
analytics:traffic:{date}

// Search and Discovery
search:results:{query}:{page}
search:suggestions:{partial}
trending:products:{period}
trending:services:{period}

// Site Configuration
config:{key}
banners:{page}
promotions:active
settings:site
```

## Invalidation Rules

### Default Rules

```typescript
// Product invalidation rules
{
  id: 'product_create',
  pattern: /^product:list:.*/,
  triggers: ['product.created'],
  tags: ['products', 'product-list'],
}

{
  id: 'product_update',
  pattern: /^product:\w+/,
  triggers: ['product.updated'],
  tags: ['products'],
}

{
  id: 'product_delete',
  pattern: /^product:.*/,
  triggers: ['product.deleted'],
  tags: ['products'],
}

// Category invalidation rules
{
  id: 'category_update',
  pattern: /^category:.*/,
  triggers: ['category.updated', 'category.deleted'],
  tags: ['categories'],
}

// Service invalidation rules
{
  id: 'service_update',
  pattern: /^service:.*/,
  triggers: ['service.updated', 'service.deleted'],
  tags: ['services'],
}

// Cart invalidation rules
{
  id: 'cart_update',
  pattern: /^cart:.*/,
  triggers: ['cart.updated', 'order.created'],
  tags: ['carts'],
}
```

## Cache Warming Configuration

### Critical Data to Warm

```typescript
const warmingConfig = {
  enabled: true,
  interval: 300000, // 5 minutes
  items: [
    {
      key: 'categories:list',
      compute: () => prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }),
      ttl: 7200000,
    },
    {
      key: 'featured:products',
      compute: () => prisma.product.findMany({
        where: { featured: true, isActive: true },
        take: 20,
        orderBy: { createdAt: 'desc' },
      }),
      ttl: 3600000,
    },
    {
      key: 'featured:services',
      compute: () => prisma.service.findMany({
        where: { isFeatured: true, isActive: true },
        take: 10,
      }),
      ttl: 3600000,
    },
    {
      key: 'site:config',
      compute: () => prisma.systemConfig.findMany(),
      ttl: 7200000,
    },
    {
      key: 'banners:home',
      compute: () => prisma.banner.findMany({
        where: { page: 'home', isActive: true, isDeleted: false },
        orderBy: { position: 'asc' },
      }),
      ttl: 1800000,
    },
  ],
};
```

## Monitoring and Alerts

### Health Check Configuration

```typescript
interface HealthCheckConfig {
  enabled: true;
  interval: 60000; // Check every 60 seconds

  // Alert thresholds
  thresholds: {
    responseTime: 1000; // Alert if > 1s
    errorRate: 0.05; // Alert if > 5%
    cacheHitRate: 0.7; // Alert if < 70%
    slowQueries: 10; // Alert if > 10 in interval
    connectionPoolUsage: 0.9; // Alert if > 90%
  };

  // Actions on alert
  actions: {
    onUnhealthy: () => console.error('DB unhealthy');
    onDegraded: () => console.warn('DB degraded');
    onSlowQuery: (query) => logSlowQuery(query);
  };
}
```

### Logging Configuration

```typescript
{
  database: {
    logLevel: ['query', 'error', 'warn'], // In development
    slowQueryThreshold: 500,
    logSlowQueries: true,
  },
  cache: {
    logMetrics: true,
    metricsInterval: 300000,
    logInvalidations: true,
  },
}
```

## Docker Compose Example

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: audiotailoc
      POSTGRES_USER: audiotailoc
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U audiotailoc"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass redis_password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://audiotailoc:secure_password@postgres:5432/audiotailoc
      DIRECT_DATABASE_URL: postgresql://audiotailoc:secure_password@postgres:5432/audiotailoc
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: redis_password
      NODE_ENV: production
    ports:
      - "3000:3000"

volumes:
  postgres_data:
  redis_data:
```

## Database Migration Strategy

```bash
# Generate Prisma client
npm run prisma:generate

# Create migration
npx prisma migrate dev --name descriptive_name

# Apply migrations in production
npx prisma migrate deploy

# View migration status
npx prisma migrate status

# Seed database
npm run seed
```

## Troubleshooting Configuration

### Enable Debug Mode

```bash
# Set environment variable
DEBUG=audiotailoc:* node dist/main.js

# Or in .env
DEBUG=audiotailoc:database:*,audiotailoc:cache:*
```

### Verify Configuration

```bash
# Check Redis connection
redis-cli -h localhost -p 6379 ping

# Check Database connection
psql -U audiotailoc -d audiotailoc -h localhost -c "SELECT 1"

# Check Prisma connection
npx prisma db execute --file check-connection.sql
```

## Performance Tuning Commands

```bash
# Analyze database
npx prisma db execute --file analyze-db.sql

# Generate query execution plans
npx prisma db execute --file explain-queries.sql

# Monitor active connections
psql -c "SELECT count(*) as active_connections FROM pg_stat_activity"

# Check cache hit rate
redis-cli INFO stats | grep hit_rate
```
