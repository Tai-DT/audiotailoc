# Hướng dẫn cấu hình DNS cho audiotailoc.com trên Vercel

## Phương pháp 1: Sử dụng Vercel CLI (Khuyến nghị)

### Bước 1: Cài đặt và đăng nhập
```bash
# Cài đặt Vercel CLI (nếu chưa có)
npm i -g vercel

# Đăng nhập Vercel
vercel login
```

### Bước 2: Chạy script tự động
```bash
# Chạy script để thêm tất cả DNS records
./add-dns-records.sh
```

### Bước 3: Xác minh cấu hình
```bash
# Chạy script kiểm tra
./verify-dns-records.sh
```

## Phương pháp 2: Sử dụng Vercel Dashboard

### Bước 1: Truy cập Vercel Dashboard
1. Đi tới https://vercel.com/dashboard
2. Đăng nhập vào tài khoản của bạn
3. Chọn project **audiotailoc**

### Bước 2: Cấu hình Domain
1. Vào **Settings** → **Domains**
2. Thêm domain `audiotailoc.com` (nếu chưa có)
3. Click vào domain để vào trang quản lý DNS

### Bước 3: Thêm DNS Records

#### A Records (4 records):
**Record 1:**
- Type: `A`
- Name: `@`
- Value: `198.49.23.144`
- TTL: `14400` (4 hours)

**Record 2:**
- Type: `A`
- Name: `@`
- Value: `198.49.23.145`
- TTL: `14400` (4 hours)

**Record 3:**
- Type: `A`
- Name: `@`
- Value: `198.185.159.145`
- TTL: `14400` (4 hours)

**Record 4:**
- Type: `A`
- Name: `@`
- Value: `198.185.159.144`
- TTL: `14400` (4 hours)

#### CNAME Record:
- Type: `CNAME`
- Name: `www`
- Value: `ext-sq.squarespace.com`
- TTL: `14400` (4 hours)

#### HTTPS Record:
- Type: `HTTPS`
- Name: `@`
- Value: `1 . alpn="h2,http/1.1" ipv4hint="198.185.159.144,198.185.159.145,198.49.23.144,198.49.23.145"`
- TTL: `14400` (4 hours)

## Các lệnh thủ công (CLI)

```bash
# Thêm 4 A records
vercel dns add audiotailoc.com @ A 198.49.23.144
vercel dns add audiotailoc.com @ A 198.49.23.145
vercel dns add audiotailoc.com @ A 198.185.159.145
vercel dns add audiotailoc.com @ A 198.185.159.144

# Thêm CNAME record
vercel dns add audiotailoc.com www CNAME ext-sq.squarespace.com

# Thêm HTTPS record
vercel dns add audiotailoc.com @ HTTPS '1 . alpn="h2,http/1.1" ipv4hint="198.185.159.144,198.185.159.145,198.49.23.144,198.49.23.145"'
```

## Kiểm tra và xác minh

### Xem tất cả DNS records:
```bash
vercel dns ls
```

### Kiểm tra từng loại record:
```bash
# Kiểm tra A records
dig A audiotailoc.com +short

# Kiểm tra CNAME record
dig CNAME www.audiotailoc.com +short

# Kiểm tra HTTPS record
dig HTTPS audiotailoc.com +short
```

### Kiểm tra trên nameservers của Vercel:
```bash
dig A audiotailoc.com +short @ns1.vercel-dns.com
dig A audiotailoc.com +short @ns2.vercel-dns.com
```

## Xử lý sự cố

### Nếu records không xuất hiện:
```bash
# Kiểm tra domain đã được thêm vào project chưa
vercel domains ls

# Liệt kê tất cả DNS records
vercel dns ls
```

### Nếu cần xóa record sai:
```bash
# Xem danh sách records với ID
vercel dns ls

# Xóa record theo ID
vercel dns rm [record-id]
```

### Kiểm tra propagation:
```bash
# Kiểm tra trên các DNS server khác nhau
dig A audiotailoc.com @8.8.8.8
dig A audiotailoc.com @1.1.1.1
dig A audiotailoc.com @208.67.222.222
```

## Lưu ý quan trọng

1. **Thời gian propagation**: DNS có thể mất đến 48 giờ để propagate toàn cầu
2. **Multiple A records**: Có nhiều A records giúp load balancing và redundancy
3. **TTL**: Tất cả records sử dụng TTL 4 giờ (14400 giây)
4. **HTTPS record**: Đây là loại record mới để cấu hình HTTP service parameters

## Scripts có sẵn

- `add-dns-records.sh`: Script tự động thêm tất cả DNS records
- `verify-dns-records.sh`: Script kiểm tra và xác minh DNS configuration

Chạy các script này để tự động hóa quá trình cấu hình và kiểm tra.