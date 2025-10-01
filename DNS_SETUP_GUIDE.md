# Hướng dẫn thiết lập DNS cho audiotailoc.com

## Domain đã mua: audiotailoc.com

### Bước 1: Thiết lập DNS Records tại Squarespace Domains

Truy cập Squarespace Domains dashboard và thêm các DNS records sau:

#### A. Vercel Domain Setup (chính)
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

#### B. Heroku Backend Setup (nếu cần custom subdomain)
```
Type: CNAME
Name: api
Value: backend-audiotailoc-f6b75c2cc1ea.herokuapp.com
```

### Bước 2: Cấu hình domain trong Vercel

1. Đăng nhập vào Vercel Dashboard
2. Chọn project `audiotailoc-frontend`
3. Vào Settings → Domains
4. Thêm domain: `audiotailoc.com`
5. Thêm domain: `www.audiotailoc.com`

### Bước 3: Kiểm tra cấu hình

#### Frontend URLs sẽ là:
- Chính: https://audiotailoc.com
- WWW: https://www.audiotailoc.com

#### Backend URLs (Heroku):
- API: https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1
- Hoặc: https://api.audiotailoc.com/api/v1 (nếu setup CNAME)

### Bước 4: Environment Variables đã cập nhật

✅ `.env.production`:
```
NEXT_PUBLIC_SITE_URL=https://audiotailoc.com
```

✅ `vercel.json`:
```json
{
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://audiotailoc.com"
  }
}
```

### Bước 5: Deploy và kiểm tra

1. **Deploy lên Vercel:**
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Kiểm tra DNS propagation:**
   - https://whatsmydns.net/#CNAME/audiotailoc.com
   - https://whatsmydns.net/#CNAME/www.audiotailoc.com

3. **Test các URLs:**
   - https://audiotailoc.com
   - https://www.audiotailoc.com
   - https://audiotailoc.com/products
   - https://audiotailoc.com/api/products

### Bước 6: SSL Certificate

Vercel sẽ tự động tạo SSL certificate cho domain sau khi DNS propagation hoàn tất (thường 24-48 giờ).

### Bước 7: SEO và Sitemap

✅ Đã cập nhật:
- `/sitemap.ts` → audiotailoc.com
- `/sitemap.xml/route.ts` → audiotailoc.com  
- `/robots.ts` → audiotailoc.com
- Product metadata → audiotailoc.com

### Troubleshooting

1. **Nếu domain không hoạt động:**
   - Kiểm tra DNS propagation
   - Đảm bảo CNAME records đúng
   - Chờ 24-48h để DNS propagation hoàn tất

2. **SSL Error:**
   - Chờ Vercel tự động tạo certificate
   - Có thể mất vài giờ sau khi DNS hoạt động

3. **API không hoạt động:**
   - Kiểm tra CORS settings trong backend
   - Đảm bảo Heroku app không sleep

### Contact Support

- Vercel Support: https://vercel.com/support
- Squarespace Domains Support: https://support.squarespace.com/

---

**Lưu ý:** DNS propagation có thể mất 24-48 giờ để hoàn tất trên toàn cầu.