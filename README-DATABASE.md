# 🗄️ **Audio Tài Lộc - Database Setup Guide**

## 📋 **Tổng quan**

Hướng dẫn này sẽ giúp bạn thiết lập và quản lý cơ sở dữ liệu PostgreSQL từ Aiven cho dự án Audio Tài Lộc.

## 🔧 **Thông tin Database**

### **Aiven PostgreSQL Configuration**
```
Service URI: postgres://avnadmin:AVNS_J1t4lXQgYA1bGfQZgh5@pg-audio-tai-loc-kadev.c.aivencloud.com:26566/defaultdb?sslmode=require
Database: defaultdb
Host: pg-audio-tai-loc-kadev.c.aivencloud.com
Port: 26566
User: avnadmin
SSL Mode: require
Connection Limit: 20
```

## 🚀 **Cài đặt nhanh**

### **1. Thiết lập Database**
```bash
# Từ thư mục gốc của project
./scripts/setup-database.sh development
```

### **2. Test kết nối**
```bash
# Test connection từ backend
cd backend
npm run db:test
```

### **3. Tạo và chạy Migration**
```bash
# Từ backend directory
npm run db:migrate
```

### **4. Seed dữ liệu mẫu**
```bash
# Seed dữ liệu mẫu (development only)
npm run db:seed
```

## 📁 **Cấu trúc Files**

```
workspace/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   └── seed.ts                # Seed data script
│   ├── .env                       # Environment variables
│   ├── .env.development           # Development config
│   ├── .env.staging              # Staging config
│   ├── .env.production           # Production config
│   └── ca.pem                     # SSL Certificate
├── scripts/
│   ├── setup-database.sh          # Database setup script
│   ├── migrate-database.sh        # Migration script
│   └── test-database-connection.js # Connection test
└── docker-compose.yml             # Docker services
```

## 🛠️ **Scripts có sẵn**

### **Database Setup Scripts**
```bash
# Cài đặt hoàn chỉnh database
./scripts/setup-database.sh [environment]

# Chạy migration
./scripts/migrate-database.sh migrate [environment]

# Push schema (development)
./scripts/migrate-database.sh push [environment]

# Reset database (development only)
./scripts/migrate-database.sh reset [environment]

# Seed dữ liệu
./scripts/migrate-database.sh seed [environment]

# Test connection
./scripts/migrate-database.sh test [environment]
```

### **NPM Scripts (trong backend/)**
```bash
# Generate Prisma client
npm run prisma:generate

# Chạy migration development
npm run prisma:migrate:dev

# Deploy migration production
npm run prisma:migrate:deploy

# Push schema to database
npm run prisma:db:push

# Reset database
npm run prisma:db:reset

# Open Prisma Studio
npm run prisma:studio
```

## 🔐 **Cấu hình Environment**

### **Development (.env.development)**
- Full debug logging
- Seed data enabled
- Swagger API docs enabled
- Test endpoints available

### **Staging (.env.staging)**
- Production-like settings
- Limited debug logging
- Backup enabled
- Monitoring enabled

### **Production (.env.production)**
- Security hardened
- Minimal logging
- Backup enabled
- Monitoring enabled
- Swagger disabled

## 📊 **Database Schema**

### **Core Models**
- **User**: Quản lý người dùng và xác thực
- **Product**: Thông tin sản phẩm audio
- **Category**: Phân loại sản phẩm
- **Cart**: Giỏ hàng người dùng
- **Order**: Đơn hàng và thanh toán
- **Inventory**: Quản lý tồn kho
- **ChatSession**: Chat với AI và nhân viên

### **Advanced Features**
- **AI Integration**: Google Gemini AI
- **Real-time Chat**: Socket.io
- **Payment Processing**: PayOS, VNPay, MoMo
- **File Storage**: Cloudinary, MinIO
- **Search**: MeiliSearch
- **Monitoring**: Prometheus, Grafana

## 🔍 **Troubleshooting**

### **Connection Issues**
```bash
# Test PostgreSQL connection manually
cd backend
node scripts/test-pg-connection.js

# Test Prisma connection
node scripts/test-database-connection.js
```

### **Common Problems**

#### **1. ENOTFOUND Error**
```
❌ PostgreSQL connection test failed!
Error: getaddrinfo ENOTFOUND pg-audio-tai-loc-kadev.c.aivencloud.com
```

