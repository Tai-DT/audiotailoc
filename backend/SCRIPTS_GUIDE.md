# Audio Tài Lộc - Development Scripts Guide

## 📋 Tổng quan Scripts

Dự án Audio Tài Lộc có các scripts tự động hóa để phát triển và quản lý hệ thống karaoke.

## 🎯 Scripts Chính

### 1. Database & Sample Data Scripts

#### `create-sample-data.ts`
```bash
npx ts-node create-sample-data.ts
```
- Tạo dữ liệu mẫu cơ bản: 7 categories, 14 products, 3 services, 2 pages
- Ngôn ngữ: Tiếng Việt
- Database: PostgreSQL

#### `create-more-sample-data.ts`
```bash
npx ts-node create-more-sample-data.ts
```
- Tạo dữ liệu bổ sung: users, inventory, reviews, technicians, promotions
- Phụ thuộc vào dữ liệu từ script 1

#### `create-final-sample-data.ts`
```bash
npx ts-node create-final-sample-data.ts
```
- Tạo dữ liệu cuối cùng: point transactions, redemption history
- Chạy sau khi có đầy đủ users và products

#### `check-all-tables.ts`
```bash
npx ts-node check-all-tables.ts
```
- Kiểm tra số lượng records trong tất cả tables
- Verify data integrity

### 2. API Testing Scripts

#### `scripts/smoke-api-test.js`
```bash
node scripts/smoke-api-test.js
```
- Test smoke cho tất cả API endpoints
- Kiểm tra health check và basic functionality
- Generate report về API status

#### `scripts/generate-types.js`
```bash
node scripts/generate-types.js
```
- Tự động generate TypeScript types từ API responses
- Output: `src/types/generated/api-types.ts`
- Sử dụng cho frontend type safety

### 3. Development Environment Scripts

#### `scripts/dev-server.js`
```bash
node scripts/dev-server.js
```
- Khởi chạy tất cả services cùng lúc:
  - Backend API (port 3010)
  - Frontend Dashboard (port 3000)
  - Prisma Studio (port 5555)
- Graceful shutdown với Ctrl+C

#### `scripts/setup-frontend.js`
```bash
node scripts/setup-frontend.js
```
- Tạo cấu trúc Next.js dashboard
- Setup Tailwind CSS, TypeScript, testing
- Tạo components và layouts cơ bản

### 4. Utility Scripts

#### `scripts/add-ai-endpoints-simple.js`
```bash
node scripts/add-ai-endpoints-simple.js
```
- Thêm AI endpoints cơ bản
- Tích hợp với OpenAI API

#### `scripts/analyze-apis.js`
```bash
node scripts/analyze-apis.js
```
- Phân tích và document API endpoints
- Generate API documentation

#### `scripts/test-all-modules.js`
```bash
node scripts/test-all-modules.js
```
- Test tất cả NestJS modules
- Kiểm tra dependencies và imports

## 🚀 Quick Start Workflow

### Bước 1: Setup Database
```bash
# Tạo dữ liệu mẫu cơ bản
npx ts-node create-sample-data.ts

# Tạo dữ liệu bổ sung
npx ts-node create-more-sample-data.ts

# Tạo dữ liệu cuối cùng
npx ts-node create-final-sample-data.ts

# Kiểm tra dữ liệu
npx ts-node check-all-tables.ts
```

### Bước 2: Setup Frontend
```bash
# Tạo cấu trúc frontend
node scripts/setup-frontend.js

# Cài đặt dependencies
cd frontend && npm install
```

### Bước 3: Generate Types
```bash
# Generate TypeScript types từ API
node scripts/generate-types.js
```

### Bước 4: Start Development
```bash
# Khởi chạy tất cả services
node scripts/dev-server.js
```

## 📊 Database Schema

### Core Tables
- `categories` (7 records): Loại sản phẩm karaoke
- `products` (14 records): Sản phẩm karaoke
- `services` (3 records): Dịch vụ lắp đặt, cho thuê, thanh lý
- `pages` (2 records): Banner và About page

### Extended Tables
- `users`: Khách hàng và admin
- `orders`: Đơn hàng
- `inventory`: Tồn kho
- `reviews`: Đánh giá sản phẩm
- `technicians`: Kỹ thuật viên
- `promotions`: Khuyến mãi
- `point_transactions`: Tích điểm
- `redemption_history`: Đổi quà

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/audiotailoc"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-key"

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3010
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Prisma Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

## 🧪 Testing

### API Testing
```bash
# Smoke test
node scripts/smoke-api-test.js

# Unit tests
npm test

# E2E tests (frontend)
cd frontend && npm run test:e2e
```

## 📝 Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Component-based architecture

### API Design
- RESTful endpoints
- Zod validation
- Swagger documentation
- Error handling middleware

### Database
- Prisma ORM
- PostgreSQL
- Foreign key constraints
- Data seeding scripts

## 🎯 Next Steps

1. **Chạy dev environment**: `node scripts/dev-server.js`
2. **Xem dữ liệu**: Truy cập http://localhost:5555 (Prisma Studio)
3. **Test API**: Chạy `node scripts/smoke-api-test.js`
4. **Develop frontend**: Sử dụng prompts trong `AUDIO_TAILOC_PROMPT_PACK.md`
5. **Deploy**: Setup production environment

## 📞 Support

- **Backend API**: http://localhost:3010/api/docs
- **Frontend Dashboard**: http://localhost:3000
- **Database Studio**: http://localhost:5555
- **API Health**: http://localhost:3010/health

---

**🎵 Audio Tài Lộc - Hệ thống quản lý thiết bị karaoke chuyên nghiệp**
