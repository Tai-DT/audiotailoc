# Quick Reference Guide

## 📱 Project Overview

**Audio Tài Lộc** - E-commerce platform for professional audio equipment

### Three Main Parts
1. **Backend** (NestJS) - API Server
2. **Frontend** (Next.js) - Customer Website
3. **Dashboard** (Next.js) - Admin Management

---

## 🏗️ Backend Structure (40+ Modules)

### Core Modules
| Module | Purpose | Key Endpoints |
|--------|---------|---------------|
| **auth** | Authentication | POST /auth/login, /auth/register |
| **users** | User management | GET/POST/PUT /users |
| **admin** | Admin functions | GET/POST /admin/users |

### E-Commerce Modules
| Module | Purpose | Key Endpoints |
|--------|---------|---------------|
| **catalog** | Products | GET /catalog/products |
| **cart** | Shopping cart | GET/POST /cart |
| **checkout** | Order validation | POST /checkout/validate |
| **orders** | Order management | GET/POST /orders |
| **payments** | Payment processing | POST /payments/process |
| **inventory** | Stock management | GET/PUT /inventory |
| **wishlist** | Favorites | GET/POST /wishlist |
| **promotions** | Discounts | GET /promotions |

### Feature Modules
| Module | Purpose |
|--------|---------|
| **reviews** | Product reviews & ratings |
| **services** | Technical services |
| **booking** | Service appointments |
| **blog** | Blog management |
| **projects** | Portfolio projects |
| **search** | Full-text search |
| **analytics** | Data analysis |
| **ai** | AI recommendations |
| **realtime** | WebSocket updates |
| **notifications** | Email/push alerts |
| **support** | Customer support |
| **chat** | Real-time messaging |
| **files** | File uploads |
| **backup** | Data backup |

---

## 🎨 Frontend Pages (30+)

### E-Commerce
- `/` - Home
- `/products` - Product list
- `/products/[slug]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/order-success` - Confirmation
- `/orders` - Order history
- `/wishlist` - Favorites

### Services
- `/services` - Service list
- `/service-booking` - Book service
- `/booking-history` - Booking history

### Content
- `/blog` - Blog list
- `/blog/[slug]` - Blog post
- `/projects` - Portfolio
- `/danh-muc` - Categories

### Support
- `/contact` - Contact form
- `/support` - Support tickets
- `/knowledge-base` - FAQ/Guides
- `/technical-support` - Tech help

### User
- `/login` - Sign in
- `/register` - Sign up
- `/profile` - User profile

### Policies
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/warranty` - Warranty info
- `/shipping-policy` - Shipping info
- `/return-policy` - Return policy

---

## 📊 Dashboard Pages (27+)

### Management
| Page | Purpose |
|------|---------|
| `/dashboard` | Overview |
| `/dashboard/analytics` | Sales analytics |
| `/dashboard/orders` | Order management |
| `/dashboard/products` | Product management |
| `/dashboard/customers` | Customer management |
| `/dashboard/reviews` | Review management |
| `/dashboard/promotions` | Promotion management |
| `/dashboard/reports` | Reports |
| `/dashboard/settings` | Configuration |
| `/dashboard/users` | User management |
| `/dashboard/blog` | Blog management |
| `/dashboard/inventory` | Stock management |
| `/dashboard/support` | Support tickets |
| `/dashboard/chat` | Chat |

---

## 🔄 Main Data Flows

### 1. Purchase Flow
```
Browse → Add to Cart → Checkout → Payment → Order Created → Admin Notified
```

### 2. Review Flow
```
Submit Review → Pending → Admin Approves → Display on Product
```

### 3. Service Booking Flow
```
Browse Services → Select Date/Time → Book → Admin Assigns Technician → Completion
```

### 4. Real-time Updates
```
Database Change → WebSocket Event → Dashboard/Frontend Updated
```

---

## 🔐 Authentication

### Login Flow
```
1. User enters email/password
2. Backend validates credentials
3. Backend returns JWT token
4. Frontend stores token
5. Frontend sends token with requests
```

### Protected Endpoints
- Admin endpoints: `@UseGuards(AdminOrKeyGuard)`
- User endpoints: JWT required
- Public endpoints: No auth

---

## 📦 Database Tables

```
Users
├── id, email, password, name, role

Products
├── id, name, description, price, stock, category

Orders
├── id, userId, items, status, totalPrice, shippingAddress

Reviews
├── id, productId, userId, rating, comment, status

Payments
├── id, orderId, amount, status, method

Inventory
├── id, productId, quantity, warehouseLocation

Services
├── id, name, description, price

Bookings
├── id, userId, serviceId, date, time, status

