# 📊 Database Seeding Report - Audio Tài Lộc

**Ngày:** 11 tháng 11, 2025  
**Người thực hiện:** AI Assistant  
**Trạng thái:** ⚠️ Database Connection Issues

---

## 🔍 Tình trạng hiện tại

### ✅ Hoàn thành
1. **Scripts đã tạo:**
   - ✅ `backend/scripts/check-database-stats.js` - Script kiểm tra thống kê database
   - ✅ `backend/scripts/seed-comprehensive.js` - Script seed toàn bộ dữ liệu qua Prisma
   - ✅ `backend/scripts/seed-via-api.js` - Script seed dữ liệu qua API endpoints

2. **Cài đặt:**
   - ✅ bcrypt package đã được cài đặt
   - ✅ axios package đã có sẵn

### ❌ Vấn đề gặp phải

**1. Database Connection Error:**
```
Can't reach database server at `pg-audio-tai-loc-kadev.b.aivencloud.com:26566`
```

**Chi tiết lỗi:**
- Prisma Accelerate không thể kết nối đến Aiven PostgreSQL database
- Cả direct connection và Prisma Accelerate đều không hoạt động
- Backend đang chạy (port 3010) nhưng không thể kết nối database
- Health endpoint trả về `status: "error"`

**Nguyên nhân có thể:**
1. Database server Aiven không chạy hoặc đã bị xóa
2. Firewall/Network blocking connection
3. SSL certificate issues
4. Database credentials không hợp lệ
5. Prisma Accelerate API key hết hạn

---

## 📋 Dữ liệu đã chuẩn bị để seed

### 1. **Users** (5 users)
- Admin: `admin@audiotailoc.vn` (ADMIN role)
- Manager: `manager@audiotailoc.vn` (MANAGER role)
- 3 Customers với role USER

**Password:** `Admin@123456` (đáp ứng yêu cầu: uppercase, special char, not common)

### 2. **Categories** (6 categories)
| Tên | Slug | Mô tả |
|-----|------|-------|
| Âm thanh chuyên nghiệp | am-thanh-chuyen-nghiep | Thiết bị cao cấp cho sân khấu |
| Loa & Amplifier | loa-amplifier | Hệ thống loa và amply |
| Microphone | microphone | Micro không dây, có dây |
| Mixer & Console | mixer-console | Bàn mixer analog và digital |
| Thiết bị ghi âm | thiet-bi-ghi-am | Thiết bị ghi âm studio |
| Phụ kiện âm thanh | phu-kien-am-thanh | Cáp, giắc, phụ kiện |

### 3. **Products** (5 sản phẩm chính)
| Sản phẩm | Giá | Danh mục | Tồn kho |
|----------|-----|----------|---------|
| Loa JBL PRX815W | 45,000,000đ | Loa & Amplifier | 20 |
| Mixer Yamaha MG16XU | 18,500,000đ | Mixer & Console | 15 |
| Micro Shure SM58 | 3,200,000đ | Microphone | 50 |
| Interface Focusrite Scarlett 2i2 | 4,800,000đ | Thiết bị ghi âm | 30 |
| Cáp XLR Mogami | 850,000đ | Phụ kiện | 100 |

### 4. **Service Types** (5 loại dịch vụ)
- Lắp đặt hệ thống
- Bảo trì - Sửa chữa
- Tư vấn kỹ thuật
- Đào tạo - Huấn luyện
- Thuê thiết bị

### 5. **Services** (3 dịch vụ)
- Lắp đặt âm thanh hội trường (50,000,000đ)
- Bảo trì định kỳ hệ thống (5,000,000đ)
- Tư vấn giải pháp âm thanh (2,000,000đ)

### 6. **Banners** (2 banners)
- Giảm giá 20% toàn bộ loa JBL
- Dịch vụ lắp đặt chuyên nghiệp

### 7. **Projects** (2 dự án)
- Hệ thống âm thanh Hội trường Thống Nhất
- Studio thu âm MusicLab

### 8. **Promotions** (2 mã giảm giá)
- `WELCOME10` - Giảm 10% đơn đầu (max 1,000,000đ)
- `FLASH20` - Flash Sale 20% (max 5,000,000đ)

