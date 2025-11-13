# 🎵 Audio Tài Lộc - Local Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (hoặc sử dụng Prisma Accelerate)

### 1️⃣ Cấu Hình Environment Variables

#### Backend (`backend/.env`)
```bash
cp backend/.env.example backend/.env
# Edit backend/.env với các thông tin cần thiết
```

**Các biến quan trọng cho local:**
```bash
PORT=3010
NODE_ENV=development
DATABASE_URL="your_database_url"
JWT_ACCESS_SECRET="your_secret"
JWT_REFRESH_SECRET="your_secret"
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"
FRONTEND_URL="http://localhost:3000"
DASHBOARD_URL="http://localhost:3001"
```

#### Frontend (`frontend/.env.local`)
```bash
cp frontend/.env.local.example frontend/.env.local
# Edit frontend/.env.local
```

**Cấu hình:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Dashboard (`dashboard/.env.local`)
```bash
cp dashboard/.env.local.example dashboard/.env.local
# Edit dashboard/.env.local
```

**Cấu hình:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_ADMIN_API_KEY=dev-admin-key-2024
```

---

### 2️⃣ Cài Đặt Dependencies

```bash
# Cài đặt tất cả dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd dashboard && npm install && cd ..
```

---

### 3️⃣ Khởi Động Services

#### Cách 1: Sử dụng scripts tự động (Khuyến nghị)

```bash
# Khởi động tất cả services
./start-local.sh

# Hoặc khởi động từng service
./start-local.sh backend
./start-local.sh frontend
./start-local.sh dashboard
```

#### Cách 2: Khởi động thủ công

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Dashboard:**
```bash
cd dashboard
npm run dev
```

---

### 4️⃣ Kiểm Tra Services

```bash
# Chạy health check cho tất cả services
./check-services.sh
```

**Hoặc kiểm tra thủ công:**

```bash
# Backend Health
curl http://localhost:3010/api/v1/health

# Frontend
curl http://localhost:3000

# Dashboard
curl http://localhost:3001
```

---

### 5️⃣ Dừng Services

```bash
# Dừng tất cả services
./stop-local.sh
```

**Hoặc dừng thủ công:**
```bash
# Ctrl+C trong mỗi terminal
# Hoặc kill processes bằng port
lsof -ti:3010 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Dashboard
```

---

## 📋 Services Overview

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Backend API | 3010 | http://localhost:3010/api/v1 | NestJS REST API |
| API Docs | 3010 | http://localhost:3010/docs | Swagger Documentation |
| Frontend | 3000 | http://localhost:3000 | Next.js Customer Website |
| Dashboard | 3001 | http://localhost:3001 | Next.js Admin Dashboard |

---

## 🔧 Troubleshooting

### 🐛 Lỗi: Port already in use

**Giải pháp:**
```bash
# Kiểm tra process đang dùng port
lsof -i :3010  # Backend
lsof -i :3000  # Frontend
lsof -i :3001  # Dashboard

# Kill process
lsof -ti:3010 | xargs kill -9
```

### 🐛 Lỗi: CORS blocked

**Nguyên nhân:** Backend không cho phép origin của frontend/dashboard

**Giải pháp:**
1. Mở `backend/.env`
2. Thêm URL vào `CORS_ORIGINS`:
   ```bash
   CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"
   ```
3. Restart backend

### 🐛 Lỗi: Cannot connect to backend

**Kiểm tra:**
1. Backend có đang chạy không?
   ```bash
   curl http://localhost:3010/api/v1/health
   ```

2. Frontend/Dashboard có đúng API URL không?
   ```bash
   # Frontend
   grep NEXT_PUBLIC_API_URL frontend/.env.local
   
   # Dashboard  
   grep NEXT_PUBLIC_API_URL dashboard/.env.local
   ```

3. Check console trong browser DevTools

### 🐛 Lỗi: Database connection failed

**Giải pháp:**
1. Kiểm tra `DATABASE_URL` trong `backend/.env`
2. Test connection:
   ```bash
   cd backend
   npx prisma db pull
   ```
3. Nếu cần, chạy migrations:
   ```bash
   npx prisma migrate dev
   ```

### 🐛 Lỗi: Module not found

**Giải pháp:**
```bash
# Xóa node_modules và reinstall
rm -rf backend/node_modules frontend/node_modules dashboard/node_modules
rm -rf backend/package-lock.json frontend/package-lock.json dashboard/package-lock.json

