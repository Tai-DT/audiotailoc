# 🚀 HƯỚNG DẪN SỬ DỤNG - AUDIO TÀI LỘC DASHBOARD

## 📋 TỔNG QUAN

Project Audio Tài Lộc gồm 2 phần chính:
- **Backend API** (NestJS) - Port 3010
- **Dashboard** (Next.js) - Port 3001

## ✅ ĐÃ HOÀN THÀNH

### 1. Sửa lỗi Accessibility ✅
- Thêm `aria-label` cho tất cả input và select elements
- File: `/dashboard/app/kb/articles/page.tsx`

### 2. Tạo Development Scripts ✅
- Script `start-dev.sh` để chạy cả backend và dashboard
- Tự động check ports, kill processes cũ, và start services
- Logs được lưu vào `backend-dev.log` và `dashboard-dev.log`

### 3. Tạo Documentation ✅
- `DASHBOARD_IMPROVEMENT_PLAN.md` - Kế hoạch chi tiết 12 giai đoạn
- `DASHBOARD_FIX_SUMMARY.md` - Tóm tắt và quick fixes
- `DASHBOARD_USAGE.md` - Hướng dẫn sử dụng (file này)

---

## 🚀 CÁCH SỬ DỤNG

### Phương án 1: Sử dụng Script (KHUYẾN NGHỊ)

```bash
cd /Users/macbook/Desktop/audiotailoc

# Chạy script startup
./start-dev.sh

# Script sẽ:
# 1. Check và kill processes cũ trên port 3010 và 3001
# 2. Install dependencies nếu cần
# 3. Start backend trên port 3010
# 4. Start dashboard trên port 3001
# 5. Show logs real-time

# Để dừng: Nhấn Ctrl+C
```

### Phương án 2: Chạy Thủ Công

#### Terminal 1 - Backend:
```bash
cd /Users/macbook/Desktop/audiotailoc/backend

# Install dependencies (lần đầu)
yarn install

# Generate Prisma client (lần đầu)
npx prisma generate

# Migrate database (lần đầu)
npx prisma migrate dev --name init

# Start server
yarn dev

# Backend will run on http://localhost:3010
```

#### Terminal 2 - Dashboard:
```bash
cd /Users/macbook/Desktop/audiotailoc/dashboard

# Install dependencies (lần đầu)
npm install

# Clear cache
rm -rf .next node_modules/.cache

# Start server
npm run dev

# Dashboard will run on http://localhost:3001
```

---

## 🔐 ĐĂNG NHẬP

### Tạo Admin Account (nếu chưa có)

```bash
cd /Users/macbook/Desktop/audiotailoc/backend

# Option 1: Create admin
node scripts/create-admin.js

# Option 2: Reset admin password
node scripts/reset-admin-password.js
```

### Credentials mặc định:
- **Email:** admin@audiotailoc.com
- **Password:** admin123 (hoặc password bạn đã tạo)

### Login Flow:
1. Mở http://localhost:3001
2. Sẽ tự động redirect tới `/login`
3. Nhập email và password
4. Sau khi login thành công, redirect tới `/dashboard`
5. JWT token được lưu trong localStorage

---

## 📊 KIỂM TRA HỆ THỐNG

### 1. Check Backend Health
```bash
curl http://localhost:3010/api/v1/health
# Expected: {"status":"ok"}
```

### 2. Check API Docs
Mở trình duyệt: http://localhost:3010/api/v1/docs

### 3. Check Dashboard
Mở trình duyệt: http://localhost:3001

### 4. Check Processes
```bash
# Kiểm tra process đang chạy
ps aux | grep node

# Kiểm tra port 3010
lsof -i :3010

# Kiểm tra port 3001
lsof -i :3001
```

---

## 🧪 TEST DASHBOARD FEATURES

### 1. Dashboard Home (/dashboard)
- [ ] Stats cards hiển thị số liệu
- [ ] Charts render đúng
- [ ] Recent orders hiển thị
- [ ] Quick actions work

### 2. Orders (/dashboard/orders)
- [ ] List orders hiển thị
- [ ] Tạo order mới
- [ ] Edit order
- [ ] Delete order
- [ ] Update status
- [ ] Search/filter works

### 3. Products (/dashboard/products)
- [ ] List products
- [ ] CRUD operations
- [ ] Image upload
- [ ] Categories

### 4. Services (/dashboard/services)
- [ ] List services
- [ ] CRUD operations
- [ ] Service types

### 5. Users (/dashboard/users)
- [ ] List users
- [ ] Edit user
- [ ] Delete user
- [ ] Role management

### 6. Bookings (/dashboard/bookings)
- [ ] List bookings
- [ ] Create booking
- [ ] Update status
- [ ] Calendar view

### 7. Projects (/dashboard/projects)
- [ ] List projects
- [ ] CRUD operations
- [ ] Featured toggle
- [ ] Image upload

### 8. Reviews (/dashboard/reviews)
- [ ] List reviews
- [ ] Approve/reject
- [ ] Reply to review

---

## 🐛 TROUBLESHOOTING

### Problem 1: Port Already in Use

**Error:** `Address already in use`

**Solution:**
```bash
# Kill process on port 3010
lsof -ti:3010 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use the script (it auto-kills)
./start-dev.sh
```

### Problem 2: Backend Connection Failed

