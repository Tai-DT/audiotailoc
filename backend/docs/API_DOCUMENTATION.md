# Audio Tài Lộc API Documentation

## Overview

The Audio Tài Lộc API is a comprehensive RESTful API built with NestJS, providing e-commerce, service booking, and content management capabilities. The API is versioned and currently on **v1**, with all endpoints prefixed with `/api/v1`.

**Base URL:** `http://localhost:3010/api/v1`
**Documentation:** `http://localhost:3010/docs`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Core Endpoints](#core-endpoints)
3. [Error Handling](#error-handling)
4. [Response Format](#response-format)
5. [Rate Limiting](#rate-limiting)
6. [Pagination](#pagination)
7. [Detailed Endpoint Reference](#detailed-endpoint-reference)

---

## Authentication

### JWT Bearer Token

The API uses JWT (JSON Web Token) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Register User
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2024-11-12T10:30:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Refresh Token
```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200 OK):
{
  "success": true,
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## Response Format

All API responses follow a standardized format:

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    // Response payload
  },
  "timestamp": "2024-11-12T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Bad Request",
  "errors": [
    "Field validation error"
  ],
  "timestamp": "2024-11-12T10:30:00Z"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE with no response body |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate unique field |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Responses

```json
// Validation Error
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    "email: must be an email",
    "password: must be longer than or equal to 8 characters"
  ]
}

// Unauthorized
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or missing authentication token"
}

// Not Found
{
  "success": false,
  "statusCode": 404,
  "message": "Not Found",
  "error": "Product not found"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit:** 1000 requests per 15 minutes per IP
- **Headers:** Response includes `RateLimit-*` headers
- **Exclusion:** Health check endpoints are excluded

**Rate Limit Headers:**
```
RateLimit-Limit: 1000
RateLimit-Remaining: 999
RateLimit-Reset: 1699776600
```

When rate limit is exceeded:
```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Pagination

List endpoints support pagination with the following query parameters:

```
GET /api/v1/products?page=1&limit=20&sort=-createdAt

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 20, max: 100)
- sort: Sort field with direction (-field for DESC, field for ASC)
- search: Search query
```

**Paginated Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    { "id": "1", "name": "Product 1" },
    { "id": "2", "name": "Product 2" }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasMore": true
  }
}
```

---

## Core Endpoints

### Health Check

#### Check API Health
```
GET /api/v1/health

Response (200 OK):
{
  "status": "ok",
  "timestamp": "2024-11-12T10:30:00Z",
  "uptime": 3600
}
```

---

## Detailed Endpoint Reference

### Users Module (`/users`)

#### Get Current User
```
GET /api/v1/users/me
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+84912345678",
    "role": "USER",
    "createdAt": "2024-10-01T00:00:00Z",
    "updatedAt": "2024-11-12T10:30:00Z"
  }
}
```

#### Update User Profile
```
PUT /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+84912345678"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Updated",
    "phone": "+84912345678",
    "role": "USER",
    "updatedAt": "2024-11-12T10:35:00Z"
  }
}
```

#### Change Password
```
POST /api/v1/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Catalog Module (`/catalog`)

#### Get All Products
```
GET /api/v1/catalog/products?page=1&limit=20&search=audio

Query Parameters:
- page: Page number
- limit: Items per page
- search: Search query
- category: Filter by category ID
- featured: Filter featured (true/false)
- sort: Sort field (-createdAt, name, price)

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "prod_1",
      "name": "Audio Speaker",
      "slug": "audio-speaker",
      "description": "High-quality audio speaker",
      "shortDescription": "Premium audio",
      "priceCents": 50000,
      "originalPriceCents": 75000,
      "imageUrl": "https://...",
      "images": "[...]",
      "inventory": {
        "stock": 50,
        "lowStockThreshold": 5
      },
      "featured": true,
      "isActive": true,
      "viewCount": 150,
      "createdAt": "2024-10-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "totalPages": 13
  }
}
```

#### Get Product By ID
```
GET /api/v1/catalog/products/:id

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "prod_1",
    "name": "Audio Speaker",
    "slug": "audio-speaker",
    "description": "High-quality audio speaker with wireless connectivity",
    "shortDescription": "Premium audio",
    "priceCents": 50000,
    "originalPriceCents": 75000,
    "imageUrl": "https://...",
    "images": "[{\"url\": \"...\"}, ...]",
    "categoryId": "cat_1",
    "category": {
      "id": "cat_1",
      "name": "Electronics",
      "slug": "electronics"
    },
    "brand": "AudioBrand",
    "model": "AB-1000",
    "sku": "SKU123456",
    "specifications": "{\"power\": \"100W\", \"frequency\": \"20Hz-20kHz\"}",
    "features": "[\"Wireless\", \"Bluetooth 5.0\", \"Long battery life\"]",
    "warranty": "2 years",
    "weight": 2.5,
    "dimensions": "10x10x15cm",
    "minOrderQuantity": 1,
    "maxOrderQuantity": 5,
    "viewCount": 150,
    "createdAt": "2024-10-01T00:00:00Z",
    "updatedAt": "2024-11-12T10:30:00Z"
  }
}
```

#### Get Product By Slug
```
GET /api/v1/catalog/products/slug/:slug

