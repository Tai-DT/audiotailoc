# 🔧 API Dịch Vụ - Audio Tài Lộc

## 📋 Tổng Quan

Hệ thống Audio Tài Lộc cung cấp đầy đủ các API để quản lý dịch vụ âm thanh, bao gồm:
- **Service Management:** Quản lý danh mục dịch vụ
- **Booking System:** Hệ thống đặt lịch dịch vụ
- **Technician Management:** Quản lý kỹ thuật viên
- **Service Items:** Quản lý các hạng mục dịch vụ

---

## 🛠️ Service Management APIs

### Base URL
```
https://api.audiotailoc.com/v1/services
```

### 1. Lấy Danh Sách Dịch Vụ
```http
GET /services
```

**Query Parameters:**
- `category` (optional): Lọc theo danh mục dịch vụ
- `type` (optional): Lọc theo loại dịch vụ
- `isActive` (optional): Lọc theo trạng thái hoạt động
- `page` (optional): Số trang (default: 1)
- `pageSize` (optional): Số lượng mỗi trang (default: 20)

**Response:**
```json
{
  "total": 25,
  "page": 1,
  "pageSize": 20,
  "services": [
    {
      "id": "service_123",
      "name": "Lắp đặt hệ thống âm thanh",
      "slug": "lap-dat-he-thong-am-thanh",
      "description": "Dịch vụ lắp đặt hệ thống âm thanh chuyên nghiệp",
      "category": "INSTALLATION",
      "type": "AUDIO_SYSTEM",
      "basePriceCents": 5000000,
      "estimatedDuration": 120,
      "requirements": "Không gian lắp đặt, nguồn điện ổn định",
      "features": "Tư vấn thiết kế, lắp đặt, bảo hành",
      "imageUrl": "https://example.com/audio-system.jpg",
      "isActive": true,
      "items": [
        {
          "id": "item_123",
          "name": "Loa chính",
          "description": "Loa chính công suất cao",
          "priceCents": 2000000,
          "isRequired": true
        }
      ],
      "_count": {
        "bookings": 15
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 2. Lấy Chi Tiết Dịch Vụ
```http
GET /services/{id}
```

**Response:**
```json
{
  "id": "service_123",
  "name": "Lắp đặt hệ thống âm thanh",
  "slug": "lap-dat-he-thong-am-thanh",
  "description": "Dịch vụ lắp đặt hệ thống âm thanh chuyên nghiệp",
  "category": "INSTALLATION",
  "type": "AUDIO_SYSTEM",
  "basePriceCents": 5000000,
  "estimatedDuration": 120,
  "requirements": "Không gian lắp đặt, nguồn điện ổn định",
  "features": "Tư vấn thiết kế, lắp đặt, bảo hành",
  "imageUrl": "https://example.com/audio-system.jpg",
  "isActive": true,
  "items": [...],
  "bookings": [...],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 3. Lấy Dịch Vụ Theo Slug
```http
GET /services/slug/{slug}
```

### 4. Tạo Dịch Vụ Mới (Admin)
```http
POST /services
```

**Request Body:**
```json
{
  "name": "Bảo trì hệ thống âm thanh",
  "slug": "bao-tri-he-thong-am-thanh",
  "description": "Dịch vụ bảo trì định kỳ hệ thống âm thanh",
  "category": "MAINTENANCE",
  "type": "AUDIO_SYSTEM",
  "basePriceCents": 1000000,
  "estimatedDuration": 60,
  "requirements": "Hệ thống đã được lắp đặt",
  "features": "Kiểm tra, vệ sinh, thay thế linh kiện",
  "imageUrl": "https://example.com/maintenance.jpg"
}
```

### 5. Cập Nhật Dịch Vụ (Admin)
```http
PUT /services/{id}
```

**Request Body:**
```json
{
  "name": "Bảo trì hệ thống âm thanh Premium",
  "description": "Dịch vụ bảo trì cao cấp",
  "basePriceCents": 1500000,
  "isActive": true
}
```

### 6. Xóa Dịch Vụ (Admin)
```http
DELETE /services/{id}
```

### 7. Lấy Danh Mục Dịch Vụ
```http
GET /services/categories
```

**Response:**
```json
[
  {
    "value": "INSTALLATION",
    "label": "Lắp đặt"
  },
  {
    "value": "MAINTENANCE",
    "label": "Bảo trì"
  },
  {
    "value": "REPAIR",
    "label": "Sửa chữa"
  },
  {
    "value": "CONSULTATION",
    "label": "Tư vấn"
  }
]
```

### 8. Lấy Loại Dịch Vụ
```http
GET /services/types
```

**Response:**
```json
[
  {
    "value": "AUDIO_SYSTEM",
    "label": "Hệ thống âm thanh"
  },
  {
    "value": "LIGHTING_SYSTEM",
    "label": "Hệ thống ánh sáng"
  },
  {
    "value": "VIDEO_SYSTEM",
    "label": "Hệ thống video"
  },
  {
    "value": "STAGE_EQUIPMENT",
    "label": "Thiết bị sân khấu"
  }
]
```

### 9. Thống Kê Dịch Vụ
```http
GET /services/stats
```

**Response:**
```json
{
  "totalServices": 25,
  "activeServices": 20,
  "totalBookings": 150,
  "revenueThisMonth": 50000000,
  "popularServices": [
    {
      "serviceId": "service_123",
      "name": "Lắp đặt hệ thống âm thanh",
      "bookingCount": 45,
      "revenue": 225000000
    }
  ]
}
```

---

## 📅 Booking System APIs

### Base URL
```
https://api.audiotailoc.com/v1/bookings
```

### 1. Tạo Booking Mới
```http
POST /bookings
```

**Request Body:**
```json
{
  "serviceId": "service_123",
  "userId": "user_456",
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0912345678",
  "customerEmail": "nguyenvana@example.com",
  "customerAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "scheduledDate": "2024-02-15T00:00:00.000Z",
  "scheduledTime": "14:00",
  "notes": "Khách hàng muốn lắp đặt vào buổi chiều",
  "items": [
    {
      "itemId": "item_123",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "id": "booking_789",
  "bookingNo": "BK20240215001",
  "serviceId": "service_123",
  "userId": "user_456",
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0912345678",
  "customerEmail": "nguyenvana@example.com",
  "customerAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "scheduledDate": "2024-02-15T00:00:00.000Z",
  "scheduledTime": "14:00",
  "status": "PENDING",
  "technicianId": null,
  "notes": "Khách hàng muốn lắp đặt vào buổi chiều",
  "estimatedCosts": 5000000,
  "actualCosts": null,
  "completedAt": null,
  "items": [...],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 2. Lấy Danh Sách Booking
```http
GET /bookings
```

**Query Parameters:**
- `status` (optional): Lọc theo trạng thái
- `technicianId` (optional): Lọc theo kỹ thuật viên
- `userId` (optional): Lọc theo người dùng
- `serviceId` (optional): Lọc theo dịch vụ
- `fromDate` (optional): Từ ngày
- `toDate` (optional): Đến ngày
- `page` (optional): Số trang
- `pageSize` (optional): Số lượng mỗi trang

**Response:**
```json
{
  "total": 50,
  "page": 1,
  "pageSize": 20,
  "bookings": [
    {
      "id": "booking_789",
      "bookingNo": "BK20240215001",
      "service": {
        "id": "service_123",
        "name": "Lắp đặt hệ thống âm thanh"
      },
      "customerName": "Nguyễn Văn A",
      "customerPhone": "0912345678",
      "scheduledDate": "2024-02-15T00:00:00.000Z",
      "scheduledTime": "14:00",
      "status": "PENDING",
      "technician": null,
      "estimatedCosts": 5000000,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 3. Lấy Chi Tiết Booking
```http
GET /bookings/{id}
```

### 4. Cập Nhật Trạng Thái Booking
```http
PUT /bookings/{id}/status
```

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "note": "Đã xác nhận booking",
  "changedBy": "admin_123",
  "actualCosts": 5200000
}
```

### 5. Phân Công Kỹ Thuật Viên
```http
PUT /bookings/{id}/assign
```

**Request Body:**
```json
{
  "technicianId": "tech_456",
  "note": "Phân công kỹ thuật viên có kinh nghiệm"
}
```

### 6. Đổi Lịch Booking
```http
PUT /bookings/{id}/reschedule
```

**Request Body:**
```json
{
  "newDate": "2024-02-16T00:00:00.000Z",
  "newTime": "15:00",
  "note": "Khách hàng yêu cầu đổi lịch"
}
```

### 7. Hủy Booking
```http
PUT /bookings/{id}/cancel
```

**Request Body:**
```json
{
  "reason": "Khách hàng không có nhu cầu"
}
```

### 8. Thống Kê Booking
```http
GET /bookings/stats
```

**Query Parameters:**
- `fromDate` (optional): Từ ngày
- `toDate` (optional): Đến ngày
- `technicianId` (optional): Lọc theo kỹ thuật viên

**Response:**
```json
{
  "totalBookings": 150,
  "pendingBookings": 25,
  "confirmedBookings": 80,
  "completedBookings": 40,
  "cancelledBookings": 5,
  "totalRevenue": 750000000,
  "averageBookingValue": 5000000,
  "topServices": [
    {
      "serviceId": "service_123",
      "name": "Lắp đặt hệ thống âm thanh",
      "bookingCount": 45,
      "revenue": 225000000
    }
  ]
}
```

---

## 👷 Technician Management APIs

### Base URL
```
https://api.audiotailoc.com/v1/technicians
```

### 1. Tạo Kỹ Thuật Viên Mới (Admin)
```http
POST /technicians
```

**Request Body:**
```json
{
  "name": "Trần Văn B",
  "phone": "0987654321",
  "email": "tranvanb@example.com",
  "specialties": ["INSTALLATION", "MAINTENANCE"]
}
```

### 2. Lấy Danh Sách Kỹ Thuật Viên
```http
GET /technicians
```

**Query Parameters:**
- `isActive` (optional): Lọc theo trạng thái hoạt động
- `specialty` (optional): Lọc theo chuyên môn
- `page` (optional): Số trang
- `pageSize` (optional): Số lượng mỗi trang

**Response:**
```json
{
  "total": 15,
  "page": 1,
  "pageSize": 20,
  "technicians": [
    {
      "id": "tech_456",
      "name": "Trần Văn B",
      "phone": "0987654321",
      "email": "tranvanb@example.com",
      "specialties": ["INSTALLATION", "MAINTENANCE"],
      "isActive": true,
      "rating": 4.8,
      "completedBookings": 45,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 3. Lấy Kỹ Thuật Viên Có Sẵn
```http
GET /technicians/available
```

**Query Parameters:**
- `date`: Ngày cần kiểm tra
- `time`: Thời gian cần kiểm tra
- `specialty` (optional): Chuyên môn yêu cầu
- `duration` (optional): Thời gian làm việc (phút)

**Response:**
```json
[
  {
    "id": "tech_456",
    "name": "Trần Văn B",
    "phone": "0987654321",
    "specialties": ["INSTALLATION", "MAINTENANCE"],
    "rating": 4.8,
    "availableSlots": [
      {
        "startTime": "14:00",
        "endTime": "16:00"
      }
    ]
  }
]
```

### 4. Lấy Chi Tiết Kỹ Thuật Viên
```http
GET /technicians/{id}
```

### 5. Lấy Khối Lượng Công Việc
```http
GET /technicians/{id}/workload
```

**Query Parameters:**
- `fromDate` (optional): Từ ngày
- `toDate` (optional): Đến ngày

**Response:**
```json
{
  "technicianId": "tech_456",
  "name": "Trần Văn B",
  "totalBookings": 45,
  "completedBookings": 40,
  "pendingBookings": 5,
  "totalHours": 120,
  "averageRating": 4.8,
  "monthlyStats": [
    {
      "month": "2024-01",
      "bookings": 15,
      "hours": 40,
      "revenue": 75000000
    }
  ]
}
```

### 6. Cập Nhật Kỹ Thuật Viên (Admin)
```http
PUT /technicians/{id}
```

**Request Body:**
```json
{
  "name": "Trần Văn B (Senior)",
  "phone": "0987654321",
  "specialties": ["INSTALLATION", "MAINTENANCE", "REPAIR"],
  "isActive": true
}
```

### 7. Xóa Kỹ Thuật Viên (Admin)
```http
DELETE /technicians/{id}
```

### 8. Thiết Lập Lịch Làm Việc
```http
PUT /technicians/{id}/schedule
```

**Request Body:**
```json
{
  "schedules": [
    {
      "dayOfWeek": 1,
      "startTime": "08:00",
      "endTime": "17:00",
      "isAvailable": true
    },
    {
      "dayOfWeek": 2,
      "startTime": "08:00",
      "endTime": "17:00",
      "isAvailable": true
    }
  ]
}
```

### 9. Thống Kê Kỹ Thuật Viên
```http
GET /technicians/stats
```

**Response:**
```json
{
  "totalTechnicians": 15,
  "activeTechnicians": 12,
  "totalBookings": 450,
  "averageRating": 4.6,
  "topTechnicians": [
    {
      "id": "tech_456",
      "name": "Trần Văn B",
      "completedBookings": 45,
      "rating": 4.8,
      "revenue": 225000000
    }
  ]
}
```

---

## 🔧 Service Items APIs

### 1. Thêm Hạng Mục Dịch Vụ
```http
POST /services/{serviceId}/items
```

**Request Body:**
```json
{
  "name": "Loa phụ",
  "description": "Loa phụ công suất trung bình",
  "priceCents": 1000000,
  "isRequired": false
}
```

### 2. Cập Nhật Hạng Mục Dịch Vụ
```http
PUT /services/items/{itemId}
```

**Request Body:**
```json
{
  "name": "Loa phụ Premium",
  "priceCents": 1200000,
  "isRequired": true
}
```

### 3. Xóa Hạng Mục Dịch Vụ
```http
DELETE /services/items/{itemId}
```

---

## 💰 Payment Integration

### 1. Tạo Thanh Toán Cho Booking
```http
POST /bookings/{bookingId}/payments
```

**Request Body:**
```json
{
  "amountCents": 5000000,
  "paymentMethod": "VNPAY",
  "transactionId": "txn_123456"
}
```

### 2. Cập Nhật Trạng Thái Thanh Toán
```http
PUT /bookings/payments/{paymentId}/status
```

**Request Body:**
```json
{
  "status": "COMPLETED",
  "transactionId": "txn_123456"
}
```

---

## 📊 Service Categories & Types

### Service Categories
```typescript
enum ServiceCategory {
  INSTALLATION = "INSTALLATION",    // Lắp đặt
  MAINTENANCE = "MAINTENANCE",      // Bảo trì
  REPAIR = "REPAIR",               // Sửa chữa
  CONSULTATION = "CONSULTATION"     // Tư vấn
}
```

### Service Types
```typescript
enum ServiceType {
  AUDIO_EQUIPMENT = "AUDIO_EQUIPMENT",       // Thiết bị âm thanh
  HOME_THEATER = "HOME_THEATER",             // Rạp hát tại nhà
  PROFESSIONAL_SOUND = "PROFESSIONAL_SOUND", // Âm thanh chuyên nghiệp
  LIGHTING = "LIGHTING",                     // Ánh sáng
  CONSULTATION = "CONSULTATION",             // Tư vấn
  MAINTENANCE = "MAINTENANCE",               // Bảo trì
  OTHER = "OTHER"                            // Khác
}
```

### Booking Status
```typescript
enum ServiceBookingStatus {
  PENDING = "PENDING",           // Chờ xác nhận
  CONFIRMED = "CONFIRMED",       // Đã xác nhận
  IN_PROGRESS = "IN_PROGRESS",   // Đang thực hiện
  COMPLETED = "COMPLETED",       // Hoàn thành
  CANCELLED = "CANCELLED"        // Đã hủy
}
```

---

## 🔐 Authentication & Authorization

### Public APIs (Không cần authentication)
- `GET /services` - Lấy danh sách dịch vụ
- `GET /services/categories` - Lấy danh mục dịch vụ
- `GET /services/types` - Lấy loại dịch vụ
- `GET /services/{id}` - Lấy chi tiết dịch vụ
- `GET /services/slug/{slug}` - Lấy dịch vụ theo slug
- `GET /technicians` - Lấy danh sách kỹ thuật viên
- `GET /technicians/available` - Lấy kỹ thuật viên có sẵn

### Authenticated APIs (Cần đăng nhập)
- `POST /bookings` - Tạo booking
- `GET /bookings` - Lấy danh sách booking của user
- `PUT /bookings/{id}/cancel` - Hủy booking

### Admin APIs (Chỉ admin)
- `POST /services` - Tạo dịch vụ
- `PUT /services/{id}` - Cập nhật dịch vụ
- `DELETE /services/{id}` - Xóa dịch vụ
- `POST /technicians` - Tạo kỹ thuật viên
- `PUT /technicians/{id}` - Cập nhật kỹ thuật viên
- `DELETE /technicians/{id}` - Xóa kỹ thuật viên
- `PUT /bookings/{id}/status` - Cập nhật trạng thái booking
- `PUT /bookings/{id}/assign` - Phân công kỹ thuật viên

---

## 📝 Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "customerPhone",
      "message": "Phone number is required"
    }
  ]
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Service not found"
}
```

**409 Conflict:**
```json
{
  "statusCode": 409,
  "message": "Booking time slot is not available"
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 🚀 Usage Examples

### Frontend Integration

```typescript
// Lấy danh sách dịch vụ
const fetchServices = async () => {
  const response = await fetch('/api/v1/services?isActive=true');
  const data = await response.json();
  return data.services;
};

// Tạo booking
const createBooking = async (bookingData) => {
  const response = await fetch('/api/v1/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });
  return response.json();
};

// Lấy kỹ thuật viên có sẵn
const getAvailableTechnicians = async (date, time) => {
  const response = await fetch(
    `/api/v1/technicians/available?date=${date}&time=${time}`
  );
  return response.json();
};
```

### Dashboard Integration

```typescript
// Thống kê dịch vụ
const getServiceStats = async () => {
  const response = await fetch('/api/v1/services/stats', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return response.json();
};

// Cập nhật trạng thái booking
const updateBookingStatus = async (bookingId, status) => {
  const response = await fetch(`/api/v1/bookings/${bookingId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status })
  });
  return response.json();
};
```

---

*Tài liệu này cung cấp hướng dẫn chi tiết về các API dịch vụ của hệ thống Audio Tài Lộc.*
