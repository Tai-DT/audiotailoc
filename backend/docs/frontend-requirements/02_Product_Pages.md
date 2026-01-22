# Yêu Cầu Chi Tiết: Nhóm Sản Phẩm (E-commerce)

## 1. Trang Danh Sách Sản Phẩm (Category Page)

### 1.1 UI Data Requirements
- **Category Info**: Tên danh mục, Mô tả, Banner đầu trang.
- **Sub-categories**: Các danh mục con (nếu có) để điều hướng nhanh.
- **Product List**: Danh sách sản phẩm phân trang.

### 1.2 Backend APIs Gợi ý
- `GET /api/v1/categories/:slug` (Lấy thông tin danh mục & SEO meta).
- `GET /api/v1/products?category_id=...&page=1` (Lấy list sản phẩm).

---

## 2. Trang Chi Tiết Sản Phẩm (Product Detail Page - PDP)

### 2.1 UI Components
- **Product Gallery**: List ảnh + Video (Youtube/Upload).
- **Core Info**: Tên, SKU, Brand.
- **Pricing**: Giá niêm yết, Giá khuyến mãi (nếu có), % giảm giá.
- **Inventory Status**:
  - Logic: Nếu stock > 0 -> "Còn hàng". Nếu stock <= 0 -> "Hết hàng" (Disable nút mua) hoặc "Đặt trước".
- **Variants Selector**: Chọn màu sắc / phiên bản (nếu sản phẩm có biến thể).
  - Khi chọn biến thể -> Update giá và tồn kho tương ứng.
- **Content**:
  - Short Description (HTML/Text).
  - Full Description (HTML rich text).
  - Technical Specifications (Table key-value).
- **Reviews**:
  - Rating trung bình (Stars).
  - List comment/đánh giá phân trang.
- **Related Products**: List sản phẩm cùng danh mục hoặc cùng tầm giá.

### 2.2 Backend APIs Gợi ý
- `GET /api/v1/products/:slug` (Lấy full info sản phẩm).
  - *Response includes*: variants, images, specs, seo info.
- `GET /api/v1/products/:id/related` (Lấy sản phẩm liên quan).
- `GET /api/v1/reviews?product_id=...` (Lấy đánh giá).
- `POST /api/v1/cart/add` (Action thêm vào giỏ).
- `POST /api/v1/wishlist/add` (Action thêm vào yêu thích).
