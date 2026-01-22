# Chi Tiết Các Trang Chức Năng Frontend (User Khách Hàng)

Tài liệu này mô tả chi tiết từng trang giao diện (Page) cần thiết cho website khách hàng, ánh xạ với các module backend tương ứng.

---

## 1. Nhóm Trang Chung (General)

### 1.1. Trang Chủ (Home Page)
Là bộ mặt của website, tổng hợp các thông tin quan trọng nhất.
*   **Chức năng chính:**
    *   Hiển thị Banner/Slider khuyến mãi (Module: `site`, `promotions`).
    *   Hiển thị Danh mục sản phẩm nổi bật (Module: `categories`).
    *   Block "Sản phẩm mới", "Sản phẩm bán chạy" (Module: `catalog`).
    *   Block "Dịch vụ cung cấp" (Module: `services`).
    *   Block "Tin tức mới nhất" hoặc "Dự án tiêu biểu" (Module: `blog`, `projects`).
    *   Footer: Thông tin liên hệ, link chính sách (Module: `site`).
*   **API/Backend Data:**
    *   `GET /featured-products`, `GET /banners`, `GET /categories/featured`.

### 1.2. Trang Tìm Kiếm (Search Page)
*   **Chức năng chính:**
    *   Thanh tìm kiếm (Input keyword).
    *   Bộ lọc nâng cao (Filter): Theo giá, thương hiệu, danh mục, thông số.
    *   Danh sách kết quả tìm kiếm (Grid/List view).
    *   Sắp xếp (Mới nhất, Giá tăng/giảm).
*   **API/Backend Data:**
    *   Module: `search`.
    *   `GET /search?q=...&filter=...`

---

## 2. Nhóm Trang Sản Phẩm (E-commerce)

### 2.1. Trang Danh Sách Sản Phẩm (Product Listing / Category)
Hiển thị sản phẩm theo danh mục cụ thể (VD: Loa, Amply...).
*   **Chức năng chính:**
    *   Hiển thị Breadcrumb (Trang chủ > Danh mục > ...).
    *   Bộ lọc chuyên sâu cho danh mục đó (Attributes specific to category).
    *   Phân trang (Pagination) hoặc "Xem thêm".
*   **API/Backend Data:**
    *   Module: `catalog`, `categories`.

### 2.2. Trang Chi Tiết Sản Phẩm (Product Detail)
*   **Chức năng chính:**
    *   Gallery hình ảnh/Video sản phẩm (Zoom ảnh).
    *   Thông tin: Tên, Giá (Gốc/Khuyến mãi), SKU, Tình trạng kho (Còn hàng/Hết hàng).
    *   Chọn biến thể (Màu sắc, Kích thước) - nếu có.
    *   Mô tả chi tiết (Rich text), Thông số kỹ thuật.
    *   **Hành động:** "Thêm vào giỏ", "Mua ngay", "Yêu thích" (Wishlist).
    *   Block "Sản phẩm tương tự" (Related Products).
    *   Block "Đánh giá & Bình luận" (Reviews).
*   **API/Backend Data:**
    *   Module: `catalog`, `inventory`, `reviews`, `wishlist`.

---

## 3. Nhóm Trang Dịch Vụ (Services)

### 3.1. Trang Danh Sách Dịch Vụ
Giới thiệu các gói dịch vụ (VD: Lắp đặt âm thanh, Bảo trì...).
*   **Chức năng chính:**
    *   Liệt kê các dịch vụ kèm mô tả ngắn và giá tham khảo.
    *   Nút "Đặt lịch ngay" hoặc "Xem chi tiết".
*   **API/Backend Data:**
    *   Module: `services`.

### 3.2. Trang Chi Tiết Dịch Vụ
*   **Chức năng chính:**
    *   Mô tả kỹ về quy trình dịch vụ, lợi ích.
    *   Bảng giá chi tiết.
    *   Gallery dự án đã làm liên quan đến dịch vụ này.
    *   Form đăng ký tư vấn hoặc nút chuyển sang trang Đặt lịch.

