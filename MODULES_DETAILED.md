# Chi Tiết Các Module Backend

## 📦 Backend Modules Breakdown

### 1. AUTHENTICATION & AUTHORIZATION (Xác thực & Phân quyền)

#### auth/
```
Chức năng:
- Đăng nhập (login)
- Đăng ký (register)
- Refresh token
- Logout
- JWT token management
- API Key validation

Endpoints:
POST   /auth/login
POST   /auth/register
POST   /auth/refresh
POST   /auth/logout
GET    /auth/verify
```

#### users/
```
Chức năng:
- Tạo người dùng
- Lấy thông tin người dùng
- Cập nhật hồ sơ
- Xóa tài khoản
- Quản lý mật khẩu

Endpoints:
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
PATCH  /users/:id/password
```

#### admin/
```
Chức năng:
- Quản lý admin
- Phân quyền
- Audit log
- Admin dashboard

Endpoints:
GET    /admin/users
POST   /admin/users
PUT    /admin/users/:id
DELETE /admin/users/:id
```

---

### 2. E-COMMERCE CORE (Lõi thương mại điện tử)

#### catalog/
```
Chức năng:
- Quản lý sản phẩm
- Danh mục sản phẩm
- Tìm kiếm sản phẩm
- Lọc & sắp xếp
- Thông tin chi tiết sản phẩm

Endpoints:
GET    /catalog/products
GET    /catalog/products/:id
POST   /catalog/products (admin)
PUT    /catalog/products/:id (admin)
DELETE /catalog/products/:id (admin)
GET    /catalog/categories
GET    /catalog/search
```

#### cart/
```
Chức năng:
- Thêm sản phẩm vào giỏ
- Xóa sản phẩm khỏi giỏ
- Cập nhật số lượng
- Lấy giỏ hàng
- Xóa giỏ hàng
- Tính tổng giá

Endpoints:
GET    /cart
POST   /cart/items
PUT    /cart/items/:itemId
DELETE /cart/items/:itemId
DELETE /cart
GET    /cart/total
```

#### checkout/
```
Chức năng:
- Xác nhận đơn hàng
- Xác thực thông tin giao hàng
- Tính phí vận chuyển
- Áp dụng mã giảm giá
- Tóm tắt đơn hàng

Endpoints:
POST   /checkout/validate
POST   /checkout/calculate-shipping
POST   /checkout/apply-coupon
GET    /checkout/summary
```

#### orders/
```
Chức năng:
- Tạo đơn hàng
- Lấy danh sách đơn hàng
- Chi tiết đơn hàng
- Cập nhật trạng thái
- Xóa đơn hàng
- Thống kê

Endpoints:
GET    /orders
GET    /orders/:id
POST   /orders
PATCH  /orders/:id
PATCH  /orders/:id/status/:status
DELETE /orders/:id
GET    /orders/stats
```

#### payments/
```
Chức năng:
- Xử lý thanh toán
- Tích hợp cổng thanh toán (PayOS)
- Xác nhận thanh toán
- Lịch sử thanh toán
- Hoàn tiền

Endpoints:
POST   /payments/process
POST   /payments/confirm
GET    /payments/:id
GET    /payments/order/:orderId
POST   /payments/refund/:id
```

#### inventory/
```
Chức năng:
- Quản lý tồn kho
- Cập nhật kho
- Cảnh báo hết hàng
- Chuyển động hàng hóa
- Báo cáo kho

Endpoints:
GET    /inventory
GET    /inventory/:productId
PUT    /inventory/:productId
POST   /inventory/movement
GET    /inventory/alerts
GET    /inventory/low-stock
```

#### wishlist/
```
Chức năng:
- Thêm vào danh sách yêu thích
- Xóa khỏi danh sách yêu thích
- Lấy danh sách yêu thích
- Chia sẻ danh sách

Endpoints:
GET    /wishlist
POST   /wishlist/:productId
DELETE /wishlist/:productId
GET    /wishlist/share/:shareId
```

#### promotions/
```
Chức năng:
- Tạo mã giảm giá
- Quản lý khuyến mãi
- Áp dụng khuyến mãi
- Thống kê khuyến mãi
- Hết hạn tự động

Endpoints:
GET    /promotions
GET    /promotions/:id
POST   /promotions (admin)
PUT    /promotions/:id (admin)
DELETE /promotions/:id (admin)
POST   /promotions/validate/:code
GET    /promotions/stats
```

---

### 3. REVIEWS & RATINGS (Đánh giá & Xếp hạng)

