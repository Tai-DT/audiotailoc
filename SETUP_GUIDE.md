# 🚀 Audio Tài Lộc - Hướng Dẫn Setup Hoàn Chỉnh

## 📋 Tổng Quan

Dự án Audio Tài Lộc bao gồm:
- **Backend**: NestJS API Server (Port 8000)
- **Dashboard**: Next.js Admin Dashboard (Port 3001) 
- **Frontend**: Next.js User Interface (Port 3000)

## 🏗️ Architecture đã được sửa và hoàn thiện

### ✅ Backend Fixes Completed
- ✅ Sửa lỗi TypeScript trong `ai.service.ts`
- ✅ Enable `PaymentsModule` và `OrdersModule` 
- ✅ Tạo file `.env` với cấu hình đầy đủ
- ✅ Tất cả 24 modules đã được tích hợp
- ✅ 140 API endpoints sẵn sàng

---

## 🔧 Setup Backend

### Bước 1: Cài đặt Dependencies
```bash
cd backend
npm install
# hoặc
pnpm install
```

### Bước 2: Cấu hình Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (nếu cần)
npm run prisma:migrate:dev

# Seed data (optional)
npm run seed
```

### Bước 3: Cấu hình PayOS (QUAN TRỌNG)

**📝 Lấy PayOS Credentials:**
1. Truy cập: https://payos.vn
2. Đăng ký tài khoản merchant
3. Vào Dashboard → API Keys
4. Lấy thông tin:
   - `PAYOS_CLIENT_ID`
   - `PAYOS_API_KEY` 
   - `PAYOS_CHECKSUM_KEY`
   - `PAYOS_PARTNER_CODE`

**✏️ Cập nhật file `.env`:**
```env
# Thay thế các giá trị your-payos-* bằng credentials thực tế
PAYOS_CLIENT_ID="your-actual-client-id"
PAYOS_API_KEY="your-actual-api-key"  
PAYOS_CHECKSUM_KEY="your-actual-checksum-key"
PAYOS_PARTNER_CODE="your-actual-partner-code"
```

### Bước 4: Khởi động Backend
```bash
# Chạy script tự động setup
node setup-and-test.js

# Hoặc khởi động manual
npm run start:dev
```

**✅ Backend sẽ chạy tại: http://localhost:8000**

---

## 🎨 Setup Dashboard

### Bước 1: Cài đặt Dashboard
```bash
cd dashboard
npm install
```

### Bước 2: Cấu hình Environment
```bash
# Tạo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
echo "NEXTAUTH_URL=http://localhost:3001" >> .env.local
echo "NEXTAUTH_SECRET=your-secret-key" >> .env.local
```

### Bước 3: Khởi động Dashboard
```bash
npm run dev
```

**✅ Dashboard sẽ chạy tại: http://localhost:3001**

---

## 💻 Setup Frontend

### Bước 1: Cài đặt Frontend
```bash
cd frontend
npm install
```

### Bước 2: Cấu hình Environment
```bash
# Tạo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> .env.local
```

### Bước 3: Khởi động Frontend
```bash
npm run dev
```

**✅ Frontend sẽ chạy tại: http://localhost:3000**

---

## 🔗 Kiểm Tra Kết Nối

### Test APIs
```bash
# Health check
curl http://localhost:8000/health

# Categories API
curl http://localhost:8000/api/v1/catalog/categories

# Products API  
curl http://localhost:8000/api/v1/catalog/products

# PayOS Payment Test
curl -X POST http://localhost:8000/api/v1/payments/intents \\
  -H "Content-Type: application/json" \\
  -d '{"orderId":"test-order-001","provider":"PAYOS"}'
```

### Kiểm tra Sync giữa các components
1. **Backend ↔ Dashboard**: Truy cập admin panel và kiểm tra data từ API
2. **Backend ↔ Frontend**: Test shopping cart, product listing
3. **Payment Integration**: Test checkout flow với PayOS

---

## 📊 Features Available

### ✅ Backend APIs (140 endpoints)
- **Authentication**: JWT, RBAC
- **E-commerce**: Products, Categories, Cart, Orders
- **Payments**: PayOS, VNPay, MoMo
- **AI Integration**: Google Gemini
- **Service Management**: Booking, Technicians
- **Analytics**: Business metrics
- **Search**: Full-text search với MeiliSearch

### ✅ Dashboard Features  
- Admin authentication
- Product management
- Order tracking
- Analytics dashboard
- User management
- Payment monitoring

### ✅ Frontend Features
- Product catalog
- Shopping cart
- User authentication  
- Checkout với PayOS
- Service booking
- AI chat support

---

## 🐛 Troubleshooting

### Backend không khởi động
1. Kiểm tra `.env` file có đầy đủ config
2. Chạy `npm run prisma:generate`
3. Kiểm tra port 8000 có bị chiếm không

### PayOS integration lỗi
1. Xác minh PayOS credentials trong `.env`
2. Kiểm tra webhook URLs
3. Test với PayOS sandbox environment

### Dashboard/Frontend không kết nối Backend
1. Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`
2. Đảm bảo CORS được cấu hình đúng
3. Kiểm tra network requests trong browser dev tools

---

## 🚀 Production Deployment

### Backend
- Setup PostgreSQL database
- Cấu hình PayOS production credentials
- Setup Redis cho caching
- Configure SSL certificates
- Deploy với Docker hoặc traditional hosting

### Frontend & Dashboard  
- Build với `npm run build`
- Deploy với Vercel, Netlify hoặc traditional hosting
- Cấu hình production API URLs

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong terminal
2. Xem file setup-and-test.js để debug
3. Kiểm tra API documentation tại http://localhost:8000/api

---

**🎉 Setup hoàn tất! Hệ thống Audio Tài Lộc đã sẵn sàng với đầy đủ tính năng thương mại điện tử và quản lý dịch vụ.**
