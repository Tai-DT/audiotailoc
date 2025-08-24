# API Endpoints Documentation - Audio Tài Lộc

## 📋 Overview

Backend API được thiết kế theo RESTful principles với WebSocket support cho real-time features. Tất cả endpoints đều có authentication, validation, và error handling.

## 🔐 Authentication

### Base URL
```
https://api.audiotailoc.com/v1
```

### Headers
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 🔑 Authentication Endpoints

### POST `/auth/register`
**Đăng ký tài khoản mới**

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyễn Văn A"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "Nguyễn Văn A"
    }
  }
}
```

**Rate Limit:** 3 requests/minute

---

### POST `/auth/login`
**Đăng nhập**

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

**Rate Limit:** 5 requests/minute

---

### POST `/auth/refresh`
**Làm mới access token**

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

**Rate Limit:** 10 requests/minute

---

### GET `/auth/me`
**Lấy thông tin user hiện tại**

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

---

## 🛒 E-commerce Endpoints

### GET `/catalog/products`
**Lấy danh sách sản phẩm**

**Query Parameters:**
- `page` (number): Trang hiện tại (default: 1)
- `pageSize` (number): Số sản phẩm mỗi trang (default: 20, max: 100)
- `q` (string): Từ khóa tìm kiếm
- `minPrice` (number): Giá tối thiểu
- `maxPrice` (number): Giá tối đa
- `featured` (boolean): Chỉ sản phẩm nổi bật
- `sortBy` (string): Sắp xếp theo (createdAt, name, priceCents)
- `sortOrder` (string): Thứ tự sắp xếp (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "prod_123",
        "slug": "tai-nghe-sony-wh1000xm4",
        "name": "Tai nghe Sony WH-1000XM4",
        "description": "Tai nghe chống ồn cao cấp",
        "priceCents": 8500000,
        "imageUrl": "https://example.com/image.jpg",
        "featured": true,
        "category": {
          "id": "cat_1",
          "name": "Tai nghe"
        }
      }
    ],
    "total": 150,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### GET `/catalog/products/:slug`
**Lấy chi tiết sản phẩm**

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "slug": "tai-nghe-sony-wh1000xm4",
    "name": "Tai nghe Sony WH-1000XM4",
    "description": "Tai nghe chống ồn cao cấp",
    "priceCents": 8500000,
    "imageUrl": "https://example.com/image.jpg",
    "images": ["url1", "url2"],
    "inventory": {
      "stock": 10,
      "reserved": 2
    },
    "category": {
      "id": "cat_1",
      "name": "Tai nghe"
    },
    "reviews": [
      {
        "id": "review_1",
        "rating": 5,
        "comment": "Sản phẩm rất tốt",
        "user": {
          "name": "Nguyễn Văn A"
        }
      }
    ]
  }
}
```

---

### GET `/catalog/categories`
**Lấy danh sách danh mục**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_1",
      "slug": "tai-nghe",
      "name": "Tai nghe",
      "parentId": null
    }
  ]
}
```

---

## 🛍️ Cart Endpoints

### GET `/cart`
**Lấy giỏ hàng hiện tại**

**Headers:** `Authorization: Bearer <access_token>` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart_123",
    "items": [
      {
        "id": "item_1",
        "productId": "prod_123",
        "quantity": 2,
        "unitPrice": 8500000,
        "product": {
          "name": "Tai nghe Sony WH-1000XM4",
          "imageUrl": "https://example.com/image.jpg"
        }
      }
    ],
    "totalCents": 17000000
  }
}
```

---

### POST `/cart/items`
**Thêm sản phẩm vào giỏ hàng**

**Headers:** `Authorization: Bearer <access_token>` (optional)

**Request Body:**
```json
{
  "productId": "prod_123",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Sản phẩm đã được thêm vào giỏ hàng"
  }
}
```

---

### PUT `/cart/items/:itemId`
**Cập nhật số lượng sản phẩm**

**Request Body:**
```json
{
  "quantity": 3
}
```

---

### DELETE `/cart/items/:itemId`
**Xóa sản phẩm khỏi giỏ hàng**

---

### DELETE `/cart`
**Xóa toàn bộ giỏ hàng**

---

## 💳 Checkout Endpoints

