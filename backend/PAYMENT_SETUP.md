# Cấu hình Thanh toán - Audio Tài Lộc

## 1. Tích hợp PayOS

### Bước 1: Đăng ký tài khoản PayOS
1. Truy cập https://payos.vn
2. Đăng ký tài khoản merchant
3. Lấy thông tin API credentials

### Bước 2: Cấu hình Environment Variables
Thêm các biến sau vào file `.env`:

```env
# PayOS Configuration
PAYOS_CLIENT_ID=your-payos-client-id
PAYOS_API_KEY=your-payos-api-key
PAYOS_CHECKSUM_KEY=your-payos-checksum-key
PAYOS_WEBHOOK_URL=https://your-domain.com/api/v1/webhooks/payos
PAYOS_RETURN_URL=http://localhost:3000/checkout/return
PAYOS_CANCEL_URL=http://localhost:3000/checkout/cancel
```

### Bước 3: Test PayOS Integration
```bash
node test-payment-integration.js
```

## 2. Tích hợp VNPay

### Bước 1: Đăng ký tài khoản VNPay
1. Truy cập https://sandbox.vnpayment.vn
2. Đăng ký tài khoản test
3. Lấy thông tin TMN Code và Hash Secret

### Bước 2: Cấu hình Environment Variables
```env
# VNPay Configuration
VNPAY_TMN_CODE=your-vnpay-tmn-code
VNPAY_HASH_SECRET=your-vnpay-hash-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/checkout/return
```

## 3. Tích hợp MoMo

### Bước 1: Đăng ký tài khoản MoMo
1. Truy cập https://developers.momo.vn
2. Đăng ký tài khoản developer
3. Lấy thông tin Partner Code và Access Key

### Bước 2: Cấu hình Environment Variables
```env
# MoMo Configuration
MOMO_PARTNER_CODE=your-momo-partner-code
MOMO_ACCESS_KEY=your-momo-access-key
MOMO_SECRET_KEY=your-momo-secret-key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
```

## 4. API Endpoints

### Tạo Payment Intent
```http
POST /api/v1/payments/intents
Content-Type: application/json

{
  "orderId": "order-id",
  "provider": "PAYOS|VNPAY|MOMO",
  "idempotencyKey": "unique-key",
  "returnUrl": "http://localhost:3000/checkout/return"
}
```

### Webhook Endpoints
- PayOS: `POST /api/v1/payments/payos/webhook`
- VNPay: `POST /api/v1/payments/vnpay/webhook`
- MoMo: `POST /api/v1/payments/momo/webhook`

### Callback Endpoints
- PayOS: `GET /api/v1/payments/payos/callback`
- VNPay: `GET /api/v1/payments/vnpay/callback`
- MoMo: `GET /api/v1/payments/momo/callback`

## 5. Test Thanh toán

### Chạy test tự động
```bash
node test-payment-integration.js
```

### Test thủ công
1. Tạo order
2. Tạo payment intent
3. Redirect đến trang thanh toán
4. Hoàn thành thanh toán
5. Kiểm tra webhook/callback

## 6. Troubleshooting

### Lỗi 404 - Route không tìm thấy
- Kiểm tra PaymentsModule đã được import trong AppModule
- Restart backend server

### Lỗi 401 - Unauthorized
- Kiểm tra JWT token
- Đảm bảo đã đăng nhập

### Lỗi 500 - Internal Server Error
- Kiểm tra environment variables
- Kiểm tra database connection
- Xem logs trong console

## 7. Production Checklist

- [ ] Cấu hình HTTPS
- [ ] Cập nhật webhook URLs
- [ ] Cấu hình production credentials
- [ ] Test tất cả payment providers
- [ ] Cấu hình monitoring và logging
- [ ] Backup database
- [ ] SSL certificates
- [ ] Rate limiting
- [ ] Security headers
