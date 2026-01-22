# Yêu Cầu Chi Tiết: Nhóm Dịch Vụ & Booking

## 1. Trang Danh Sách Dịch Vụ (Services List)

### 1.1 UI Data Requirements
- Danh sách tất cả dịch vụ đang cung cấp.
- Mỗi item: Hình ảnh đại diện, Tên dịch vụ, Mô tả ngắn, Khoảng giá (Giá từ...).

### 1.2 Backend APIs
- `GET /api/v1/services`
  - *Filter*: `is_active=true`.

## 2. Trang Chi Tiết Dịch Vụ (Service Detail)

### 2.1 UI Components
- **Header**: Tên dịch vụ, Giá tham khảo.
- **Content**: Nội dung chi tiết quy trình, cam kết chất lượng.
- **Technicians**: Danh sách kỹ thuật viên tiêu biểu (Optional).
- **Reviews**: Đánh giá từ khách hàng đã sử dụng dịch vụ.
- **Booking CTA**: Nút "Đặt Lịch Ngay" nổi bật.

### 2.2 Backend APIs
- `GET /api/v1/services/:slug`

## 3. Trang Đặt Lịch (Booking Page)

### 3.1 Flow & Form Data
- **Step 1: Select Service**: Chọn dịch vụ (nếu chưa chọn từ trang trước).
- **Step 2: Select Time**:
  - User chọn Ngày -> Hệ thống hiển thị các Slot giờ còn trống.
- **Step 3: Info & Confirm**:
  - Input: Họ tên, SĐT, Địa chỉ phục vụ, Ghi chú.
  - Summary: Dịch vụ đã chọn, Thời gian, Giá dự kiến.

### 3.2 Backend APIs
- `GET /api/v1/booking/slots?date=YYYY-MM-DD&service_id=...`
  - Logic backend: Check lịch của technicians, trả về các khung giờ available.
- `POST /api/v1/bookings`
  - Body: `{ service_id, slot_time, customer_info, ... }`
  - Logic: Tạo booking status `PENDING`. Gửi noti cho admin.
