# 👑 ADMIN DASHBOARD APIS - THÔNG TIN CHI TIẾT

## 🔐 Authentication & Authorization

### Yêu cầu bảo mật:
- **Authentication Type**: Bearer Token (JWT)
- **Required Role**: ADMIN
- **Guard**: AdminOrKeyGuard
- **Header**: `Authorization: Bearer <JWT_TOKEN>`

---

## 🏠 ADMIN ENDPOINTS OVERVIEW

### 📊 **1. Dashboard Overview**
```http
GET /api/v1/admin/dashboard
```

**Chức năng**: Tổng quan dashboard admin với tất cả metrics chính  
**Query Parameters**:
- `startDate` (optional): Ngày bắt đầu (ISO format)
- `endDate` (optional): Ngày kết thúc (ISO format)

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,         // Tổng số users
      "totalProducts": 890,       // Tổng số products
      "totalOrders": 3450,        // Tổng số orders
      "totalRevenue": 125000000,  // Tổng doanh thu (VNĐ)
      "newUsers": 45,             // Users mới trong khoảng thời gian
      "newOrders": 123,           // Orders mới trong khoảng thời gian
      "pendingOrders": 23,        // Orders đang chờ xử lý
      "lowStockProducts": 12      // Sản phẩm sắp hết hàng
    },
    "recentActivities": {
      "orders": [...],            // 5 orders gần nhất
      "users": [...]              // 5 users đăng ký gần nhất
    },
    "period": {
      "startDate": "2025-01-01",
      "endDate": "2025-01-31"
    }
  }
}
```

**Cache**: 5 minutes  
**Rate Limit**: 100 requests/minute

---

### 👥 **2. User Statistics**
```http
GET /api/v1/admin/stats/users
```

**Chức năng**: Thống kê chi tiết về users  
**Query Parameters**:
- `days` (optional, default: 30): Số ngày để phân tích

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,         // Tổng số users
    "activeUsers": 890,         // Users hoạt động trong khoảng thời gian
    "newUsers": 45,             // Users mới trong khoảng thời gian
    "usersByRole": {            // Phân bố theo role
      "USER": 1100,
      "ADMIN": 5,
      "MODERATOR": 145
    }
  }
}
```

**Cache**: 15 minutes  
**Rate Limit**: 100 requests/minute

---

### 📋 **3. Order Statistics**
```http
GET /api/v1/admin/stats/orders
```

**Chức năng**: Thống kê chi tiết về orders và doanh thu  
**Query Parameters**:
- `days` (optional, default: 30): Số ngày để phân tích

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "totalOrders": 3450,        // Tổng số orders
    "completedOrders": 3200,    // Orders đã hoàn thành
    "pendingOrders": 180,       // Orders đang chờ
    "cancelledOrders": 70,      // Orders đã hủy
    "totalRevenue": 125000000,  // Tổng doanh thu (VNĐ)
    "ordersByStatus": {         // Phân bố theo status
      "COMPLETED": 3200,
      "PENDING": 180,
      "CANCELED": 70,
      "PROCESSING": 45
    }
  }
}
```

**Cache**: 15 minutes  
**Rate Limit**: 100 requests/minute

---

### 📦 **4. Product Statistics**
```http
GET /api/v1/admin/stats/products
```

**Chức năng**: Thống kê chi tiết về products và inventory

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "totalProducts": 890,       // Tổng số products
    "activeProducts": 780,      // Products đang active
    "lowStockProducts": 12,     // Products sắp hết hàng (stock <= 10)
    "productsByCategory": {     // Phân bố theo category
      "karaoke": 450,
      "audio_equipment": 290,
      "accessories": 150
    }
  }
}
```

**Cache**: 15 minutes  
**Rate Limit**: 100 requests/minute

---

### 🔧 **5. Bulk Actions**
```http
POST /api/v1/admin/bulk-action
```

**Chức năng**: Thực hiện hành động hàng loạt trên users/products/orders

**Request Body**:
```json
{
  "action": "delete|activate|deactivate|export",
  "ids": ["id1", "id2", "id3"],
  "type": "users|products|orders"
}
```

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "action": "delete",
    "type": "products",
    "affectedCount": 3,
    "message": "Successfully deleted 3 products"
  }
}
```

**Rate Limit**: 50 requests/minute

### Các Actions Available:
- **delete**: Xóa các entities đã chọn
- **activate**: Kích hoạt (products: featured=true, users: enable, orders: completed)
- **deactivate**: Vô hiệu hóa (products: featured=false, users: disable, orders: cancelled)
- **export**: Xuất danh sách (chưa implement)

---

### 🖥️ **6. System Status**
```http
GET /api/v1/admin/system/status
```

**Chức năng**: Kiểm tra trạng thái hệ thống và health check

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "database": "Connected",     // Trạng thái database
    "redis": "OK",              // Trạng thái Redis cache
    "maintenanceMode": false,   // Chế độ bảo trì
    "uptime": 86400,           // Thời gian hoạt động (seconds)
    "memoryUsage": {           // Sử dụng bộ nhớ
      "rss": 52428800,
      "heapTotal": 29360128,
      "heapUsed": 20729744
    },
    "environment": "production" // Môi trường hiện tại
  }
}
```

