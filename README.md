# Audio Tài Lộc 🎵💰

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

Hệ thống quản lý và bán hàng audio chuyên nghiệp với kiến trúc microservices hiện đại.

## 🎯 Mục tiêu

Audio Tài Lộc là nền tảng toàn diện cho việc quản lý và bán các sản phẩm audio chất lượng cao, bao gồm:
- **Quản lý sản phẩm**: Dashboard admin với CRUD đầy đủ
- **Cửa hàng trực tuyến**: Storefront hiện đại với UX tối ưu
- **Hệ thống xác thực**: Bảo mật đa lớp với JWT
- **API mạnh mẽ**: RESTful API với NestJS và Prisma

## 🏗️ Kiến trúc

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   Storefront    │    │   Mobile App    │
│   (Next.js)     │    │   (Next.js)     │    │   (Future)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Backend API          │
                    │     (NestJS + Prisma)     │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Database             │
                    │     (SQLite/PostgreSQL)   │
                    └───────────────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: [Prisma](https://www.prisma.io/) - Next-generation ORM
- **Authentication**: JWT với refresh token rotation
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) với App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation

### DevOps & Tools
- **Package Manager**: [pnpm](https://pnpm.io/) với workspaces
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Code Quality**: ESLint + Prettier + Husky
- **Testing**: Jest + Playwright (E2E)

## 📁 Cấu trúc Dự án

```
audiotailoc/
├── apps/
│   ├── backend/          # NestJS API server
│   │   ├── src/
│   │   │   ├── modules/  # Feature modules
│   │   │   ├── prisma/   # Database schema & migrations
│   │   │   └── main.ts   # Application entry point
│   │   └── prisma/
│   │       └── schema.prisma
│   ├── dashboard/        # Admin dashboard (Next.js)
│   │   ├── app/         # App Router pages
│   │   └── components/  # Reusable components
│   └── frontend/        # Public storefront (Next.js)
│       ├── app/         # App Router pages
│       └── components/  # Store components
├── packages/            # Shared packages (future)
├── scripts/            # Build & deployment scripts
└── docker-compose.yml  # Development environment
```

## 🚀 Hướng dẫn Nhanh

### Yêu cầu Hệ thống
- Node.js 18+ 
- pnpm 9.7.0+
- Git

### Cài đặt

1. **Clone repository**
```bash
git clone https://github.com/your-username/audiotailoc.git
cd audiotailoc
```

2. **Cài đặt dependencies**
```bash
pnpm install
```

3. **Cấu hình môi trường**
```bash
# Backend
cp apps/backend/.env.example apps/backend/.env
# Dashboard
cp apps/dashboard/.env.example apps/dashboard/.env.local
# Frontend  
cp apps/frontend/.env.example apps/frontend/.env.local
```

4. **Khởi tạo database**
```bash
# Migrate database
pnpm --filter @audiotailoc/backend prisma:migrate:dev

# Generate Prisma client
pnpm --filter @audiotailoc/backend prisma:generate

# Seed dữ liệu mẫu
pnpm --filter @audiotailoc/backend seed
```

5. **Chạy development**
```bash
# Chạy tất cả services
pnpm dev

# Hoặc chạy riêng lẻ
pnpm backend:dev      # Backend API (port 3010)
pnpm dashboard:dev    # Admin Dashboard (port 3001)
pnpm frontend:dev     # Storefront (port 3000)
```

### Truy cập ứng dụng
- **Storefront**: http://localhost:3000
- **Dashboard**: http://localhost:3001
- **API Docs**: http://localhost:3010/docs
- **Health Check**: http://localhost:3010/health

## 🔧 Cấu hình Môi trường

### Backend (.env)
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Admin
ADMIN_EMAILS="admin@example.com,admin2@example.com"

# Server
PORT=3010
NODE_ENV=development
```

### Dashboard (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010
```

## 📚 API Documentation

API được tài liệu hóa đầy đủ với Swagger UI:
- **Development**: http://localhost:3010/docs
- **Production**: https://api.audiotailoc.com/docs

### Endpoints chính
- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh` - Refresh token
- `GET /products` - Danh sách sản phẩm
- `POST /products` - Tạo sản phẩm (Admin)
- `PUT /products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /products/:id` - Xóa sản phẩm (Admin)

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## 🏗️ Build & Deploy

```bash
# Build tất cả
pnpm build

# Build riêng lẻ
pnpm backend:build
pnpm dashboard:build
pnpm frontend:build

# Production
pnpm start
```

## 🔒 Bảo mật

- **Authentication**: JWT với refresh token rotation
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Strict validation với class-validator
- **Rate Limiting**: API rate limiting
- **CORS**: Cross-origin resource sharing được cấu hình
- **Helmet**: Security headers

## 📈 Monitoring & Health

- **Health Check**: `/health` endpoint
- **Metrics**: Prometheus metrics (future)
- **Logging**: Structured JSON logging
- **Error Tracking**: Global exception filter

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng đọc:

1. [Code of Conduct](CODE_OF_CONDUCT.md)
2. [Contributing Guide](CONTRIBUTING.md)
3. [Issue Templates](.github/ISSUE_TEMPLATE/)
4. [Pull Request Template](.github/pull_request_template.md)

### Quy ước Code
- **Naming**: camelCase cho variables, PascalCase cho classes
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)
- **Branches**: `feature/`, `bugfix/`, `hotfix/` prefixes
- **PR**: Require reviews, CI checks

## 📋 Roadmap

### Ngắn hạn (1-2 tuần)
- [x] Cấu trúc monorepo cơ bản
- [x] Authentication system
- [x] CRUD products
- [ ] Enhanced README & documentation
- [ ] CI/CD pipeline
- [ ] Testing framework

### Trung hạn (3-6 tuần)
- [ ] Advanced auth (refresh rotation)
- [ ] Shared packages (@audiotailoc/types)
- [ ] Image upload service (S3/Cloudinary)
- [ ] Caching layer (Redis)
- [ ] Search & filtering
- [ ] Role-based permissions

### Dài hạn
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Advanced SEO
- [ ] Performance optimization
- [ ] Microservices architecture

## 📄 License

Dự án này được cấp phép theo [MIT License](LICENSE).

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/audiotailoc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/audiotailoc/discussions)
- **Email**: support@audiotailoc.com

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) team cho framework tuyệt vời
- [Prisma](https://www.prisma.io/) cho ORM hiện đại
- [Next.js](https://nextjs.org/) team cho React framework
- [Vercel](https://vercel.com/) cho hosting platform

---

**Audio Tài Lộc** - Nâng tầm trải nghiệm audio của bạn! 🎵✨

