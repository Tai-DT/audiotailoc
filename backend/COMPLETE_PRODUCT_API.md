# 🎯 **Audio Tài Lộc - Complete Product API**

## 📋 **Tổng quan**

API sản phẩm hoàn chỉnh với đầy đủ tính năng CRUD, tìm kiếm nâng cao, phân tích, và quản lý inventory cho hệ thống Audio Tài Lộc.

## 🚀 **Tính năng chính**

### ✅ **Quản lý sản phẩm**
- **CRUD hoàn chỉnh**: Tạo, đọc, cập nhật, xóa sản phẩm
- **Validation đầy đủ**: Class-validator với custom rules
- **SEO optimization**: Meta title, description, keywords, canonical URL
- **Đa ngôn ngữ**: Hỗ trợ tiếng Việt và tiếng Anh

### ✅ **Tìm kiếm & Lọc**
- **Tìm kiếm full-text**: Tên, mô tả, tags, thương hiệu
- **Lọc nâng cao**: Giá, danh mục, thương hiệu, trạng thái
- **Sắp xếp linh hoạt**: Theo tên, giá, ngày tạo, lượt xem
- **Phân trang**: Offset-based với metadata đầy đủ

### ✅ **Quản lý kho & Inventory**
- **Stock tracking**: Theo dõi số lượng tồn kho
- **Order limits**: Giới hạn số lượng đặt hàng tối thiểu/tối đa
- **Stock alerts**: Cảnh báo hết hàng
- **Bulk operations**: Cập nhật hàng loạt

### ✅ **Thông số kỹ thuật**
- **Specifications**: JSON-based với structured data
- **Features**: Danh sách tính năng sản phẩm
- **Warranty**: Thông tin bảo hành
- **Dimensions & Weight**: Kích thước và trọng lượng

### ✅ **Hình ảnh & Media**
- **Multiple images**: Hỗ trợ nhiều hình ảnh sản phẩm
- **Image validation**: Kiểm tra URL hợp lệ
- **Image optimization**: Metadata cho SEO

### ✅ **Phân tích & Analytics**
- **View tracking**: Theo dõi lượt xem
- **Top products**: Sản phẩm được xem nhiều nhất
- **Category analytics**: Thống kê theo danh mục
- **Performance metrics**: Chỉ số hiệu suất

### ✅ **Import/Export**
- **CSV Export**: Xuất dữ liệu sản phẩm
- **CSV Import**: Nhập dữ liệu hàng loạt
- **Data validation**: Kiểm tra dữ liệu khi import

## 📚 **API Endpoints**

### **1. Quản lý sản phẩm**

#### **Tạo sản phẩm**
```http
POST /api/v1/catalog/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium Audio Cable",
  "slug": "premium-audio-cable",
  "description": "High-quality audio cable for professional use",
  "priceCents": 15000000,
  "categoryId": "category-uuid",
  "stockQuantity": 100,
  "images": ["https://example.com/image1.jpg"],
  "specifications": [
    {"key": "Length", "value": "3m"},
    {"key": "Connector", "value": "3.5mm"}
  ],
  "metaTitle": "Premium Audio Cable - Professional Quality",
  "metaDescription": "High-quality audio cable for professional audio equipment",
  "isActive": true
}
```

#### **Lấy danh sách sản phẩm**
```http
GET /api/v1/catalog/products?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc&q=audio&minPrice=100000&maxPrice=5000000&categoryId=category-uuid&featured=true
```

#### **Lấy sản phẩm theo ID**
```http
GET /api/v1/catalog/products/:id
```

#### **Lấy sản phẩm theo Slug**
```http
GET /api/v1/catalog/products/slug/:slug
```

#### **Cập nhật sản phẩm**
```http
PUT /api/v1/catalog/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "priceCents": 16000000,
  "stockQuantity": 95
}
```

#### **Xóa sản phẩm**
```http
DELETE /api/v1/catalog/products/:id
Authorization: Bearer <token>
```

### **2. Tìm kiếm & Gợi ý**

#### **Tìm kiếm sản phẩm**
```http
GET /api/v1/catalog/products/search?q=audio+cable&limit=20
```

#### **Gợi ý tìm kiếm**
```http
GET /api/v1/catalog/products/suggestions?q=audio&limit=10
```

### **3. Operations hàng loạt**

#### **Xóa hàng loạt**
```http
DELETE /api/v1/catalog/products?ids=product-id-1,product-id-2,product-id-3
Authorization: Bearer <token>
```

#### **Cập nhật hàng loạt**
```http
PATCH /api/v1/catalog/products/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "productIds": ["product-id-1", "product-id-2"],
  "categoryId": "new-category-id",
  "isActive": true,
  "addTags": "new-tag,another-tag"
}
```

#### **Nhân bản sản phẩm**
```http
POST /api/v1/catalog/products/:id/duplicate
Authorization: Bearer <token>
```

### **4. Analytics & Statistics**

#### **Tăng lượt xem**
```http
POST /api/v1/catalog/products/:id/view
```

#### **Analytics tổng quan**
```http
GET /api/v1/catalog/products/analytics/overview
Authorization: Bearer <token>
```

#### **Top sản phẩm được xem**
```http
GET /api/v1/catalog/products/analytics/top-viewed?limit=10
Authorization: Bearer <token>
```

