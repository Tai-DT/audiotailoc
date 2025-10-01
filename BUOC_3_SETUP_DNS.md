# 🔧 Hướng dẫn setup DNS cho audiotailoc.com

## Bước 3: Setup DNS Records

### 📍 Domain Provider: Squarespace Domains (hoặc provider nơi bạn mua domain)

### 🎯 DNS Records cần thêm:

#### 1. Root Domain (@)
```
Type: CNAME
Name: @ (hoặc để trống)
Value: cname.vercel-dns.com
TTL: 3600 (hoặc Auto)
```

#### 2. WWW Subdomain
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (hoặc Auto)
```

### 📋 Các bước thực hiện:

1. **Đăng nhập vào Squarespace Domains**
   - Truy cập: https://account.squarespace.com/domains
   - Đăng nhập với tài khoản đã mua domain

2. **Tìm domain audiotailoc.com**
   - Click vào domain audiotailoc.com
   - Chọn "DNS Settings" hoặc "Manage DNS"

3. **Thêm CNAME Records**
   - Click "Add Record" hoặc "+"
   - Chọn Type: CNAME
   - Name: @ (hoặc root)
   - Value: cname.vercel-dns.com
   - Save

   - Thêm record thứ 2:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
   - Save

4. **Xóa các records cũ (nếu có)**
   - Xóa A records cũ pointing tới IP cũ
   - Xóa CNAME records cũ không cần thiết
   - Giữ lại MX records cho email (nếu có)

### ⚠️ Lưu ý quan trọng:

- **DNS Propagation**: Có thể mất 24-48 giờ để DNS propagation hoàn tất
- **Check propagation**: Sử dụng https://whatsmydns.net/#CNAME/audiotailoc.com
- **Backup**: Screenshot lại settings cũ trước khi thay đổi

### 🔍 Kiểm tra DNS:

```bash
# Kiểm tra CNAME record
dig audiotailoc.com CNAME
dig www.audiotailoc.com CNAME

# Hoặc sử dụng nslookup
nslookup audiotailoc.com
nslookup www.audiotailoc.com
```

### 🎯 Kết quả mong đợi:

```
audiotailoc.com -> cname.vercel-dns.com
www.audiotailoc.com -> cname.vercel-dns.com
```

---

**Sau khi setup DNS xong, chuyển sang Bước 4: Setup Vercel Domain**