# Yêu Cầu Chi Tiết: Nội Dung & Tiện Ích Khác

## 1. Tin Tức & Blog (Blog Page)

### 1.1 UI Requirements
- **Layout**: Grid bài viết. Sidebar (Categories, Popular Posts).
- **Detail Post**: Title, Content, Author, Date, Related Posts.

### 1.2 APIs
- `GET /api/v1/blog/posts`
- `GET /api/v1/blog/categories`
- `GET /api/v1/blog/posts/:slug`

## 2. Dự Án (Portfolio)

### 2.1 UI Requirements
- Gallery các dự án đã thực hiện.
- Filter theo loại dự án (Lắp đặt gia đình, Hội trường, Karaoke...).
- **Detail Project**:
  - Image Slider.
  - Description: Yêu cầu khách hàng -> Giải pháp -> Kết quả.
  - List thiết bị đã sử dụng (Link tới sản phẩm).

### 2.2 APIs
- `GET /api/v1/projects`
- `GET /api/v1/projects/:slug`

## 3. Liên Hệ & Hỗ Trợ

### 3.1 Contact Page
- Form liên hệ: Tên, Email, Tiêu đề, Nội dung.
- Google Maps Embed.
- Info: Hotline, Email, Showroom Address.

### 3.2 APIs
- `POST /api/v1/support/contact` (Gửi form liên hệ -> Lưu database & email admin).

## 4. Chat & Notification
- **Chat Widget**: Tích hợp Facebook Messenger hoặc Custom Socket.io Chat.
- **Notifications**: Dropdown thông báo trên Header (Đơn hàng thay đổi trạng thái, Khuyến mãi mới).

### 4.3 APIs
- `GET /api/v1/notifications`
- `PUT /api/v1/notifications/:id/read`