### 9. **Site Stats** (4 thống kê)
- 1,200 Khách hàng hài lòng
- 650 Thiết bị & giải pháp
- 4.9 Đánh giá trung bình
- 7 Năm kinh nghiệm

---

## 🔧 Cách khắc phục

### Option 1: Khôi phục Aiven Database (Khuyến nghị)

1. **Kiểm tra Aiven Console:**
   ```
   https://console.aiven.io/
   ```
   - Đăng nhập và kiểm tra xem database có đang chạy không
   - Nếu đã bị xóa hoặc tạm dừng, hãy khởi động lại hoặc tạo mới

2. **Cập nhật credentials nếu cần:**
   - Cập nhật `backend/.env` với connection strings mới
   - Chạy lại migrations: `npx prisma migrate deploy`

### Option 2: Sử dụng Local PostgreSQL

1. **Cài đặt PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15
   ```

2. **Tạo database:**
   ```bash
   psql postgres
   CREATE DATABASE audiotailoc;
   \q
   ```

3. **Cập nhật `.env`:**
   ```env
   DATABASE_URL="postgresql://localhost:5432/audiotailoc"
   DIRECT_DATABASE_URL="postgresql://localhost:5432/audiotailoc"
   ```

4. **Chạy migrations và seed:**
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   node scripts/seed-comprehensive.js
   ```

### Option 3: Sử dụng Supabase (Miễn phí)

1. **Tạo project tại:**
   ```
   https://supabase.com/
   ```

2. **Lấy connection string từ Project Settings > Database**

3. **Cập nhật `.env`:**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   DIRECT_DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

4. **Deploy migrations:**
   ```bash
   cd backend
   npx prisma migrate deploy
   node scripts/seed-comprehensive.js
   ```

---

## 📝 Scripts sẵn sàng sử dụng

### 1. Check Database Stats
```bash
cd backend
node scripts/check-database-stats.js
```
**Chức năng:** Kiểm tra số lượng records trong các bảng chính

### 2. Seed via Prisma (sau khi fix database)
```bash
cd backend
node scripts/seed-comprehensive.js
```
**Chức năng:** Seed toàn bộ dữ liệu trực tiếp qua Prisma ORM

### 3. Seed via API (sau khi fix database)
```bash
cd backend
node scripts/seed-via-api.js
```
**Chức năng:** Seed dữ liệu thông qua API endpoints (cần backend đang chạy)

---

## ✅ Checklist sau khi fix database

- [ ] Database có thể kết nối
- [ ] Backend health check trả về `status: "ok"`
- [ ] Chạy migrations: `npx prisma migrate deploy`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Chạy seed script: `node scripts/seed-comprehensive.js`
- [ ] Verify data: `node scripts/check-database-stats.js`
- [ ] Test API endpoints:
  - GET `/api/v1/health` - Health check
  - GET `/api/v1/categories` - Danh sách categories
  - GET `/api/v1/products` - Danh sách products
  - POST `/api/v1/auth/login` - Login với admin account

---

## 📊 Expected Results After Seeding

```
✅ Users: 5
✅ Products: 5
✅ Categories: 6
✅ Services: 3
✅ Service Types: 5
✅ Banners: 2
✅ Projects: 2
✅ Promotions: 2
✅ Inventory: 5 (auto-created with products)
✅ Site Stats: 4
```

---

## 🔐 Test Credentials

**Admin Account:**
- Email: `admin@audiotailoc.vn`
- Password: `Admin@123456`
- Role: ADMIN

**Manager Account:**
- Email: `manager@audiotailoc.vn`  
- Password: `Admin@123456`
- Role: MANAGER

**Customer Account:**
- Email: `customer1@gmail.com`
- Password: `Admin@123456`
- Role: USER

---

## 📞 Hỗ trợ thêm

Nếu cần hỗ trợ:
1. Kiểm tra logs backend: `backend/logs/`
2. Kiểm tra Prisma logs: Set `DEBUG=prisma:*` trong terminal
3. Test database connection:
   ```bash
   cd backend
   npx prisma db execute --url "YOUR_DATABASE_URL" --stdin <<< "SELECT 1"
   ```

---

**Ghi chú:** Tất cả scripts đã được tạo và sẵn sàng sử dụng ngay khi database connection được khôi phục.
