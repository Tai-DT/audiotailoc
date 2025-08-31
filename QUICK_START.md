# 🚀 Audio Tài Lộc - Quick Start Guide

Hướng dẫn khởi động nhanh cho hệ thống Audio Tài Lộc.

## 📋 Yêu cầu hệ thống

- Node.js 18+ hoặc 20+
- npm hoặc yarn
- Git

## 🎯 Khởi động nhanh

### 1. Clone và cài đặt dependencies

```bash
git clone <repository-url>
cd audiotailoc

# Cài đặt dependencies cho backend
cd backend && npm install && cd ..

# Cài đặt dependencies cho frontend  
cd frontend && npm install && cd ..
```

### 2. Khởi động hệ thống

#### Cách 1: Sử dụng script tự động (Khuyến nghị)

```bash
# Khởi động toàn bộ hệ thống
node start-system.js
```

#### Cách 2: Khởi động thủ công

```bash
# Terminal 1: Khởi động backend
cd backend
npm run dev

# Terminal 2: Khởi động frontend
cd frontend  
npm run dev
```

### 3. Kiểm tra hệ thống

```bash
# Chạy test hệ thống
node test-system.cjs
```

## 🌐 Truy cập ứng dụng

Sau khi khởi động thành công, bạn có thể truy cập:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3010/api/v1
- **API Documentation**: http://localhost:3010/docs
- **Health Check**: http://localhost:3010/api/v1/health

## 🛠️ Cấu hình môi trường

### Backend (.env)
```env
NODE_ENV=development
PORT=3010
DATABASE_URL="file:./prisma/dev.db"
JWT_ACCESS_SECRET=dev_access_secret_change_me
JWT_REFRESH_SECRET=dev_refresh_secret_change_me
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_APP_NAME=Audio Tài Lộc
```

## 📊 Tính năng chính

### ✅ Đã hoàn thành
- ✅ Backend API với NestJS
- ✅ Frontend với Next.js 15
- ✅ Database SQLite với Prisma
- ✅ Authentication system
- ✅ Product catalog
- ✅ Shopping cart
- ✅ Order management
- ✅ Service booking
- ✅ Responsive design
- ✅ TailwindCSS v4 styling

### 🔄 Đang phát triển
- 🔄 Payment integration
- 🔄 Real-time chat
- 🔄 Admin dashboard
- 🔄 Advanced search

## 🧪 Testing

```bash
# Test backend
cd backend && npm run test

# Test frontend
cd frontend && npm run test

# Test hệ thống
node test-system.cjs
```

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Port đã được sử dụng**
   ```bash
   # Kiểm tra port
   lsof -i :3001
   lsof -i :3010
   
   # Kill process nếu cần
   kill -9 <PID>
   ```

2. **Database errors**
   ```bash
   cd backend
   npx prisma db push --force-reset
   npm run seed
   ```

3. **Frontend build errors**
   ```bash
   cd frontend
   rm -rf .next
   npm run dev
   ```

### Logs

- **Backend logs**: `backend/logs/`
- **Frontend logs**: Console trong browser
- **System logs**: Terminal output

## 📁 Cấu trúc dự án

```
audiotailoc/
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
├── start-system.js         # System startup script
├── test-system.cjs         # System test script
└── README.md
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Hỗ trợ

- 📧 Email: support@audiotailoc.com
- 📱 Phone: +84 XXX XXX XXXX
- 🏢 Address: Your Business Address

---

**Built with ❤️ by Audio Tài Lộc Team**



