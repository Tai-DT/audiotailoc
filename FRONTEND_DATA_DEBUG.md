# 🔍 FRONTEND DATA DEBUGGING GUIDE
**Ngày tạo**: 11/11/2025
**Mục đích**: Khắc phục vấn đề frontend không hiển thị dữ liệu từ backend

---

## 🎯 VẤN ĐỀ

Frontend chưa hiển thị dữ liệu từ backend. Có thể do một trong các nguyên nhân sau:

1. ❌ Backend chưa chạy
2. ❌ Database không có seed data
3. ❌ API endpoints không hoạt động
4. ❌ CORS blocking requests
5. ❌ Frontend config sai URL

---

## ✅ CHECKLIST KIỂM TRA

### 1. Kiểm Tra Backend Đang Chạy

```bash
# Kiểm tra backend port 3010
lsof -i :3010

# Hoặc thử curl
curl http://localhost:3010/api/v1/health
# Expected: {"status": "ok", ...}
```

**Nếu không chạy**:
```bash
cd backend
npm run dev
```

### 2. Kiểm Tra Environment Variables

**Backend** (`backend/.env`):
```bash
PORT=3010
DATABASE_URL=prisma://accelerate.prisma-data.net/...
JWT_ACCESS_SECRET=your-jwt-access-secret-key-change-in-production
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-change-in-production
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
```

