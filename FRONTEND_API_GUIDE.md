# 🎵 Audio Tài Lộc - Frontend API Guide

**Base URL:** `http://localhost:3010/api/v1`

## 📋 Tổng quan

Hướng dẫn sử dụng API cho frontend Audio Tài Lộc. Tài liệu này liệt kê tất cả các endpoints đang hoạt động và cách sử dụng chúng.

## 🔧 Health & System

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-08-22T23:41:22.242Z"
  },
  "message": "Data retrieved successfully"
}
```

### Health Uptime
```http
GET /health/uptime
```

### Health Version
```http
GET /health/version
```

## 📦 Catalog & Products

### Danh sách sản phẩm
```http
GET /catalog/products
```

**Query Parameters:**
- `page` (number): Trang hiện tại (default: 1)
- `pageSize` (number): Số sản phẩm mỗi trang (default: 20)
- `categoryId` (string): Lọc theo danh mục
- `featured` (boolean): Chỉ lấy sản phẩm nổi bật
- `q` (string): Tìm kiếm theo tên

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Microphone Karaoke",
      "description": "Microphone chuyên nghiệp cho karaoke",
      "priceCents": 500000,
      "imageUrl": "https://example.com/mic.jpg",
      "categoryId": "1",
      "featured": true
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Sản phẩm theo danh mục
```http
GET /catalog/products?categoryId=1
```

### Sản phẩm nổi bật
```http
GET /catalog/products?featured=true
```

### Tìm kiếm nâng cao
```http
GET /catalog/search/advanced?q=audio&pageSize=50
```

## 🎵 Services

### Danh sách dịch vụ
```http
GET /services
```

**Query Parameters:**
- `page` (number): Trang hiện tại
- `pageSize` (number): Số dịch vụ mỗi trang
- `category` (string): Lọc theo danh mục (RENTAL, INSTALLATION, etc.)
- `type` (string): Lọc theo loại dịch vụ
- `isActive` (boolean): Chỉ lấy dịch vụ đang hoạt động

**Response:**
```json
{
  "services": [
    {
      "id": "1",
      "name": "Cho thuê thiết bị âm thanh",
      "description": "Dịch vụ cho thuê thiết bị âm thanh chuyên nghiệp",
      "category": "RENTAL",
      "type": "AUDIO_EQUIPMENT",
      "basePriceCents": 1000000,
      "estimatedDuration": 4,
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### Dịch vụ theo danh mục
```http
GET /services?category=RENTAL
```

### Danh mục dịch vụ
```http
GET /services/categories
```

### Loại dịch vụ
```http
GET /services/types
```

### Thống kê dịch vụ
```http
GET /services/stats
```

## 📂 Categories

### Danh sách danh mục
```http
GET /catalog/categories
```

### Danh mục với sản phẩm
```http
GET /catalog/categories?include=products
```

## 🔍 Search

### Tìm kiếm sản phẩm
```http
GET /search/products?q=audio
```

**Query Parameters:**
- `q` (string): Từ khóa tìm kiếm
- `category` (string): Lọc theo danh mục
- `minPrice` (number): Giá tối thiểu
- `maxPrice` (number): Giá tối đa
- `inStock` (boolean): Còn hàng
- `featured` (boolean): Sản phẩm nổi bật
- `sortBy` (string): Sắp xếp theo (relevance, price_asc, price_desc, etc.)
- `page` (number): Trang hiện tại
- `limit` (number): Số kết quả

### Tìm kiếm với bộ lọc
```http
GET /search/products?q=mic&minPrice=100000&maxPrice=500000
```

## 📅 Bookings

### Danh sách đặt lịch
```http
GET /bookings
```

**Query Parameters:**
- `status` (string): Trạng thái đặt lịch
- `technicianId` (string): ID kỹ thuật viên
- `userId` (string): ID người dùng
- `serviceId` (string): ID dịch vụ
- `fromDate` (string): Từ ngày (ISO format)
- `toDate` (string): Đến ngày (ISO format)
- `page` (number): Trang hiện tại
- `pageSize` (number): Số đặt lịch mỗi trang

### Tạo đặt lịch
```http
POST /bookings
```

**Request Body:**
```json
{
  "serviceId": "1",
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0123456789",
  "customerEmail": "customer@example.com",
  "customerAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "scheduledDate": "2025-08-23",
  "scheduledTime": "14:00",
  "notes": "Ghi chú đặt lịch"
}
```

## 🛒 Cart

### Xem giỏ hàng
```http
GET /cart?guestId=abc123
GET /cart?userId=user123
```

### Thêm vào giỏ hàng
```http
POST /cart/items?guestId=abc123
POST /cart/items?userId=user123
```

**Request Body:**
```json
{
  "productId": "1",
  "quantity": 2
}
```

### Giỏ hàng khách
```http
POST /cart/guest
GET /cart/guest/abc123
POST /cart/guest/abc123/items
PUT /cart/guest/abc123/items/1
DELETE /cart/guest/abc123/items/1
DELETE /cart/guest/abc123/clear
```

## 🔐 Authentication

### Đăng ký
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyễn Văn A"
}
```

### Đăng nhập
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Thông tin user
```http
GET /auth/me
```
**Headers:** `Authorization: Bearer <token>`

### Refresh token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

## 💳 Payments

### Phương thức thanh toán
```http
GET /payments/methods
```

### Trạng thái thanh toán
```http
GET /payments/status
```

### Tạo payment intent
```http
POST /payments/intents
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "orderId": "order123",
  "provider": "VNPAY",
  "idempotencyKey": "unique_key_123",
  "returnUrl": "https://example.com/return"
}
```

## 📋 Orders

### Danh sách đơn hàng
```http
GET /orders
```
**Headers:** `Authorization: Bearer <token>`

### Tạo đơn hàng
```http
POST /orders
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0123456789",
  "customerEmail": "customer@example.com",
  "notes": "Ghi chú đơn hàng"
}
```

### Chi tiết đơn hàng
```http
GET /orders/order123
```
**Headers:** `Authorization: Bearer <token>`

### Cập nhật trạng thái đơn hàng
```http
PATCH /orders/order123/status/confirmed
```
**Headers:** `Authorization: Bearer <token>`

## 🔔 Notifications

### Danh sách thông báo
```http
GET /notifications?userId=user123
```

### Cài đặt thông báo
```http
GET /notifications/settings?userId=user123
```

### Đăng ký thông báo
```http
POST /notifications/subscribe
```

**Request Body:**
```json
{
  "userId": "user123",
  "type": "booking_confirmation",
  "channel": "email"
}
```

### Hủy đăng ký thông báo
```http
POST /notifications/unsubscribe
```

### Đánh dấu đã đọc
```http
POST /notifications/mark-read
```

**Request Body:**
```json
{
  "notificationId": "notif123",
  "userId": "user123"
}
```

## 👥 Users

### Thông tin user
```http
GET /users/profile
```
**Headers:** `Authorization: Bearer <token>`

### Danh sách users (Admin)
```http
GET /users
```
**Headers:** `Authorization: Bearer <admin_token>`

## 📊 Error Handling

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "email: Invalid email format",
    "password: Password must be at least 6 characters"
  ],
  "timestamp": "2025-08-22T23:41:22.242Z",
  "path": "/api/v1/auth/register"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 🔧 Frontend Integration

### Axios Configuration
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3010/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Example Usage
```javascript
// Get products
const getProducts = async (params = {}) => {
  const response = await api.get('/catalog/products', { params });
  return response.data;
};

// Create booking
const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

// Add to cart
const addToCart = async (productId, quantity, guestId = null, userId = null) => {
  const params = guestId ? { guestId } : { userId };
  const response = await api.post('/cart/items', {
    productId,
    quantity
  }, { params });
  return response.data;
};
```

## 🚀 Performance Tips

1. **Use pagination** for large datasets
2. **Implement caching** for static data
3. **Use query parameters** for filtering
4. **Handle errors gracefully** with proper user feedback
5. **Implement loading states** for better UX

## 📝 Notes

- Tất cả timestamps đều ở định dạng ISO 8601
- Giá tiền được lưu dưới dạng cents (chia cho 100 để hiển thị)
- Authentication sử dụng JWT Bearer tokens
- CORS đã được cấu hình cho localhost:3000, 3001, 3002

---

*API Guide được tạo tự động cho Audio Tài Lộc Frontend*
