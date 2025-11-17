# 🛒 Checkout & PayOS Integration - Flow Documentation

## 📋 Overview

Hệ thống checkout đã được sửa để hỗ trợ thanh toán qua PayOS với QR code. Flow hiện tại đã được tối ưu hoá để:
- ✅ Tạo Order trước khi xử lý thanh toán
- ✅ Lưu thông tin giao hàng chi tiết
- ✅ Tích hợp PayOS QR code cho phương thức thanh toán
- ✅ Hỗ trợ COD (Thanh toán khi nhận hàng)

---

## 🔄 Payment Flow

### **Phương Thức 1: PayOS (Thanh toán Online với QR Code)**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Checkout Page)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Step 1: User clicks "Đặt hàng"
                              │ handlePlaceOrder() called
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ POST /checkout                                                  │
│ Body: {                                                         │
│   promotionCode?: string (optional)                            │
│   shippingAddress: {                                           │
│     fullName, phone, email, address,                          │
│     notes?, coordinates?, goongPlaceId?                       │
│   }                                                             │
│ }                                                               │
│ Headers: Authorization: Bearer {token} (optional for guests)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Backend: CheckoutService.createOrder()
                              │ - Xác nhận giỏ hàng không trống
                              │ - Validate promo code
                              │ - Tính discount, shipping, total
                              │ - TẠO ORDER record trong DB
                              │ - Lưu thông tin giao hàng
                              │ - Mark cart as CHECKED_OUT
                              │ - Gửi email confirm
                              │
                              ▼
         Response: { id, orderNo, totalCents, status, shippingAddress }
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│ POST /payments/intents                                          │
│ Body: {                                                         │
│   orderId: string,                                             │
│   provider: 'PAYOS' or 'COD',                                  │
│   idempotencyKey: string,                                      │
│   returnUrl: string (optional)                                 │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                    Backend Fork: Provider Type
                    ╱                      ╲
                   ╱                        ╲
                  ▼                          ▼
         PayOS Route              COD Route
         (lines 74-113)           (lines 31-50)
              │                        │
              │                   Update Order
              │                   status = CONFIRMED
              │                        │
              │              Return { redirectUrl: null,
              │                        paymentMethod: 'COD' }
              │
    PayOS API Call (buildRedirectUrl):
    1. Extract orderCode = orderNo
    2. Create payload với order info
    3. Generate HMAC-SHA256 signature
    4. POST to PayOS API /v2/checkout/create
    5. Response contains checkoutUrl + QR code
              │
              ▼
    Response: { redirectUrl: checkoutUrl, paymentMethod: 'PAYOS' }
              │
              ▼
    Frontend receives response:
    - If PayOS: window.location.href = redirectUrl
               (User redirected to PayOS checkout page with QR)
    - If COD: router.push('/order-success?orderId=...')
             (Immediate success, no payment needed)
              │
              ▼
    ┌─────────────────────────────────────────┐
    │  PayOS Checkout Page                    │
    │  - Display QR Code                      │
    │  - Bank transfer options                │
    │  - Waiting for payment confirmation     │
    └─────────────────────────────────────────┘
              │
              │ User scans QR or transfers
              │
              ▼
    ┌─────────────────────────────────────────┐
    │  PayOS Webhook (on payment)              │
    │  POST /api/v1/payments/payos/webhook    │
    │  PayOSService.handleWebhook()           │
    │  - Verify signature                     │
    │  - Update order status to CONFIRMED     │
    │  - Create payment record                │
    │  - Update payment intent status         │
    └─────────────────────────────────────────┘
              │
              ▼
    ┌─────────────────────────────────────────┐
    │  Frontend (if webhook return was set)   │
    │  User redirected to returnUrl:          │
    │  /order-success?orderId={orderNo}       │
    │  (Show order confirmation)              │
    └─────────────────────────────────────────┘
```

---

### **Phương Thức 2: COD (Thanh toán khi nhận hàng)**

Quá trình giống như trên, nhưng:
- Step 2b: Order được tự động xác nhận (status = CONFIRMED)
- Không cần redirect đến bất kỳ trang thanh toán nào
- Frontend immediately redirect đến order-success page
- Không cần webhook verification

---

## 📦 Database Schema

### Orders Table (Important Fields)
```javascript
{
  id: UUID,
  orderNo: string,         // e.g., "ATL1731827200000"
  userId: UUID | null,     // For authenticated users
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED',
  subtotalCents: number,   // Product total in cents
  discountCents: number,   // Promo discount in cents
  shippingCents: number,   // Shipping fee in cents
  totalCents: number,      // Final total in cents
  promotionCode: string | null,
  shippingAddress: JSON,   // Stored as JSON string:
  // {
  //   fullName: string,
  //   phone: string,
  //   email: string,
  //   address: string,
  //   notes: string | null,
  //   coordinates: { lat: number, lng: number } | null,
  //   goongPlaceId: string | null
  // }
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Payment Intents Table
```javascript
{
  id: UUID,
  orderId: UUID,
  provider: 'PAYOS' | 'VNPAY' | 'MOMO' | 'COD',
  amountCents: number,
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED',
  returnUrl: string | null,
  metadata: JSON | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Payments Table (Created on success)
```javascript
{
  id: UUID,
  orderId: UUID,
  intentId: UUID,
  provider: 'PAYOS',
  amountCents: number,
  status: 'SUCCEEDED',
  transactionId: string,    // From PayOS
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🔐 PayOS Configuration

Frontend environment variables (`.env.local`):
```bash
NEXT_PUBLIC_PAYOS_CLIENT_ID=c666c1e6-26c6-4264-b5a5-4de552535065
NEXT_PUBLIC_PAYOS_ENV=sandbox  # or 'production'
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Backend environment variables (`.env`):
```bash
PAYOS_CLIENT_ID=c666c1e6-26c6-4264-b5a5-4de552535065
PAYOS_API_KEY=43e30c48-a208-47ad-855a-c1bdf18d748b
PAYOS_CHECKSUM_KEY=33642e2b053986dbdb178487479fb0191371435d1f9328b8fba61ef6c20a65ab
PAYOS_PARTNER_CODE=DOTAI3004
PAYOS_API_URL=https://api.payos.vn
PAYOS_WEBHOOK_URL=http://localhost:3010/api/v1/payments/payos/webhook
PAYOS_RETURN_URL=http://localhost:3000/checkout/return
PAYOS_CANCEL_URL=http://localhost:3000/checkout/cancel
```

---

## 🔄 API Endpoints

### 1. Create Checkout (Create Order)
```http
POST /checkout
Content-Type: application/json
Authorization: Bearer {token}  # Optional (for guests too)

{
  "promotionCode": "SUMMER2024",  // Optional
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "phone": "0912345678",
    "email": "user@example.com",
    "address": "123 Đường ABC, Quận 1",
    "notes": "Giao vào buổi tối",
    "coordinates": { "lat": 10.77, "lng": 106.70 },  // Optional
    "goongPlaceId": "abc123"  // Optional
  }
}

Response 200:
{
  "id": "uuid-order-id",
  "orderNo": "ATL1731827200000",
  "totalCents": 2500000,     // 25,000 VND
  "status": "PENDING",
  "shippingAddress": { /* echoed back */ }
}

Response 400:
{
  "message": "Giỏ hàng trống" | "Thông tin giao hàng là bắt buộc"
}
```

### 2. Create Payment Intent
```http
POST /payments/intents
Content-Type: application/json
Authorization: Bearer {token}  # Required for authenticated users

{
  "orderId": "uuid-order-id",
  "provider": "PAYOS",  // or "COD"
  "idempotencyKey": "uuid-order-id-1731827200000",
  "returnUrl": "http://localhost:3000/order-success?orderId=ATL1731827200000"
}

Response 200 (PayOS):
{
  "intentId": "uuid-intent-id",
  "redirectUrl": "https://api.payos.vn/checkout?token=...",
  "paymentMethod": "PAYOS"
}

Response 200 (COD):
{
  "intentId": "uuid-intent-id",
  "redirectUrl": null,
  "paymentMethod": "COD"
}

Response 400:
{
  "message": "Order not found" | "Invalid payment provider"
}
```

### 3. PayOS Webhook
```http
POST /payments/payos/webhook
Content-Type: application/json
x-signature: {hmac-signature}

{
  "code": "00",  // "00" = success, "01" = failed, "02" = cancelled
  "orderCode": "ATL1731827200000",
  "transactionDateTime": "2024-11-17 10:00:00",
  "accountNumber": "1234567890",
  "accountName": "Tran Van B",
  "amount": 2500000,
  "description": "Thanh toan don hang ATL1731827200000",
  "id": "transaction-uuid",
  "reference": "ATL1731827200000",
  "status": "COMPLETED",
  "signature": "..."
}

Response 200:
{
  "error": 0,
  "message": "success" | "Payment successful" | "Payment failed"
}
```

---

## ⚠️ Important Notes

### Guest Checkout
- Frontend checkout page không yêu cầu authentication
- User có thể checkout mà không cần login
- POST /checkout không yêu cầu JWT token (optional)
- Email từ shippingAddress được dùng cho order confirmation

### Shipping Address JSON Storage
- Thông tin giao hàng lưu trong column `shippingAddress` dưới dạng JSON string
- Khi query order, cần parse JSON nếu cần lấy individual fields
- VD: `JSON.parse(order.shippingAddress).fullName`

### Payment Status Flow
```
Order Status:        PENDING → CONFIRMED → COMPLETED → REFUNDED/CANCELLED
(Checkout)          (Payment)    (Shipped)

Payment Intent:      PENDING → SUCCEEDED → (no change for refunds)

Payments Record:     (Created when payment succeeds)
Status:              SUCCEEDED → REFUNDED
```

### Price in Cents
- All prices trong database lưu bằng **cents** (VND/100)
- VD: 25,000 VND = 2500000 cents
- Frontend display: `(cents / 100).toLocaleString('vi-VN')`

---

## 🧪 Testing Checklist

- [ ] Checkout page displays correctly with 3 steps
- [ ] Address autocomplete works (Google Maps/Goong integration)
- [ ] COD method: Order created, user redirected to success page
- [ ] PayOS method: Order created, redirected to PayOS checkout page
- [ ] PayOS Sandbox: QR code displays and can be tested
- [ ] Webhook received when payment confirmed
- [ ] Order status updated to CONFIRMED after payment
- [ ] Payment record created in database
- [ ] Confirmation email sent with correct order details
- [ ] Cart cleared after successful order
- [ ] Return URL parameter working (orderId in URL)

---

## 🔧 Troubleshooting

### Issue: "Order not found" when creating payment intent
**Solution**: Make sure checkout endpoint returned order ID and you're passing correct orderId

### Issue: PayOS redirectUrl is null
**Solution**: Check PayOS API credentials in .env, ensure PAYOS_API_URL is correct

### Issue: Webhook not received
**Solution**:
- Check PAYOS_WEBHOOK_URL in .env matches PayOS settings
- Ensure webhook endpoint is publicly accessible
- Check x-signature header is verified correctly

### Issue: "Giỏ hàng trống"
**Solution**: Cart service returns empty cart, check CartService.getCartWithTotals()

---

## 📚 Files Modified

1. **frontend/app/checkout/page.tsx**
   - Rewrote `handlePlaceOrder()` function
   - Now calls POST /checkout first
   - Then creates payment intent
   - Handles PayOS redirect properly

2. **backend/src/modules/checkout/checkout.controller.ts**
   - Added new POST / endpoint (main checkout)
   - Added ShippingAddressDto for validation
   - Accepts guest checkouts (no JWT required)

3. **backend/src/modules/checkout/checkout.service.ts**
   - Updated `createOrder()` to save shipping address as JSON
   - Uses full shipping info for email notifications
   - Works with guest users (optional userId)

4. **backend/src/modules/payments/payments.service.ts**
   - Updated `createIntent()` response format
   - Now returns `redirectUrl` and `paymentMethod`
   - COD returns redirectUrl = null

---

## 🚀 Next Steps

1. Test checkout flow end-to-end
2. Verify PayOS sandbox QR code generation
3. Set up webhook testing (use ngrok for local testing)
4. Update order-success page to handle both methods
5. Implement payment status tracking in user dashboard
6. Add refund functionality for admin panel

---

Created: 2024-11-17
Last Updated: 2024-11-17