**Dashboard** (`dashboard/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
```

### 3. Kiểm Tra Database Có Dữ Liệu

```bash
cd backend

# Check if database has products
npx prisma studio
# Mở http://localhost:5555
# Kiểm tra table: Product, Category, Service

# Hoặc query trực tiếp
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.product.count().then(count => console.log('Products:', count));"
```

**Nếu không có dữ liệu, chạy seed**:
```bash
cd backend
npm run seed
# hoặc
npx prisma db seed
```

### 4. Test API Endpoints Trực Tiếp

**Test Products API**:
```bash
# Get all products
curl http://localhost:3010/api/v1/catalog/products

# Get top viewed products
curl http://localhost:3010/api/v1/catalog/products/analytics/top-viewed?limit=8

# Get categories
curl http://localhost:3010/api/v1/catalog/categories

# Get services
curl http://localhost:3010/api/v1/services
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

### 5. Kiểm Tra CORS

**Test CORS từ frontend origin**:
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     --verbose \
     http://localhost:3010/api/v1/catalog/products
```

**Expected Headers**:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

---

## 🔧 NGUYÊN NHÂN PHỔ BIẾN & GIẢI PHÁP

### ❌ Lỗi 1: "Network Error" trong Browser Console

**Nguyên nhân**: Backend chưa chạy hoặc sai URL

**Giải pháp**:
```bash
# 1. Start backend
cd backend && npm run dev

# 2. Verify URL trong frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1

# 3. Restart frontend
cd frontend && npm run dev
```

### ❌ Lỗi 2: CORS Policy Error

**Nguyên nhân**: Backend CORS chưa allow frontend origin

**Giải pháp**:
Kiểm tra `backend/src/main.ts` line 84-125:
```typescript
const corsOrigins = config.get('CORS_ORIGIN',
  'http://localhost:3000,http://localhost:3001,http://localhost:3002,https://*.vercel.app'
);
```

Hoặc thêm vào `backend/.env`:
```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### ❌ Lỗi 3: Empty Data Array []

**Nguyên nhân**: Database không có dữ liệu

**Giải pháp**:
```bash
cd backend

# Chạy seed data
npm run seed

# Hoặc chạy seed script trực tiếp
npx ts-node src/seed.ts
```

**Seed Scripts Available**:
- `src/seed.ts` - Basic seed
- `src/seed-complete-data.ts` - Complete seed with more data

### ❌ Lỗi 4: 401 Unauthorized

**Nguyên nhân**: API endpoint yêu cầu authentication

**Giải pháp**:
Kiểm tra endpoint có `@UseGuards()` không:

```typescript
// backend/src/modules/catalog/catalog.controller.ts
@Get('products')
@UseGuards() // ← Nếu có thì cần login
```

**Temporary Fix** (development only):
Comment out `@UseGuards()` line để test

### ❌ Lỗi 5: 404 Not Found

**Nguyên nhân**: Endpoint URL sai

**Debug**:
```typescript
// Frontend calling:
/catalog/products/analytics/top-viewed

// Backend có endpoint:
@Get('products/analytics/top-viewed')
```

Check base path:
- Frontend base: `http://localhost:3010/api/v1`
- Backend prefix: `api/v1`
- Controller path: `catalog`
- Method path: `products/analytics/top-viewed`

**Full URL**: `http://localhost:3010/api/v1/catalog/products/analytics/top-viewed`

---

## 🧪 DEBUGGING WORKFLOW

### Step 1: Test Backend Alone

```bash
# Start backend
cd backend && npm run dev

# Test health endpoint
curl http://localhost:3010/api/v1/health

# Expected: {"status":"ok",...}
```

### Step 2: Test Database Connection

```bash
# Open Prisma Studio
cd backend && npx prisma studio

# Check tables:
# - Product (should have records)
# - Category (should have records)
# - Service (should have records)
```

### Step 3: Test API Endpoints

```bash
# Test products
curl http://localhost:3010/api/v1/catalog/products | jq

# Should return:
# {
#   "items": [...products...],
#   "total": X,
#   "page": 1,
#   "pageSize": 20
# }
```

### Step 4: Test Frontend API Client

**Open Browser Console** (F12) và chạy:

```javascript
// Test API client
fetch('http://localhost:3010/api/v1/catalog/products')
  .then(res => res.json())
  .then(data => console.log('Products:', data))
  .catch(err => console.error('Error:', err));

// Or test top-viewed
fetch('http://localhost:3010/api/v1/catalog/products/analytics/top-viewed?limit=8')
  .then(res => res.json())
  .then(data => console.log('Top Viewed:', data))
  .catch(err => console.error('Error:', err));
```

### Step 5: Check React Query DevTools

Frontend có React Query DevTools:

1. Start frontend: `cd frontend && npm run dev`
2. Open http://localhost:3000
3. Look for React Query DevTools badge (bottom left/right)
4. Click to open
5. Check queries:
   - `['products', 'top-viewed', 8]` - Should show data or error

---

## 📊 COMMON API ENDPOINTS

### Products
```bash
GET  /api/v1/catalog/products
GET  /api/v1/catalog/products/:id
GET  /api/v1/catalog/products/slug/:slug
GET  /api/v1/catalog/products/analytics/top-viewed?limit=8
GET  /api/v1/catalog/products/analytics/recent?limit=8
POST /api/v1/catalog/products (admin only)
PUT  /api/v1/catalog/products/:id (admin only)
```

### Categories
```bash
GET /api/v1/catalog/categories
GET /api/v1/catalog/categories/:id
GET /api/v1/catalog/categories/slug/:slug
GET /api/v1/catalog/categories/slug/:slug/products
```

### Services
```bash
GET /api/v1/services
GET /api/v1/services/:id
GET /api/v1/services/slug/:slug
GET /api/v1/services/featured
```

### Projects
```bash
GET /api/v1/projects
GET /api/v1/projects/:id
GET /api/v1/projects/slug/:slug
GET /api/v1/projects/featured
```

---

## 🔍 MONITORING & LOGGING

### Backend Logs

```bash
# Watch backend logs
cd backend
npm run dev

# Look for:
# ✓ "Audio Tài Lộc API v1 đang chạy tại: http://localhost:3010"
# ✓ "Database connected"
# ✓ "Health Check: http://localhost:3010/api/v1/health"
```

### Frontend Logs

```bash
# Watch frontend logs
cd frontend
npm run dev

# Open Browser Console (F12)
# Look for:
# - "[API Client] Base URL: http://localhost:3010/api/v1"
# - "[API Client] Request: GET http://localhost:3010/api/v1/catalog/products"
# - Any error messages
```

### Network Tab

**Browser DevTools → Network Tab**:
1. Filter by "XHR" or "Fetch"
2. Look for requests to `localhost:3010`
3. Check:
   - Status Code (should be 200)
   - Response data
   - Request headers (Origin, Authorization)
   - Response headers (Access-Control-Allow-Origin)

---

## ✅ QUICK FIX CHECKLIST

- [ ] Backend running on port 3010
- [ ] Database connected (check Prisma)
- [ ] Database has seed data (run seed script)
- [ ] `.env` files updated correctly
- [ ] CORS allows localhost:3000
- [ ] API endpoints return data (test with curl)
- [ ] Frontend `.env.local` has correct API_URL
- [ ] Browser has no CORS errors
- [ ] React Query shows data in DevTools
- [ ] No 401/403 errors (auth guards)

---

## 🚀 RECOMMENDED STARTUP SEQUENCE

```bash
# Terminal 1: Backend
cd backend
npm install          # If first time
npx prisma generate  # Generate Prisma client
npm run seed         # Seed database
npm run dev          # Start backend

# Wait for: "Audio Tài Lộc API v1 đang chạy tại: http://localhost:3010"

# Terminal 2: Test API
curl http://localhost:3010/api/v1/health
curl http://localhost:3010/api/v1/catalog/products

# Terminal 3: Frontend
cd frontend
npm install          # If first time
npm run dev          # Start frontend

# Open: http://localhost:3000
```

---

## 📝 SEED DATA COMMAND

**If database is empty**:

```bash
cd backend

# Option 1: Basic seed
npm run seed

# Option 2: Complete seed (more data)
npx ts-node src/seed-complete-data.ts

# Option 3: Reset and seed
npx prisma migrate reset --force
npm run seed
```

**Verify seed success**:
```bash
npx prisma studio
# Check Product, Category, Service tables have data
```

---

## 🎯 SUCCESS CRITERIA

Frontend should show data when:

✅ Backend returns data:
```bash
curl http://localhost:3010/api/v1/catalog/products
# Returns: {"items": [...], "total": X}
```

✅ Frontend fetches successfully:
```
Browser Network Tab shows:
- Request URL: http://localhost:3010/api/v1/catalog/products/analytics/top-viewed?limit=8
- Status: 200 OK
- Response: {...data...}
```

✅ Components render:
```
Homepage shows:
- Sản phẩm nổi bật (Featured Products)
- With product cards
- Images, names, prices
```

---

**Prepared by**: Claude Code
**Date**: November 11, 2025
**Status**: Debugging Guide Ready
