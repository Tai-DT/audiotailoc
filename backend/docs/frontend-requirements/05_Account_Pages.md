# Yêu Cầu Chi Tiết: Tài Khoản Khách Hàng (My Account)

## 1. Xác Thực (Auth)

### 1.1 UI Pages
- **Login**: Email/Phone + Password.
- **Register**: Full Name, Email, Phone, Password.
- **Forgot Password**: Input Email -> Send Link/OTP.
- **Reset Password**: Input New Password.

### 1.2 Backend APIs
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/auth/me` (Lấy info user hiện tại từ Token).

## 2. Dashboard & Profile

### 2.1 UI Components
- **Profile Info**: Form update tên, avatar, số điện thoại.
- **Address Book**: List địa chỉ giao hàng. Button "Thêm địa chỉ mới".
- **Change Password**: Input mật khẩu cũ, mật khẩu mới.

### 2.2 Backend APIs
- `PUT /api/v1/users/profile`
- `GET /api/v1/users/addresses`
- `POST /api/v1/users/addresses`
- `PUT /api/v1/users/password`

## 3. Quản Lý Đơn Hàng (Order History)

### 3.1 UI List
- Danh sách đơn hàng sắp xếp theo ngày mới nhất.
- Filter theo Status: All, Processing, Shipping, Completed, Cancelled.
- Mỗi item: Mã đơn, Ngày đặt, Tổng tiền, Trạng thái (Badge màu).

### 3.2 Chi Tiết Đơn Hàng
- List sản phẩm trong đơn.
- Timeline trạng thái (Đặt hàng -> Xác nhận -> Đóng gói -> Giao -> Nhận).
- Nếu trạng thái = Pending -> Hiện nút "Hủy đơn".

### 3.3 Backend APIs
- `GET /api/v1/orders/my-orders?status=...&page=...`
- `GET /api/v1/orders/:id`
- `POST /api/v1/orders/:id/cancel`
