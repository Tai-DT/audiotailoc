# 🚀 Hướng dẫn setup Vercel Domain

## Bước 4: Thêm Domain vào Vercel Project

### 📋 Các bước thực hiện:

#### 1. Đăng nhập Vercel Dashboard
- Truy cập: https://vercel.com/dashboard
- Đăng nhập với GitHub account

#### 2. Tìm Project audiotailoc-frontend
- Tìm project "audiotailoc-frontend" trong dashboard
- Click vào project name

#### 3. Vào Settings → Domains
- Click tab "Settings" 
- Click "Domains" trong sidebar

#### 4. Thêm Domain audiotailoc.com
- Click "Add" hoặc "Add Domain"
- Nhập: `audiotailoc.com`
- Click "Add"

#### 5. Thêm WWW Domain
- Tiếp tục click "Add Domain"
- Nhập: `www.audiotailoc.com`
- Click "Add"

#### 6. Verify Domain Configuration
Vercel sẽ hiển thị status của từng domain:
- ✅ **audiotailoc.com** - Valid Configuration
- ✅ **www.audiotailoc.com** - Valid Configuration

### 🔧 Environment Variables (kiểm tra lại)

Trong project settings → Environment Variables:

```
Production:
NEXT_PUBLIC_SITE_URL = https://audiotailoc.com
NEXT_PUBLIC_API_URL = https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1
NODE_ENV = production
```

### ⚠️ Lưu ý:

- **SSL Certificate**: Vercel tự động tạo SSL cho domain
- **Redirect**: Set www.audiotailoc.com redirect to audiotailoc.com (optional)
- **DNS Check**: Vercel sẽ check DNS configuration tự động

### 🎯 Kết quả mong đợi:

```
Domain Status:
✅ audiotailoc.com - Valid Configuration
✅ www.audiotailoc.com - Valid Configuration  
🔄 SSL Certificate - Issuing (có thể mất vài phút)
```

---

**Sau khi setup Vercel xong, chuyển sang Bước 5: Deploy và Test**