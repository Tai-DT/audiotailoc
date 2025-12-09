# Phân Tích Hệ Thống Audio Tài Lộc

## 📋 Tổng Quan

Dự án **Audio Tài Lộc** là một hệ thống e-commerce và quản lý dịch vụ audio hoàn chỉnh, được xây dựng với kiến trúc microservices gồm 3 phần chính:
- **Backend**: NestJS API Server
- **Frontend**: Next.js Customer-facing Website  
- **Dashboard**: Next.js Admin Panel

---

## 🏗️ BACKEND (NestJS)

### **Công Nghệ & Stack**

- **Framework**: NestJS 10.4.0 (Node.js >= 20.x)
- **Database**: PostgreSQL với Prisma ORM 6.16.2
- **Authentication**: JWT (Access + Refresh tokens)
- **API Documentation**: Swagger/OpenAPI
- **Real-time**: Socket.IO
- **Caching**: Redis (ioredis, cache-manager)
- **File Storage**: Cloudinary
- **Payment**: PayOS integration
- **Logging**: Winston, Pino
- **Monitoring**: Prometheus metrics, Health checks

### **Kiến Trúc**

```
backend/
├── src/
│   ├── modules/          # Feature modules
│   ├── common/           # Shared utilities
│   ├── prisma/          # Database service
│   └── main.ts          # Application bootstrap
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
└── package.json
```

### **Các Module Chính**

#### 1. **Authentication & Authorization**
- `auth/` - JWT authentication, password hashing
- `users/` - User management
- `admin/` - Admin operations với API key authentication
- Guards: `JwtGuard`, `AdminGuard`, `OptionalJwtGuard`

#### 2. **E-commerce Core**
- `catalog/` - Product catalog management
- `cart/` - Shopping cart
- `orders/` - Order management
- `payments/` - Payment processing (PayOS)
- `checkout/` - Checkout flow
- `promotions/` - Promotion & discount system
- `wishlist/` - Wishlist functionality

#### 3. **Inventory Management**
- `inventory/` - Stock management
- Inventory movements tracking
- Low stock alerts
- Stock adjustments

#### 4. **Service Management**
- `services/` - Service catalog
- `service-types/` - Service type categories
- `booking/` - Service booking system
- `technicians/` - Technician management

#### 5. **Content Management**
- `blog/` - Blog articles
- `projects/` - Portfolio projects
- `site/` - Site content & settings
- `seo/` - SEO management

#### 6. **Support & Communication**
- `support/` - Customer support
- `chat/` - Real-time chat (guest & authenticated)
- `messages/` - Message system
- `notifications/` - Notification system

#### 7. **Analytics & Reporting**
- `analytics/` - Business analytics
- `reports/` - Report generation (CSV, Excel, PDF)
- `monitoring/` - Performance monitoring

#### 8. **Infrastructure**
- `files/` - File upload/download (Cloudinary)
- `maps/` - Maps integration (Goong Maps)
- `search/` - Search functionality
- `caching/` - Cache management
- `backup/` - Data backup
- `webhooks/` - Webhook handling
- `realtime/` - Real-time updates (Socket.IO)
- `ai/` - AI features

### **API Structure**

- **Base URL**: `/api/v1`
- **Documentation**: `/docs` và `/api/v1/docs`
- **Health Check**: `/api/v1/health`
- **Versioning**: Single v1 API (unified)

### **Security Features**

- ✅ Helmet.js (security headers)
- ✅ CORS configuration
- ✅ Rate limiting (express-rate-limit)
- ✅ Input validation (class-validator)
- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ Admin API key authentication
- ✅ Request body size limits

### **Database Schema Highlights**

- **Users**: Authentication, roles, profiles
- **Products**: Catalog với categories, images, specifications
- **Orders**: Order management với items, payments, shipping
- **Services**: Service catalog với types, technicians
- **Bookings**: Service bookings với scheduling
- **Blog**: Articles với categories, comments
- **Projects**: Portfolio projects
- **Inventory**: Stock tracking với movements & alerts
- **Chat**: Conversations & messages
- **Notifications**: User notifications
- **Activity Logs**: Audit trail

### **Performance Optimizations**

- ✅ Redis caching
- ✅ Database query optimization
- ✅ Compression middleware
- ✅ Response transformation interceptors
- ✅ BigInt serialization
- ✅ Connection pooling (Prisma)