#### reviews/
```
Chức năng:
- Tạo đánh giá sản phẩm
- Lấy danh sách đánh giá
- Cập nhật đánh giá
- Xóa đánh giá
- Phê duyệt/Từ chối
- Đánh dấu hữu ích
- Thống kê đánh giá

Endpoints:
GET    /reviews
GET    /reviews/:id
POST   /reviews
PUT    /reviews/:id
DELETE /reviews/:id
PATCH  /reviews/:id/status/:status (admin)
PATCH  /reviews/:id/helpful/:helpful
GET    /reviews/stats/summary (admin)
GET    /reviews/product/:productId
```

---

### 4. SERVICES MANAGEMENT (Quản lý dịch vụ)

#### services/
```
Chức năng:
- Quản lý dịch vụ kỹ thuật
- Mô tả dịch vụ
- Giá dịch vụ
- Thời gian dịch vụ

Endpoints:
GET    /services
GET    /services/:id
POST   /services (admin)
PUT    /services/:id (admin)
DELETE /services/:id (admin)
```

#### service-types/
```
Chức năng:
- Quản lý loại dịch vụ
- Phân loại dịch vụ

Endpoints:
GET    /service-types
POST   /service-types (admin)
PUT    /service-types/:id (admin)
DELETE /service-types/:id (admin)
```

#### booking/
```
Chức năng:
- Đặt lịch dịch vụ
- Lấy danh sách đặt lịch
- Cập nhật trạng thái
- Hủy đặt lịch
- Lịch sử đặt lịch

Endpoints:
GET    /booking
GET    /booking/:id
POST   /booking
PUT    /booking/:id
DELETE /booking/:id
GET    /booking/user/:userId
PATCH  /booking/:id/status/:status
```

#### technicians/
```
Chức năng:
- Quản lý kỹ thuật viên
- Gán công việc
- Lịch làm việc
- Đánh giá kỹ thuật viên

Endpoints:
GET    /technicians
GET    /technicians/:id
POST   /technicians (admin)
PUT    /technicians/:id (admin)
DELETE /technicians/:id (admin)
GET    /technicians/:id/schedule
```

---

### 5. CONTENT MANAGEMENT (Quản lý nội dung)

#### blog/
```
Chức năng:
- Tạo bài viết blog
- Quản lý bài viết
- Phân loại bài viết
- Tìm kiếm bài viết
- Bình luận

Endpoints:
GET    /blog
GET    /blog/:id
POST   /blog (admin)
PUT    /blog/:id (admin)
DELETE /blog/:id (admin)
GET    /blog/category/:categoryId
```

#### projects/
```
Chức năng:
- Quản lý dự án/portfolio
- Upload hình ảnh dự án
- Mô tả dự án
- Phân loại dự án

Endpoints:
GET    /projects
GET    /projects/:id
POST   /projects (admin)
PUT    /projects/:id (admin)
DELETE /projects/:id (admin)
POST   /projects/:id/upload
```

#### site/
```
Chức năng:
- Quản lý banner
- Cấu hình website
- Thống kê website
- Lời chứng thực

Endpoints:
GET    /site/banners
POST   /site/banners (admin)
PUT    /site/banners/:id (admin)
DELETE /site/banners/:id (admin)
GET    /site/settings
PUT    /site/settings (admin)
GET    /site/stats
GET    /site/testimonials
```

#### categories/
```
Chức năng:
- Quản lý danh mục
- Phân cấp danh mục
- Sắp xếp danh mục

Endpoints:
GET    /categories
GET    /categories/:id
POST   /categories (admin)
PUT    /categories/:id (admin)
DELETE /categories/:id (admin)
```

#### seo/
```
Chức năng:
- Tối ưu SEO
- Meta tags
- Structured data
- Sitemap

Endpoints:
GET    /seo/meta/:page
PUT    /seo/meta/:page (admin)
GET    /seo/sitemap
GET    /seo/robots.txt
```

---

### 6. COMMUNICATION (Giao tiếp)

#### messages/
```
Chức năng:
- Gửi tin nhắn
- Lấy tin nhắn
- Xóa tin nhắn
- Đánh dấu đã đọc

Endpoints:
GET    /messages
GET    /messages/:id
POST   /messages
DELETE /messages/:id
PATCH  /messages/:id/read
```

#### chat/
```
Chức năng:
- Chat trực tiếp
- Lịch sử chat
- Thông báo chat

Endpoints:
GET    /chat/conversations
GET    /chat/:conversationId
POST   /chat/message
DELETE /chat/:conversationId
```

#### notifications/
```
Chức năng:
- Gửi thông báo
- Email notification
- Push notification
- Lịch sử thông báo

Endpoints:
GET    /notifications
POST   /notifications (admin)
DELETE /notifications/:id
PATCH  /notifications/:id/read
POST   /notifications/email (admin)
```

