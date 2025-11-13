# 🚀 QUICK START GUIDE - AUDIO TÀI LỘC

## ⚡ Khởi động nhanh (Local Development)

### 1. Backend (Port 3010)

```bash
cd /Users/macbook/Desktop/audiotailoc/backend

# Install dependencies (if needed)
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed database (optional)
npm run seed

# Start development server
npm run dev

# Or start production build
npm run build && npm run start
```

**Test backend:**
```bash
curl http://localhost:3010/api/v1/health
```

### 2. Frontend (Port 3000)

```bash
cd /Users/macbook/Desktop/audiotailoc/frontend

# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Or build for production
npm run build && npm run start
```

**Access:** http://localhost:3000

### 3. Dashboard (Port 3001)

```bash
cd /Users/macbook/Desktop/audiotailoc/dashboard

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

**Access:** http://localhost:3001

---

## 🧪 Testing API Endpoints

### Health Check
```bash
curl http://localhost:3010/api/v1/health
```

### Get Products
```bash
curl http://localhost:3010/api/v1/catalog/products
```

### Get Categories
```bash
curl http://localhost:3010/api/v1/catalog/categories
```

### Login (Test)
```bash
curl -X POST http://localhost:3010/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

---

## 📁 Important Files

### Backend
```
backend/
├── .env                    # Environment variables
├── prisma/schema.prisma   # Database schema
├── src/main.ts            # Entry point
└── dist/                  # Built files (after npm run build)
```

### Frontend
```
frontend/
├── .env.local             # Environment variables
├── lib/api.ts             # API client configuration
├── lib/hooks/use-api.ts   # React Query hooks
└── app/page.tsx           # Homepage
```

---

## 🔧 Troubleshooting

### Backend không start được
```bash
# Check database connection
npx prisma studio

# Regenerate Prisma Client
npx prisma generate

# Check logs
tail -f backend.log
```

### Frontend không connect được backend
1. Check `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
   ```

2. Check backend is running:
   ```bash
   curl http://localhost:3010/api/v1/health
   ```

### Database issues
```bash
# Reset database (CAUTION: deletes all data)
cd backend
npx prisma migrate reset

# Run migrations only
npx prisma migrate deploy

# View database
npx prisma studio
```

---

## 🌐 URLs Reference

| Service | URL | Port |
|---------|-----|------|
| Backend API | http://localhost:3010/api/v1 | 3010 |
| Frontend | http://localhost:3000 | 3000 |
| Dashboard | http://localhost:3001 | 3001 |
| Prisma Studio | http://localhost:5555 | 5555 |

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="prisma://accelerate.prisma-data.net/..."
DIRECT_DATABASE_URL="postgres://..."
JWT_ACCESS_SECRET="your-secret"
JWT_REFRESH_SECRET="your-secret"
PORT="3010"
NODE_ENV="development"
REDIS_URL="rediss://..."
CLOUDINARY_CLOUD_NAME="dib7tbv7w"
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
PAYOS_CLIENT_ID="..."
PAYOS_API_KEY="..."
PAYOS_CHECKSUM_KEY="..."
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3010/api/v1"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dib7tbv7w"
NEXT_PUBLIC_FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_DASHBOARD_URL="http://localhost:3001"
```

---

## 🎯 Common Tasks

### Add new product (via API)
```bash
curl -X POST http://localhost:3010/api/v1/catalog/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Product Name",
    "slug": "product-name",
    "description": "Description",
    "priceCents": 100000,
    "categoryId": "category-uuid",
    "stockQuantity": 10
  }'
```

### Seed database with sample data
```bash
cd backend
npm run seed
```

### View database in browser
```bash
cd backend
npx prisma studio
# Opens http://localhost:5555
```

---

## 🚨 If Something Breaks

1. **Stop all servers:** Ctrl+C in all terminals
2. **Clear caches:**
   ```bash
   cd backend && rm -rf dist node_modules/.cache
   cd frontend && rm -rf .next
   ```
3. **Reinstall dependencies:**
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```
4. **Rebuild:**
   ```bash
   cd backend && npm run build
   ```
5. **Restart services**

---

## 📞 Support

**Logs location:**
- Backend: `./backend.log`
- Frontend: Console output
- Database: Check Aiven dashboard

**Check status:**
```bash
# Backend
curl http://localhost:3010/api/v1/health/detailed

# Database
cd backend && npx prisma db pull
```

---

*Last updated: 12/11/2025*