# Reinstall
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd dashboard && npm install && cd ..
```

---

## 📝 Useful Commands

### Backend

```bash
cd backend

# Development
npm run dev

# Build
npm run build

# Production
npm run start:prod

# Database
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Run migrations
npx prisma generate        # Generate Prisma Client

# Tests
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage
```

### Frontend / Dashboard

```bash
cd frontend  # hoặc cd dashboard

# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

---

## 🔐 Admin Access

### Tạo Admin User

```bash
cd backend
npm run create-admin
```

**Hoặc sử dụng Prisma Studio:**
1. `npx prisma studio`
2. Mở bảng `User`
3. Tạo user mới với `role = "ADMIN"`

### Default Admin (nếu có)
```
Email: admin@audiotailoc.vn
Password: (check backend/scripts/create-admin.js)
```

---

## 🌐 Network Access

### Truy cập từ thiết bị khác trong cùng mạng LAN

1. **Lấy IP máy chủ:**
   ```bash
   # macOS
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Linux
   hostname -I
   ```

2. **Cập nhật CORS trong backend `.env`:**
   ```bash
   CORS_ORIGINS="http://localhost:3000,http://192.168.1.XXX:3000,http://192.168.1.XXX:3001"
   ```

3. **Truy cập từ thiết bị khác:**
   - Backend: `http://192.168.1.XXX:3010/api/v1`
   - Frontend: `http://192.168.1.XXX:3000`
   - Dashboard: `http://192.168.1.XXX:3001`

---

## 📚 Documentation

- **Backend API Docs:** http://localhost:3010/docs
- **Prisma Schema:** `backend/prisma/schema.prisma`
- **Full Setup Guide:** `LOCAL_SETUP_REPORT.md`

---

## 🔄 Development Workflow

1. **Start all services:**
   ```bash
   ./start-local.sh
   ```

2. **Check status:**
   ```bash
   ./check-services.sh
   ```

3. **Make changes:**
   - Backend: Auto-reload với `nodemon`
   - Frontend/Dashboard: Hot Module Replacement (HMR)

4. **Test changes:**
   - Backend: http://localhost:3010/docs
   - Frontend: http://localhost:3000
   - Dashboard: http://localhost:3001

5. **Stop services:**
   ```bash
   ./stop-local.sh
   ```

---

## 🎯 Next Steps

- [ ] Cấu hình environment variables
- [ ] Cài đặt dependencies
- [ ] Chạy migrations (nếu cần)
- [ ] Tạo admin user
- [ ] Khởi động services
- [ ] Test kết nối
- [ ] Bắt đầu development!

---

## 💡 Tips

1. **Sử dụng VSCode workspace:**
   - Mở cả 3 folders (backend, frontend, dashboard) trong một workspace
   - Cài extension: ESLint, Prettier, Prisma

2. **Debug trong VSCode:**
   - Sử dụng launch.json để debug backend
   - Chrome DevTools cho frontend/dashboard

3. **Database GUI:**
   - Sử dụng Prisma Studio: `npx prisma studio`
   - Hoặc pgAdmin, TablePlus cho PostgreSQL

4. **API Testing:**
   - Swagger UI: http://localhost:3010/docs
   - Postman Collection (nếu có)
   - curl commands

5. **Git workflow:**
   ```bash
   git checkout -b feature/your-feature
   # Make changes
   git add .
   git commit -m "feat: your feature"
   git push origin feature/your-feature
   ```

---

## 🆘 Need Help?

- Check `LOCAL_SETUP_REPORT.md` for detailed setup info
- Review logs in each terminal window
- Check browser console for frontend errors
- Use `./check-services.sh` to diagnose issues

---

**Happy Coding! 🎉**
