# Audio Tài Lộc - Flow Chi Tiết Backend, Frontend và Dashboard

## 📋 Tổng Quan Hệ Thống

### Kiến Trúc
- **Backend**: NestJS API Server (Port 3010)
- **Dashboard**: Next.js Admin Panel (Port 3001)
- **Frontend**: (Có thể có hoặc tích hợp trong Dashboard)

---

## 🔄 Flow Backend (NestJS)

### 1. Khởi Động Backend
```
1. Load Environment Variables (.env)
2. Validate Required Env Vars (DATABASE_URL, JWT_SECRETS)
3. Initialize NestJS Application
4. Setup Middleware:
   - Compression
   - Helmet (Security)
   - CORS
   - Body Parser (JSON, URL Encoded)
5. Setup Global Pipes:
   - ValidationPipe
   - Transform Interceptor
   - Exception Filters
6. Initialize Prisma Client
7. Setup Swagger Documentation (/docs)
8. Start Server on Port 3010
```

### 2. Request Flow
```
Request → CORS Middleware → Helmet → Compression → 
Body Parser → Route Handler → Controller → Service → 
Prisma → Database → Response → Transform → Client
```

### 3. Module Structure
```
app.module.ts
├── ConfigModule (Global)
├── CacheModule (Global)
├── PrismaModule (Global)
├── HealthModule
├── AuthModule
│   ├── Login
│   ├── Register
│   ├── Refresh Token
│   └── Logout
├── UsersModule
│   ├── CRUD Users
│   ├── Profile Management
│   └── Permissions
├── CatalogModule
│   ├── Products CRUD
│   ├── Categories
│   └── Search
├── OrdersModule
│   ├── Create Order
│   ├── Order Status
│   └── Order History
├── PaymentsModule
│   ├── Payment Processing
│   └── Payment Status
├── PromotionsModule
│   ├── Promotion CRUD
│   ├── Apply Promotion
│   └── Promotion Analytics
├── CartModule
├── CheckoutModule
├── NotificationsModule
├── BackupModule
└── ... (Other Modules)
```

### 4. API Endpoints Flow

#### Authentication Flow
```
POST /api/v1/auth/login
  → Validate credentials
  → Generate JWT tokens (access + refresh)
  → Return tokens + user info

POST /api/v1/auth/refresh
  → Validate refresh token
  → Generate new access token
  → Return new token

POST /api/v1/auth/logout
  → Invalidate refresh token
  → Clear session
```

#### Product Flow
```
GET /api/v1/products
  → Query params: page, limit, category, search
  → Prisma query with filters
  → Return paginated products

POST /api/v1/products
  → Validate DTO
  → Upload images (Cloudinary)
  → Create product in DB
  → Return created product

PUT /api/v1/products/:id
  → Validate DTO
  → Update product
  → Return updated product

DELETE /api/v1/products/:id
  → Soft delete (isDeleted flag)
  → Return success
```

#### Order Flow
```
POST /api/v1/orders
  → Validate cart items
  → Calculate totals
  → Apply promotions
  → Create order
  → Process payment
  → Update inventory
  → Send notifications
  → Return order details

GET /api/v1/orders/:id
  → Fetch order with relations
  → Return order details

PUT /api/v1/orders/:id/status
  → Update order status
  → Trigger status-specific actions
  → Return updated order
```

---

## 🎨 Flow Dashboard (Next.js)

### 1. Khởi Động Dashboard
```
1. Load Environment Variables
2. Initialize Next.js App
3. Setup API Client (axios)
4. Setup Auth Context
5. Setup Socket.IO (if needed)
6. Start Dev Server on Port 3001
```

### 2. Page Flow

#### Authentication Flow
```
/login
  → Login Form
  → POST /api/v1/auth/login
  → Store tokens (localStorage/cookies)
  → Redirect to /dashboard

/dashboard
  → Protected Route
  → Check Auth Token
  → Load Dashboard Data
  → Render Dashboard
```

#### Dashboard Pages Flow
```
/dashboard
  ├── Overview (Analytics, Stats)
  ├── /products
  │   ├── List Products
  │   ├── Create Product
  │   ├── Edit Product
  │   └── Delete Product
  ├── /orders
  │   ├── List Orders
  │   ├── Order Details
  │   └── Update Status
  ├── /customers
  │   ├── List Customers
  │   └── Customer Details
  ├── /promotions
  │   ├── List Promotions
  │   ├── Create Promotion
  │   └── Apply Promotion
  ├── /inventory
  │   └── Stock Management
  ├── /analytics
  │   └── Reports & Charts
  └── /settings
      └── System Settings
```

### 3. Component Flow
```
Page Component
  → Fetch Data (useQuery/useEffect)
  → Display Loading State
  → Render Data Table/List
  → Handle Actions (Create/Edit/Delete)
  → Show Success/Error Messages
```

### 4. API Integration Flow
```
Dashboard Component
  → Call API Hook (useApi)
  → API Client (lib/api-client.ts)
  → HTTP Request (axios)
  → Backend API (Port 3010)
  → Response Handling
  → Update UI State
```

---

## 🔍 Flow Kiểm Tra và Sửa Lỗi

### 1. Kiểm Tra Backend

#### Build & Type Check
```bash
cd backend
npm run typecheck        # TypeScript type checking
npm run build            # Build production
npm run lint             # ESLint check
```