---

## 🎨 FRONTEND (Next.js)

### **Công Nghệ & Stack**

- **Framework**: Next.js 16.0.3 (React 18.3.1)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion, Motion
- **Real-time**: Socket.IO Client
- **Payment**: PayOS integration
- **Maps**: Goong Maps integration
- **SEO**: Next.js SEO features

### **Kiến Trúc**

```
frontend/
├── app/                  # Next.js App Router
│   ├── api/             # API routes (proxy)
│   ├── auth/            # Authentication pages
│   ├── products/        # Product pages
│   ├── cart/            # Shopping cart
│   ├── checkout/        # Checkout flow
│   ├── orders/          # Order management
│   ├── services/        # Service pages
│   ├── blog/            # Blog pages
│   └── ...
├── components/           # React components
│   ├── home/            # Homepage components
│   ├── products/        # Product components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utilities & hooks
│   ├── hooks/           # Custom hooks
│   ├── api.ts           # API client
│   └── ...
└── public/               # Static assets
```

### **Tính Năng Chính**

#### 1. **E-commerce**
- Product catalog với categories
- Product detail pages với SEO
- Shopping cart
- Checkout với PayOS payment
- Order tracking
- Wishlist

#### 2. **Service Booking**
- Service catalog
- Service booking form
- Booking history
- Service orders

#### 3. **Content**
- Blog articles với categories
- Project portfolio
- Knowledge base
- SEO-optimized pages

#### 4. **User Features**
- User authentication (login/register)
- User profile
- Order history
- Payment history
- Chat support

#### 5. **UI/UX**
- Responsive design (mobile-first)
- Dark mode support
- Animations & transitions
- Loading states
- Error handling
- Toast notifications

### **API Integration**

- **API Client**: `lib/api.ts` - Centralized API client
- **Hooks**: Custom hooks cho data fetching (`use-products`, `use-orders`, etc.)
- **Proxy Routes**: Next.js API routes để proxy requests đến backend

### **SEO Features**

- ✅ Dynamic metadata
- ✅ Canonical URLs
- ✅ Sitemap generation
- ✅ Robots.txt
- ✅ Structured data
- ✅ Open Graph tags

---

## 📊 DASHBOARD (Next.js Admin Panel)

### **Công Nghệ & Stack**

- **Framework**: Next.js 16.0.6 (React 18.3.1)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Real-time**: Socket.IO Client
- **File Upload**: Cloudinary integration

### **Kiến Trúc**

```
dashboard/
├── app/
│   ├── api/             # API routes (proxy)
│   ├── dashboard/       # Dashboard pages
│   │   ├── products/   # Product management
│   │   ├── orders/     # Order management
│   │   ├── bookings/   # Booking management
│   │   ├── services/   # Service management
│   │   ├── analytics/  # Analytics dashboard
│   │   └── ...
│   ├── login/          # Admin login
│   └── ...
├── components/          # React components
│   ├── layout/         # Dashboard layout
│   ├── products/       # Product management
│   ├── orders/         # Order management
│   └── ui/             # UI components
├── lib/
│   ├── api-client.ts   # API client
│   └── ...
└── hooks/              # Custom hooks
```

### **Tính Năng Quản Lý**

#### 1. **Product Management**
- CRUD operations
- Category management
- Inventory management
- Stock alerts
- Bulk operations

#### 2. **Order Management**
- Order list & details
- Status updates
- Customer information
- Order editing
- Export functionality

#### 3. **Service Management**
- Service CRUD
- Service types
- Technician management
- Booking management
- Status tracking

#### 4. **Analytics & Reports**
- Dashboard analytics
- Revenue charts
- Sales reports
- Export (CSV, Excel, PDF)
- Real-time metrics

#### 5. **Content Management**
- Banner management
- Blog articles
- Projects
- Site settings
- SEO settings

#### 6. **User Management**
- User list & details
- Role management
- Customer management
- Activity logs

#### 7. **Support**
- Chat management
- Message handling
- Notification management
- Support tickets

### **Authentication**

- Admin login với JWT
- Admin API key authentication
- Protected routes
- Session management

### **API Client**

- Centralized API client (`lib/api-client.ts`)
- Error handling
- Token management
- Request interceptors

---

## 🔄 Luồng Dữ Liệu