**Solutions:**
- ✅ Đảm bảo database đã được tạo trên Aiven
- ✅ Kiểm tra "Public access" được enable trong Aiven dashboard
- ✅ Verify hostname chính xác trong connection string
- ✅ Kiểm tra network connectivity

#### **2. SSL Certificate Issues**
```
Error: cert file not found (No such file or directory)
```

**Solutions:**
- ✅ Đảm bảo file `ca.pem` tồn tại trong thư mục backend
- ✅ Đặt file certificate đúng vị trí
- ✅ Cập nhật đường dẫn trong DATABASE_URL nếu cần

#### **3. Authentication Issues**
```
Error: authentication failed
```

**Solutions:**
- ✅ Kiểm tra username/password chính xác
- ✅ Đảm bảo user có quyền truy cập database
- ✅ Check connection limits trong Aiven

### **Reset Database (Development)**
```bash
cd backend
npm run db:reset
npm run db:seed
```

### **Aiven Dashboard Setup**

#### **Enable Public Access:**
1. Truy cập Aiven Console
2. Chọn PostgreSQL service
3. Vào tab "Overview"
4. Click "Enable public access"
5. Add IP addresses hoặc allow all (0.0.0.0/0) cho development

#### **Check Connection Limits:**
1. Vào tab "Users"
2. Click vào user `avnadmin`
3. Verify connection limit (default: 20)
4. Increase nếu cần thiết

#### **Database Status:**
1. Vào tab "Overview"
2. Check service status: "Running"
3. Verify connection info chính xác

## 📈 **Monitoring & Maintenance**

### **Health Checks**
- Database connection: `GET /api/v1/health`
- Application status: `GET /api/v1/health/app`
- System metrics: Prometheus endpoints

### **Backup Strategy**
- **Development**: Manual backup khi cần
- **Staging**: Daily backup at 3 AM
- **Production**: Daily backup at 2 AM, 30 days retention

### **Performance**
- Connection pooling: Enabled
- Query optimization: Prisma ORM
- Caching: Redis integration
- Rate limiting: Configurable

## 🚀 **Deployment**

### **Docker Deployment**
```bash
# Build and run with Docker
docker-compose up -d backend

# Check logs
docker-compose logs backend
```

### **Environment Variables**
Đảm bảo các biến môi trường sau được cấu hình:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secrets
- `REDIS_URL`: Redis connection (optional)
- `GOOGLE_AI_API_KEY`: Google AI API key

## 📞 **Support**

Nếu gặp vấn đề với database setup:
1. Kiểm tra logs: `docker-compose logs backend`
2. Test connection: `npm run db:test`
3. Check Aiven dashboard cho connection limits
4. Verify SSL certificate validity

## 🔒 **Security Notes**

- **SSL Required**: Tất cả connections phải sử dụng SSL
- **Password Rotation**: Thay đổi password định kỳ
- **Access Control**: Chỉ cho phép IP cần thiết
- **Backup Security**: Mã hóa backup files
- **Monitoring**: Theo dõi failed login attempts

---

## 🎯 **Quick Start Commands**

### **Phase 1: Aiven Database Setup**
```bash
# 1. Truy cập Aiven Console
# - Tạo PostgreSQL service
# - Enable "Public access"
# - Lưu connection details

# 2. Cập nhật connection string trong backend/.env
DATABASE_URL="postgresql://avnadmin:YOUR_PASSWORD@YOUR_HOST:26566/defaultdb?sslmode=require"

# 3. Test connection
cd backend
npm install pg
node scripts/test-pg-connection.js
```

### **Phase 2: Application Setup**
```bash
# 4. Clone repository (if not already done)
git clone <repository-url>
cd audio-tail-loc

# 5. Setup database với scripts
./scripts/setup-database.sh development

# 6. Install dependencies
cd backend && npm install

# 7. Generate Prisma client
npm run prisma:generate

# 8. Push schema to database
npm run db:push

# 9. Seed data (optional)
npm run db:seed

# 10. Start development server
npm run start:dev

# 11. Open Prisma Studio (optional)
npm run prisma:studio
```

### **Phase 3: Verification**
```bash
# Test database connection
npm run db:test

# Check database tables
npm run prisma:studio

# Verify API endpoints
curl http://localhost:8000/api/v1/health
```

**🎉 Database setup hoàn tất! Bạn có thể bắt đầu phát triển ứng dụng.**