Response (200 OK): Same as Get Product By ID
```

#### Create Product (Admin)
```
POST /api/v1/catalog/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Product",
  "slug": "new-product",
  "description": "Product description",
  "shortDescription": "Short desc",
  "priceCents": 100000,
  "originalPriceCents": 150000,
  "categoryId": "cat_1",
  "brand": "BrandName",
  "model": "Model-123",
  "sku": "SKU789",
  "specifications": "{\"power\": \"50W\"}",
  "features": "[\"Feature1\", \"Feature2\"]",
  "warranty": "1 year",
  "weight": 2.0,
  "dimensions": "10x10x10cm",
  "minOrderQuantity": 1,
  "maxOrderQuantity": 10
}

Response (201 Created):
{
  "success": true,
  "data": { /* Created product object */ }
}
```

#### Update Product (Admin)
```
PUT /api/v1/catalog/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "priceCents": 95000
}

Response (200 OK):
{
  "success": true,
  "data": { /* Updated product object */ }
}
```

#### Delete Product (Admin)
```
DELETE /api/v1/catalog/products/:id
Authorization: Bearer <admin_token>

Response (204 No Content)
```

#### Get Product Categories
```
GET /api/v1/catalog/categories

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "cat_1",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices",
      "imageUrl": "https://...",
      "isActive": true,
      "parentId": null,
      "children": [
        {
          "id": "cat_2",
          "name": "Speakers",
          "slug": "speakers",
          "parentId": "cat_1"
        }
      ],
      "createdAt": "2024-10-01T00:00:00Z"
    }
  ]
}
```

### Cart Module (`/cart`)

#### Get Cart
```
GET /api/v1/cart
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "cart_1",
    "userId": "user_1",
    "status": "ACTIVE",
    "items": [
      {
        "id": "item_1",
        "productId": "prod_1",
        "quantity": 2,
        "price": 50000,
        "product": {
          "id": "prod_1",
          "name": "Audio Speaker",
          "imageUrl": "https://...",
          "priceCents": 50000
        }
      }
    ],
    "createdAt": "2024-11-12T09:00:00Z",
    "updatedAt": "2024-11-12T10:30:00Z"
  }
}
```

#### Add to Cart
```
POST /api/v1/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "prod_1",
  "quantity": 2
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "item_1",
    "cartId": "cart_1",
    "productId": "prod_1",
    "quantity": 2,
    "price": 50000,
    "product": { /* Product details */ }
  }
}
```

#### Update Cart Item
```
PUT /api/v1/cart/items/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}

Response (200 OK):
{
  "success": true,
  "data": { /* Updated cart item */ }
}
```

#### Remove from Cart
```
DELETE /api/v1/cart/items/:itemId
Authorization: Bearer <token>

Response (204 No Content)
```

#### Clear Cart
```
DELETE /api/v1/cart/clear
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

### Orders Module (`/orders`)

#### Create Order
```
POST /api/v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": "123 Main St, City, Country",
  "shippingCoordinates": "10.7769,106.7009",
  "promotionCode": "DISCOUNT10"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "order_1",
    "orderNo": "ORD-2024-001",
    "userId": "user_1",
    "subtotalCents": 100000,
    "discountCents": 10000,
    "shippingCents": 5000,
    "totalCents": 95000,
    "status": "PENDING",
    "shippingAddress": "123 Main St",
    "promotionCode": "DISCOUNT10",
    "items": [
      {
        "id": "item_1",
        "productId": "prod_1",
        "quantity": 2,
        "price": 50000,
        "name": "Audio Speaker",
        "imageUrl": "https://..."
      }
    ],
    "createdAt": "2024-11-12T10:30:00Z"
  }
}
```