### POST `/checkout`
**Tạo đơn hàng**

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "shippingAddress": {
    "name": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận 1, TP.HCM"
  },
  "paymentMethod": "MOMO",
  "promoCode": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_123",
    "orderNo": "ATL20241201001",
    "totalCents": 15300000,
    "paymentUrl": "https://payment.momo.vn/...",
    "expiresAt": "2024-12-01T10:30:00Z"
  }
}
```

---

### GET `/orders`
**Lấy danh sách đơn hàng**

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `page` (number): Trang hiện tại
- `pageSize` (number): Số đơn hàng mỗi trang
- `status` (string): Lọc theo trạng thái

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "order_123",
        "orderNo": "ATL20241201001",
        "status": "PAID",
        "totalCents": 15300000,
        "createdAt": "2024-12-01T10:00:00Z",
        "items": [
          {
            "productName": "Tai nghe Sony WH-1000XM4",
            "quantity": 2,
            "unitPrice": 8500000
          }
        ]
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### GET `/orders/:orderId`
**Lấy chi tiết đơn hàng**

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_123",
    "orderNo": "ATL20241201001",
    "status": "PAID",
    "totalCents": 15300000,
    "shippingAddress": {
      "name": "Nguyễn Văn A",
      "phone": "0123456789",
      "address": "123 Đường ABC, Quận 1, TP.HCM"
    },
    "items": [
      {
        "productName": "Tai nghe Sony WH-1000XM4",
        "quantity": 2,
        "unitPrice": 8500000
      }
    ],
    "payments": [
      {
        "method": "MOMO",
        "amount": 15300000,
        "status": "SUCCESS",
        "transactionId": "momo_123"
      }
    ],
    "createdAt": "2024-12-01T10:00:00Z",
    "updatedAt": "2024-12-01T10:15:00Z"
  }
}
```

---

## 💬 Chat Endpoints

### GET `/chat/sessions`
**Lấy danh sách phiên chat (Admin only)**

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `status` (string): OPEN, ESCALATED, CLOSED
- `page` (number): Trang hiện tại
- `pageSize` (number): Số phiên mỗi trang

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "session_123",
        "status": "OPEN",
        "userId": "user_123",
        "messageCount": 5,
        "lastMessageAt": "2024-12-01T10:00:00Z",
        "createdAt": "2024-12-01T09:30:00Z"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### GET `/chat/sessions/:sessionId`
**Lấy chi tiết phiên chat**

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session_123",
    "status": "OPEN",
    "userId": "user_123",
    "messages": [
      {
        "id": "msg_1",
        "role": "USER",
        "text": "Xin chào, tôi cần tư vấn về tai nghe",
        "createdAt": "2024-12-01T09:30:00Z"
      },
      {
        "id": "msg_2",
        "role": "ASSISTANT",
        "text": "Chào bạn! Tôi có thể giúp bạn tìm hiểu về tai nghe. Bạn đang quan tâm đến loại tai nghe nào?",
        "createdAt": "2024-12-01T09:30:05Z"
      }
    ],
    "createdAt": "2024-12-01T09:30:00Z",
    "updatedAt": "2024-12-01T10:00:00Z"
  }
}
```

---

### POST `/chat/sessions/:sessionId/messages`
**Gửi tin nhắn (Admin only)**

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "text": "Cảm ơn bạn đã liên hệ!"
}
```

---

### PATCH `/chat/sessions/:sessionId/escalate`
**Escalate phiên chat (Admin only)**

**Headers:** `Authorization: Bearer <access_token>`

---

### PATCH `/chat/sessions/:sessionId/close`
**Đóng phiên chat (Admin only)**

**Headers:** `Authorization: Bearer <access_token>`

---

### GET `/chat/sessions/:sessionId/analytics`
**Lấy thống kê phiên chat (Admin only)**

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_123",
    "totalMessages": 10,
    "userMessages": 5,
    "assistantMessages": 4,
    "staffMessages": 1,
    "averageResponseTime": 5000,
    "sessionDuration": 1800000,
    "status": "OPEN"
  }
}
```

---

### GET `/chat/stats`
**Lấy thống kê tổng quan chat (Admin only)**

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSessions": 100,
    "openSessions": 15,
    "escalatedSessions": 5,
    "closedSessions": 80,
    "escalationRate": 5.0,
    "resolutionRate": 80.0
  }
}
```

---

## 🔍 Search Endpoints

### GET `/search`
**Tìm kiếm sản phẩm**

