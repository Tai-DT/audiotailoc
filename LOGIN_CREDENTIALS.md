# Tài khoản đăng nhập Audio Tài Lộc

## 🔐 Tài khoản Admin
- **Email**: `admin@audiotailoc.com`
- **Password**: `admin_password_123`
- **Role**: ADMIN
- **Quyền hạn**: Toàn bộ hệ thống (Dashboard Admin)

## 👤 Tài khoản Demo User  
- **Email**: `demo@audiotailoc.com`
- **Password**: `demo123`
- **Role**: USER
- **Quyền hạn**: Người dùng thường (Frontend)

## 🌐 Các URL quan trọng

### Backend API
- API Server: http://localhost:3010
- API Documentation: http://localhost:3010/docs
- API v1 Docs: http://localhost:3010/api/v1/docs
- Health Check: http://localhost:3010/health

### Frontend (User)
- Frontend: http://localhost:3000
- Login: http://localhost:3000/login
- Software Page: http://localhost:3000/software
- Profile: http://localhost:3000/profile

### Dashboard (Admin)
- Dashboard: http://localhost:3001
- Login: http://localhost:3001/login
- Software Management: http://localhost:3001/dashboard/software

## 📝 Lưu ý

1. **Bảo mật**: Đổi password admin trong production
2. **Seed data**: Chạy `npm run seed` trong folder backend để tạo admin user
3. **Demo user**: Chạy `npx ts-node prisma/seed-demo-user.ts` để tạo demo user

## 🚀 Khởi động dịch vụ

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Dashboard
cd dashboard && npm run dev
```

## ✅ Checklist sau khi login

### Admin (Dashboard)
- [ ] Truy cập Dashboard
- [ ] Tạo sản phẩm software mới
- [ ] Upload file/link Google Drive
- [ ] Cấu hình giá và quyền truy cập
- [ ] Publish software

### User (Frontend)
- [ ] Xem danh sách software
- [ ] Xem chi tiết software
- [ ] Mua software (nếu có giá)
- [ ] Download software miễn phí
- [ ] Xem lịch sử download trong Profile

---
**Ngày tạo**: 02/02/2026
**Version**: 1.0.0
