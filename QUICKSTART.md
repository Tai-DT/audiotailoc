# 🚀 Audio Tài Lộc - Quick Start Guide

## 🎵 Khởi động nhanh toàn bộ hệ thống với dữ liệu thật

> **📝 Lưu ý:** Hệ thống đã được cấu hình để sử dụng cổng **3010** cho backend thay vì cổng 8000.

### **Cách 1: Script tự động (Khuyến nghị)**
```bash
# Từ thư mục root của project
./start-full-system.sh

# Hoặc
bash start-full-system.sh
```

### **Cách 2: Docker Compose**
```bash
# Khởi động tất cả services
docker-compose up --build

# Services sẽ chạy trên:
# - Dashboard: http://localhost:3000
# - Backend: http://localhost:3010
# - Database: localhost:5432
# - Redis: localhost:6379
# - Meilisearch: localhost:7700
```

### **Cách 3: Chạy riêng lẻ**

#### **Bước 1: Khởi động Database Services**
```bash
docker-compose up -d postgres redis meilisearch
```

#### **Bước 2: Khởi động Backend**
```bash
cd backend
npm install
# Chạy backend trên cổng 3010
PORT=3010 npm run start:dev
# Backend sẽ chạy trên http://localhost:3010
```

#### **Bước 3: Khởi động Dashboard**
```bash
cd dashboard
npm install
npm run setup  # Tạo .env.local
npm run dev
# Dashboard chạy trên http://localhost:3000
```

## 🌐 Truy cập hệ thống

Sau khi khởi động, truy cập:

- **📊 Dashboard Admin**: http://localhost:3000
- **🔗 Backend API**: http://localhost:3010
- **📚 API Documentation**: http://localhost:3010/docs
- **🗄️ Database**: localhost:5432 (user: postgres, password: password)

## ✅ Tính năng đã hoàn thành

### 🎯 **Dashboard Features**
- ✅ **Real-time Stats** - Dữ liệu thật từ backend API
- ✅ **Interactive Charts** - Biểu đồ với Recharts từ dữ liệu thật
- ✅ **Live Notifications** - WebSocket real-time updates
- ✅ **Connection Status** - Hiển thị trạng thái kết nối

### 📦 **Product Management**
- ✅ **Real API Integration** - CRUD với backend thật
- ✅ **Search & Filter** - Tìm kiếm sản phẩm thật
- ✅ **Pagination** - Phân trang từ API
- ✅ **Bulk Operations** - Thao tác hàng loạt

### 🛒 **Order Management**
- ✅ **Order List** - Danh sách đơn hàng thật
- ✅ **Order Details** - Chi tiết đầy đủ đơn hàng
- ✅ **Status Updates** - Cập nhật trạng thái thật
- ✅ **Customer Info** - Thông tin khách hàng

### 👥 **User Management**
- ✅ **User Database** - Danh sách users từ API
- ✅ **Search Users** - Tìm kiếm người dùng
- ✅ **Role Management** - Phân quyền thật
- ✅ **User Actions** - Edit, suspend, delete

### 📊 **Analytics**
- ✅ **Real Analytics Data** - Từ backend APIs
- ✅ **Interactive Charts** - Revenue, Products, Orders
- ✅ **Live Updates** - Real-time data refresh
- ✅ **Export Options** - Xuất báo cáo

## 🔧 Troubleshooting

### **Lỗi kết nối API**
```bash
# Kiểm tra backend
curl http://localhost:3010/api/v1/health

# Kiểm tra environment
cat dashboard/.env.local
```

### **Lỗi WebSocket**
- Kiểm tra browser console
- Đảm bảo backend có WebSocket enabled
- Verify WebSocket URL: `ws://localhost:8000`

### **Dừng services**
```bash
# Dừng Docker services
docker-compose down

# Dừng background processes
pkill -f "next dev"
pkill -f "nest start"
```

## 🎯 API Endpoints được sử dụng

```
Dashboard Stats: GET /api/v1/admin/dashboard
Sales Analytics: GET /api/v1/analytics/sales
Products: GET /api/v1/catalog/products
Orders: GET /api/v1/orders
Users: GET /api/v1/admin/users
WebSocket: ws://localhost:3010
```

## 🎉 Thành công!

Dashboard Audio Tài Lộc đã sẵn sàng với:
- ✅ **Dữ liệu thật** từ backend API
- ✅ **Real-time features** qua WebSocket
- ✅ **Interactive UI** với modern design
- ✅ **Complete CRUD** operations
- ✅ **Security** với JWT authentication

**🎵 Chúc mừng! Hệ thống Audio Tài Lộc đã sẵn sàng phục vụ!**