**Query Parameters:**
- `q` (string): Từ khóa tìm kiếm
- `category` (string): Lọc theo danh mục
- `minPrice` (number): Giá tối thiểu
- `maxPrice` (number): Giá tối đa
- `inStock` (boolean): Chỉ sản phẩm còn hàng
- `featured` (boolean): Chỉ sản phẩm nổi bật
- `sortBy` (string): Sắp xếp theo
- `sortOrder` (string): Thứ tự sắp xếp
- `limit` (number): Số kết quả (max: 100)
- `offset` (number): Offset

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "prod_123",
        "name": "Tai nghe Sony WH-1000XM4",
        "description": "Tai nghe chống ồn cao cấp",
        "priceCents": 8500000,
        "imageUrl": "https://example.com/image.jpg",
        "score": 0.95
      }
    ],
    "total": 25,
    "query": "tai nghe sony",
    "enhancedQuery": "tai nghe sony wh1000xm4 noise cancelling"
  }
}
```

---

### GET `/search/suggestions`
**Lấy gợi ý tìm kiếm**

**Query Parameters:**
- `q` (string): Từ khóa (partial)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "product",
      "value": "Tai nghe Sony WH-1000XM4",
      "count": 1
    },
    {
      "type": "category",
      "value": "Tai nghe",
      "count": 15
    }
  ]
}
```

---

## 🔔 Notification Endpoints

### GET `/notifications`
**Lấy danh sách thông báo**

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `page` (number): Trang hiện tại
- `pageSize` (number): Số thông báo mỗi trang
- `read` (boolean): Lọc theo trạng thái đọc

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "notif_123",
        "type": "order_update",
        "title": "Cập nhật đơn hàng",
        "message": "Đơn hàng ATL20241201001 đã được xử lý",
        "read": false,
        "data": {
          "orderId": "order_123",
          "orderNo": "ATL20241201001"
        },
        "createdAt": "2024-12-01T10:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### PATCH `/notifications/:notificationId/read`
**Đánh dấu thông báo đã đọc**

**Headers:** `Authorization: Bearer <access_token>`

---

### PATCH `/notifications/read-all`
**Đánh dấu tất cả thông báo đã đọc**

**Headers:** `Authorization: Bearer <access_token>`

---

### GET `/notifications/stats`
**Lấy thống kê thông báo**

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "unread": 3,
    "read": 7,
    "unreadPercentage": 30.0
  }
}
```

---

## 💳 Payment Endpoints

### POST `/payments/webhooks/momo`
**Webhook MOMO**

**Request Body:**
```json
{
  "orderId": "ATL20241201001",
  "resultCode": 0,
  "transId": "momo_123",
  "amount": 15300000,
  "signature": "abc123..."
}
```

**Response:**
```json
{
  "resultCode": 0,
  "message": "success"
}
```

---

### POST `/payments/webhooks/payos`
**Webhook PayOS**

**Request Body:**
```json
{
  "orderId": "ATL20241201001",
  "status": "success",
  "transactionId": "payos_123",
  "amount": 15300000,
  "signature": "abc123..."
}
```

**Response:**
```json
{
  "resultCode": 0,
  "message": "success"
}
```

---

## 📊 Analytics Endpoints

### GET `/analytics/sales`
**Lấy thống kê bán hàng (Admin only)**

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `startDate` (string): Ngày bắt đầu (ISO)
- `endDate` (string): Ngày kết thúc (ISO)
- `groupBy` (string): Nhóm theo (day, week, month)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 150000000,
    "totalOrders": 50,
    "averageOrderValue": 3000000,
    "conversionRate": 2.5,
    "revenueGrowth": 15.5,
    "orderGrowth": 12.0,
    "salesByPeriod": [
      {
        "period": "2024-12-01",
        "revenue": 5000000,
        "orders": 2,
        "customers": 2
      }
    ]
  }
}
```

---

### GET `/analytics/customers`
**Lấy thống kê khách hàng (Admin only)**

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 1000,
    "newCustomers": 50,
    "returningCustomers": 200,
    "customerRetentionRate": 20.0,
    "customerLifetimeValue": 5000000,
    "averageOrdersPerCustomer": 2.5
  }
}
```

---

## 🏥 Health Check Endpoints

### GET `/health`
**Kiểm tra sức khỏe hệ thống**

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-01T10:00:00Z"
}
```

---

