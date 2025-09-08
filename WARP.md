# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Architecture Overview

Audio Tài Lộc is a full-stack e-commerce platform for audio services built with a three-tier architecture:

### Core Applications
- **Backend** (`/backend`): NestJS API server with PostgreSQL database
- **Frontend** (`/frontend`): Next.js 15 customer-facing application  
- **Dashboard** (`/dashboard`): Next.js 15 admin panel

### Key Technologies
- **Backend**: NestJS, TypeScript, Prisma ORM, PostgreSQL, Redis (optional), JWT auth
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Zustand, Radix UI
- **Database**: PostgreSQL with Prisma migrations
- **Deployment**: Docker containers, GitHub Actions CI/CD

## Common Development Commands

### Project Setup
```bash
# Install all dependencies (from project root)
npm install

# Setup environment files
cd backend && cp env-template.txt .env
cd ../frontend && cp .env.local.example .env.local  
cd ../dashboard && cp .env.local.example .env.local

# Database setup (development uses SQLite by default)
cd backend
npm run prisma:generate
npx prisma db push
npm run seed
```

### Development Servers
```bash
# Start all services (from project root)
npm run dev

# Or start individual services
npm run dev:backend    # Backend on :8000
npm run dev:frontend   # Frontend on :3000  
npm run dev:dashboard  # Dashboard on :3001

# Or manually
cd backend && npm run start:dev
cd frontend && npm run dev
cd dashboard && npm run dev
```

### Database Operations
```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Push schema changes (development)
npx prisma db push

# Run migrations (production)
npm run prisma:migrate:dev

# Seed database with sample data
npm run seed

# Open Prisma Studio
npx prisma studio
```

### Testing
```bash
# Backend tests
cd backend
npm run test                # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:e2e           # End-to-end tests
npm run test:watch         # Watch mode
npm run test:cov           # With coverage

# Frontend tests  
cd frontend
npm run test

# Dashboard E2E tests
cd dashboard
npx playwright test
```

### Build & Production
```bash
# Build backend
cd backend
npm run build
npm run start:prod

# Build frontend
cd frontend
npm run build
npm run start

# Build dashboard
cd dashboard
npm run build
npm run start

# Type checking
cd backend && npm run typecheck
cd frontend && npm run type-check
```

### Linting & Code Quality
```bash
# Backend linting
cd backend
npm run lint
npm run lint:fix

# Frontend linting  
cd frontend
npm run lint

# Dashboard linting
cd dashboard
npm run lint
```

## Data Model Architecture

The application uses Prisma ORM with PostgreSQL. Key models include:

### Core Business Models
- **User**: Authentication and user management with role-based access
- **Product**: E-commerce products with categories, specifications, inventory
- **Category**: Hierarchical product categorization
- **Service**: Professional audio services with booking system
- **ServiceCategory/ServiceType**: Service classification hierarchy

### E-commerce Models
- **Cart/CartItem**: Shopping cart functionality
- **Order/OrderItem**: Order processing and fulfillment
- **Payment/PaymentIntent**: Payment processing with multiple providers (VNPAY, MOMO, PayOS)
- **Inventory**: Stock management and tracking

### User Experience Models
- **ProductReview**: Product ratings and reviews with moderation
- **WishlistItem**: User wishlist functionality
- **Notification**: User notifications system
- **ChatSession**: Customer support chat

### Analytics & Tracking
- **ProductView/ServiceView**: View tracking for analytics
- **SearchQuery**: Search analytics
- **ActivityLog**: User activity tracking

## Module Structure

### Backend Modules (`/backend/src/modules`)
- `auth/`: JWT authentication, guards, role management
- `admin/`: Admin panel APIs and management functions
- `ai/`: Google AI integration (Gemini) and embeddings
- `analytics/`: Usage analytics and reporting
- `booking/`: Service booking management
- `cache/`: Redis caching layer
- `catalog/`: Product catalog management
- `customer/`: Customer-facing APIs (reviews, etc.)
- `service-categories/`: Service categorization
- `services/`: Professional services management
- `backup/`: Database backup and restore

