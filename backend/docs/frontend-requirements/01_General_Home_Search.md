# Yêu Cầu Chi Tiết: Nhóm Chức Năng Chung & Trang Chủ

Tài liệu này mô tả chi tiết các yêu cầu dữ liệu và API cho các trang chung của Frontend.

## 1. Trang Chủ (Home Page)

### 1.1 UI Components & Data Requirements
- **Banner Slider**: Danh sách các banner quảng cáo/khuyến mãi đang hoạt động.
  - *Fields cần thiết*: Image URL, Title, Description, Link/Action, Order priority.
- **Featured Categories**: Danh sách các danh mục nổi bật (có icon/thumbnail).
  - *Fields*: ID, Name, Slug, Thumbnail, Product Count.
- **New Arrivals**: Top 8-10 sản phẩm mới nhất.
  - *Fields*: Product Card info (Name, Price, Sale Price, Image, Slug, Rating).
- **Best Sellers**: Top sản phẩm bán chạy.
- **Featured Services**: 3-4 dịch vụ tiêu biểu.
  - *Fields*: Service Name, Short Description, Icon/Image, Link.
- **Latest News**: 3 tin tức/bài viết mới nhất.

### 1.2 Backend APIs Gợi ý
- `GET /api/v1/site/banners?position=home_main`
- `GET /api/v1/categories/featured`
- `GET /api/v1/products/new-arrivals?limit=10`
- `GET /api/v1/products/best-sellers?limit=10`
- `GET /api/v1/services/featured`
- `GET /api/v1/blog/posts?limit=3&sort=newest`

---

## 2. Trang Tìm Kiếm & Lọc (Search Page)

### 2.1 UI Components
- **Search Bar**: Input text tìm kiếm.
- **Filters Sidebar**:
  - Price Range (Slider hoặc các khoảng giá: <1M, 1-5M...).
  - Brands (Checkbox list).
  - Categories (Tree view).
  - Attributes (Màu sắc, Công suất...).
- **Sort Options**: Mới nhất, Giá thấp-cao, Giá cao-thấp, Bán chạy.
- **Results Grid**: Danh sách sản phẩm thỏa mãn điều kiện.

### 2.2 Backend APIs Gợi ý
- `GET /api/v1/search/products`
  - *Query Params*: `q` (keyword), `price_min`, `price_max`, `brand_ids`, `category_id`, `sort`, `page`, `limit`.
- `GET /api/v1/search/filters`
  - *Response*: Trả về các facests (danh sách brand, max price, categories có trong kết quả tìm kiếm để render bộ lọc).
