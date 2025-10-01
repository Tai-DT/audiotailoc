# PayOS Payment Integration Guide

## Tổng quan

PayOS đã được tích hợp đầy đủ vào hệ thống Audio Tài Lộc với các tính năng:

- ✅ Thanh toán qua QR Code (VNPay)
- ✅ Chuyển khoản ngân hàng
- ✅ Webhook xử lý tự động
- ✅ Demo mode & Production mode
- ✅ Bảo mật với HMAC SHA256 signature

## Cấu hình hiện tại

### Environment Variables đã cấu hình:

```bash
# PayOS Credentials (Đã có trong .env.local)
PAYOS_PARTNER_CODE=DOTAI3004
PAYOS_API_KEY=43e30c48-a208-47ad-855a-c1bdf18d748b
PAYOS_CHECKSUM_KEY=33642e2b053986dbdb178487479fb0191371435d1f9328b8fba61ef6c20a65ab

# PayOS API Endpoints
PAYOS_CREATE_PAYMENT_URL=https://api.payos.vn/v2/payment-requests
PAYOS_VERIFY_PAYMENT_URL=https://api.payos.vn/v2/payment-requests/{orderCode}
PAYOS_CANCEL_PAYMENT_URL=https://api.payos.vn/v2/payment-requests/{orderCode}/cancel

# App URLs for redirects
NEXT_PUBLIC_APP_URL=https://audiotailoc-frontend-37b1aolbt-kadevs-projects.vercel.app
PAYOS_RETURN_URL=https://audiotailoc-frontend-37b1aolbt-kadevs-projects.vercel.app/order-success
PAYOS_CANCEL_URL=https://audiotailoc-frontend-37b1aolbt-kadevs-projects.vercel.app/checkout

# Webhook endpoint
PAYOS_WEBHOOK_URL=https://audiotailoc-frontend-37b1aolbt-kadevs-projects.vercel.app/api/webhook/payos
```

## Cách hoạt động

### 1. Quy trình thanh toán
1. Khách hàng chọn PayOS trong trang checkout (`/checkout`)
2. Hệ thống gọi API `/api/payment/process` với `paymentMethod: 'payos'`
3. API tạo payment request tới PayOS và trả về payment URL
4. Khách hàng được redirect tới PayOS để thanh toán
5. Sau khi thanh toán, khách hàng được redirect về `/order-success`
6. Webhook `/api/webhook/payos` nhận thông báo từ PayOS để cập nhật trạng thái

### 2. Demo Mode vs Production Mode
- **Demo Mode**: Khi credentials không đầy đủ hoặc = "demo_partner_code"
  - Sử dụng `/payment-demo` page để mô phỏng thanh toán
  - Không gọi API PayOS thật
- **Production Mode**: Khi có đầy đủ credentials thật
  - Gọi API PayOS chính thức
  - Xử lý thanh toán thật

### 3. Bảo mật
- Sử dụng HMAC SHA256 signature để xác thực requests
- Validate webhook signatures
- Environment variables bảo vệ credentials

## API Endpoints

### 1. `/api/payment/process` (POST)
- Tạo payment request
- Trả về payment URL để redirect

### 2. `/api/payment/status` (GET)
- Kiểm tra trạng thái thanh toán
- Query params: `orderId`, `paymentMethod`

### 3. `/api/webhook/payos` (POST)
- Nhận webhook từ PayOS
- Cập nhật trạng thái đơn hàng tự động

## Testing

### Demo Mode Testing
1. Truy cập `/checkout`
2. Chọn phương thức thanh toán "PayOS (VNPay)"
3. Hệ thống sẽ redirect tới `/payment-demo`
4. Chọn phương thức thanh toán (QR hoặc Bank Transfer)
5. Hệ thống mô phỏng kết quả (success/failed/pending)

### Production Testing
1. Đảm bảo có PayOS credentials thật
2. Test với số tiền nhỏ (VD: 1,000 VND)
3. Kiểm tra webhook hoạt động
4. Verify trong PayOS Dashboard

## Production Setup

### 1. Cập nhật credentials
Thay thế credentials demo bằng credentials production từ PayOS Dashboard:

```bash
# Lấy từ https://payos.vn/dashboard
PAYOS_PARTNER_CODE=YOUR_REAL_PARTNER_CODE
PAYOS_API_KEY=YOUR_REAL_API_KEY
PAYOS_CHECKSUM_KEY=YOUR_REAL_CHECKSUM_KEY
```

### 2. Cập nhật URLs
```bash
# Production URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
PAYOS_RETURN_URL=https://yourdomain.com/order-success
PAYOS_CANCEL_URL=https://yourdomain.com/checkout
PAYOS_WEBHOOK_URL=https://yourdomain.com/api/webhook/payos
```

### 3. Cấu hình PayOS Dashboard
1. Đăng nhập https://payos.vn/dashboard
2. Thêm domain của bạn vào whitelist
3. Cấu hình webhook URL: `https://yourdomain.com/api/webhook/payos`
4. Test webhook connection

## Troubleshooting

### Lỗi thường gặp:

1. **"Backend API URL is not configured"**
   - Đảm bảo `NEXT_PUBLIC_API_URL` được set

2. **"Frontend URL is not configured"**
   - Đảm bảo `FRONTEND_URL` được set

3. **PayOS API error**
   - Kiểm tra credentials trong PayOS Dashboard
   - Verify webhook URL accessible
   - Check network connectivity

4. **Webhook signature mismatch**
   - Đảm bảo `PAYOS_CHECKSUM_KEY` chính xác
   - Check webhook payload format

## Monitoring

### Logs để theo dõi:
- Payment creation logs in `/api/payment/process`
- Webhook processing logs in `/api/webhook/payos`
- Payment status check logs in `/api/payment/status`

### PayOS Dashboard:
- Theo dõi transactions
- Check webhook delivery status
- View payment analytics

## Security Best Practices

1. **Environment Variables**
   - Không commit credentials vào Git
   - Sử dụng .env.local cho development
   - Sử dụng Vercel Environment Variables cho production

2. **Webhook Security**
   - Validate signatures
   - Check request origin
   - Rate limiting

3. **Error Handling**
   - Không expose sensitive information trong error messages
   - Log errors for monitoring
   - Graceful fallback to demo mode

## Support

Nếu có vấn đề với PayOS integration:
1. Check logs trong browser console và server logs
2. Verify credentials trong PayOS Dashboard
3. Test webhook với tools như ngrok
4. Liên hệ PayOS support nếu cần