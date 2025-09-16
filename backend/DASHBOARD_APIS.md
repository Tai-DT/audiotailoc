# 📊 DASHBOARD API - DANH SÁCH ĐẦY ĐỦ CHI TIẾT
## Audio Tài Lộc - Admin Dashboard & Analytics APIs

> **Base URL Production**: `https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1`  
> **Base URL Local**: `http://localhost:3010/api/v1`  
> **Authentication**: Bearer Token (Admin role required)  
> **Documentation**: `/docs` hoặc `/api/v1/docs`

---

## 🏠 1. ADMIN DASHBOARD ENDPOINTS

### 📈 Dashboard Overview
```http
GET /api/v1/admin/dashboard
```
**Mô tả**: Tổng quan dashboard admin với thống kê tổng thể  
**Query Parameters**:
- `startDate` (optional): Ngày bắt đầu (ISO format)
- `endDate` (optional): Ngày kết thúc (ISO format)

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalProducts": 890,
      "totalOrders": 3450,
      "totalRevenue": 125000000,
      "newUsers": 45,
      "newOrders": 123,
      "pendingOrders": 23,
      "lowStockProducts": 12
    },
    "recentActivities": {
      "orders": [...],
      "users": [...]
    },
    "period": {
      "startDate": "2025-01-01",
      "endDate": "2025-01-31"
    }
  }
}
```

### 👥 User Statistics
```http
GET /api/v1/admin/stats/users
```
**Mô tả**: Thống kê chi tiết về người dùng  
**Query Parameters**:
- `days` (optional, default: 30): Số ngày thống kê

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 890,
    "newUsers": 45,
    "usersByRole": {
      "USER": 1100,
      "ADMIN": 5,
      "MODERATOR": 145
    }
  }
}
```

### 📋 Order Statistics  
```http
GET /api/v1/admin/stats/orders
```
**Mô tả**: Thống kê chi tiết về đơn hàng và doanh thu  
**Query Parameters**:
- `days` (optional, default: 30): Số ngày thống kê

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "totalOrders": 3450,
    "completedOrders": 3200,
    "pendingOrders": 180,
    "cancelledOrders": 70,
    "totalRevenue": 125000000,
    "ordersByStatus": {
      "COMPLETED": 3200,
      "PENDING": 180,
      "CANCELED": 70,
      "PROCESSING": 45
    }
  }
}
```

### 📦 Product Statistics
```http
GET /api/v1/admin/stats/products
```
**Mô tả**: Thống kê chi tiết về sản phẩm và inventory

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "totalProducts": 890,
    "activeProducts": 780,
    "lowStockProducts": 12,
    "productsByCategory": {
      "karaoke": 450,
      "audio_equipment": 290,
      "accessories": 150
    }
  }
}
```

### 🔧 Bulk Actions
```http
POST /api/v1/admin/bulk-action
```
**Mô tả**: Thực hiện hành động hàng loạt (xóa, kích hoạt, vô hiệu hóa)

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

### 🖥️ System Status
```http
GET /api/v1/admin/system/status
```
**Mô tả**: Trạng thái hệ thống và health check

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "database": "Connected",
    "redis": "OK",
    "maintenanceMode": false,
    "uptime": 86400,
    "memoryUsage": {
      "rss": 52428800,
      "heapTotal": 29360128,
      "heapUsed": 20729744
    },
    "environment": "production"
  }
}
```

### 📋 Activity Logs
```http
GET /api/v1/admin/logs/activity
```
**Mô tả**: Lịch sử hoạt động và audit trail  
**Query Parameters**:
- `type` (optional): Loại log cần lấy
- `limit` (optional, default: 100): Số lượng logs

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "logs": [],
    "total": 0,
    "type": "all",
    "limit": 100
  },
  "message": "Activity log retrieval not implemented yet"
}
```

---

## 📊 2. ANALYTICS ENDPOINTS

### 📈 Analytics Dashboard
```http
GET /api/v1/analytics/dashboard
```
**Mô tả**: Dashboard analytics tổng thể với tất cả metrics  
**Query Parameters** (tất cả optional):
- `startDate`: Ngày bắt đầu (ISO format)
- `endDate`: Ngày kết thúc (ISO format) 
- `productIds[]`: Mảng ID sản phẩm để filter
- `categoryIds[]`: Mảng ID danh mục để filter
- `customerSegment`: Phân khúc khách hàng
- `region`: Khu vực địa lý
- `channel`: Kênh bán hàng

### 💰 Sales Analytics
```http
GET /api/v1/analytics/sales
```
**Mô tả**: Phân tích doanh thu và bán hàng chi tiết  
**Query Parameters**: Giống Analytics Dashboard

