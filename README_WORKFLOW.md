# 🚀 Audio Tài Lộc - Modern Development Workflow

## 📋 Tổng quan

Dự án Audio Tài Lộc sử dụng quy trình phát triển hiện đại với CI/CD, containerization, và best practices cho production deployment.

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   Dashboard     │
│   (Next.js)     │◄──►│   (NestJS)       │◄──►│   (Next.js)     │
│   Port: 3000    │    │   Port: 8000     │    │   Port: 3001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │   PostgreSQL    │
                    │   Redis Cache   │
                    │   MeiliSearch   │
                    └─────────────────┘
```

## 🚀 Quick Start

### 1. Development Setup

```bash
# Clone repository
git clone https://github.com/your-username/audio-tailoc.git
cd audio-tailoc

# Setup development environment
./scripts/setup-dev.sh

# Or manual setup
cp .env.development .env
npm install
npm run dev
```

### 2. Using Docker (Recommended)

```bash
# Development
./scripts/deploy.sh development

# Staging
./scripts/deploy.sh staging

# Production
./scripts/deploy.sh production
```

## 📁 Project Structure

```
audio-tailoc/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   └── main.ts         # Application entry
│   ├── prisma/             # Database schema
│   └── Dockerfile
├── frontend/                # Next.js Client App
│   ├── app/                # App Router pages
│   ├── components/         # Reusable components
│   ├── store/              # Zustand state management
│   └── Dockerfile
├── dashboard/               # Admin Dashboard
│   ├── app/                # App Router pages
│   ├── components/         # Admin components
│   └── Dockerfile
├── monitoring/              # Monitoring stack
│   ├── prometheus.yml
│   └── grafana/
├── scripts/                 # Deployment scripts
│   ├── deploy.sh
│   └── setup-dev.sh
├── docker-compose.yml       # Docker services
├── .github/workflows/       # CI/CD pipelines
└── .env.*                   # Environment configs
```

## 🛠️ Development Workflow

### Daily Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build backend
```

### Code Quality

```bash
# Backend
cd backend && npm run lint
cd backend && npm run test

# Frontend
cd frontend && npm run lint
cd frontend && npm run test

# Dashboard
cd dashboard && npm run lint
cd dashboard && npm run test
```

### Database Management

```bash
# Generate Prisma client
cd backend && npx prisma generate

# Create migration
cd backend && npx prisma migrate dev

# Reset database
cd backend && npx prisma migrate reset

# Seed data
cd backend && npm run seed
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
- Backend Tests & Build
- Frontend Tests & Build
- Dashboard Tests & Build
- Security Scanning
- Docker Build & Push
- Deploy to Staging
- Deploy to Production
```

### Manual Deployment

```bash
# Deploy to staging
git push origin develop

# Deploy to production
git push origin main

# Or manual deployment
./scripts/deploy.sh production backend
```

## 📊 Monitoring & Observability

### Accessing Monitoring

```bash
# Prometheus metrics
open http://localhost:9090

# Grafana dashboards
open http://localhost:3002
# Default credentials: admin/admin

# System health
curl http://localhost:8000/api/v1/health
```

### Key Metrics

- **Application Metrics**: Response times, error rates
- **System Metrics**: CPU, Memory, Disk usage
- **Database Metrics**: Connection pools, query performance
- **Business Metrics**: User activity, conversion rates

## 🔒 Security

### Environment Variables

```bash
# Development
cp .env.development .env

# Production (Never commit!)
cp .env.production .env
# Edit with real production values
```

### Security Best Practices

- ✅ JWT authentication with refresh tokens
- ✅ Rate limiting (1000 requests/15min)
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation with class-validator
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend && npm run test
cd backend && npm run test:e2e

# Frontend tests
cd frontend && npm run test

# Dashboard tests
cd dashboard && npm run test
```

### Test Coverage

```bash
# Generate coverage reports
cd backend && npm run test:cov
cd frontend && npm run test -- --coverage
```

## 🚢 Production Deployment

### Prerequisites

```bash
# Required tools
- Docker & Docker Compose
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- MeiliSearch
```

### Production Checklist

- [ ] Update `.env.production` with real credentials
- [ ] Configure domain and SSL certificates
- [ ] Setup monitoring and alerting
- [ ] Configure backup strategy
- [ ] Test payment integrations
- [ ] Setup CDN for static assets
- [ ] Configure load balancer

### Deployment Commands

```bash
# Full production deployment
./scripts/deploy.sh production

# Rolling update specific service
./scripts/deploy.sh production backend

# View deployment status
docker-compose ps

# Check logs
docker-compose logs -f backend
```

## 📚 API Documentation

### Swagger Documentation

```bash
# Development
open http://localhost:8000/docs

# Production
open https://api.your-domain.com/docs
```

### API Endpoints

```typescript
// Authentication
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/refresh

// Products
GET /api/v1/catalog/products
POST /api/v1/catalog/products
PUT /api/v1/catalog/products/:id

// Cart Management
GET /api/v1/cart
POST /api/v1/cart/items
PUT /api/v1/cart/items/:id

// Orders
GET /api/v1/orders
POST /api/v1/orders
PUT /api/v1/orders/:id/status

// AI Features
POST /api/v1/ai/chat
GET /api/v1/ai/search
POST /api/v1/ai/recommendations

// Real-time Chat
WebSocket: ws://localhost:8000
POST /api/v1/chat/send-message
```

## 🐛 Troubleshooting

### Common Issues

```bash
# Port conflicts
docker-compose down
docker-compose up -d

# Database connection issues
cd backend && npx prisma migrate reset

# Redis connection issues
docker-compose restart redis

# Build cache issues
docker system prune -f
docker-compose build --no-cache
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f frontend

# View container status
docker-compose ps
```

## 🤝 Contributing

### Development Guidelines

1. **Branch Strategy**
   ```bash
   # Feature branches
   git checkout -b feature/new-feature

   # Bug fixes
   git checkout -b bugfix/issue-description

   # Release branches
   git checkout -b release/v1.2.0
   ```

2. **Code Quality**
   ```bash
   # Run linters
   npm run lint

   # Run tests
   npm run test

   # Build check
   npm run build
   ```

3. **Commit Convention**
   ```bash
   feat: add new chat feature
   fix: resolve payment integration bug
   docs: update API documentation
   refactor: improve database queries
   test: add unit tests for cart service
   ```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Ensure CI/CD passes
4. Create pull request to `develop`
5. Code review and approval
6. Merge to `develop`
7. Release to `main` for production

## 📞 Support & Documentation

### Documentation Links

- [API Documentation](http://localhost:8000/docs)
- [Frontend Components](./frontend/README.md)
- [Backend Modules](./backend/README.md)
- [Deployment Guide](./scripts/README.md)

### Getting Help

- **Issues**: Create GitHub issue with detailed description
- **Discussions**: Use GitHub discussions for questions
- **Documentation**: Check README files in each directory

---

## 🎯 Success Metrics

### Performance Targets
- **Response Time**: < 200ms for API calls
- **Uptime**: 99.9% availability
- **Error Rate**: < 0.1% error rate
- **Load Time**: < 3 seconds for initial page load

### Business Metrics
- **User Engagement**: Track through analytics
- **Conversion Rate**: Monitor checkout flow
- **Customer Satisfaction**: Support ticket resolution time

---

**🎵 Chúc mừng! Bạn đã setup thành công hệ thống Audio Tài Lộc với quy trình phát triển hiện đại! 🎵**