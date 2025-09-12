# 🚀 Audio Tài Lộc Development Environment Setup

Hướng dẫn thiết lập môi trường phát triển cho dự án Audio Tài Lộc.

## 📋 Yêu cầu hệ thống

- **Docker & Docker Compose**: >= 20.10
- **Node.js**: >= 18.x (cho development local)
- **Git**: >= 2.30

## 🛠️ Cài đặt nhanh với Docker

### Bước 1: Khởi động môi trường
```bash
# Chạy script khởi động
./start-dev.sh
```

### Bước 2: Kiểm tra services
Sau khi script chạy xong, các services sẽ available tại:
- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:3010
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🔧 Cấu hình Database

### Tạo database và chạy migration
```bash
# Vào container backend
docker-compose exec backend bash

# Chạy migration
npm run prisma:migrate:dev

# Seed dữ liệu mẫu
npm run seed
```

## 📁 Cấu trúc môi trường

```
audiotailoc/
├── docker-compose.yml          # Docker services
├── start-dev.sh               # Script khởi động
├── backend/
│   ├── .env                   # Environment variables
│   ├── Dockerfile.dev         # Development Dockerfile
│   └── ...
├── frontend/
│   ├── .env.local            # Environment variables
│   ├── Dockerfile.dev        # Development Dockerfile
│   └── ...
└── dashboard/
    ├── .env.local           # Environment variables
    ├── Dockerfile.dev       # Development Dockerfile
    └── ...
```

## 🐳 Docker Services

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| postgres | postgres:15-alpine | 5432 | Database |
| redis | redis:7-alpine | 6379 | Cache |
| backend | custom | 3010 | API Server |
| frontend | custom | 3000 | Web App |
| dashboard | custom | 3001 | Admin Dashboard |

## 🔑 Environment Variables

### Backend (.env)
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/audiotailoc"
REDIS_URL="redis://localhost:6379"
MEILI_URL="http://localhost:7700"
JWT_ACCESS_SECRET="dev-jwt-access-secret-key"
# ... các biến khác
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

## 📊 Quản lý dữ liệu

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres audiotailoc > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U postgres audiotailoc < backup.sql
```

## 🛠️ Lệnh hữu ích

### Xem logs
```bash
# Tất cả services
docker-compose logs -f

# Service cụ thể
docker-compose logs -f backend
```

### Dừng services
```bash
docker-compose down
```

### Dọn dẹp hoàn toàn
```bash
docker-compose down -v --remove-orphans
docker system prune -a
```

### Restart service
```bash
docker-compose restart backend
```

## 🔍 Troubleshooting

### Service không khởi động
```bash
# Kiểm tra logs
docker-compose logs [service-name]

# Restart service
docker-compose restart [service-name]
```

### Database connection error
```bash
# Kiểm tra PostgreSQL
docker-compose exec postgres pg_isready -U postgres

# Reset database
docker-compose down -v postgres
docker-compose up -d postgres
```

### Port conflict
```bash
# Thay đổi port trong docker-compose.yml
ports:
  - "3001:3000"  # host:container
```

## 📝 Lưu ý cho Production

1. **Thay đổi secrets**: Đừng sử dụng dev secrets trong production
2. **Cấu hình HTTPS**: Sử dụng SSL certificates
3. **Backup strategy**: Thiết lập backup tự động
4. **Monitoring**: Thêm monitoring và logging
5. **Security**: Cấu hình firewall và security headers

## 🤝 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Docker và Docker Compose đã cài đặt đúng
2. Ports không bị conflict
3. Environment variables đã cấu hình đúng
4. Dependencies đã được cài đặt trong containers