### Frontend Pages (`/frontend/app`)
- Authentication: `login/`, `register/`, `profile/`
- E-commerce: `products/`, `categories/`, `cart/`, `checkout/`
- Services: `services/`, `booking/`
- User: `account/`, `orders/`, `notifications/`
- Support: `about/`, `support/`, `privacy/`, `terms/`

### Dashboard Pages (`/dashboard/app`)  
- Admin: `dashboard/`, `analytics/`, `products/`, `orders/`
- Inventory: `inventory/`
- Communications: `conversations/`
- Testing: Various test pages for development

## Environment Configuration

### Backend Environment (.env)
```bash
# Database (SQLite for development, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_ACCESS_SECRET="your-jwt-access-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT="8000"
NODE_ENV="development"

# External Services
REDIS_URL="redis://localhost:6379"
GOOGLE_AI_API_KEY="your-google-ai-api-key"
PAYOS_CLIENT_ID="your-payos-client-id"
PAYOS_API_KEY="your-payos-api-key"
```

### Frontend/Dashboard Environment (.env.local)
```bash
NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
NEXT_PUBLIC_WS_URL="ws://localhost:8000"
NEXTAUTH_URL="http://localhost:3000"  # or 3001 for dashboard
NEXTAUTH_SECRET="your-nextauth-secret"
```

## Development Patterns

### Backend Development
- Follow NestJS module pattern with controllers, services, and DTOs
- Use Prisma for database operations with proper error handling
- Implement proper validation using class-validator decorators
- Use guards for authentication and role-based authorization
- Follow RESTful API conventions with OpenAPI documentation

### Frontend Development  
- Use Next.js App Router with TypeScript
- Implement responsive design with Tailwind CSS
- Use Zustand for state management
- Follow React Hook Form + Zod for form validation
- Use Radix UI components for accessibility

### Database Development
- Use Prisma migrations for schema changes
- Implement proper indexing for performance
- Use soft deletes (`isDeleted` flag) instead of hard deletes
- Follow proper relational modeling with foreign keys

## API Endpoints

### Key API Routes
- **Health**: `GET /api/v1/health`
- **Authentication**: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`
- **Products**: `GET /api/v1/products`, `GET /api/v1/products/:id`
- **Services**: `GET /api/v1/services`, `POST /api/v1/services/book`
- **Cart**: `GET /api/v1/cart`, `POST /api/v1/cart/items`
- **Orders**: `GET /api/v1/orders`, `POST /api/v1/orders`
- **Admin**: `GET /api/v1/admin/*` (protected routes)

### API Documentation
- Swagger documentation available at `http://localhost:8000/docs`
- API versioning implemented with `/api/v1/` prefix

## Testing Strategy

### Backend Testing
- Unit tests for services and utilities
- Integration tests for API endpoints
- E2E tests for critical user journeys
- Security tests for authentication and authorization
- Performance tests for high-load scenarios

### Frontend Testing
- Component testing with React Testing Library
- E2E testing with Playwright (dashboard)
- API integration testing

## Deployment

### Local Development
- Use SQLite database for quick setup
- All services run on different ports (3000, 3001, 8000)
- Hot reloading enabled for all applications

### Production Considerations
- Switch to PostgreSQL database
- Configure proper environment variables
- Use Redis for caching and session management
- Implement proper logging and monitoring
- Follow security best practices for JWT and API keys

## Key Features Implementation

### Payment Integration
- Multiple payment providers supported (VNPAY, MOMO, PayOS)
- Payment intent pattern for secure transactions
- Order status tracking and fulfillment

### Search & Discovery
- Product search with filters and categories
- Service discovery with booking capabilities
- Analytics tracking for search queries

### User Experience
- Real-time chat support
- Product reviews and ratings
- Wishlist functionality
- Order tracking and history

### Admin Features
- Comprehensive dashboard for business management
- Product and service management
- Order processing and fulfillment
- Analytics and reporting
- User management and moderation