**Expected Response**:
```json
{
  "totalSales": 125000000,
  "totalOrders": 3450,
  "averageOrderValue": 362318,
  "salesGrowth": 15.2,
  "topSellingProducts": [...],
  "salesByPeriod": [...],
  "salesByCategory": {...},
  "conversionRate": 3.2
}
```

### 👥 Customer Analytics  
```http
GET /api/v1/analytics/customers
```
**Mô tả**: Phân tích hành vi và segmentation khách hàng  
**Query Parameters**: Giống Analytics Dashboard

**Expected Response**:
```json
{
  "totalCustomers": 1250,
  "newCustomers": 45,
  "returningCustomers": 890,
  "customerLifetimeValue": 1250000,
  "customerSegments": {...},
  "topCustomers": [...],
  "churnRate": 2.1,
  "retentionRate": 87.5
}
```

### 📦 Inventory Analytics
```http
GET /api/v1/analytics/inventory
```  
**Mô tả**: Phân tích tồn kho và inventory management  
**Query Parameters**: Giống Analytics Dashboard

**Expected Response**:
```json
{
  "totalProducts": 890,
  "lowStockItems": 12,
  "outOfStockItems": 3,
  "inventoryTurnover": 4.2,
  "stockValue": 45000000,
  "slowMovingItems": [...],
  "fastMovingItems": [...],
  "stockMovement": [...]
}
```

### 📊 Business KPIs
```http
GET /api/v1/analytics/kpis
```
**Mô tả**: Key Performance Indicators của business  
**Query Parameters**: Giống Analytics Dashboard

**Expected Response**:
```json
{
  "revenue": {
    "current": 125000000,
    "target": 150000000,
    "growth": 15.2
  },
  "orders": {
    "current": 3450,
    "target": 4000,
    "growth": 12.5
  },
  "customers": {
    "acquisition": 45,
    "retention": 87.5,
    "satisfaction": 4.2
  },
  "operational": {
    "fulfillmentTime": 24.5,
    "returnRate": 1.2,
    "supportTickets": 12
  }
}
```

### 📤 Export Analytics
```http
GET /api/v1/analytics/export/:type
```
**Mô tả**: Export dữ liệu analytics  
**Path Parameters**:
- `type`: `sales|customers|inventory|all`

**Query Parameters**:
- `format` (optional, default: csv): `csv|excel|pdf`  
- Các filter parameters khác giống Analytics Dashboard

**Response**:
```json
{
  "filename": "sales_analytics_20250109.csv",
  "downloadUrl": "/api/v1/analytics/download/sales_analytics_20250109.csv"
}
```

### ⚡ Real-time Sales
```http
GET /api/v1/analytics/realtime/sales
```
**Mô tả**: Dữ liệu bán hàng real-time (hôm nay)

**Expected Response**:
```json
{
  "totalSales": 2500000,
  "totalOrders": 23,
  "averageOrderValue": 108695,
  "salesGrowth": 5.2,
  "lastUpdated": "2025-01-09T10:30:00Z"
}
```

### ⚡ Real-time Orders
```http
GET /api/v1/analytics/realtime/orders  
```
**Mô tả**: Theo dõi đơn hàng real-time

**Response**:
```json
{
  "todayOrders": 23,
  "todayRevenue": 2500000,
  "averageOrderValue": 108695,
  "lastUpdated": "2025-01-09T10:30:00Z"
}
```

---

## 🏥 3. HEALTH & MONITORING ENDPOINTS

### 🔍 Basic Health Check
```http
GET /api/v1/health
```
**Mô tả**: Health check cơ bản

### 🔍 Detailed Health Check  
```http
GET /api/v1/health/detailed
```
**Mô tả**: Health check chi tiết với thông tin system

### 💾 Database Health
```http
GET /api/v1/health/database
```
**Mô tả**: Kiểm tra kết nối database

### ⚡ Performance Metrics
```http
GET /api/v1/health/performance
```
**Mô tả**: Metrics về performance hệ thống

### 🖥️ System Information
```http
GET /api/v1/health/system
```
**Mô tả**: Thông tin hệ thống (CPU, memory, disk)

### 💭 Memory Usage
```http
GET /api/v1/health/memory
```
**Mô tả**: Thông tin sử dụng bộ nhớ

### ⏱️ Uptime Information
```http
GET /api/v1/health/uptime
```
**Mô tả**: Thời gian hoạt động hệ thống

### 📊 Application Metrics
```http
GET /api/v1/health/metrics
```
**Mô tả**: Metrics ứng dụng tổng thể

### 🚨 Active Alerts
```http
GET /api/v1/health/alerts
```
**Mô tả**: Cảnh báo và alerts đang hoạt động

---

## 🔐 4. AUTHENTICATION & AUTHORIZATION

### Tất cả Dashboard APIs yêu cầu:
1. **Bearer Token Authentication**
2. **Admin Role** hoặc **API Key**
3. **Headers**:
   ```
   Authorization: Bearer <jwt_token>
   Content-Type: application/json
   ```