### 3.3. Trang Đặt Lịch (Booking Page)
*   **Chức năng chính:**
    *   Chọn loại dịch vụ.
    *   Chọn ngày và giờ (Calendar view - check slot trống).
    *   Chọn kỹ thuật viên (nếu hệ thống cho phép).
    *   Nhập thông tin khách hàng (Tên, SĐT, Địa chỉ).
    *   Ghi chú thêm.
*   **API/Backend Data:**
    *   Module: `booking`, `technicians`.
    *   `POST /bookings`.

---

## 4. Nhóm Trang Mua Sắm (Checkout Flow)

### 4.1. Trang Giỏ Hàng (Cart)
*   **Chức năng chính:**
    *   Liệt kê sản phẩm đã chọn.
    *   Điều chỉnh số lượng (+/-), Xóa sản phẩm.
    *   Hiển thị tổng tiền tạm tính.
    *   Nhập mã giảm giá (Coupon).
*   **API/Backend Data:**
    *   Module: `cart`, `promotions`.

### 4.2. Trang Thanh Toán (Checkout)
*   **Chức năng chính:**
    *   **Bước 1: Thông tin giao hàng**: Chọn địa chỉ từ sổ địa chỉ hoặc nhập mới.
    *   **Bước 2: Vận chuyển**: Chọn đơn vị/phương thức vận chuyển.
    *   **Bước 3: Thanh toán**: Chọn phương thức (COD, Banking, VNPay...).
    *   Hiển thị tóm tắt đơn hàng và Tổng tiền cuối cùng (đã trừ khuyến mãi, cộng ship).
    *   Nút "Đặt hàng".
*   **API/Backend Data:**
    *   Module: `checkout`, `orders`, `payments`.

### 4.3. Trang Hoàn Tất (Order Success)
*   **Chức năng chính:**
    *   Thông báo đặt hàng thành công.
    *   Hiển thị Mã đơn hàng.
    *   Hướng dẫn thanh toán (nếu chọn chuyển khoản).
    *   Nút "Tiếp tục mua sắm" hoặc "Xem đơn hàng".

---

## 5. Nhóm Trang Tài Khoản (Customer Account)
*Yêu cầu đăng nhập*

### 5.1. Trang Đăng Nhập / Đăng Ký
*   Form Login, Register, Forgot Password.
*   Login with Google/Facebook (Module `auth`).

### 5.2. Trang Dashboard (Tổng quan tài khoản)
*   Hiển thị thông tin cơ bản user.
*   Tóm tắt đơn hàng gần đây.

### 5.3. Trang Quản Lý Đơn Hàng (Order History)
*   Danh sách đơn hàng đã mua.
*   Tab trạng thái: Chờ xác nhận, Đang giao, Hoàn thành, Đã hủy.
*   **API:** Module `orders`, `bookings` (lịch sử đặt lịch).

### 5.4. Trang Chi Tiết Đơn Hàng
*   Thông tin chi tiết từng món hàng, giá tiền, trạng thái vận chuyển.
*   **Hành động:** Hủy đơn (nếu được phép), Mua lại (Re-order), Đánh giá sản phẩm.

### 5.5. Trang Sổ Địa Chỉ (Address Book)
*   Thêm/Sửa/Xóa địa chỉ giao hàng mặc định.

### 5.6. Trang Yêu Thích (Wishlist)
*   Danh sách sản phẩm đã tim.
*   Nút chuyển sản phẩm sang giỏ hàng.

---

## 6. Nhóm Trang Nội Dung & Tiện Ích

### 6.1. Trang Tin Tức / Blog
*   Danh sách bài viết chia theo category (VD: Kiến thức âm thanh, Review sản phẩm).
*   Module: `blog`.

### 6.2. Trang Dự Án (Portfolio)
*   Showcase các dự án thực tế đã triển khai (Hình ảnh trước/sau, thiết bị sử dụng).
*   Module: `projects`.

### 6.3. Trang Liên Hệ (Contact)
*   Thông tin liên hệ, Bản đồ (Module `maps`).
*   Form gửi tin nhắn liên hệ (Module `support` / `messages`).

### 6.4. Trang Hỏi Đáp (FAQ)
*   Danh sách câu hỏi thường gặp (Module `faq`).

### 6.5. Trang Chat (Live Chat)
*   Widget chat ở góc màn hình kết nối với admin/support (Module `chat`).
