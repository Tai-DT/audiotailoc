# Audio Tài Lộc Backend - Architecture Documentation

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Module Structure](#module-structure)
4. [Data Flow](#data-flow)
5. [Database Schema](#database-schema)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Design](#api-design)
8. [Error Handling](#error-handling)
9. [Caching Strategy](#caching-strategy)
10. [Security Architecture](#security-architecture)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │  Dashboard   │  │  Mobile App  │      │
│  │(Next.js)     │  │  (Next.js)   │  │  (React)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────┬─────────────────────────────┘
                               │
                      ┌────────▼────────┐
                      │   API Gateway   │
                      │ (Express + CORS)│
                      │ (Rate Limiting) │
                      │ (Compression)   │
                      │ (Security)      │
                      └────────┬────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
   ┌────────────┐        ┌────────────┐        ┌────────────┐
   │ Auth Guard │        │ Pipes &    │        │ Interceptors
   │ & JWT      │        │ Validators │        │ & Filters
   └────────────┘        └────────────┘        └────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
          ┌────────────────────▼────────────────────┐
          │    NestJS Application (v1 API)          │
          │                                         │
          │  ┌──────────────────────────────────┐  │
          │  │  Feature Modules                 │  │
          │  │ ┌──────────────────────────────┐ │  │
          │  │ │ Auth | Users | Catalog      │ │  │
          │  │ │ Cart | Orders | Payments    │ │  │
          │  │ │ Services | Bookings | Blog  │ │  │
          │  │ │ Admin | Analytics | Support │ │  │
          │  │ └──────────────────────────────┘ │  │
          │  │                                  │  │
          │  │  ┌─────────────────────────────┐ │  │
          │  │  │ Services (Business Logic)   │ │  │
          │  │  │ Controllers (Request Handlers)
          │  │  │ DTOs (Data Validation)      │ │  │
          │  │  └─────────────────────────────┘ │  │
          │  └──────────────────────────────────┘  │
          └────────────┬───────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │  Prisma    │ │   Redis    │ │  External  │
   │   Service  │ │   Cache    │ │  Services  │
   └────────────┘ └────────────┘ └────────────┘
        │              │              │
        ▼              ▼              ▼
   PostgreSQL    Redis Cloud    Payment Providers
   (Aiven)      (Upstash)       Email Service
                                Google AI API
                                Maps API
```

### Deployment Architecture

```
┌──────────────────────────────────────────────────┐
│            Load Balancer (ALB)                    │
│            HTTPS Termination                      │
│            SSL/TLS Certificates                   │
└─────────────────────┬──────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ ECS     │  │ ECS     │  │ ECS     │
   │ Instance│  │ Instance│  │ Instance│ (Auto-scaling)
   │ (Backend)  │ (Backend)  │ (Backend)
   └─────────┘  └─────────┘  └─────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   PostgreSQL    Redis Cluster  S3 Buckets
   (AWS RDS)    (ElastiCache)   (File Storage)
```

---

## Technology Stack

### Core Framework
- **NestJS 10.4.0** - Progressive Node.js framework
- **Express.js** - Underlying HTTP server
- **TypeScript 5.1** - Type-safe development

### Database & ORM
- **PostgreSQL 15** - Primary relational database
- **Prisma 6.16** - Next-generation ORM
- **Prisma Accelerate** - Connection pooling and caching

### Authentication & Security
- **JWT (JSON Web Tokens)** - Token-based authentication
- **bcryptjs** - Password hashing
- **Helmet** - HTTP security headers
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Express rate-limit

### Caching
- **Redis** - In-memory data store
- **NestJS Cache Manager** - Caching abstraction
- **Upstash** - Managed Redis service

### File Storage & CDN
- **Cloudinary** - Image hosting and transformation
- **AWS S3** - File backup and storage

### Payment Processing
- **PayOS** - Vietnamese payment gateway
- **VNPay** - Payment processor
- **MoMo** - Mobile payment

### Additional Services
- **Nodemailer** - Email delivery
- **Axios** - HTTP client
- **Socket.io** - Real-time communication (optional)
- **prom-client** - Prometheus metrics
- **Pino** - Structured logging

### Development Tools
- **Jest** - Unit testing framework
- **Supertest** - HTTP assertion library
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Swagger/OpenAPI** - API documentation

---

## Module Structure

### Core Modules

```
Backend Application
│
├── Auth Module
│   ├── Controllers: Authentication endpoints
│   ├── Services: JWT, password validation
│   ├── Guards: JWT verification, Admin check
│   └── DTOs: Login, Register, RefreshToken
│
├── Users Module
│   ├── User management and profiles
│   ├── Change password functionality
│   ├── User roles and permissions
│   └── Activity logging
│
├── Shared Module
│   ├── Common utilities
│   ├── Database service (Prisma)
│   ├── Cache service (Redis)
│   └── Shared DTOs and constants
│
└── Admin Module
    ├── Dashboard statistics
    ├── System configuration
    ├── User management
    └── Analytics and reporting
```

### E-Commerce Modules

```
E-Commerce System
│
├── Catalog Module
│   ├── Products CRUD operations
│   ├── Categories management
│   ├── Search and filtering
│   ├── Product reviews
│   └── Featured products
│
├── Cart Module
│   ├── Add/remove items
│   ├── Update quantities
│   ├── Cart calculations
│   └── Guest carts
│
├── Orders Module
│   ├── Order creation
│   ├── Order tracking
│   ├── Status management
│   └── Order history
│
├── Payments Module
│   ├── Payment intent creation
│   ├── Payment confirmation
│   ├── Transaction tracking
│   ├── Refund handling
│   └── Multiple payment providers
│
├── Inventory Module
│   ├── Stock management
│   ├── Low stock alerts
│   ├── Inventory movements
│   └── Inventory reports
│
├── Wishlist Module
│   ├── Add/remove from wishlist
│   ├── Wishlist retrieval
│   └── Share wishlist
│
└── Promotions Module
    ├── Coupon management
    ├── Discount calculation
    ├── Promotional campaigns
    └── Usage tracking
```

### Service Management Modules

```
Service Management
│
├── Services Module
│   ├── Service catalog
│   ├── Service details
│   ├── Service types
│   └── Pricing management
│
├── Booking Module
│   ├── Service bookings
│   ├── Booking status tracking
│   ├── Schedule management
│   └── Booking notifications
│
├── Technicians Module
│   ├── Technician profiles
│   ├── Availability scheduling
│   ├── Specializations
│   └── Performance metrics
│
└── Service Payments Module
    ├── Service payment processing
    ├── Payment tracking
    └── Service invoicing
```

### Content & Marketing Modules

```
Content Management
│
├── Blog Module
│   ├── Article creation
│   ├── Categories
│   ├── Comments
│   └── SEO optimization
│
├── Site Module
│   ├── Site banners
│   ├── Pages management
│   ├── Settings
│   └── Testimonials
│
├── Projects Module
│   ├── Portfolio projects
│   ├── Project showcase
│   └── Case studies
│
├── Marketing Module
│   ├── Campaigns management
│   ├── Email templates
│   ├── Newsletter subscriptions
│   └── Marketing analytics
│
└── Analytics Module
    ├── User analytics
    ├── Traffic tracking
    ├── Revenue reporting
    └── Conversion metrics
```

### Support & Infrastructure Modules

```
Support & Infrastructure
│
├── Support Module
│   ├── Customer questions
│   ├── Support tickets
│   └── Knowledge base
│
├── Notifications Module
│   ├── Push notifications
│   ├── Email notifications
│   ├── In-app notifications
│   └── Notification preferences
│
├── Webhooks Module
│   ├── Webhook management
│   ├── Event delivery
│   └── Retry logic
│
├── Files Module
│   ├── File upload
│   ├── File storage
│   ├── Image processing
│   └── Media management
│
├── Backup Module
│   ├── Automatic backups
│   ├── Backup scheduling
│   ├── Restore functionality
│   └── Backup verification
│
├── Health Module
│   ├── Health checks
│   ├── Status endpoints
│   └── Dependency checks
│
└── Monitoring Module
    ├── Performance metrics
    ├── Error tracking
    ├── Request logging
    └── Alert configuration
```

---

## Data Flow

### Request/Response Flow

```
Client Request
    │
    ▼
┌─────────────────────────────────────┐
│  Express Middleware Stack           │
│  ├── Body Parser                    │
│  ├── CORS                           │
│  ├── Compression                    │
│  ├── Helmet (Security)              │
│  ├── Rate Limiting                  │
│  └── Logging                        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Global Pipes                       │
│  ├── ValidationPipe (DTO validation)│
│  └── TransformPipe                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Route Matching                     │
│  ├── Find matching controller route │
│  └── Extract route parameters       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Execution Pipeline                 │
│  ├── AuthGuard (if required)        │
│  ├── CustomGuards                   │
│  ├── Controller Method              │
│  ├── Service Methods                │
│  ├── Database Queries (Prisma)      │
│  └── External API Calls             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Interceptors (Post-Processing)     │
│  ├── Response Transform             │
│  ├── Logging                        │
│  └── Caching                        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Error Handling                     │
│  ├── Exception Filter               │
│  ├── Error Formatting               │
│  └── Error Logging                  │
└──────────────┬──────────────────────┘
               │
               ▼
Client Response (JSON)
```

### Authentication Flow

```
User Login Request
    │
    ├─ POST /auth/login
    │   ├─ Email & Password
    │   └─ Content-Type: application/json
    │
    ▼
AuthController.login()
    │
    ├─ Call AuthService.login()
    │
    ▼
AuthService.login()
    │
    ├─ Find user by email
    │   └─ Prisma query: user.findUnique()
    │
    ├─ Verify password
    │   └─ bcryptjs.compare()
    │
    ├─ Generate tokens
    │   ├─ AccessToken (15 minutes)
    │   └─ RefreshToken (7 days)
    │
    └─ Return tokens to client
        │
        ├─ Access Token
        │   └─ Stored in memory/localStorage
        │
        └─ Refresh Token
            └─ Stored in secure HTTP-only cookie

Subsequent Requests with Access Token
    │
    ├─ Authorization: Bearer <accessToken>
    │
    ▼
JwtGuard
    │
    ├─ Extract token from header
    ├─ Verify signature
    ├─ Check expiration
    └─ Extract user data
        │
        ▼
Request continues with user context
```

### Database Query Flow

```
Controller Method
    │
    ▼
Service Method
    │
    ├─ Check Cache (Redis)
    │   ├─ If hit → Return cached data
    │   └─ If miss → Continue to DB
    │
    ▼
Prisma Query
    │
    ├─ Query builder
    ├─ Include relations if needed
    ├─ Apply filters/sorting
    └─ Send to PostgreSQL
        │
        ▼
    PostgreSQL
        │
        ├─ Parse query
        ├─ Execute with indexes
        ├─ Fetch results
        └─ Return to Prisma
            │
            ▼
    Prisma
        │
        ├─ Parse results
        ├─ Transform to model instances
        └─ Return to Service
            │
            ▼
    Service
        │
        ├─ Cache result (if applicable)
        ├─ Transform/format data
        └─ Return to Controller
            │
            ▼
    Controller
        │
        ├─ Format response
        ├─ Add metadata
        └─ Send to client
```

---

## Database Schema

### Core Models

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │ (CUID)
│ email       │ (Unique)
│ password    │ (Hashed)
│ name        │
│ phone       │
│ role        │ (ENUM: USER, ADMIN)
│ createdAt   │
│ updatedAt   │
│
│ Relations:  │
│ - carts     │
│ - orders    │
│ - reviews   │
│ - projects  │
│ - bookings  │
│ - etc...    │
└─────────────┘
```

### E-Commerce Schema

```
Product ◄─── Category
  ├─── CartItem
  ├─── OrderItem
  ├─── ProductReview
  ├─── ProductView
  ├─── Inventory
  ├─── InventoryMovement
  ├─── InventoryAlert
  └─── WishlistItem

Cart
  └─── CartItem ──► Product

Order
  ├─── OrderItem ──► Product
  ├─── Payment
  ├─── PaymentIntent
  └─── User

Payment ◄─── PaymentIntent
  └─── Refund
```

### Service Management Schema

```
Service ◄─── ServiceType
  ├─── ServiceBooking
  ├─── ServiceView
  ├─── ServiceItem
  └─── ServicePayment

ServiceBooking
  ├─── ServiceBookingItem ──► ServiceItem
  ├─── ServicePayment
  ├─── ServiceStatusHistory
  ├─── Technician
  └─── User

Technician
  ├─── ServiceBooking
  └─── TechnicianSchedule
```

### Content Schema

```
Blog Structure:
blog_articles ◄─── blog_categories
  ├─── blog_comments
  ├─── User (author)
  └─── ProductReview

Project
  └─── User (owner)

Page
Newsletter_subscriptions
Policies
Testimonials
Banners
```

---

## Authentication & Authorization

### JWT Token Structure

```
AccessToken (15 minutes):
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1699776600,
  "exp": 1699777500
}

RefreshToken (7 days):
{
  "sub": "user_id",
  "type": "refresh",
  "iat": 1699776600,
  "exp": 1705875600
}
```

### Guard Hierarchy

```
Request
  │
  ├─ Public Routes (no guard)
  │   ├─ GET /products
  │   ├─ GET /services
  │   ├─ POST /auth/login
  │   └─ POST /auth/register
  │
  ├─ Protected Routes (JwtGuard)
  │   ├─ GET /users/me
  │   ├─ POST /cart/items
  │   ├─ POST /orders
  │   └─ GET /bookings
  │
  └─ Admin Routes (JwtGuard + AdminGuard)
      ├─ POST /products (create)
      ├─ PUT /products/:id (update)
      ├─ DELETE /products/:id
      ├─ GET /admin/dashboard
      ├─ GET /analytics
      └─ POST /users (manage users)
```

### Role-Based Access Control

```
Roles:
  ├─ USER (default)
  │   └─ Can browse products
  │   └─ Can create orders
  │   └─ Can manage personal cart
  │   └─ Can leave reviews
  │
  ├─ ADMIN
  │   └─ All USER permissions
  │   └─ Can manage products
  │   └─ Can manage services
  │   └─ Can view analytics
  │   └─ Can manage users
  │   └─ Can manage content
  │
  └─ TECHNICIAN (future)
      └─ Can view assigned bookings
      └─ Can update booking status
      └─ Can view schedule
```

---

## API Design

### RESTful Principles

```
Resource: /products

GET    /products           → List all products
GET    /products/:id       → Get product details
POST   /products           → Create product (admin)
PUT    /products/:id       → Update product (admin)
DELETE /products/:id       → Delete product (admin)

Query Parameters:
GET /products?page=1&limit=20&sort=-createdAt&search=audio

Nested Resources:
GET /products/:id/reviews           → Product reviews
GET /orders/:id/items               → Order items
POST /bookings/:id/payments         → Booking payment
```

### Response Standards

```
Success Response (200, 201):
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { /* payload */ },
  "pagination": { /* if applicable */ },
  "timestamp": "2024-11-12T10:30:00Z"
}

Error Response (400, 401, 404, etc.):
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": ["Specific error 1", "Specific error 2"],
  "timestamp": "2024-11-12T10:30:00Z"
}
```

---

## Error Handling

### Exception Hierarchy

```
HttpException (Base)
  ├─ BadRequestException (400)
  │   └─ Invalid input
  ├─ UnauthorizedException (401)
  │   └─ Authentication failed
  ├─ ForbiddenException (403)
  │   └─ Insufficient permissions
  ├─ NotFoundException (404)
  │   └─ Resource not found
  ├─ ConflictException (409)
  │   └─ Duplicate resource
  ├─ UnprocessableEntityException (422)
  │   └─ Validation errors
  └─ InternalServerErrorException (500)
      └─ Server errors
```

### Custom Exception Filters

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Format error response
    // Log error
    // Send response
  }
}
```

---

## Caching Strategy

### Cache Layers

```
Level 1: Application Level (Memory)
  ├─ HTTP response caching
  ├─ Service method results
  └─ TTL: 5-60 seconds

Level 2: Redis Cache
  ├─ Session data
  ├─ Frequently accessed data (products, categories)
  ├─ User preferences
  └─ TTL: 1 hour - 7 days

Level 3: Database Query Cache (Prisma Accelerate)
  ├─ Query results caching
  ├─ Automatic invalidation
  └─ Transparent to application
```

### Cache Invalidation

```
On data updates:
  ├─ Delete affected cache keys
  ├─ Clear related caches
  ├─ Set cache max-age to 0
  └─ Rebuild cache on next request

Cache Keys:
  product:{id}
  category:{id}
  user:{id}:preferences
  popular-products
  featured-services
```

---

## Security Architecture

### Authentication Security

```
Password Security:
  ├─ Bcrypt with 10+ rounds
  ├─ Minimum 8 characters
  ├─ Must contain: uppercase, lowercase, number, special char
  ├─ Rate limit login attempts
  └─ Account lockout after 5 failed attempts

Token Security:
  ├─ HS256 signing algorithm
  ├─ Strong secret keys (32+ chars)
  ├─ Short access token expiry (15 min)
  ├─ Longer refresh token (7 days)
  ├─ Store refresh token in HTTP-only cookie
  └─ Implement token rotation
```

### Network Security

```
HTTPS/TLS:
  ├─ All endpoints HTTPS only
  ├─ TLS 1.2 or higher
  ├─ Strong cipher suites
  └─ HSTS enabled

CORS:
  ├─ Specific origin whitelist
  ├─ Specific methods (GET, POST, PUT, DELETE)
  ├─ Specific headers allowed
  └─ Credentials: true only for same-origin

Rate Limiting:
  ├─ 1000 requests per 15 minutes per IP
  ├─ Different limits for different endpoints
  └─ Exponential backoff on repeated violations
```

### Data Security

```
Database:
  ├─ SSL connections required
  ├─ Encryption at rest
  ├─ Regular backups
  ├─ Minimal privileges for users
  └─ SQL injection prevention (ORM)

File Storage:
  ├─ Cloudinary CDN
  ├─ Signed URLs with expiry
  ├─ Access control per user
  └─ Virus scanning

Secrets Management:
  ├─ Environment variables only
  ├─ Never in source code
  ├─ Different secrets per environment
  ├─ Rotation schedule
  └─ AWS Secrets Manager / Vault
```

### Input Validation

```
DTOs with class-validator:
  ├─ Type checking
  ├─ Length validation
  ├─ Format validation (email, URL)
  ├─ Whitelist/Blacklist
  └─ Custom validators

Request Size Limits:
  ├─ JSON body: 2MB
  ├─ URL encoded: 2MB
  ├─ File uploads: 50MB
  └─ Parameter count: 10000 max
```

---

## Performance Considerations

### Database Optimization

```
Indexes:
  ├─ Primary keys (id)
  ├─ Foreign keys
  ├─ Frequently filtered columns (featured, isActive)
  ├─ Sorted columns (createdAt)
  └─ Combined indexes for common queries

Query Optimization:
  ├─ Use select() to fetch only needed fields
  ├─ Eager loading with include()
  ├─ Pagination for large result sets
  ├─ Avoid N+1 queries
  └─ Use transactions for consistency
```

### Response Optimization

```
Compression:
  ├─ gzip compression enabled
  ├─ Threshold: 1KB
  ├─ Level: 6 (balance speed/ratio)
  └─ Exclude: already compressed (images, videos)

Pagination:
  ├─ Default: 20 items per page
  ├─ Maximum: 100 items per page
  └─ Cursor-based pagination for large datasets

Caching:
  ├─ HTTP cache headers
  ├─ ETags for conditional requests
  └─ Cache-Control max-age
```

---

## Scalability

### Horizontal Scaling

```
Load Balancer
    │
    ├─ Backend Instance 1
    ├─ Backend Instance 2
    ├─ Backend Instance 3
    └─ Backend Instance N

Shared Resources:
    ├─ PostgreSQL RDS
    ├─ Redis Cluster
    └─ S3/Cloudinary
```

### Session Management

```
Stateless API:
  ├─ All data in JWT token
  ├─ No server-side sessions
  ├─ Can scale horizontally
  └─ Any instance can handle request
```

---

## Monitoring & Observability

### Logging

```
Structured Logging (Pino):
  ├─ Timestamp
  ├─ Log level (debug, info, warn, error)
  ├─ Logger name
  ├─ Message
  ├─ Context data
  └─ Stack trace (for errors)

Log Aggregation:
  ├─ CloudWatch (AWS)
  ├─ ELK Stack (optional)
  └─ Query and search logs
```

### Metrics

```
Prometheus Metrics:
  ├─ Request count
  ├─ Request duration
  ├─ Error rate
  ├─ Database connection pool
  ├─ Cache hit rate
  └─ Memory usage
```

### Alerts

```
Alert Conditions:
  ├─ Error rate > 1%
  ├─ Response time > 500ms
  ├─ Database connection pool full
  ├─ API health check failed
  ├─ Disk space < 10%
  └─ Memory usage > 80%
```

---

## Future Architecture Improvements

1. **Microservices** - Break into separate services
2. **Event-Driven** - Message queue (RabbitMQ, Kafka)
3. **GraphQL** - Add GraphQL API alongside REST
4. **WebSockets** - Real-time features
5. **Search** - MeiliSearch integration
6. **Machine Learning** - Recommendation engine
7. **Blockchain** - Loyalty program

---

## Architecture Decision Records (ADRs)

### ADR-1: NestJS Framework

**Decided:** Use NestJS for backend framework

**Rationale:**
- TypeScript first-class support
- Built-in dependency injection
- Modular architecture
- Active community
- Production-ready

### ADR-2: PostgreSQL + Prisma

**Decided:** Use PostgreSQL with Prisma ORM

**Rationale:**
- Type-safe queries
- Auto-generated migrations
- Developer experience
- Studio for data visualization
- Great TypeScript support

### ADR-3: JWT Authentication

**Decided:** Use JWT for stateless authentication

**Rationale:**
- Scalable across instances
- No session storage needed
- Works well with SPAs
- Standard and well-tested

### ADR-4: Redis Caching

**Decided:** Use Redis for caching and sessions

**Rationale:**
- Fast in-memory store
- Key-value flexibility
- Pub/Sub capabilities
- Managed services available
- Excellent Node.js integration

---

## References

- [NestJS Architecture](https://docs.nestjs.com)
- [Prisma Data Guide](https://www.prisma.io/dataguide)
- [REST API Best Practices](https://restfulapi.net)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance.html)
