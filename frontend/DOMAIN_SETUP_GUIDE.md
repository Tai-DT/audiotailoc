# 🌐 Hướng dẫn thiết lập Domain cho Audio Tài Lộc

## 📋 Tóm tắt kết quả tìm kiếm domain

### ❌ audiotailoc.com
- **Trạng thái**: Unavailable (đã bị chiếm)

### ✅ Các lựa chọn thay thế được khuyến nghị:

1. **🥇 audiotailoc.net** - ₫336,000 (~$14)
   - Phù hợp cho doanh nghiệp công nghệ
   - Giá cả hợp lý
   - Dễ nhớ và chuyên nghiệp

2. **🥈 audiotailoc.store** - ₫96,000 (~$4) 
   - Giá rẻ nhất (khuyến mãi)
   - Phù hợp cho e-commerce
   - Thể hiện tính chất kinh doanh

3. **🥉 audiotailoc.live** - ₫480,000 (~$20)
   - Thể hiện tính năng động
   - Phù hợp cho streaming/live audio

## 🛠️ Các bước thiết lập Domain

### Bước 1: Mua domain từ Squarespace Domains
1. Truy cập https://domains.squarespace.com
2. Tìm kiếm domain đã chọn
3. Chọn domain và thanh toán
4. Hoàn tất đăng ký

### Bước 2: Thiết lập DNS trên Squarespace
```
Thêm các DNS records sau:
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### Bước 3: Cấu hình domain trên Vercel
1. Truy cập Vercel Dashboard
2. Chọn project `frontend-audiotailoc`
3. Vào Settings > Domains
4. Thêm domain mới (ví dụ: audiotailoc.net)
5. Vercel sẽ verify domain tự động

### Bước 4: Cấu hình SSL/TLS
- Vercel tự động cấp SSL certificate từ Let's Encrypt
- Domain sẽ có HTTPS trong vòng vài phút

## 📁 Files đã được cập nhật:

### ✅ .env.production
- Cấu hình NEXT_PUBLIC_SITE_URL
- Thiết lập SEO meta tags
- Environment variables cho production

### ✅ next.config.ts  
- Thêm security headers
- Cấu hình cho custom domain
- Optimization settings

### ✅ vercel.json
- Security headers 
- Redirects configuration
- Environment variables

## 🔧 Commands để deploy với domain mới:

```bash
# 1. Build với production config
cd /Users/macbook/Desktop/audiotailoc/frontend
npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Add domain (chạy sau khi mua domain)
vercel domains add audiotailoc.net

# 4. Verify domain
vercel domains verify audiotailoc.net
```

## 🔍 Checklist sau khi thiết lập:

- [ ] Domain đã được mua và đăng ký
- [ ] DNS records đã được cấu hình
- [ ] Domain đã được add vào Vercel project
- [ ] SSL certificate đã được issued
- [ ] Website accessible via custom domain
- [ ] Redirects hoạt động đúng (www -> non-www)
- [ ] Security headers được apply
- [ ] SEO meta tags hiển thị đúng domain

## 🌟 Lợi ích của việc sử dụng custom domain:

1. **Professional branding**: audiotailoc.net vs frontend-audiotailoc.vercel.app
2. **SEO improvement**: Custom domain có ranking tốt hơn
3. **Trust factor**: Khách hàng tin tưởng domain riêng hơn
4. **Email setup**: Có thể tạo email @audiotailoc.net
5. **Marketing**: Dễ nhớ và chia sẻ

## 📞 Hỗ trợ:
- Vercel Documentation: https://vercel.com/docs/concepts/projects/domains
- Squarespace Domains Help: https://support.squarespace.com/

---
**Ghi chú**: File này đã được tạo tự động bởi AI Assistant để hướng dẫn thiết lập domain cho project Audio Tài Lộc.