**Cache**: 1 minute  
**Rate Limit**: 100 requests/minute

---

### 📋 **7. Activity Logs**
```http
GET /api/v1/admin/logs/activity
```

**Chức năng**: Lịch sử hoạt động và audit trail  
**Query Parameters**:
- `type` (optional): Loại log cần lấy
- `limit` (optional, default: 100): Số lượng logs

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "logs": [],               // Danh sách logs (chưa implement)
    "total": 0,
    "type": "all",
    "limit": 100
  },
  "message": "Activity log retrieval not implemented yet"
}
```

**Rate Limit**: 100 requests/minute  
**Status**: 🚧 Not implemented yet

---

## 🚀 CÁCH SỬ DỤNG CHO ADMIN

### 1. **JavaScript SDK Usage**:
```javascript
import { DashboardAPI } from './dashboard-api-sdk.js';

const api = new DashboardAPI({
  baseURL: 'https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1',
  token: 'admin-jwt-token'
});

// Lấy dashboard overview
const dashboard = await api.admin.getDashboard({
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});

// Lấy thống kê users
const userStats = await api.admin.getUserStats(7); // 7 ngày qua

// Thực hiện bulk action
await api.admin.bulkAction('activate', ['prod1', 'prod2'], 'products');

// Kiểm tra system status
const systemStatus = await api.admin.getSystemStatus();
```

### 2. **cURL Examples**:
```bash
# Dashboard overview
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     "https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/admin/dashboard"

# User statistics (30 ngày)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     "https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/admin/stats/users?days=30"

# Bulk delete products
curl -X POST \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"action":"delete","ids":["id1","id2"],"type":"products"}' \
     "https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/admin/bulk-action"
```

### 3. **Widget Mapping cho Admin Dashboard**:
```javascript
const widgets = [
  {
    name: "Overview Cards",
    endpoint: "/admin/dashboard",
    dataPath: "data.overview",
    refreshInterval: 300000 // 5 minutes
  },
  {
    name: "User Stats Chart",
    endpoint: "/admin/stats/users",
    dataPath: "data.usersByRole",
    refreshInterval: 900000 // 15 minutes
  },
  {
    name: "Recent Orders Table",
    endpoint: "/admin/dashboard",
    dataPath: "data.recentActivities.orders",
    refreshInterval: 300000 // 5 minutes
  },
  {
    name: "System Status",
    endpoint: "/admin/system/status",
    dataPath: "data",
    refreshInterval: 60000 // 1 minute
  }
];
```

---

## ⚠️ LƯU Ý QUAN TRỌNG CHO ADMIN

### 🔒 **Security**:
- Tất cả endpoints yêu cầu role ADMIN
- JWT token phải valid và không expired
- Sử dụng HTTPS trong production

### 📊 **Performance**:
- Dashboard data được cache 5-15 minutes
- Real-time system status cache 1 minute
- Rate limits nghiêm ngặt cho bulk operations

### 🚨 **Error Handling**:
- **403 Forbidden**: Không có quyền admin
- **400 Bad Request**: Invalid parameters
- **500 Internal Error**: Lỗi server

### 💡 **Best Practices**:
1. Sử dụng date filters để giảm data load
2. Implement proper error handling
3. Cache dashboard data ở frontend
4. Sử dụng bulk actions cho efficiency
5. Monitor system status thường xuyên

---

## 🎯 ADMIN DASHBOARD COMPONENTS

### **Main Admin Panel Components**:
1. **Overview Cards**: Hiển thị key metrics
2. **Statistics Charts**: Users/Orders/Products trends
3. **Recent Activities**: Latest orders và user registrations
4. **System Health**: Database, Redis, Memory status
5. **Bulk Operations**: Mass actions interface
6. **Activity Logs**: Audit trail (sắp có)

### **Data Refresh Strategy**:
- **Critical metrics**: 1-5 minutes refresh
- **Statistics**: 15-30 minutes refresh
- **System health**: 1 minute refresh
- **Bulk operations**: On-demand only

---

**🔥 Tất cả admin APIs đã sẵn sàng để xây dựng dashboard mạnh mẽ!**