### **Frontend → Backend**
1. Frontend gọi API qua `lib/api.ts`
2. Next.js API routes (proxy) nếu cần
3. Backend NestJS API (`/api/v1/*`)
4. Database (Prisma → PostgreSQL)

### **Dashboard → Backend**
1. Dashboard gọi API qua `lib/api-client.ts`
2. Next.js API routes (proxy) nếu cần
3. Backend NestJS API với Admin authentication
4. Database (Prisma → PostgreSQL)

### **Real-time Updates**
- Socket.IO connections
- Real-time notifications
- Live chat
- Order status updates

---

## 🔐 Authentication Flow

### **User Authentication**
1. Login → Backend `/api/v1/auth/login`
2. Backend trả về `accessToken` và `refreshToken`
3. Frontend lưu tokens vào localStorage
4. Mỗi request gửi `Authorization: Bearer {token}`
5. Token refresh khi hết hạn

### **Admin Authentication**
1. Admin login → Backend `/api/v1/auth/login`
2. Backend trả về tokens
3. Dashboard lưu tokens
4. Requests gửi kèm `X-Admin-Key` header (nếu có)

---

## 📦 Database Schema Highlights

### **Core Models**
- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Orders
- `order_items` - Order items
- `payments` - Payment records
- `services` - Services
- `service_types` - Service types
- `bookings` - Service bookings
- `technicians` - Technicians
- `inventory` - Stock inventory
- `inventory_movements` - Stock movements
- `blog_articles` - Blog posts
- `projects` - Portfolio projects
- `chat_conversations` - Chat conversations
- `chat_messages` - Chat messages
- `notifications` - Notifications
- `activity_logs` - Audit logs

---

## 🚀 Deployment

### **Backend**
- Port: 3010 (default)
- Environment: Node.js >= 20.x
- Database: PostgreSQL
- Redis: Caching & sessions

### **Frontend**
- Port: 3000 (default)
- Framework: Next.js
- Deployment: Vercel-ready

### **Dashboard**
- Port: 3001 (default)
- Framework: Next.js
- Deployment: Vercel-ready

---

## 📝 Environment Variables

### **Backend**
- `DATABASE_URL` - PostgreSQL connection
- `JWT_ACCESS_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `CORS_ORIGIN` - Allowed CORS origins
- `CLOUDINARY_URL` - Cloudinary configuration
- `REDIS_URL` - Redis connection
- `PAYOS_CLIENT_ID`, `PAYOS_API_KEY` - PayOS credentials
- `ADMIN_API_KEY` - Admin API key

### **Frontend**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SITE_URL` - Frontend URL
- `NEXT_PUBLIC_PAYOS_CLIENT_ID` - PayOS client ID

### **Dashboard**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_ADMIN_API_KEY` - Admin API key

---

## 🎯 Điểm Mạnh

### **Backend**
✅ Modular architecture (NestJS)
✅ Type-safe với TypeScript
✅ Comprehensive API documentation
✅ Real-time capabilities
✅ Robust error handling
✅ Performance optimizations
✅ Security best practices

### **Frontend**
✅ Modern Next.js App Router
✅ SEO-optimized
✅ Responsive design
✅ Great UX với animations
✅ Type-safe API integration

### **Dashboard**
✅ Comprehensive admin features
✅ Real-time updates
✅ Analytics & reporting
✅ User-friendly interface

---

## 🔧 Cải Thiện Đề Xuất

### **Backend**
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add API rate limiting per user
- [ ] Add request logging middleware
- [ ] Optimize database queries
- [ ] Add API versioning strategy
- [ ] Add GraphQL support (optional)

### **Frontend**
- [ ] Add E2E tests (Playwright)
- [ ] Optimize bundle size
- [ ] Add service worker (PWA)
- [ ] Improve error boundaries
- [ ] Add loading skeletons
- [ ] Optimize images

### **Dashboard**
- [ ] Add bulk operations
- [ ] Add advanced filters
- [ ] Add export templates
- [ ] Add audit trail UI
- [ ] Add user activity monitoring

---

## 📚 Tài Liệu Tham Khảo

- Backend API Docs: `/docs` hoặc `/api/v1/docs`
- Database Schema: `backend/prisma/schema.prisma`
- Frontend Components: `frontend/components/`
- Dashboard Components: `dashboard/components/`

---

**Tạo bởi**: AI Assistant  
**Ngày**: 2025-01-24  
**Phiên bản**: 1.0