### GET `/health/detailed`
**Kiểm tra chi tiết sức khỏe hệ thống**

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-01T10:00:00Z",
  "uptime": 86400000,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database is healthy",
      "responseTime": 15
    },
    "memory": {
      "status": "healthy",
      "message": "Memory usage is normal",
      "details": {
        "used": 1073741824,
        "total": 2147483648,
        "percentage": 50.0
      }
    },
    "disk": {
      "status": "healthy",
      "message": "Disk space is available"
    },
    "dependencies": {
      "status": "healthy",
      "message": "All dependencies are healthy"
    }
  }
}
```

---

## 🔌 WebSocket Events

### Connection
```javascript
// Kết nối WebSocket
const socket = io('https://api.audiotailoc.com', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Chat Events

#### `join_session`
```javascript
// Tham gia phiên chat
socket.emit('join_session', { sessionId: 'session_123' });
```

#### `leave_session`
```javascript
// Rời khỏi phiên chat
socket.emit('leave_session', { sessionId: 'session_123' });
```

#### `send_message`
```javascript
// Gửi tin nhắn
socket.emit('send_message', {
  sessionId: 'session_123',
  text: 'Xin chào!'
});
```

#### `typing`
```javascript
// Hiển thị trạng thái đang gõ
socket.emit('typing', {
  sessionId: 'session_123',
  isTyping: true
});
```

#### `session_history`
```javascript
// Nhận lịch sử chat
socket.on('session_history', (data) => {
  console.log('Chat history:', data);
});
```

#### `new_message`
```javascript
// Nhận tin nhắn mới
socket.on('new_message', (data) => {
  console.log('New message:', data);
});
```

#### `ai_response`
```javascript
// Nhận phản hồi AI
socket.on('ai_response', (data) => {
  console.log('AI response:', data);
});
```

#### `user_typing`
```javascript
// Nhận trạng thái đang gõ của user khác
socket.on('user_typing', (data) => {
  console.log('User typing:', data);
});
```

### Notification Events

#### `new_notification`
```javascript
// Nhận thông báo mới
socket.on('new_notification', (data) => {
  console.log('New notification:', data);
});
```

#### `pending_notifications`
```javascript
// Nhận thông báo chờ
socket.on('pending_notifications', (data) => {
  console.log('Pending notifications:', data);
});
```

#### `notification_updated`
```javascript
// Cập nhật trạng thái thông báo
socket.on('notification_updated', (data) => {
  console.log('Notification updated:', data);
});
```

---

## ⚠️ Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Lỗi validation
- `AUTHENTICATION_ERROR`: Lỗi xác thực
- `AUTHORIZATION_ERROR`: Lỗi phân quyền
- `NOT_FOUND`: Không tìm thấy
- `CONFLICT`: Xung đột dữ liệu
- `RATE_LIMIT_EXCEEDED`: Vượt quá giới hạn
- `INTERNAL_SERVER_ERROR`: Lỗi server

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `429`: Too Many Requests
- `500`: Internal Server Error

---

## 📝 Rate Limiting

### Authentication Endpoints
- Register: 3 requests/minute
- Login: 5 requests/minute
- Refresh: 10 requests/minute

### General Endpoints
- GET requests: 100 requests/minute
- POST requests: 50 requests/minute
- PUT/DELETE requests: 30 requests/minute

### WebSocket
- Connection: 10 connections/minute
- Messages: 100 messages/minute

---

## 🔒 Security

### Authentication
- JWT tokens với expiration
- Refresh token rotation
- Account lockout protection

### Data Protection
- Input validation và sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Headers
- CORS configuration
- Security headers (Helmet)
- Rate limiting headers

---

*API Documentation for Audio Tài Lộc Backend*
*Last updated: ${new Date().toISOString()}*

### Maps (updated)
- GET `/maps/geocode?query=...`
- GET `/maps/directions?from=lat,lng&to=lat,lng`
- GET `/maps/reverse?latlng=lat,lng`
- GET `/maps/place-detail?placeId=...`

ENV: `GOONG_API_KEY`

### Meilisearch
- ENV: `MEILI_ENABLED=true`
- ENV: `MEILI_URL=http://localhost:7700`
- ENV: `MEILI_API_KEY=...` (nếu bật auth)

SearchService sẽ ưu tiên Meilisearch khi bật `MEILI_ENABLED=true`, fallback sang Prisma nếu Meili không khả dụng.