#### Get Orders
```
GET /api/v1/orders?page=1&limit=10&status=PENDING
Authorization: Bearer <token>

Query Parameters:
- page: Page number
- limit: Items per page
- status: Filter by status (PENDING, CONFIRMED, PROCESSING, COMPLETED, CANCELLED)
- sort: Sort field

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "order_1",
      "orderNo": "ORD-2024-001",
      "userId": "user_1",
      "totalCents": 95000,
      "status": "PENDING",
      "items": [ /* Order items */ ],
      "createdAt": "2024-11-12T10:30:00Z",
      "updatedAt": "2024-11-12T10:30:00Z"
    }
  ],
  "pagination": { /* Pagination info */ }
}
```

#### Get Order By ID
```
GET /api/v1/orders/:id
Authorization: Bearer <token>

Response (200 OK): Single order object
```

#### Cancel Order
```
POST /api/v1/orders/:id/cancel
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": { /* Updated order */ }
}
```

### Payments Module (`/payments`)

#### Create Payment Intent
```
POST /api/v1/payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_1",
  "provider": "payos",
  "amountCents": 95000
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "intent_1",
    "orderId": "order_1",
    "provider": "payos",
    "amountCents": 95000,
    "status": "PENDING",
    "clientSecret": "secret_...",
    "returnUrl": "http://localhost:3000/checkout/return"
  }
}
```

#### Confirm Payment
```
POST /api/v1/payments/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "intentId": "intent_1",
  "transactionId": "txn_123456"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "payment_1",
    "orderId": "order_1",
    "intentId": "intent_1",
    "provider": "payos",
    "amountCents": 95000,
    "status": "SUCCESS",
    "transactionId": "txn_123456"
  }
}
```

#### Get Payment Status
```
GET /api/v1/payments/:id
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "payment_1",
    "orderId": "order_1",
    "provider": "payos",
    "amountCents": 95000,
    "status": "SUCCESS",
    "transactionId": "txn_123456",
    "createdAt": "2024-11-12T10:30:00Z"
  }
}
```

### Services Module (`/services`)

#### Get Services
```
GET /api/v1/services?page=1&limit=20&featured=true

Query Parameters:
- page: Page number
- limit: Items per page
- featured: Filter featured services
- typeId: Filter by service type
- search: Search query

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "svc_1",
      "name": "Audio Repair Service",
      "slug": "audio-repair",
      "description": "Professional audio equipment repair",
      "shortDescription": "Expert repairs",
      "basePriceCents": 50000,
      "price": 50000,
      "duration": 120,
      "typeId": "type_1",
      "images": "[...]",
      "isFeatured": true,
      "viewCount": 200,
      "createdAt": "2024-10-01T00:00:00Z"
    }
  ],
  "pagination": { /* Pagination info */ }
}
```

#### Get Service By ID
```
GET /api/v1/services/:id

Response (200 OK): Single service object
```

#### Get Service Types
```
GET /api/v1/service-types

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "type_1",
      "name": "Repair Services",
      "slug": "repair-services",
      "icon": "wrench",
      "color": "#FF5733",
      "isActive": true,
      "sortOrder": 1
    }
  ]
}
```

### Bookings Module (`/bookings`)

#### Create Service Booking
```
POST /api/v1/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": "svc_1",
  "scheduledAt": "2024-12-01T14:00:00Z",
  "notes": "Additional service notes"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "booking_1",
    "userId": "user_1",
    "serviceId": "svc_1",
    "status": "PENDING",
    "scheduledAt": "2024-12-01T14:00:00Z",
    "estimatedCosts": 50000,
    "notes": "Additional service notes",
    "createdAt": "2024-11-12T10:30:00Z"
  }
}
```

#### Get Bookings
```
GET /api/v1/bookings?page=1&limit=10&status=PENDING
Authorization: Bearer <token>

Query Parameters:
- page: Page number
- limit: Items per page
- status: Filter by status

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "booking_1",
      "userId": "user_1",
      "serviceId": "svc_1",
      "service": { /* Service details */ },
      "status": "PENDING",
      "scheduledAt": "2024-12-01T14:00:00Z",
      "estimatedCosts": 50000
    }
  ],
  "pagination": { /* Pagination info */ }
}
```

