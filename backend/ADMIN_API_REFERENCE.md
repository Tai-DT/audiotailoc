# 📊 ADMIN API ENDPOINTS - REFERENCE TABLE

## 🚀 Quick Reference cho Admin Dashboard

| Endpoint | Method | Chức năng | Cache | Rate Limit |
|----------|---------|-----------|-------|------------|
| `/admin/dashboard` | GET | Dashboard tổng quan | 5 min | 100/min |
| `/admin/stats/users` | GET | Thống kê users | 15 min | 100/min |
| `/admin/stats/orders` | GET | Thống kê orders | 15 min | 100/min |
| `/admin/stats/products` | GET | Thống kê products | 15 min | 100/min |
| `/admin/bulk-action` | POST | Bulk operations | - | 50/min |
| `/admin/system/status` | GET | System health | 1 min | 100/min |
| `/admin/logs/activity` | GET | Activity logs | - | 100/min |

## 🔑 Admin API Key Information

### Authentication Details:
- **Token Type**: JWT Bearer Token
- **Required Role**: ADMIN
- **Guard**: AdminOrKeyGuard
- **Header Format**: `Authorization: Bearer <JWT_TOKEN>`

### Environment URLs:
- **Production**: `https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1`
- **Local**: `http://localhost:3010/api/v1`

## 📈 Admin Dashboard Metrics Overview

### Key Statistics Available:

#### 📊 Dashboard Overview (`/admin/dashboard`)
```json
{
  "totalUsers": 1250,
  "totalProducts": 890,
  "totalOrders": 3450,
  "totalRevenue": 125000000,
  "newUsers": 45,
  "newOrders": 123,
  "pendingOrders": 23,
  "lowStockProducts": 12
}
```

#### 👥 User Statistics (`/admin/stats/users`)
```json
{
  "totalUsers": 1250,
  "activeUsers": 890,
  "newUsers": 45,
  "usersByRole": {
    "USER": 1100,
    "ADMIN": 5,
    "MODERATOR": 145
  }
}
```

#### 📋 Order Statistics (`/admin/stats/orders`)
```json
{
  "totalOrders": 3450,
  "completedOrders": 3200,
  "pendingOrders": 180,
  "cancelledOrders": 70,
  "totalRevenue": 125000000,
  "ordersByStatus": {
    "COMPLETED": 3200,
    "PENDING": 180,
    "CANCELED": 70
  }
}
```

#### 📦 Product Statistics (`/admin/stats/products`)
```json
{
  "totalProducts": 890,
  "activeProducts": 780,
  "lowStockProducts": 12,
  "productsByCategory": {
    "karaoke": 450,
    "audio_equipment": 290,
    "accessories": 150
  }
}
```

## 🔧 Bulk Actions Available

### Supported Operations:

| Action | Description | Applies to |
|--------|-------------|------------|
| `delete` | Xóa các entities đã chọn | users, products, orders |
| `activate` | Kích hoạt (featured=true, enable, completed) | users, products, orders |
| `deactivate` | Vô hiệu hóa (featured=false, disable, cancelled) | users, products, orders |
| `export` | Xuất danh sách (future feature) | users, products, orders |

### Usage Example:
```json
{
  "action": "activate",
  "ids": ["id1", "id2", "id3"],
  "type": "products"
}
```

## 🖥️ System Status Information

### Health Check Data:
- **Database**: Connection status
- **Redis**: Cache server status  
- **Maintenance Mode**: System maintenance flag
- **Uptime**: Server uptime in seconds
- **Memory Usage**: RAM usage statistics
- **Environment**: Current environment (production/development)

## ⚡ Quick Setup Guide

### 1. Get Admin JWT Token:
```bash
# Login as admin first
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@audiotailoc.com","password":"admin_password"}' \
  "https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/auth/login"
```

### 2. Use Admin APIs:
```bash
# Set admin token
ADMIN_TOKEN="your_admin_jwt_token"

# Get dashboard overview
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
     "https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/admin/dashboard"

# Get user stats for last 7 days  
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
     "https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/admin/stats/users?days=7"

# Check system status
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
     "https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/admin/system/status"
```

### 3. JavaScript SDK Usage:
```javascript
const api = new DashboardAPI({
  baseURL: 'https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1',
  token: adminToken
});

// Dashboard data
const dashboard = await api.admin.getDashboard();
const userStats = await api.admin.getUserStats(30);
const systemStatus = await api.admin.getSystemStatus();

// Bulk operations
await api.admin.bulkAction('activate', productIds, 'products');
```

## 🚨 Error Codes cho Admin

| Code | Status | Message |
|------|--------|---------|
| `ADMIN_ACCESS_REQUIRED` | 403 | Admin access required for this endpoint |
| `INVALID_DATE_RANGE` | 400 | Invalid date range provided |
| `BULK_ACTION_ERROR` | 500 | Failed to perform bulk action |
| `SYSTEM_STATUS_ERROR` | 500 | Failed to get system status |

## 📱 Admin Dashboard Widget Mapping

### Main Dashboard Widgets:
1. **Overview Cards** → `/admin/dashboard` → `data.overview`
2. **User Chart** → `/admin/stats/users` → `data.usersByRole`  
3. **Recent Orders** → `/admin/dashboard` → `data.recentActivities.orders`
4. **System Health** → `/admin/system/status` → `data`

### Refresh Intervals:
- **Critical data**: 1-5 minutes
- **Statistics**: 15 minutes
- **System status**: 1 minute

## 💡 Admin Best Practices

### Performance:
- Cache dashboard data client-side
- Use appropriate date ranges
- Implement proper error handling
- Monitor rate limits

### Security:
- Always use HTTPS in production
- Validate JWT token expiry
- Log admin actions for audit
- Implement session timeout

### UX:
- Show loading states
- Display error messages clearly
- Auto-refresh critical metrics
- Provide bulk operation feedback

---

**🎯 Complete admin information ready for dashboard implementation!**
