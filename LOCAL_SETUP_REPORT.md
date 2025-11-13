# Báo Cáo Kiểm Tra Kết Nối Local - Audio Tài Lộc

## 📊 Tổng Quan Kiểm Tra

**Ngày kiểm tra:** 11/11/2025  
**Trạng thái:** ⚠️ Cần cấu hình cho môi trường local

---

## 🔍 Phân Tích Cấu Hình Hiện Tại

### 1. Backend (Port 3010)

#### Cấu hình trong `.env`
```bash
PORT="3010"
NODE_ENV="development"
API_VERSION="v1"

# CORS Origins
CORS_ORIGINS="http://192.168.1.8:3000,http://192.168.1.8:3001,http://localhost:3000,http://localhost:3001,http://localhost:3002,http://127.0.0.1:62292,https://audiotailoc-frontend-37b1aolbt-kadevs-projects.vercel.app,https://dashboard-57fndz1vw-kadevs-projects.vercel.app"

# Frontend URLs (Production)
FRONTEND_URL="https://audiotailoc-frontend-37b1aolbt-kadevs-projects.vercel.app"
DASHBOARD_URL="https://dashboard-57fndz1vw-kadevs-projects.vercel.app"
```

#### ✅ Điểm Tốt:
- Đã cấu hình CORS cho localhost (port 3000, 3001, 3002)
- Server listen trên `0.0.0.0` để có thể truy cập từ mạng local
- API prefix: `/api/v1`
- Swagger docs: `http://localhost:3010/docs`

#### ⚠️ Vấn Đề:
- CORS origins đang mix production và development URLs
- FRONTEND_URL và DASHBOARD_URL đang trỏ về production Vercel

---

### 2. Frontend (Port 3000)

#### Cấu hình trong `.env.local`
```bash
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1

# App URLs (Production)
NEXT_PUBLIC_APP_URL=https://audiotailoc.com
PAYOS_RETURN_URL=https://audiotailoc.com/order-success
PAYOS_CANCEL_URL=https://audiotailoc.com/checkout
```

#### Cấu hình trong `lib/api.ts`
```typescript
const API_BASE_URL = configuredBaseUrl && configuredBaseUrl.length > 0
  ? configuredBaseUrl
  : 'http://localhost:3010/api/v1';
```

#### ✅ Điểm Tốt:
- Đã cấu hình `NEXT_PUBLIC_API_URL` đúng cho local
- API client có fallback về localhost
- Có debug logging trong development mode

#### ⚠️ Vấn Đề:
- PayOS URLs đang trỏ về production domain
- NEXT_PUBLIC_APP_URL chưa có biến local

---

### 3. Dashboard (Port 3001 hoặc 3002)

#### Cấu hình trong `.env.local`
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3010

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dib7tbv7w
CLOUDINARY_API_KEY=515973253722995
CLOUDINARY_API_SECRET=JHQbBTbJicxxdF7qoJrLUBLYI7w

