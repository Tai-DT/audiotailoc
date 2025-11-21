# 🚀 AUDIO TÀI LỘC DASHBOARD APIS

Tài liệu và công cụ đầy đủ cho Dashboard APIs của Audio Tài Lộc.

## 📁 Các File Trong Thư Mục

### 📋 Tài Liệu Chính
- **`DASHBOARD_APIS.md`** - Tài liệu chi tiết về tất cả APIs
- **`dashboard-apis.json`** - Structured data dạng JSON cho APIs
- **`README.md`** - File này (hướng dẫn tổng quan)

### 🛠️ Công Cụ Development
- **`dashboard-api-sdk.js`** - JavaScript/TypeScript SDK
- **`dashboard-apis.postman_collection.json`** - Postman collection để test

## 🎯 API Overview

### 🏠 Admin Dashboard APIs
```
GET /api/v1/admin/dashboard        # Tổng quan dashboard
GET /api/v1/admin/stats/users      # Thống kê users
GET /api/v1/admin/stats/orders     # Thống kê orders
GET /api/v1/admin/stats/products   # Thống kê products
POST /api/v1/admin/bulk-action     # Bulk actions
GET /api/v1/admin/system/status    # System status
GET /api/v1/admin/logs/activity    # Activity logs
```

### 📊 Analytics APIs
```
GET /api/v1/analytics/dashboard     # Analytics tổng quan
GET /api/v1/analytics/sales         # Sales analytics
GET /api/v1/analytics/customers     # Customer analytics
GET /api/v1/analytics/inventory     # Inventory analytics
GET /api/v1/analytics/kpis          # Business KPIs
GET /api/v1/analytics/export/:type  # Export data
GET /api/v1/analytics/realtime/*    # Real-time data
```

### 🏥 Health Monitoring
```
GET /api/v1/health/*               # Health checks (9 endpoints)
```

## 🌐 Environment URLs

### Production
- **API Base**: `https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1`
- **Documentation**: `https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/docs`
- **Health Check**: `https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/health`

### Local Development
- **API Base**: `http://localhost:3010/api/v1`
- **Documentation**: `http://localhost:3010/docs`
- **Health Check**: `http://localhost:3010/api/v1/health`

## 🔐 Authentication

Tất cả dashboard APIs yêu cầu:
```bash
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

Chỉ admin role mới được phép truy cập.

## 🚀 Quick Start

### 1. Using JavaScript SDK
```javascript
import { DashboardAPI } from './dashboard-api-sdk.js';

const api = new DashboardAPI({
  baseURL: 'https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1',
  token: 'your-jwt-token'
});

// Get dashboard data
const dashboard = await api.admin.getDashboard();

// Get real-time sales
const sales = await api.analytics.getRealTimeSales();

// Setup auto-refresh widget
const widgetManager = new DashboardWidgetManager(api);
widgetManager.registerWidget(
  'sales-widget',
  '/analytics/realtime/sales',
  (data) => console.log('Sales data:', data),
  60000 // refresh every minute
);
```

### 2. Using cURL
```bash
# Get dashboard overview
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/admin/dashboard

# Get real-time sales
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/analytics/realtime/sales
```

### 3. Using Postman
1. Import `dashboard-apis.postman_collection.json`
2. Set JWT token in collection variables
3. Run requests to test APIs

## 📊 Dashboard Widget Mapping

### Main Dashboard
| Widget | API Endpoint | Refresh |
|--------|-------------|---------|
| Overview Cards | `/admin/dashboard` | 5 min |
| Real-time Sales | `/analytics/realtime/sales` | 1 min |
| Recent Orders | `/admin/dashboard` | 5 min |
| System Status | `/admin/system/status` | 1 min |

### Analytics Dashboard  
| Widget | API Endpoint | Refresh |
|--------|-------------|---------|
| KPI Cards | `/analytics/kpis` | 30 min |
| Sales Trends | `/analytics/sales` | 30 min |
| Customer Segments | `/analytics/customers` | 30 min |
| Inventory Status | `/analytics/inventory` | 30 min |

## 🔧 Advanced Usage

### Analytics Filters
```javascript
import { AnalyticsFilterBuilder } from './dashboard-api-sdk.js';

const filters = new AnalyticsFilterBuilder()
  .dateRange('2025-01-01', '2025-01-31')
  .products(['prod1', 'prod2'])
  .customerSegment('vip')
  .build();

const sales = await api.analytics.getSales(filters);
```

### Bulk Actions
```javascript
// Activate multiple products
await api.admin.bulkAction('activate', ['id1', 'id2'], 'products');

// Delete multiple users  
await api.admin.bulkAction('delete', ['user1', 'user2'], 'users');
```

### Error Handling
```javascript
try {
  const data = await api.admin.getDashboard();
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error [${error.code}]:`, error.message);
    console.error('Status:', error.status);
  }
}
```

## 📈 Performance Tips

1. **Caching**: Sử dụng appropriate cache times
   - Real-time data: No cache
   - Dashboard: 5 minutes
   - Analytics: 30 minutes

2. **Rate Limiting**: Respect rate limits
   - Admin endpoints: 100/minute
   - Analytics: 50/minute  
   - Real-time: 30/minute

3. **Pagination**: Use limit parameters for large datasets

4. **Filtering**: Apply filters to reduce data size

## 🐛 Common Issues

### 403 Forbidden
- Check JWT token validity
- Verify admin role permission
- Ensure proper Authorization header

### 408 Timeout
- Check network connectivity
- Increase timeout in SDK config
- Try again with smaller date ranges

### Rate Limited
- Wait before retrying
- Implement exponential backoff
- Use caching to reduce requests

## 📞 Support

- **Documentation**: Đọc `DASHBOARD_APIS.md` để có thông tin chi tiết
- **Testing**: Sử dụng Postman collection để test APIs
- **Development**: Dùng JavaScript SDK để integrate nhanh
- **Issues**: Check console errors và API response messages

## 📝 Notes

- Tất cả timestamps đều ở định dạng ISO 8601
- Amounts đều tính bằng đồng VNĐ (cents * 100)
- Real-time endpoints cập nhật mỗi phút
- Export functions sẽ được implement trong version tương lai
- Activity logs hiện tại chưa được implement đầy đủ

## 🛡️ Create / Update Admin User (Local & Dev)

If you need to create an admin user for development or testing, you can run the provided script. It will create an admin if one doesn't exist, and optionally update an existing admin's password and name when using the `--overwrite` flag.

From the `backend` folder, run:

```bash
# Example: Create or update admin
npx ts-node ./scripts/create-admin.ts --email=admin@audiotailoc.com --password=StrongPassword! --name="Administrator" --overwrite
```

Options:

- `--email` - Admin email (default: `admin@audiotailoc.com`)
- `--password` - Admin password (default: `admin123`)
- `--name` - Admin display name (default: `Admin User`)
- `--overwrite` - Update existing admin with provided password and name
- `--dry-run` - Print what would be done without modifying the database
- `--force-production` - Allow running the script in production (use with caution)

Note: Make sure `DATABASE_URL` is available in your environment, e.g., via a `.env` file or exported variable.


## 🔄 Updates

- **v1.0.0** - Initial release với complete API documentation
- Xem `DASHBOARD_APIS.md` để biết thêm chi tiết về từng endpoint

---

**🎯 Ready to build amazing dashboards with Audio Tài Lộc APIs!**