**Error:** Dashboard shows "Failed to fetch" or API errors

**Check:**
1. Backend is running:
   ```bash
   curl http://localhost:3010/api/v1/health
   ```

2. `.env.local` has correct API URL:
   ```bash
   cat dashboard/.env.local
   # Should have: NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
   ```

3. CORS configured on backend

### Problem 3: Login Fails

**Error:** "Invalid credentials" or "Login failed"

**Check:**
1. Admin account exists:
   ```bash
   cd backend
   npx prisma studio
   # Check User table for admin
   ```

2. Create admin if missing:
   ```bash
   cd backend
   node scripts/create-admin.js
   ```

3. Reset password:
   ```bash
   cd backend
   node scripts/reset-admin-password.js
   ```

### Problem 4: Dashboard Shows No Data

**Error:** Empty lists, no stats

**Check:**
1. Backend has data:
   ```bash
   cd backend
   npx prisma studio
   # Check tables: Order, Product, Service, etc.
   ```

2. Seed database:
   ```bash
   cd backend
   node scripts/seed-all-data.js
   ```

3. Check network tab in browser:
   - API requests should return data
   - Check Authorization header has JWT token

### Problem 5: Build Errors

**Error:** TypeScript or build errors

**Solution:**
```bash
cd dashboard

# Clear everything
rm -rf .next node_modules/.cache node_modules package-lock.json

# Reinstall
npm install

# Try dev again
npm run dev
```

### Problem 6: Database Errors

**Error:** Prisma errors, migration errors

**Solution:**
```bash
cd backend

# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset

# Or just migrate
npx prisma migrate dev

# Generate client
npx prisma generate

# Seed data
node scripts/seed-all-data.js
```

---

## 📝 LOGS

### View Backend Logs
```bash
# Real-time
tail -f backend-dev.log

# Backend application logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

### View Dashboard Logs
```bash
# Real-time
tail -f dashboard-dev.log

# Browser console
# Open DevTools (F12) -> Console tab
```

---

## 🔧 USEFUL COMMANDS

### Backend Commands
```bash
cd backend

# Install deps
yarn install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (DB GUI)
npx prisma studio

# Seed data
node scripts/seed-all-data.js

# Create admin
node scripts/create-admin.js

# Reset admin password
node scripts/reset-admin-password.js

# Start dev
yarn dev

# Start production
yarn start:prod

# Run tests
yarn test
```

### Dashboard Commands
```bash
cd dashboard

# Install deps
npm install

# Clear cache
rm -rf .next node_modules/.cache

# Dev mode
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

---

## 🌐 URLS

- **Dashboard:** http://localhost:3001
- **Login:** http://localhost:3001/login
- **Dashboard Home:** http://localhost:3001/dashboard
- **Backend API:** http://localhost:3010/api/v1
- **API Docs:** http://localhost:3010/api/v1/docs
- **Health Check:** http://localhost:3010/api/v1/health
- **Prisma Studio:** http://localhost:5555 (khi chạy `npx prisma studio`)

---

## 📚 DOCUMENTATION

- **Main Plan:** `DASHBOARD_IMPROVEMENT_PLAN.md` - Kế hoạch 12 giai đoạn
- **Quick Fixes:** `DASHBOARD_FIX_SUMMARY.md` - Tóm tắt nhanh
- **Usage Guide:** `DASHBOARD_USAGE.md` - File này
- **Backend README:** `backend/README.md`
- **Dashboard README:** `dashboard/README.md`
- **Integration:** `dashboard/INTEGRATION.md`
- **Knowledge Base:** `DASHBOARD_KB_COMPLETE.md`

---

## 🎯 NEXT STEPS

1. ✅ **Run Services** - Use `./start-dev.sh`
2. ✅ **Login** - Access dashboard and login
3. ✅ **Test Features** - Go through each page
4. 🔄 **Fix Issues** - Fix any bugs found
5. 🔄 **Optimize** - Improve performance
6. 🔄 **Deploy** - Prepare for production

---

## ✅ QUICK START (TL;DR)

```bash
# 1. Start everything
cd /Users/macbook/Desktop/audiotailoc
./start-dev.sh

# 2. Create admin (if needed)
# In another terminal:
cd backend
node scripts/create-admin.js

# 3. Open browser
# http://localhost:3001

# 4. Login
# Email: admin@audiotailoc.com
# Password: admin123

# 5. Test features
# Click through all pages and test CRUD

# 6. Stop services
# Press Ctrl+C in the terminal running start-dev.sh
```

---

## 🎉 SUCCESS!

Nếu bạn thấy:
- ✅ Backend running on port 3010
- ✅ Dashboard running on port 3001
- ✅ Can login successfully
- ✅ Dashboard loads without errors
- ✅ Can view data on pages

**Congratulations! 🎊 Your dashboard is working!**

Next: Test all features và fix any issues found.

---

## 📞 SUPPORT

**Need help?**
- Check logs: `backend-dev.log`, `dashboard-dev.log`
- Check browser console (F12)
- Check Network tab for API calls
- Check VSCode Problems panel
- Review documentation files

**Common Issues:**
- Port conflicts → Kill processes and restart
- Login fails → Create admin account
- No data → Seed database
- Build errors → Clear cache and reinstall

---

**Happy Coding! 🚀**