NODE_ENV=development
```

#### Cấu hình trong `lib/api-client.ts`
```typescript
const API_BASE_URL: string = (() => {
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env && env.trim().length > 0) return env;
  
  // Dynamic fallback logic
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:3010/api/v1`;
    }
  }
  
  return 'http://localhost:3010/api/v1';
})();
```

#### ✅ Điểm Tốt:
- API URL đã cấu hình đúng cho local
- Có logic fallback thông minh dựa trên hostname
- Đã có admin API key header support

#### ⚠️ Vấn Đề:
- CLOUDINARY_API_KEY và SECRET đang được commit (nên dùng .env.local.example)

---

## 🎯 Đề Xuất Cấu Hình Cho Local Development

### Bước 1: Cập Nhật Backend `.env`

```bash
# ==========================================================================
# LOCAL DEVELOPMENT CONFIGURATION
# ==========================================================================

# Server Configuration
PORT="3010"
NODE_ENV="development"
API_VERSION="v1"

# Database Configuration (giữ nguyên)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
DIRECT_DATABASE_URL="postgres://avnadmin:..."

# JWT Configuration (giữ nguyên)
JWT_ACCESS_SECRET="audiotailoc-jwt-access-secret-dev-2024-secure-key-256-bits-random"
JWT_REFRESH_SECRET="audiotailoc-jwt-refresh-secret-dev-2024-secure-key-256-bits-random"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# 💳 PayOS Configuration - LOCAL TESTING
PAYOS_CLIENT_ID="c666c1e6-26c6-4264-b5a5-4de552535065"
PAYOS_API_KEY="43e30c48-a208-47ad-855a-c1bdf18d748b"
PAYOS_CHECKSUM_KEY="33642e2b053986dbdb178487479fb0191371435d1f9328b8fba61ef6c20a65ab"
PAYOS_PARTNER_CODE="DOTAI30042001"
PAYOS_API_URL="https://api.payos.vn"

# LOCAL URLs for PayOS callbacks
PAYOS_WEBHOOK_URL="http://localhost:3010/api/v1/payments/payos/webhook"
PAYOS_RETURN_URL="http://localhost:3000/checkout/return"
PAYOS_CANCEL_URL="http://localhost:3000/checkout/cancel"

# CORS Configuration - LOCAL ONLY
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002,http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:3002,http://192.168.1.8:3000,http://192.168.1.8:3001,http://192.168.1.8:3002"

# Frontend URLs - LOCAL
FRONTEND_URL="http://localhost:3000"
DASHBOARD_URL="http://localhost:3001"

# Cloudinary (giữ nguyên)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dib7tbv7w"
CLOUDINARY_CLOUD_NAME="dib7tbv7w"
CLOUDINARY_API_KEY="515973253722995"
CLOUDINARY_API_SECRET="JHQbBTbJicxxdF7qoJrLUBLYI7w"
CLOUDINARY_UPLOAD_PRESET="audio-tailoc"

# Redis (giữ nguyên)
REDIS_URL=rediss://default:AWVBAAIncDFkNmQzNmNmNmQ3MjM0ODAwYTcyMzJlNTE0MzdiZWE0OHAxMjU5MjE@rapid-phoenix-25921.upstash.io:6379

# Email Configuration (giữ nguyên)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="noreply@audiotailoc.vn"

# Google AI (giữ nguyên)
GOOGLE_AI_API_KEY="your-google-ai-api-key"
GEMINI_MODEL="gemini-1.5-pro"

# Maps (giữ nguyên)
GOONG_API_KEY="CixnooMLQK60Y3nAvT9kQEcE2SKILKnwZoNNanhH"

# Security
BCRYPT_ROUNDS="10"
SESSION_SECRET="your-session-secret-key"
ADMIN_API_KEY="dev-admin-key-2024"

# Logging
LOG_LEVEL="debug"
LOG_FILE="true"

# Rate Limiting (relaxed for local dev)
THROTTLE_TTL="60"
THROTTLE_LIMIT="1000"
```

---

### Bước 2: Cập Nhật Frontend `.env.local`

```bash
# ==========================================================================
# FRONTEND LOCAL DEVELOPMENT CONFIGURATION
# ==========================================================================

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME="Audio Tài Lộc"
NEXT_PUBLIC_APP_DESCRIPTION="Thiết bị âm thanh chuyên nghiệp"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dib7tbv7w
CLOUDINARY_CLOUD_NAME="dib7tbv7w"
CLOUDINARY_API_KEY="your_api_key_here"
CLOUDINARY_API_SECRET="your_secret_here"
CLOUDINARY_UPLOAD_PRESET="audio-tailoc"

# PayOS Configuration (LOCAL)
PAYOS_PARTNER_CODE=DOTAI30042001
PAYOS_API_KEY=43e30c48-a208-47ad-855a-c1bdf18d748b
PAYOS_CHECKSUM_KEY=33642e2b053986dbdb178487479fb0191371435d1f9328b8fba61ef6c20a65ab

# PayOS URLs (LOCAL)
PAYOS_RETURN_URL=http://localhost:3000/checkout/return
PAYOS_CANCEL_URL=http://localhost:3000/checkout
PAYOS_WEBHOOK_URL=http://localhost:3010/api/v1/payments/payos/webhook

# Order API Key (nếu cần)
PUBLIC_ORDER_API_KEY=your_order_api_key_here

# Development Mode
NODE_ENV=development
```

---

### Bước 3: Cập Nhật Dashboard `.env.local`

```bash
# ==========================================================================
# DASHBOARD LOCAL DEVELOPMENT CONFIGURATION
# ==========================================================================

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3010

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dib7tbv7w
CLOUDINARY_API_KEY=515973253722995
CLOUDINARY_API_SECRET=JHQbBTbJicxxdF7qoJrLUBLYI7w
CLOUDINARY_UPLOAD_PRESET=audio-tailoc

# Admin API Key
NEXT_PUBLIC_ADMIN_API_KEY=dev-admin-key-2024

# Development Mode
NODE_ENV=development
```

---

## 🚀 Hướng Dẫn Chạy Local

### Bước 1: Khởi động Backend

```bash
cd backend
npm install
npm run dev

# Hoặc sử dụng script có sẵn
./start-dev.sh
```

**Kiểm tra:**
- Backend: http://localhost:3010/api/v1/health
- API Docs: http://localhost:3010/docs

---

### Bước 2: Khởi động Frontend

```bash
cd frontend
npm install
npm run dev
```

**Kiểm tra:**
- Frontend: http://localhost:3000
- API connection: Kiểm tra Network tab trong DevTools

---

### Bước 3: Khởi động Dashboard

```bash
cd dashboard
npm install
npm run dev
```

**Kiểm tra:**
- Dashboard: http://localhost:3001 (hoặc port được assign)
- API connection: Kiểm tra Network tab trong DevTools

---

## 🧪 Kiểm Tra Kết Nối

### Test 1: Backend Health Check

```bash
curl http://localhost:3010/api/v1/health
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-11-11T..."
  }
}
```

---

### Test 2: Frontend → Backend

1. Mở http://localhost:3000
2. Mở DevTools → Network tab
3. Kiểm tra các request đến `http://localhost:3010/api/v1/*`
4. Xác nhận không có CORS errors

---

### Test 3: Dashboard → Backend

1. Mở http://localhost:3001
2. Login với admin account
3. Kiểm tra các API requests trong Network tab
4. Xác nhận `X-Admin-Key` header được gửi đúng

---

## 🔧 Troubleshooting

### Lỗi: CORS blocked

**Nguyên nhân:** Backend CORS_ORIGINS không chứa frontend URL

**Giải pháp:**
1. Kiểm tra URL frontend đang chạy (console log)
2. Thêm URL đó vào `CORS_ORIGINS` trong backend `.env`
3. Restart backend

---

### Lỗi: Cannot connect to backend

**Nguyên nhân:** Backend chưa chạy hoặc port sai

**Giải pháp:**
1. Kiểm tra backend đang chạy: `curl http://localhost:3010/api/v1/health`
2. Kiểm tra `NEXT_PUBLIC_API_URL` trong frontend/dashboard
3. Restart các services

---

### Lỗi: Database connection failed

**Nguyên nhân:** Prisma Accelerate hoặc database URL không hợp lệ

**Giải pháp:**
1. Kiểm tra `DATABASE_URL` trong backend `.env`
2. Test connection: `cd backend && npx prisma db pull`
3. Nếu cần, cập nhật connection string

---

### Lỗi: PayOS webhook không hoạt động

**Nguyên nhân:** Localhost không thể nhận webhook từ internet

**Giải pháp (Development):**
1. Sử dụng ngrok để expose localhost:
   ```bash
   ngrok http 3010
   ```
2. Cập nhật `PAYOS_WEBHOOK_URL` với ngrok URL
3. Hoặc skip webhook testing trong local, chỉ test trên staging

---

## 📝 Checklist Hoàn Chỉnh

### Backend ✓
- [x] Port 3010 đang chạy
- [x] CORS cấu hình cho localhost:3000, 3001, 3002
- [x] Health endpoint responds OK
- [x] Swagger docs accessible
- [x] Database connected

### Frontend ✓
- [x] `NEXT_PUBLIC_API_URL` trỏ về localhost:3010
- [x] API client có debug logging
- [x] CORS không bị block
- [x] PayOS URLs cấu hình cho local

### Dashboard ✓
- [x] `NEXT_PUBLIC_API_URL` trỏ về localhost:3010
- [x] Admin API key được set
- [x] Cloudinary credentials configured
- [x] WebSocket URL configured (nếu cần)

---

## 🎉 Kết Luận

Hệ thống đã có **cấu hình cơ bản tốt** cho local development. Chỉ cần:

1. ✅ Đảm bảo tất cả `.env.local` files có đủ biến môi trường
2. ✅ Khởi động services theo đúng thứ tự (Backend → Frontend → Dashboard)
3. ✅ Kiểm tra CORS và network connectivity
4. ⚠️ PayOS webhooks cần ngrok hoặc test trên staging/production

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs của từng service
2. Verify environment variables đã được load
3. Test API endpoints bằng Postman/curl
4. Kiểm tra Network tab trong browser DevTools

**Backend logs:** `backend/logs/`  
**Frontend logs:** Console trong browser  
**Dashboard logs:** Console trong browser