### Admin Guard Implementation:
- Sử dụng `AdminOrKeyGuard`
- Kiểm tra role `ADMIN` hoặc valid API key
- Tự động reject nếu không có quyền

---

## 📝 5. RESPONSE FORMAT STANDARDS

### Success Response:
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message",
  "timestamp": "2025-01-09T10:30:00Z"
}
```

### Error Response:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details"
  },
  "timestamp": "2025-01-09T10:30:00Z"
}
```

---

## 🚀 6. USAGE EXAMPLES

### JavaScript/Frontend Integration:
```javascript
// Dashboard Overview
const getDashboard = async (startDate, endDate) => {
  const response = await fetch(`/api/v1/admin/dashboard?startDate=${startDate}&endDate=${endDate}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Real-time Sales
const getRealTimeSales = async () => {
  const response = await fetch('/api/v1/analytics/realtime/sales', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Bulk Actions
const performBulkAction = async (action, ids, type) => {
  const response = await fetch('/api/v1/admin/bulk-action', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action, ids, type })
  });
  return response.json();
};
```

---

## 🔍 7. QUERY PARAMETER FILTERS

### Analytics Filters (áp dụng cho tất cả analytics endpoints):
```
startDate=2025-01-01          // Ngày bắt đầu
endDate=2025-01-31            // Ngày kết thúc  
productIds[]=id1&productIds[]=id2  // Filter theo sản phẩm
categoryIds[]=cat1&categoryIds[]=cat2  // Filter theo danh mục
customerSegment=vip           // Phân khúc khách hàng
region=north                  // Khu vực
channel=online                // Kênh bán hàng
```

### Admin Stats Filters:
```
days=30                       // Số ngày thống kê (default: 30)
type=all                      // Loại logs (cho activity logs)
limit=100                     // Giới hạn số lượng (default: 100)
```

---

## 📊 8. DASHBOARD WIDGETS MAPPING

### Main Dashboard Widgets:
1. **Overview Cards**: `/api/v1/admin/dashboard` → overview object
2. **Sales Chart**: `/api/v1/analytics/realtime/sales` → for real-time
3. **Orders Table**: `/api/v1/admin/dashboard` → recentActivities.orders
4. **Users Chart**: `/api/v1/admin/stats/users` → usersByRole
5. **Products Status**: `/api/v1/admin/stats/products` → all fields
6. **System Status**: `/api/v1/admin/system/status` → all system info

### Analytics Dashboard Widgets:
1. **KPI Cards**: `/api/v1/analytics/kpis` → all KPIs
2. **Sales Trends**: `/api/v1/analytics/sales` → salesByPeriod
3. **Customer Segments**: `/api/v1/analytics/customers` → customerSegments  
4. **Inventory Status**: `/api/v1/analytics/inventory` → stock levels
5. **Real-time Metrics**: `/api/v1/analytics/realtime/*` → live data

---

## ⚡ 9. PERFORMANCE & CACHING

### Caching Strategy:
- **Real-time endpoints**: No cache (always fresh)
- **Dashboard data**: 5 minutes cache
- **Statistics**: 15 minutes cache  
- **Analytics**: 30 minutes cache
- **System status**: 1 minute cache

### Rate Limiting:
- **Admin endpoints**: 100 requests/minute
- **Analytics**: 50 requests/minute
- **Real-time**: 30 requests/minute

---

## 🛠️ 10. IMPLEMENTATION NOTES

### Backend Architecture:
- **NestJS Controllers**: Xử lý HTTP requests
- **Prisma ORM**: Database operations
- **Redis Cache**: Caching layer (Upstash)
- **Guards**: Authentication & authorization
- **Swagger**: API documentation

### Frontend Integration:
- Sử dụng các endpoints này để xây dựng admin dashboard
- Real-time data có thể polling mỗi 30-60 giây
- Implement error handling và loading states
- Cache client-side cho performance tốt hơn

### Production URLs:
- **API Base**: `https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1`
- **Documentation**: `https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/docs`
- **Health Check**: `https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/health`

---

## 📋 11. CHECKLIST IMPLEMENTATION

### ✅ Hoàn thành:
- [x] Admin dashboard endpoints
- [x] Analytics endpoints  
- [x] Health monitoring
- [x] Authentication guards
- [x] Error handling
- [x] Swagger documentation

### 🔄 Đang phát triển:
- [ ] Activity logs implementation
- [ ] Advanced filtering
- [ ] Export functionality
- [ ] Real-time WebSocket updates

### 🚀 Tương lai:
- [ ] Mobile dashboard APIs
- [ ] Advanced AI analytics
- [ ] Custom report builder
- [ ] Multi-tenant support

---

*Tài liệu này được tạo bởi GitHub Copilot cho Audio Tài Lộc Dashboard APIs - Version 1.0*