#### support/
```
Chức năng:
- Tạo vé hỗ trợ
- Quản lý vé
- Trả lời vé
- Đóng vé

Endpoints:
GET    /support/tickets
GET    /support/tickets/:id
POST   /support/tickets
PUT    /support/tickets/:id
POST   /support/tickets/:id/reply
PATCH  /support/tickets/:id/status/:status
```

---

### 7. ADVANCED FEATURES (Tính năng nâng cao)

#### search/
```
Chức năng:
- Tìm kiếm toàn văn
- Gợi ý tìm kiếm
- Lọc kết quả
- Lịch sử tìm kiếm

Endpoints:
GET    /search
GET    /search/suggestions
GET    /search/history
```

#### analytics/
```
Chức năng:
- Thống kê doanh số
- Phân tích khách hàng
- Báo cáo bán hàng
- Phân tích sản phẩm

Endpoints:
GET    /analytics/sales
GET    /analytics/customers
GET    /analytics/products
GET    /analytics/revenue
```

#### ai/
```
Chức năng:
- Gợi ý sản phẩm
- Chatbot AI
- Phân tích dữ liệu

Endpoints:
GET    /ai/recommendations/:userId
POST   /ai/chat
GET    /ai/insights
```

#### realtime/
```
Chức năng:
- WebSocket connections
- Real-time updates
- Live notifications
- Chat real-time

WebSocket Events:
- order:updated
- message:new
- notification:new
- inventory:updated
```

---

### 8. INFRASTRUCTURE & UTILITIES

#### files/
```
Chức năng:
- Upload file
- Xóa file
- Lấy file
- Quản lý file

Endpoints:
POST   /files/upload
GET    /files/:id
DELETE /files/:id
GET    /files/list
```

#### backup/
```
Chức năng:
- Backup dữ liệu
- Restore dữ liệu
- Lịch sử backup

Endpoints:
GET    /backup/list
POST   /backup/create (admin)
POST   /backup/restore/:id (admin)
```

#### health/
```
Chức năng:
- Health check
- Status API
- Dependencies check

Endpoints:
GET    /health
GET    /health/live
GET    /health/ready
```

#### caching/
```
Chức năng:
- Cache management
- Redis integration
- Cache invalidation

Endpoints:
GET    /cache/stats
DELETE /cache/clear (admin)
```

#### logging/
```
Chức năng:
- Log management
- Error logging
- Audit logging

Endpoints:
GET    /logs
GET    /logs/:id
DELETE /logs/:id (admin)
```

#### monitoring/
```
Chức năng:
- System monitoring
- Performance metrics
- Error tracking

Endpoints:
GET    /monitoring/metrics
GET    /monitoring/errors
GET    /monitoring/performance
```

#### webhooks/
```
Chức năng:
- Webhook management
- Event handling
- Retry logic

Endpoints:
GET    /webhooks
POST   /webhooks (admin)
PUT    /webhooks/:id (admin)
DELETE /webhooks/:id (admin)
```

#### maps/
```
Chức năng:
- Google Maps integration
- Geocoding
- Distance calculation

Endpoints:
GET    /maps/geocode
GET    /maps/distance
GET    /maps/nearby
```

---

## 🔗 Module Dependencies

```
App Module
├── Auth Module
│   └── Users Module
├── Catalog Module
│   └── Categories Module
├── Cart Module
│   └── Catalog Module
├── Checkout Module
│   ├── Cart Module
│   ├── Promotions Module
│   └── Payments Module
├── Orders Module
│   ├── Checkout Module
│   └── Inventory Module
├── Reviews Module
│   └── Catalog Module
├── Services Module
│   ├── Service Types Module
│   ├── Booking Module
│   └── Technicians Module
├── Blog Module
├── Projects Module
├── Site Module
├── SEO Module
├── Messages Module
├── Chat Module
├── Notifications Module
├── Support Module
├── Search Module
├── Analytics Module
├── AI Module
├── Realtime Module
├── Files Module
├── Backup Module
├── Health Module
├── Caching Module
├── Logging Module
├── Monitoring Module
├── Webhooks Module
└── Maps Module
```

---

## 📊 Data Relationships

```
User
├── Orders (1:N)
├── Reviews (1:N)
├── Messages (1:N)
├── Wishlist (1:N)
├── Bookings (1:N)
└── Support Tickets (1:N)

Product
├── Reviews (1:N)
├── OrderItems (1:N)
├── Inventory (1:1)
├── Promotions (N:M)
└── Categories (N:M)

Order
├── OrderItems (1:N)
├── Payments (1:N)
└── User (N:1)

Review
├── Product (N:1)
└── User (N:1)

Promotion
├── Products (N:M)
└── Orders (N:M)
```
