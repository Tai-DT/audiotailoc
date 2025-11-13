# Deployment Guide - Audio Tài Lộc Backend

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Production Environment Setup](#production-environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Database Migration](#database-migration)
5. [Vercel Deployment](#vercel-deployment)
6. [AWS Deployment](#aws-deployment)
7. [Scaling & Performance](#scaling--performance)
8. [Monitoring & Logging](#monitoring--logging)
9. [Backup & Recovery](#backup--recovery)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

### Code Quality
- [ ] All tests passing: `npm run test`
- [ ] No linting errors: `npm run lint`
- [ ] No TypeScript errors: `npm run typecheck:full`
- [ ] Code is formatted: `npm run format:check`
- [ ] No console.log statements
- [ ] All TODOs are resolved

### Security
- [ ] All secrets in environment variables
- [ ] No hardcoded credentials
- [ ] API keys rotated for all services
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled
- [ ] JWT secrets set strong (min 32 characters)
- [ ] HTTPS configured

### Database
- [ ] Backup created before migration
- [ ] All migrations tested locally
- [ ] Rollback plan documented
- [ ] Database user permissions minimized
- [ ] Connection pooling configured

### Dependencies
- [ ] All packages updated to latest stable versions
- [ ] Security vulnerabilities checked: `npm audit`
- [ ] Breaking changes reviewed in changelogs
- [ ] Lock file committed

### Configuration
- [ ] All environment variables defined
- [ ] No development config in production
- [ ] Logging configured
- [ ] Error tracking setup (Sentry)
- [ ] Monitoring alerts configured

---

## Production Environment Setup

### 1. Create Production Environment File

Create `.env.production` with production values:

```env
# Database
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=PRODUCTION_API_KEY"
DIRECT_DATABASE_URL="postgres://prod_user:SECURE_PASSWORD@prod-host:26566/dbname?sslmode=require"

# Security - CHANGE THESE IMMEDIATELY
JWT_ACCESS_SECRET="GENERATE_RANDOM_32_CHAR_STRING_ACCESS"
JWT_REFRESH_SECRET="GENERATE_RANDOM_32_CHAR_STRING_REFRESH"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3010
NODE_ENV=production
API_VERSION=v1
ENABLE_SWAGGER=false

# Domain Configuration
CORS_ORIGINS="https://audiotailoc.vn,https://www.audiotailoc.vn,https://dashboard.audiotailoc.vn"
FRONTEND_URL="https://audiotailoc.vn"
DASHBOARD_URL="https://dashboard.audiotailoc.vn"

# Redis - Use managed service
REDIS_URL="rediss://default:SECURE_PASSWORD@prod-redis-host:6379"

# Payment Providers
PAYOS_CLIENT_ID="PRODUCTION_CLIENT_ID"
PAYOS_API_KEY="PRODUCTION_API_KEY"
PAYOS_CHECKSUM_KEY="PRODUCTION_CHECKSUM"
PAYOS_WEBHOOK_URL="https://api.audiotailoc.vn/api/v1/payments/payos/webhook"
PAYOS_RETURN_URL="https://audiotailoc.vn/checkout/return"
PAYOS_CANCEL_URL="https://audiotailoc.vn/checkout/cancel"

# File Storage
CLOUDINARY_CLOUD_NAME="PRODUCTION_CLOUD"
CLOUDINARY_API_KEY="PRODUCTION_API_KEY"
CLOUDINARY_API_SECRET="PRODUCTION_SECRET"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@audiotailoc.vn"
SMTP_PASS="APP_PASSWORD"
EMAIL_FROM="Audio Tài Lộc <noreply@audiotailoc.vn>"

# Rate Limiting
THROTTLE_TTL="60"
THROTTLE_LIMIT="100"

# Logging
LOG_LEVEL="info"
LOG_FILE="true"

# Security
BCRYPT_ROUNDS="12"
SESSION_SECRET="GENERATE_RANDOM_STRING"
```

### 2. Generate Secure Secrets

```bash
# Generate random strings for JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(24).toString('base64'))"
```

### 3. Environment-Specific Configuration

Structure for environment management:

```
.env.production          # Production secrets (DO NOT commit)
.env.staging            # Staging secrets (DO NOT commit)
.env.development        # Development (commit safe defaults)
```

---

## Docker Deployment

### 1. Dockerfile

The project includes a `Dockerfile` for containerization:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3010/api/v1/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/main.js"]
```

### 2. Build Docker Image

```bash
# Build image
docker build -t audiotailoc-backend:latest .

# Tag for registry
docker tag audiotailoc-backend:latest registry.example.com/audiotailoc-backend:latest

# Push to registry
docker push registry.example.com/audiotailoc-backend:latest
```

### 3. Docker Compose Setup

```yaml
version: '3.8'

services:
  backend:
    image: audiotailoc-backend:latest
    container_name: audiotailoc-backend
    ports:
      - "3010:3010"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      DIRECT_DATABASE_URL: ${DIRECT_DATABASE_URL}
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      REDIS_URL: ${REDIS_URL}
      # ... other env vars
    depends_on:
      - postgres
      - redis
    networks:
      - audiotailoc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3010/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:15-alpine
    container_name: audiotailoc-postgres
    environment:
      POSTGRES_DB: audiotailoc
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - audiotailoc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: audiotailoc-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - audiotailoc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  audiotailoc-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

### 4. Run with Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild images
docker-compose up -d --build
```

---

## Database Migration

### Pre-Migration Steps

```bash
# 1. Backup existing database
pg_dump -U postgres -h prod-host audiotailoc > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Test migrations locally against production database
npm run prisma:migrate:prod -- --name migrate_to_prod

# 3. Create rollback plan
```

### Running Migrations in Production

```bash
# 1. Connect to production environment
# Set environment variables to production

# 2. Verify pending migrations
npm run prisma:migrate:status

# 3. Run migrations
npm run prisma:migrate:prod

# 4. Verify migration success
npm run prisma:validate

# 5. Check data integrity
```

### Migration Rollback

```bash
# In case of issues, rollback to previous version
npm run prisma:migrate:resolve -- --rolled-back migration_name

# Or manually restore from backup
psql -U postgres -h prod-host audiotailoc < backup_YYYYMMDD_HHMMSS.sql
```

---

## Vercel Deployment

### 1. Configure Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Link to Vercel
vercel link

# Set environment variables in Vercel dashboard
vercel env pull
```

### 2. Environment Variables in Vercel

Set all production environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add all variables from `.env.production`

### 3. Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View deployments
vercel list
```

### 4. Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

---

## AWS Deployment

### 1. Deploy to AWS ECS

#### Create Docker Repository in ECR

```bash
# Create ECR repository
aws ecr create-repository --repository-name audiotailoc-backend

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag and push image
docker build -t audiotailoc-backend:latest .
docker tag audiotailoc-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/audiotailoc-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/audiotailoc-backend:latest
```

#### Create ECS Task Definition

```json
{
  "family": "audiotailoc-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "audiotailoc-backend",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/audiotailoc-backend:latest",
      "portMappings": [
        {
          "containerPort": 3010,
          "hostPort": 3010,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:audiotailoc-db"
        },
        {
          "name": "JWT_ACCESS_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:audiotailoc-jwt-access"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/audiotailoc-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### Create ECS Service

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name audiotailoc

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster audiotailoc \
  --service-name audiotailoc-backend \
  --task-definition audiotailoc-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789:targetgroup/audiotailoc/xxx,containerName=audiotailoc-backend,containerPort=3010
```

### 2. AWS RDS Database Setup

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier audiotailoc-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password SECURE_PASSWORD \
  --allocated-storage 20 \
  --publicly-accessible false \
  --vpc-security-group-ids sg-xxx

# Get RDS endpoint
aws rds describe-db-instances --db-instance-identifier audiotailoc-postgres
```

### 3. ElastiCache Redis Setup

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id audiotailoc-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --vpc-security-group-ids sg-xxx

# Get Redis endpoint
aws elasticache describe-cache-clusters --cache-cluster-id audiotailoc-redis
```

---

## Scaling & Performance

### 1. Horizontal Scaling

Configure auto-scaling for ECS:

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/audiotailoc/audiotailoc-backend \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-scaling \
  --service-namespace ecs \
  --resource-id service/audiotailoc/audiotailoc-backend \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration TargetValue=70,PredefinedMetricSpecification="{PredefinedMetricType=ECSServiceAverageCPUUtilization}"
```

### 2. Database Performance

```bash
# Monitor slow queries
EXPLAIN ANALYZE SELECT * FROM products WHERE category = 'electronics';

# Add indexes for frequently queried columns
ALTER TABLE products ADD INDEX idx_category (category);
ALTER TABLE orders ADD INDEX idx_user_id_created_at (user_id, created_at);

# Monitor connection pool
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

### 3. Caching Strategy

```typescript
// Cache frequently accessed data
async getPopularProducts() {
  const cached = await this.cache.get('popular-products');
  if (cached) return cached;

  const products = await this.prisma.product.findMany({
    where: { featured: true },
    take: 10,
  });

  // Cache for 1 hour
  await this.cache.set('popular-products', products, 3600000);
  return products;
}
```

---

## Monitoring & Logging

### 1. Setup CloudWatch Logging

```bash
# Create log group
aws logs create-log-group --log-group-name /ecs/audiotailoc-backend

# Set retention policy
aws logs put-retention-policy \
  --log-group-name /ecs/audiotailoc-backend \
  --retention-in-days 30
```

### 2. Application Logging

Configure logging in `.env.production`:

```env
LOG_LEVEL="info"
LOG_FILE="true"
```

Logs are written to:
- Console: Real-time
- File: `/var/log/audiotailoc/backend.log`
- CloudWatch: Via ECS integration

### 3. Error Tracking with Sentry

```bash
# Install Sentry
npm install @sentry/node

# Initialize in main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.useGlobalFilters(new SentryExceptionFilter());
app.use(Sentry.Handlers.errorHandler());
```

### 4. Health Monitoring

```bash
# Check health endpoint
curl http://api.audiotailoc.vn/api/v1/health

# Setup monitoring alert
aws cloudwatch put-metric-alarm \
  --alarm-name backend-unhealthy \
  --alarm-description "Alert when backend is unhealthy" \
  --metric-name HealthCheckStatus \
  --namespace AWS/ECS \
  --statistic Average \
  --period 60 \
  --threshold 1 \
  --comparison-operator LessThanThreshold
```

---

## Backup & Recovery

### 1. Database Backups

#### Automated Backups

```bash
# AWS RDS automatic backups (retention: 30 days)
aws rds modify-db-instance \
  --db-instance-identifier audiotailoc-postgres \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00"
```

#### Manual Backups

```bash
# Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier audiotailoc-postgres \
  --db-snapshot-identifier audiotailoc-backup-$(date +%Y%m%d-%H%M%S)

# List snapshots
aws rds describe-db-snapshots --db-instance-identifier audiotailoc-postgres
```

### 2. Application Backups

```bash
# Backup database locally
pg_dump -h prod-host -U prod_user audiotailoc | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Upload to S3
aws s3 cp backup_*.sql.gz s3://audiotailoc-backups/

# Setup lifecycle policy to delete old backups
aws s3api put-bucket-lifecycle-configuration \
  --bucket audiotailoc-backups \
  --lifecycle-configuration '{...}'
```

### 3. Restore from Backup

```bash
# Restore to new RDS instance
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier audiotailoc-postgres-restored \
  --db-snapshot-identifier audiotailoc-backup-20241112-120000

# Or restore from local backup
gunzip < backup_20241112_120000.sql.gz | psql -h localhost -U postgres audiotailoc
```

---

## Troubleshooting

### Common Deployment Issues

#### 1. Database Connection Failed

```bash
# Check database connectivity
psql -h prod-host -U prod_user -d audiotailoc -c "SELECT 1;"

# Verify security groups
aws ec2 describe-security-groups --group-ids sg-xxx

# Check RDS parameter group
aws rds describe-db-parameters --db-parameter-group-name default.postgres15
```

#### 2. Out of Memory

```bash
# Increase container memory in task definition
aws ecs update-task-definition \
  --family audiotailoc-backend \
  --memory 2048

# Monitor memory usage
aws cloudwatch get-metric-statistics \
  --namespace ECS/ContainerInsights \
  --metric-name MemoryUtilized \
  --dimensions Name=ServiceName,Value=audiotailoc-backend
```

#### 3. High CPU Usage

```bash
# Profile application
# Add nodejs profiler to Dockerfile
npm install --save-dev 0x

# Run with profiler
0x node dist/main.js

# Scale horizontally
aws ecs update-service \
  --cluster audiotailoc \
  --service audiotailoc-backend \
  --desired-count 4
```

#### 4. Slow API Responses

```bash
# Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

# Add missing indexes
CREATE INDEX idx_product_featured ON products(featured);

# Cache frequently accessed data
```

#### 5. Redis Connection Issues

```bash
# Test Redis connection
redis-cli -h redis-host -a password PING

# Monitor Redis memory
redis-cli -h redis-host INFO memory

# Clear cache if needed
redis-cli -h redis-host FLUSHALL
```

### Rollback Procedures

```bash
# Rollback to previous ECS task definition
aws ecs update-service \
  --cluster audiotailoc \
  --service audiotailoc-backend \
  --task-definition audiotailoc-backend:PREVIOUS_REVISION

# Rollback database migration
npm run prisma:migrate:resolve -- --rolled-back migration_name

# Restart service
aws ecs update-service \
  --cluster audiotailoc \
  --service audiotailoc-backend \
  --force-new-deployment
```

---

## Deployment Checklist

Before going live:

- [ ] All code pushed to main branch
- [ ] Tests passing in CI/CD
- [ ] Code review approved
- [ ] Security scan passed
- [ ] Database migrations tested
- [ ] Environment variables set correctly
- [ ] Secrets stored securely
- [ ] SSL certificates configured
- [ ] DNS records updated
- [ ] Monitoring alerts setup
- [ ] Backup strategy tested
- [ ] Runbook documentation created
- [ ] Team notified of deployment
- [ ] Deployment window scheduled
- [ ] Rollback plan ready

---

## Support & Resources

- AWS Documentation: https://docs.aws.amazon.com
- Docker Documentation: https://docs.docker.com
- Prisma Deployment: https://www.prisma.io/docs/guides/deployment
- Vercel Deployment: https://vercel.com/docs
- Sentry Setup: https://docs.sentry.io

---

## Post-Deployment

1. Monitor application for errors
2. Check performance metrics
3. Verify all features working
4. Test user flows end-to-end
5. Document lessons learned
6. Update runbooks
7. Celebrate successful deployment!