#### **Sản phẩm mới nhất**
```http
GET /api/v1/catalog/products/analytics/recent?limit=10
Authorization: Bearer <token>
```

### **5. Import/Export**

#### **Export CSV**
```http
GET /api/v1/catalog/products/export/csv
Authorization: Bearer <token>
```

#### **Import CSV**
```http
POST /api/v1/catalog/products/import/csv
Authorization: Bearer <token>
Content-Type: application/json

{
  "csvData": "Name,Price (VND),Stock Quantity,Category\n\"Test Product\",150000,100,\"Electronics\""
}
```

## 🔧 **Query Parameters**

### **Pagination**
- `page`: Số trang (bắt đầu từ 1)
- `pageSize`: Số item mỗi trang (1-100)

### **Sorting**
- `sortBy`: Trường sắp xếp (createdAt, name, price, updatedAt, viewCount)
- `sortOrder`: Thứ tự sắp xếp (asc, desc)

### **Filtering**
- `q`: Từ khóa tìm kiếm
- `minPrice`: Giá tối thiểu (cents)
- `maxPrice`: Giá tối đa (cents)
- `categoryId`: ID danh mục
- `brand`: Thương hiệu
- `featured`: Sản phẩm nổi bật (true/false)
- `isActive`: Trạng thái active (true/false)
- `inStock`: Còn hàng (true/false)
- `tags`: Tags (comma-separated)

## 📊 **Response Format**

### **Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/catalog/products",
  "method": "GET"
}
```

### **List Response**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Data retrieved successfully"
}
```

### **Error Response**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/catalog/products",
  "correlationId": "req_123456"
}
```

## 🔒 **Authentication & Authorization**

- **Bearer Token**: Cần cho tất cả operations write
- **Admin Role**: Yêu cầu cho operations quản lý
- **JWT Token**: Expires trong 1 giờ
- **Refresh Token**: Để lấy access token mới

## 📋 **Data Models**

### **Product Fields**
- **Basic**: id, slug, name, description, priceCents
- **Inventory**: stockQuantity, minOrderQuantity, maxOrderQuantity
- **SEO**: metaTitle, metaDescription, metaKeywords, canonicalUrl
- **Media**: images (array), imageUrl (legacy)
- **Specifications**: JSON array với key-value pairs
- **Category**: categoryId với relation
- **Analytics**: viewCount, createdAt, updatedAt

### **Validation Rules**
- **Name**: 2-200 ký tự, bắt buộc
- **Slug**: 2-100 ký tự, chỉ chứa a-z, 0-9, hyphens
- **Price**: Tối thiểu 100 cents (1,000 VND)
- **Images**: Tối đa 10 URLs, phải là URL hợp lệ
- **Specifications**: Tối đa 50 items
- **SEO fields**: Giới hạn độ dài cho performance

## 🚀 **Performance Features**

### **Database Optimization**
- **Indexes**: Trên slug, categoryId, isActive, featured
- **Query optimization**: Select only needed fields
- **Connection pooling**: Prisma connection management

### **Caching Strategy**
- **Redis**: Cache cho categories và popular products
- **TTL**: 5 phút cho categories, 1 giờ cho analytics

### **Rate Limiting**
- **Read operations**: 1000 requests/minute
- **Write operations**: 100 requests/minute
- **Search operations**: 500 requests/minute

## 🧪 **Testing**

### **Unit Tests**
```bash
npm run test:unit
```

### **Integration Tests**
```bash
npm run test:integration
```

### **E2E Tests**
```bash
npm run test:e2e
```

## 📖 **Usage Examples**

### **JavaScript/TypeScript**
```javascript
// Create product
const product = await fetch('/api/v1/catalog/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Premium Headphones',
    priceCents: 2990000,
    categoryId: 'headphones-category-id',
    isActive: true
  })
});

// Search products
const searchResults = await fetch('/api/v1/catalog/products/search?q=headphones&limit=10');
```

### **cURL Examples**
```bash
# Get products with filtering
curl "http://localhost:3010/api/v1/catalog/products?page=1&pageSize=10&categoryId=headphones&minPrice=1000000"

# Create product
curl -X POST http://localhost:3010/api/v1/catalog/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Product","priceCents":150000,"categoryId":"category-id"}'
```

## 🔧 **Setup & Configuration**

### **Environment Variables**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/audiotailoc
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
API_BASE_URL=http://localhost:3010
```

### **Database Migration**
```bash
npm run prisma:migrate:dev
npm run prisma:generate
```

### **Seed Data**
```bash
npm run seed
```

## 📈 **Monitoring & Logging**

- **Request logging**: Tất cả requests được log
- **Error tracking**: Structured error responses
- **Performance monitoring**: Response time tracking
- **Database query logging**: Slow queries được track

## 🎯 **Best Practices**

1. **Use slugs for SEO-friendly URLs**
2. **Implement proper caching strategies**
3. **Validate all input data thoroughly**
4. **Use pagination for large datasets**
5. **Implement proper error handling**
6. **Monitor performance regularly**
7. **Backup data regularly**
8. **Use transactions for bulk operations**

---

## 📞 **Support**

- **Documentation**: `/api/v1/docs` (Swagger UI)
- **Health Check**: `/api/v1/health`
- **API Version**: v1 (Stable)
- **Contact**: dev@audiotailoc.com

---

*API được thiết kế theo chuẩn RESTful với focus vào performance, security, và developer experience.*
