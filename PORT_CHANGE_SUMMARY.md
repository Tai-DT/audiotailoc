# 🔄 **Chuyển đổi cổng từ 8000 sang 3010 - Tóm tắt thay đổi**

## 🎯 **Mục đích**
Chuyển đổi backend từ cổng **8000** sang cổng **3010** để tránh xung đột với các service khác đang chạy trên hệ thống.

## ✅ **Các file đã được cập nhật:**

### **1. Environment Configuration**
- ✅ `dashboard/.env.local` - Cập nhật API URL và WebSocket URL
- ✅ `dashboard/env-config-updated.md` - Cập nhật template configuration
- ✅ `dashboard/app/lib/api.ts` - Cập nhật fallback URL

### **2. Docker Configuration**
- ✅ `docker-compose.yml` - Cập nhật backend port mapping và environment
- ✅ Backend service chạy trên cổng 3010
- ✅ Dashboard environment variables

### **3. Startup Scripts**
- ✅ `start-full-system.sh` - Cập nhật health check và service URLs
- ✅ Backend startup với `PORT=3010`

### **4. Documentation**
- ✅ `dashboard/README.md` - Cập nhật tất cả URLs và examples
- ✅ `QUICKSTART.md` - Cập nhật hướng dẫn setup
- ✅ Troubleshooting sections

### **5. Code Updates**
- ✅ `dashboard/app/hooks/useDashboard.ts` - WebSocket fallback URL
- ✅ All API calls và endpoint references

## 🌐 **Service URLs mới:**

| Service | Old URL | New URL |
|---------|---------|---------|
| Backend API | http://localhost:8000 | **http://localhost:3010** |
| API Docs | http://localhost:8000/docs | **http://localhost:3010/docs** |
| WebSocket | ws://localhost:8000 | **ws://localhost:3010** |
| Dashboard | http://localhost:3000 | http://localhost:3000 (unchanged) |

## 🚀 **Cách khởi động hệ thống:**

### **Docker Compose (Khuyến nghị):**
```bash
docker-compose up --build
```

### **Chạy riêng lẻ:**
```bash
# 1. Start database services
docker-compose up -d postgres redis meilisearch

# 2. Start backend on port 3010
cd backend
PORT=3010 npm run start:dev

# 3. Start dashboard
cd dashboard
npm run dev
```

### **Script tự động:**
```bash
./start-full-system.sh
```

## 🔧 **Environment Variables:**

```bash
# Dashboard (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3010
NEXT_PUBLIC_API_DOCS_URL=http://localhost:3010/docs

# Backend (environment hoặc .env)
PORT=3010
```

## ✅ **Verification:**

Sau khi khởi động, kiểm tra:
- ✅ Backend health: `curl http://localhost:3010/api/v1/health`
- ✅ API docs: http://localhost:3010/docs
- ✅ Dashboard: http://localhost:3000
- ✅ WebSocket connection trong browser console

## 🎯 **Lợi ích:**
- ✅ Tránh xung đột cổng với các service khác
- ✅ Cấu hình nhất quán trên tất cả files
- ✅ Documentation và scripts được cập nhật
- ✅ Backward compatibility với fallback URLs

## 🚨 **Lưu ý:**
Nếu bạn đã có data trên cổng 8000, hãy backup trước khi chuyển đổi. Database và Redis data sẽ được preserve trong Docker volumes.

---

**🎉 Hệ thống Audio Tài Lộc đã được cập nhật để sử dụng cổng 3010!** 🎵