#### Test API Endpoints
```bash
# Health Check
curl http://localhost:3010/health

# Swagger Docs
open http://localhost:3010/docs

# Test Authentication
curl -X POST http://localhost:3010/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

#### Database Check
```bash
cd backend
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma Client
```

### 2. Kiểm Tra Dashboard

#### Build & Type Check
```bash
cd dashboard
npm run build            # Build production
npm run lint             # ESLint check
```

#### Test Pages
```bash
# Start Dev Server
npm run dev

# Check Pages
- http://localhost:3001/login
- http://localhost:3001/dashboard
- http://localhost:3001/dashboard/products
```

### 3. Flow Sửa Lỗi

#### TypeScript Errors
```
1. Run typecheck: npm run typecheck
2. Identify error file and line
3. Check Prisma schema vs code usage
4. Fix field naming (snake_case vs camelCase)
5. Comment out non-existent relations
6. Re-run typecheck
```

#### API Errors
```
1. Check backend logs
2. Verify endpoint exists
3. Check request/response format
4. Verify authentication
5. Check database connection
6. Test with Postman/curl
```

#### Frontend Errors
```
1. Check browser console
2. Verify API endpoint URL
3. Check CORS settings
4. Verify authentication tokens
5. Check component props/types
6. Verify data format
```

---

## 📝 Checklist Kiểm Tra Theo Flow

### Backend Checklist
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Prisma schema synced
- [ ] TypeScript compilation passes
- [ ] All modules imported correctly
- [ ] API endpoints accessible
- [ ] Authentication working
- [ ] CORS configured correctly
- [ ] Swagger docs accessible
- [ ] Error handling working

### Dashboard Checklist
- [ ] Environment variables configured
- [ ] API client configured
- [ ] Authentication flow working
- [ ] Protected routes working
- [ ] All pages accessible
- [ ] API calls successful
- [ ] Error handling working
- [ ] Loading states working
- [ ] Forms validation working
- [ ] Data tables rendering

### Integration Checklist
- [ ] Backend API accessible from Dashboard
- [ ] CORS allows Dashboard origin
- [ ] Authentication tokens working
- [ ] Data flow Backend → Dashboard working
- [ ] Real-time updates (if any) working
- [ ] File uploads working
- [ ] Error messages displayed correctly

---

## 🚀 Quick Start Commands

### Start Backend
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:3010
```

### Start Dashboard
```bash
cd dashboard
npm install
npm run dev
# Dashboard runs on http://localhost:3001
```

### Start Both (using script)
```bash
./start-services.sh
```

---

## 🔧 Common Issues & Solutions

### Issue: TypeScript Errors
**Solution**: 
- Check Prisma schema field names
- Use snake_case for Prisma operations
- Use camelCase for TypeScript interfaces
- Comment out non-existent relations

### Issue: CORS Errors
**Solution**:
- Check CORS_ORIGIN in backend .env
- Add dashboard URL to allowed origins
- Verify CORS middleware is enabled

### Issue: Authentication Fails
**Solution**:
- Check JWT secrets in .env
- Verify token expiration
- Check refresh token flow
- Verify user exists in database

### Issue: Database Connection
**Solution**:
- Check DATABASE_URL in .env
- Verify database is running
- Run Prisma migrations
- Generate Prisma client

---

## 📊 Monitoring & Logging

### Backend Logs
- Application logs: Console output
- Error logs: Exception filters
- Request logs: Logging interceptor
- Performance: Performance interceptor

### Dashboard Logs
- Browser console
- Network tab (API calls)
- React DevTools
- Error boundaries

---

## 🔐 Security Flow

### Authentication
1. User logs in → JWT tokens generated
2. Tokens stored (httpOnly cookies recommended)
3. Each request includes token in header
4. Backend validates token
5. Token refresh before expiration

### Authorization
1. Check user role/permissions
2. Verify resource ownership
3. Apply role-based access control
4. Return 403 if unauthorized

---

## 📈 Performance Optimization

### Backend
- Enable compression
- Use caching (Redis)
- Optimize database queries
- Use pagination
- Implement rate limiting

### Dashboard
- Code splitting
- Lazy loading components
- Image optimization
- API response caching
- Debounce search inputs

---

## 🧪 Testing Flow

### Backend Tests
```bash
npm run test              # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Coverage
```

### Dashboard Tests
```bash
npm run test             # Component tests
npm run test:e2e         # E2E tests
```

---

## 📚 Documentation

### API Documentation
- Swagger UI: http://localhost:3010/docs
- OpenAPI Spec: http://localhost:3010/docs-json

### Code Documentation
- JSDoc comments in code
- README files in modules
- Type definitions in types/

---

## 🔄 Deployment Flow

### Backend Deployment
1. Build: `npm run build`
2. Run migrations: `npx prisma migrate deploy`
3. Generate Prisma client: `npx prisma generate`
4. Start: `npm start`

### Dashboard Deployment
1. Build: `npm run build`
2. Start: `npm start`
3. Or deploy to Vercel/Netlify

---

## 📞 Support & Troubleshooting

### Debug Mode
- Backend: Set `NODE_ENV=development`
- Dashboard: Use React DevTools

### Common Commands
```bash
# Reset database
npx prisma migrate reset

# Seed database
npm run seed

# View logs
tail -f /tmp/backend.log
tail -f /tmp/frontend.log
```

---

*Last Updated: 2025-01-24*