Messages
├── id, senderId, receiverId, content, timestamp
```

---

## 🚀 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | NestJS, TypeScript, Prisma |
| **Database** | PostgreSQL |
| **Cache** | Redis |
| **Frontend** | Next.js, React, TailwindCSS |
| **Dashboard** | Next.js, shadcn/ui |
| **Real-time** | Socket.io |
| **Auth** | JWT, Passport |
| **Payment** | PayOS |
| **File Storage** | Cloud Storage |
| **SEO** | Next.js, Structured Data |

---

## 📡 API Endpoints Summary

### Products
```
GET    /catalog/products              - List products
GET    /catalog/products/:id          - Get product
POST   /catalog/products              - Create (admin)
PUT    /catalog/products/:id          - Update (admin)
DELETE /catalog/products/:id          - Delete (admin)
```

### Orders
```
GET    /orders                        - List orders
GET    /orders/:id                    - Get order
POST   /orders                        - Create order
PATCH  /orders/:id                    - Update order
PATCH  /orders/:id/status/:status     - Update status
DELETE /orders/:id                    - Delete order
```

### Reviews
```
GET    /reviews                       - List reviews
GET    /reviews/:id                   - Get review
POST   /reviews                       - Create review
PUT    /reviews/:id                   - Update review
DELETE /reviews/:id                   - Delete review
PATCH  /reviews/:id/status/:status    - Approve/Reject
PATCH  /reviews/:id/helpful/:helpful  - Mark helpful
GET    /reviews/stats/summary         - Get stats
```

### Cart
```
GET    /cart                          - Get cart
POST   /cart/items                    - Add item
PUT    /cart/items/:itemId            - Update item
DELETE /cart/items/:itemId            - Remove item
DELETE /cart                          - Clear cart
```

### Checkout
```
POST   /checkout/validate             - Validate order
POST   /checkout/calculate-shipping   - Calculate shipping
POST   /checkout/apply-coupon         - Apply coupon
GET    /checkout/summary              - Get summary
```

### Payments
```
POST   /payments/process              - Process payment
POST   /payments/confirm              - Confirm payment
GET    /payments/:id                  - Get payment
POST   /payments/refund/:id           - Refund payment
```

### Services
```
GET    /services                      - List services
GET    /services/:id                  - Get service
POST   /services                      - Create (admin)
PUT    /services/:id                  - Update (admin)
DELETE /services/:id                  - Delete (admin)
```

### Bookings
```
GET    /booking                       - List bookings
GET    /booking/:id                   - Get booking
POST   /booking                       - Create booking
PUT    /booking/:id                   - Update booking
DELETE /booking/:id                   - Cancel booking
PATCH  /booking/:id/status/:status    - Update status
```

### Authentication
```
POST   /auth/login                    - Login
POST   /auth/register                 - Register
POST   /auth/refresh                  - Refresh token
POST   /auth/logout                   - Logout
GET    /auth/verify                   - Verify token
```

---

## 🎯 Key Features

### Backend
- 40+ modules
- RESTful API
- JWT authentication
- Real-time WebSocket
- Redis caching
- Comprehensive logging
- Health monitoring
- Backup system

### Frontend
- 30+ pages
- E-commerce complete
- Service booking
- Blog & portfolio
- Knowledge base
- SEO optimized
- Responsive design
- Real-time updates

### Dashboard
- 27+ management pages
- Real-time updates
- Analytics & reports
- Bulk operations
- Data export
- User management
- Role-based access

---

## 🔧 Common Tasks

### Add New Product
1. Dashboard → Products → Add Product
2. Fill product details
3. Upload images
4. Set price & stock
5. Save

### Create Order (Admin)
1. Dashboard → Orders → New Order
2. Select customer
3. Add products
4. Set shipping address
5. Create order

### Approve Review
1. Dashboard → Reviews
2. Click pending review
3. Read review
4. Click Approve/Reject
5. Save

### Create Promotion
1. Dashboard → Promotions → New
2. Set discount type & value
3. Select products
4. Set dates
5. Save

### Manage Inventory
1. Dashboard → Inventory
2. View stock levels
3. Adjust quantity
4. Set low stock alerts
5. Save

---

## 📈 Metrics Tracked

- **Sales**: Revenue, orders, AOV
- **Products**: Top sellers, low stock
- **Customers**: New, repeat, LTV
- **Reviews**: Rating, count, approval rate
- **Traffic**: Page views, sessions, bounce rate

---

## 🔗 Important Files

### Backend
- `/backend/src/modules/app.module.ts` - Main module
- `/backend/src/modules/*/controller.ts` - API endpoints
- `/backend/src/modules/*/service.ts` - Business logic
- `/backend/prisma/schema.prisma` - Database schema

### Frontend
- `/frontend/app/layout.tsx` - Root layout
- `/frontend/app/page.tsx` - Home page
- `/frontend/components/` - Reusable components
- `/frontend/hooks/` - Custom hooks

### Dashboard
- `/dashboard/app/layout.tsx` - Root layout
- `/dashboard/app/dashboard/` - Dashboard pages
- `/dashboard/components/` - Dashboard components

---

## 📚 Documentation Files

Created in root directory:
- `ARCHITECTURE_ANALYSIS.md` - Complete architecture overview
- `MODULES_DETAILED.md` - Detailed module documentation
- `FRONTEND_DASHBOARD_GUIDE.md` - Frontend & Dashboard guide
- `DATA_FLOW_INTEGRATION.md` - Data flows & integration
- `QUICK_REFERENCE.md` - This file

---

## 🆘 Support

For questions about specific modules, refer to:
1. **ARCHITECTURE_ANALYSIS.md** - Overview of all modules
2. **MODULES_DETAILED.md** - Detailed module information
3. **FRONTEND_DASHBOARD_GUIDE.md** - Frontend & Dashboard pages
4. **DATA_FLOW_INTEGRATION.md** - How data flows through system