#### Update Booking
```
PUT /api/v1/bookings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "scheduledAt": "2024-12-02T14:00:00Z",
  "notes": "Updated notes"
}

Response (200 OK): Updated booking object
```

#### Cancel Booking
```
POST /api/v1/bookings/:id/cancel
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

### Wishlist Module (`/wishlist`)

#### Get Wishlist
```
GET /api/v1/wishlist
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "item_1",
      "productId": "prod_1",
      "product": { /* Product details */ },
      "createdAt": "2024-11-10T10:00:00Z"
    }
  ]
}
```

#### Add to Wishlist
```
POST /api/v1/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "prod_1"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "item_1",
    "productId": "prod_1",
    "userId": "user_1",
    "createdAt": "2024-11-12T10:30:00Z"
  }
}
```

#### Remove from Wishlist
```
DELETE /api/v1/wishlist/:itemId
Authorization: Bearer <token>

Response (204 No Content)
```

### Analytics Module (`/analytics`)

#### Get Analytics Data
```
GET /api/v1/analytics?metric=revenue&startDate=2024-11-01&endDate=2024-11-12
Authorization: Bearer <admin_token>

Query Parameters:
- metric: Type of metric (revenue, orders, users, products)
- startDate: Start date (YYYY-MM-DD)
- endDate: End date (YYYY-MM-DD)
- groupBy: Group by (day, week, month)

Response (200 OK):
{
  "success": true,
  "data": {
    "metric": "revenue",
    "period": "2024-11-01 to 2024-11-12",
    "total": 5000000,
    "data": [
      { "date": "2024-11-01", "value": 400000 },
      { "date": "2024-11-02", "value": 450000 }
    ]
  }
}
```

### Admin Module (`/admin`)

#### Get Dashboard Summary
```
GET /api/v1/admin/dashboard
Authorization: Bearer <admin_token>

Response (200 OK):
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalOrders": 320,
    "totalRevenue": 125000000,
    "totalProducts": 450,
    "recentOrders": [ /* Last 5 orders */ ],
    "topProducts": [ /* Top 5 products */ ]
  }
}
```

#### Get System Stats
```
GET /api/v1/admin/stats
Authorization: Bearer <admin_token>

Response (200 OK):
{
  "success": true,
  "data": {
    "dbConnections": 15,
    "cacheHitRate": 0.85,
    "averageResponseTime": 145,
    "errorRate": 0.002,
    "requestsPerMinute": 450
  }
}
```

---

## Common Query Parameters

### Sorting
```
sort=-createdAt    // Descending by createdAt
sort=name          // Ascending by name
```

### Filtering
```
?status=ACTIVE
?category=electronics
?featured=true
?isActive=false
```

### Search
```
?search=audio speaker
?q=keyword search
```

---

## Request/Response Examples

### Complete Checkout Flow

```javascript
// 1. User registers or logs in
POST /api/v1/auth/login
// Returns: accessToken, refreshToken

// 2. Add products to cart
POST /api/v1/cart/items
{
  "productId": "prod_1",
  "quantity": 2
}

// 3. View cart
GET /api/v1/cart

// 4. Create order
POST /api/v1/orders
{
  "shippingAddress": "123 Main St",
  "shippingCoordinates": "10.7769,106.7009",
  "promotionCode": "DISCOUNT10"
}

// 5. Create payment intent
POST /api/v1/payments/create-intent
{
  "orderId": "order_1",
  "provider": "payos",
  "amountCents": 95000
}

// 6. Confirm payment
POST /api/v1/payments/confirm
{
  "intentId": "intent_1",
  "transactionId": "txn_123456"
}

// 7. Check order status
GET /api/v1/orders/order_1
```

---

## Supported Payment Providers

- **PayOS** - Vietnamese payment gateway
- **VNPay** - Vietnamese payment processor
- **MoMo** - Vietnamese mobile payment

---

## SDK/Client Libraries

Coming soon:
- JavaScript/TypeScript SDK
- Python SDK
- Go SDK

---

## Versioning

The current API version is **v1**. All endpoints are prefixed with `/api/v1`.

Future versions will maintain backward compatibility with deprecation warnings.

---

## Support

For API support and issues:
- GitHub Issues: [Project Repository]
- Email: support@audiotailoc.vn
- Documentation: http://localhost:3010/docs
