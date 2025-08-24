# 🎵 Audio Tài Lộc - Professional Audio Services

A modern, full-stack e-commerce platform for audio services built with cutting-edge technologies.

## 🚀 Features

### Core Features
- ✅ **Product Catalog**: Complete product management with categories
- ✅ **Shopping Cart**: Advanced cart functionality with persistence
- ✅ **User Authentication**: Secure login/register system
- ✅ **Payment Integration**: VNPAY, MOMO, PayOS support
- ✅ **Real-time Chat**: Customer support integration
- ✅ **SEO Optimized**: Built-in SEO features and sitemaps
- ✅ **Mobile Responsive**: Perfect mobile experience
- ✅ **PWA Ready**: Progressive Web App capabilities

### Technical Features
- ✅ **Modern Stack**: Next.js 15 + NestJS + TypeScript
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **Search**: Meilisearch integration
- ✅ **Caching**: Redis support
- ✅ **Security**: Comprehensive security headers
- ✅ **Performance**: Optimized for speed and scalability
- ✅ **Monitoring**: Built-in system monitoring
- ✅ **Docker**: Container-ready deployment

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI + Custom Components

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Search**: Meilisearch
- **Cache**: Redis (optional)
- **Validation**: class-validator

### DevOps
- **Container**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Custom dashboard
- **Deployment**: Ready for production

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL 15+
- Docker (optional)

### 1. Clone and Install
```bash
git clone <repository-url>
cd audio-tailoc

# Install all dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy environment file
cp frontend/.env.local.example frontend/.env.local

# Update database connection
# Edit DATABASE_URL in your environment
```

### 3. Database Setup
```bash
# Using Docker (Recommended)
docker-compose up -d postgres meilisearch

# Or using local PostgreSQL
# Make sure PostgreSQL is running
```

### 4. Run Migrations
```bash
cd backend
npm run db:push
npm run db:seed
```

### 5. Start Development
```bash
# From project root
npm run dev

# Or start services separately
npm run dev:backend
npm run dev:frontend
```

### 6. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3010/api/v1
- **Monitoring**: http://localhost:3001
- **API Docs**: http://localhost:3010/api

## 📊 Monitoring & Analytics

### System Monitoring
```bash
# Run MCP system scan
node mcp-project-automation.js

# Start monitoring dashboard
node monitoring-dashboard.js

# System health check
node system-monitor.js
```

### Available Scripts
- `mcp-project-automation.js` - Full system analysis
- `system-monitor.js` - Health monitoring
- `dev-workflow.js` - Development workflow
- `deploy-manager.js` - Deployment management

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend && npm run test

# Frontend tests
cd frontend && npm run test

# E2E tests
npm run test:e2e
```

### API Testing
```bash
# Test all APIs
node api-data-verification.js

# Test user journey
node end-to-end-user-flow-test.js
```

## 🚢 Deployment

### Using Docker
```bash
# Build and deploy
docker-compose up -d

# Or using deployment script
node deploy-manager.js build
node deploy-manager.js deploy
```

### Manual Deployment
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run start
```

## 📁 Project Structure

```
audio-tailoc/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   └── main.ts         # Application entry
│   ├── prisma/             # Database schema & migrations
│   └── package.json
├── frontend/                # Next.js application
│   ├── app/                # App router pages
│   ├── components/         # Reusable components
│   ├── lib/                # Utilities & configurations
│   ├── store/              # State management
│   └── package.json
├── docker-compose.yml      # Docker services
├── mcp-project-automation.js # System automation
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_APP_NAME=Audio Tài Lộc
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOONG_API_KEY=your_api_key
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/atl
JWT_SECRET=your_jwt_secret
MEILI_URL=http://localhost:7700
REDIS_URL=redis://localhost:6379
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- 📧 Email: support@audiotailoc.com
- 📱 Phone: +84 XXX XXX XXXX
- 🏢 Address: Your Business Address

## 🎯 Roadmap

### Phase 1 ✅ (Completed)
- Basic e-commerce functionality
- User authentication
- Product catalog
- Shopping cart

### Phase 2 🔄 (In Progress)
- Payment integration
- Order management
- Admin panel

### Phase 3 📋 (Planned)
- Advanced analytics
- Mobile app
- Multi-language support
- Advanced features

---

**Built with ❤️ by Audio Tài Lộc Team**

*Last updated: ${new Date().toISOString().split('T')[0]}*