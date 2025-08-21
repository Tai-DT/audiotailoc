# 🎵 Audio Tài Lộc - E-commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)

A comprehensive e-commerce platform for audio equipment with modern architecture, built using NestJS backend, Next.js frontend, and a professional admin dashboard.

## 🚀 Features

### Backend (NestJS)
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Complete CRUD operations for products and categories
- **Order Processing**: Shopping cart, checkout, and order management
- **Payment Integration**: VNPAY, MOMO, PAYOS payment gateways
- **File Management**: Image upload, processing, and storage
- **Webhooks**: Payment and order status webhooks
- **Internationalization**: Multi-language support (VI, EN, ZH)
- **Health Monitoring**: Comprehensive health checks and monitoring
- **Backup System**: Database backup and restore functionality
- **API Documentation**: Swagger/OpenAPI documentation

### Frontend (Next.js)
- **Modern UI/UX**: Professional e-commerce interface
- **Product Catalog**: Browse, search, and filter products
- **Shopping Cart**: Full cart management with real-time updates
- **User Authentication**: Login/logout with session management
- **Responsive Design**: Mobile-first responsive design
- **Vietnamese Localization**: Complete Vietnamese interface

### Dashboard (Next.js Admin)
- **Admin Panel**: Role-based admin interface
- **Product Management**: Create, edit, and manage products
- **Order Management**: View and process orders
- **Analytics**: Sales and performance metrics
- **User Management**: Customer and admin user management

## 🏗️ Architecture

```
audiotailoc/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── prisma/          # Database ORM
│   │   └── main.ts          # Application entry point
│   ├── prisma/              # Database schema
│   └── test/                # Unit and E2E tests
├── frontend/                # Next.js Customer Store
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Next.js pages
│   │   └── styles/          # CSS and styling
│   └── public/              # Static assets
├── dashboard/               # Next.js Admin Panel
│   ├── src/
│   │   ├── components/      # Admin components
│   │   ├── pages/           # Admin pages
│   │   └── styles/          # Admin styling
│   └── public/              # Admin assets
└── shared/                  # Shared utilities and types
```

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10+
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **File Processing**: Sharp for image processing
- **Payment**: VNPAY, MOMO, PAYOS integration
- **Testing**: Jest for unit and E2E tests
- **Documentation**: Swagger/OpenAPI

### Frontend & Dashboard
- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Forms**: React Hook Form

### DevOps
- **Package Manager**: pnpm
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Monitoring**: Health checks and logging

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm
- PostgreSQL 15+
- Redis (optional, for caching)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Tai-DT/audiotailoc.git
cd audiotailoc
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
# Backend
cp backend/.env.example backend/.env
# Frontend
cp frontend/.env.example frontend/.env
# Dashboard
cp dashboard/.env.example dashboard/.env
```

4. **Set up database**
```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Start development servers**
```bash
# Terminal 1: Backend
cd backend && pnpm run start:dev

# Terminal 2: Frontend
cd frontend && pnpm run dev

# Terminal 3: Dashboard
cd dashboard && pnpm run dev
```

## 🌐 Access Points

- **Backend API**: http://localhost:3010
- **API Documentation**: http://localhost:3010/docs
- **Frontend Store**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Health Check**: http://localhost:3010/api/v1/health

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/audiotailoc"

# JWT
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Payment Gateways
VNPAY_TMN_CODE="your-vnpay-code"
VNPAY_HASH_SECRET="your-vnpay-secret"
MOMO_ACCESS_KEY="your-momo-key"
PAYOS_CLIENT_ID="your-payos-id"

# File Storage
UPLOAD_DIR="./uploads"
CDN_URL="https://your-cdn.com"

# Redis (optional)
REDIS_URL="redis://localhost:6379"
```

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL="http://localhost:3010/api/v1"
NEXT_PUBLIC_APP_NAME="Audio Tài Lộc"
```

#### Dashboard (.env)
```env
NEXT_PUBLIC_API_URL="http://localhost:3010/api/v1"
NEXT_PUBLIC_APP_NAME="Audio Tài Lộc Admin"
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

### Frontend Tests
```bash
cd frontend
pnpm run test
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d
```

### Manual Deployment
```bash
# Backend
cd backend
pnpm run build
pnpm run start:prod

# Frontend
cd frontend
pnpm run build
pnpm run start

# Dashboard
cd dashboard
pnpm run build
pnpm run start
```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/profile` - Get user profile

### Products
- `GET /api/v1/catalog/products` - List products
- `GET /api/v1/catalog/products/:id` - Get product details
- `POST /api/v1/catalog/products` - Create product (Admin)
- `PUT /api/v1/catalog/products/:id` - Update product (Admin)
- `DELETE /api/v1/catalog/products/:id` - Delete product (Admin)

### Orders
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/checkout/create-order` - Create order

### Payments
- `POST /api/v1/payments/create-intent` - Create payment intent
- `POST /api/v1/webhooks/vnpay` - VNPAY webhook
- `POST /api/v1/webhooks/momo` - MOMO webhook

### Files
- `POST /api/v1/files/upload` - Upload file
- `GET /api/v1/files` - List files
- `DELETE /api/v1/files/:id` - Delete file

### Health
- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed health check

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin and user role management
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet Security**: Security headers and middleware
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 📈 Performance Features

- **Database Indexing**: Optimized database queries
- **Caching**: Redis-based caching for frequently accessed data
- **Image Optimization**: Automatic image compression and resizing
- **Lazy Loading**: Component and route lazy loading
- **CDN Integration**: Content delivery network support

## 🌍 Internationalization

The platform supports multiple languages:
- **Vietnamese (VI)** - Default language
- **English (EN)** - International support
- **Chinese (ZH)** - Asian market support

Translation management through database-driven system with context-aware translations.

## 🔄 CI/CD Pipeline

GitHub Actions workflow includes:
- **Linting**: ESLint and Prettier checks
- **Testing**: Unit, integration, and E2E tests
- **Security**: Vulnerability scanning
- **Build**: Docker image building
- **Deployment**: Automated deployment to staging/production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [API Docs](http://localhost:3010/docs)
- **Issues**: [GitHub Issues](https://github.com/Tai-DT/audiotailoc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Tai-DT/audiotailoc/discussions)

## 🎯 Roadmap

### Phase 1 (Completed ✅)
- [x] Basic e-commerce functionality
- [x] User authentication and authorization
- [x] Product catalog and management
- [x] Shopping cart and checkout
- [x] Payment integration

### Phase 2 (Completed ✅)
- [x] File upload and management
- [x] Webhooks system
- [x] Internationalization
- [x] Health monitoring
- [x] Backup system
- [x] CI/CD pipeline

### Phase 3 (Planned 🚧)
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] AI-powered recommendations
- [ ] Multi-vendor marketplace
- [ ] Advanced inventory management
- [ ] Customer support system

## 🙏 Acknowledgments

- **NestJS Team** for the excellent backend framework
- **Vercel** for Next.js and deployment platform
- **Prisma** for the modern database toolkit
- **Tailwind CSS** for the utility-first CSS framework

---

**Audio Tài Lộc** - Bringing premium audio equipment to Vietnam and beyond! 🎵✨
