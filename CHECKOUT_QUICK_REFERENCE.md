# 🚀 Checkout & PayOS - Quick Reference Guide

## 📍 API Endpoints Summary

| Method | Endpoint | Purpose | Auth | Response |
|--------|----------|---------|------|----------|
| POST | `/checkout` | Create Order | Optional | `{ id, orderNo, totalCents, shippingAddress }` |
| POST | `/payments/intents` | Create Payment Intent | Optional* | `{ intentId, redirectUrl, paymentMethod }` |
| POST | `/payments/payos/webhook` | PayOS Webhook | None | `{ error: 0, message: "success" }` |

*For PayOS, authentication is recommended. For COD, optional.

---

## 🔧 Request/Response Examples

### 1️⃣ Create Order: `POST /checkout`

```bash
# Request
curl -X POST http://localhost:3010/api/v1/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0912345678",
      "email": "user@example.com",
      "address": "123 Đường ABC, Quận 1"
    }
  }'

# Response 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "orderNo": "ATL1731827200000",
  "totalCents": 2530000,
  "status": "PENDING",
  "shippingAddress": { /* echoed back */ }
}

# Response 400 Bad Request
{
  "message": "Giỏ hàng trống"  or  "Thông tin giao hàng là bắt buộc"
}
```

---

### 2️⃣ Create Payment Intent: `POST /payments/intents`

**For PayOS:**
```bash
# Request
curl -X POST http://localhost:3010/api/v1/payments/intents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "provider": "PAYOS",
    "idempotencyKey": "550e8400-e29b-41d4-a716-446655440000-1731827200000"
  }'

# Response 200 OK
{
  "intentId": "payment-intent-uuid",
  "redirectUrl": "https://api.payos.vn/checkout?token=...",
  "paymentMethod": "PAYOS"
}

# Then: window.location.href = redirectUrl
```

**For COD:**
```bash
# Request (same as above, but provider = 'COD')
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "provider": "COD",
  "idempotencyKey": "550e8400-e29b-41d4-a716-446655440000-1731827200000"
}

# Response 200 OK
{
  "intentId": "payment-intent-uuid",
  "redirectUrl": null,  // No redirect needed
  "paymentMethod": "COD"
}

# Then: router.push('/order-success?orderId=...')
```

---

## 🎯 Frontend Code Reference

### Checkout Page Setup
```typescript
// Location: frontend/app/checkout/page.tsx

const handlePlaceOrder = async () => {
  setIsProcessing(true);

  try {
    // Step 1: Create Order
    const orderResponse = await apiClient.post('/checkout', {
      promotionCode: undefined,
      shippingAddress: { fullName, phone, email, address, notes, coordinates }
    });

    const { id: orderId, orderNo } = orderResponse.data;

    // Step 2: Create Payment Intent
    const intentResponse = await apiClient.post('/payments/intents', {
      orderId,
      provider: paymentMethod === 'payos' ? 'PAYOS' : 'COD',
      idempotencyKey: `${orderId}-${Date.now()}`,
      returnUrl: `${window.location.origin}/order-success?orderId=${orderNo}`
    });

    const { redirectUrl } = intentResponse.data;

    // Step 3: Handle Response
    if (paymentMethod === 'payos' && redirectUrl) {
      clearCart();
      window.location.href = redirectUrl;  // Go to PayOS QR page
    } else if (paymentMethod === 'cod') {
      clearCart();
      router.push(`/order-success?orderId=${orderNo}`);  // Go to success page
    }

  } catch (error) {
    toast.error(error.message);
  } finally {
    setIsProcessing(false);
  }
};
```

---

## 🛠️ Backend Code Reference

### Checkout Controller
```typescript
// Location: backend/src/modules/checkout/checkout.controller.ts

@Post()  // POST /checkout
async create(@Body() dto: CheckoutDto) {
  const userId = req.user?.sub;  // Optional for guests

  const order = await this.checkout.createOrder(userId, {
    promotionCode: dto.promotionCode,
    shippingAddress: dto.shippingAddress
  });

  return {
    id: order.id,
    orderNo: order.orderNo,
    totalCents: order.totalCents,
    status: order.status,
    shippingAddress: order.shippingAddress
  };
}
```

### Payments Service - Create Intent
```typescript
// Location: backend/src/modules/payments/payments.service.ts

async createIntent(params: {
  orderId: string;
  provider: 'PAYOS' | 'COD';
  returnUrl?: string;
}) {
  const order = await this.prisma.orders.findUnique({ where: { id: params.orderId } });

  const intent = await this.prisma.payment_intents.create({
    data: {
      orderId: order.id,
      provider: params.provider,
      amountCents: order.totalCents,
      status: 'PENDING'
    }
  });

  // COD: Confirm order immediately
  if (params.provider === 'COD') {
    await this.prisma.orders.update({
      where: { id: order.id },
      data: { status: 'CONFIRMED' }
    });

    return {
      intentId: intent.id,
      redirectUrl: null,
      paymentMethod: 'COD'
    };
  }

  // PAYOS: Get payment link from PayOS API
  const redirectUrl = await this.buildRedirectUrl(intent, order);

  return {
    intentId: intent.id,
    redirectUrl,
    paymentMethod: 'PAYOS'
  };
}
```

---

## 📊 Order Status States

```
Guest/Authenticated User
         │
         ▼
User selects payment method
         │
         ├─────────────────┬──────────────────┐
         │                 │                  │
         ▼                 ▼                  ▼
    POST /checkout      POST /checkout   POST /checkout
    (Create Order)      (Create Order)   (Create Order)
    status: PENDING     status: PENDING  status: PENDING
         │                 │                  │
         ▼                 ▼                  ▼
   "PayOS"             "PayOS"            "COD"
   Authenticated    Guest User      Any User
         │                 │                  │
         ├─────────────────┴──────────────────┤
         │                                    │
         ▼                                    ▼
    POST /payments/intents              POST /payments/intents
    provider: 'PAYOS'                   provider: 'COD'
    Get redirectUrl from PayOS API      redirectUrl: null
         │                                    │
         ▼                                    ▼
    User Redirected to                  User Redirected to
    PayOS Checkout Page                 /order-success
    (QR Code Displayed)                 (Order Confirmed)
         │                                    │
         │                                    ▼
         │                                Order Status: CONFIRMED
         │                                Payment Intent: PENDING
         │                                User Sees: Success Page
         │
         ▼
    User Scans QR / Transfers Money
         │
         ▼
    PayOS Returns: code = '00'
         │
         ▼
    Webhook to Backend
    POST /payments/payos/webhook
         │
         ▼
    Backend Verifies Signature
         │
         ├─ If code='00' (Success):
         │  └─ Update order status = CONFIRMED
         │  └─ Create payment record
         │  └─ Redirect returnUrl
         │
         ├─ If code='01' (Failed):
         │  └─ Update intent status = FAILED
         │
         └─ If code='02' (Cancelled):
            └─ Update intent status = CANCELLED
```

---

## 🔍 Database Query Examples

### Find Orders by Customer
```sql
-- Guest checkout (userId = NULL)
SELECT * FROM orders
WHERE shippingAddress->>'email' = 'user@example.com'
ORDER BY createdAt DESC;

-- Authenticated user
SELECT * FROM orders
WHERE userId = 'user-uuid'
ORDER BY createdAt DESC;

-- Get shipping address
SELECT shippingAddress->>'fullName' as name,
       shippingAddress->>'phone' as phone,
       shippingAddress->>'address' as address
FROM orders
WHERE id = 'order-uuid';
```

### Track Payment Status
```sql
-- Get order with payment status
SELECT o.id, o.orderNo, o.status,
       pi.provider, pi.status as payment_status,
       p.status as paid_status, p.transactionId
FROM orders o
LEFT JOIN payment_intents pi ON o.id = pi.orderId
LEFT JOIN payments p ON pi.id = p.intentId
WHERE o.orderNo = 'ATL1731827200000';
```

---

## ⚡ Performance Considerations

| Operation | Duration | Notes |
|-----------|----------|-------|
| POST /checkout | ~200ms | DB transaction + email async |
| POST /payments/intents (COD) | ~50ms | Quick order update |
| POST /payments/intents (PayOS) | ~1s | PayOS API call |
| Webhook processing | ~100ms | Verification + DB update |
| Email sending | Async | Doesn't block response |

---

## 🐛 Debugging Checklist

- [ ] Check browser Network tab for request/response
- [ ] Verify token is sent in Authorization header
- [ ] Check `X-Requested-With` header (CORS)
- [ ] Verify cart has items before checkout
- [ ] Check shipping address fields are filled
- [ ] Look at backend logs: `npm run logs` or Docker logs
- [ ] Test with empty/valid/invalid payment method
- [ ] Verify PayOS credentials in `.env`
- [ ] Check webhook signature verification
- [ ] Test order retrieval by orderNo

---

## 🔐 Security Notes

- ✅ All prices re-fetched from DB (prevent price tampering)
- ✅ HMAC signatures verified for all PayOS webhooks
- ✅ Order creation transactional (all or nothing)
- ✅ Cart marked as CHECKED_OUT (prevent duplicate orders)
- ✅ Stock reservation on order confirmation
- ✅ Email sent with order details for customer record

---

## 🚨 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Giỏ hàng trống" | Cart has no items | Add products to cart |
| "Thông tin giao hàng là bắt buộc" | Missing shipping address | Fill all address fields |
| "Order not found" | Wrong orderId | Check frontend logs |
| "PayOS API error" | Wrong credentials | Verify PAYOS_* in .env |
| "Webhook not received" | PayOS can't reach URL | Check PAYOS_WEBHOOK_URL |
| "Invalid signature" | Wrong checksum key | Verify PAYOS_CHECKSUM_KEY |

---

## 🎓 Key Concepts

**Payment Intent:**
- Represents a payment transaction attempt
- Created for each order
- Tracks payment status through workflow
- One order can have multiple intents (retry logic)

**Idempotency Key:**
- Prevents duplicate payment attempts
- Format: `{orderId}-{timestamp}`
- Should be unique per payment attempt

**PayOS QR Code:**
- Generated by PayOS API
- Contains payment information
- User scans with phone banking app
- Triggers webhook on payment

**Webhook:**
- Async notification from PayOS to backend
- Provides payment confirmation
- Triggers order status update
- Critical for order fulfillment

---

## 📚 Related Files

```
Frontend:
  - frontend/app/checkout/page.tsx (Main checkout UI)
  - frontend/lib/api.ts (API client)
  - frontend/lib/payos-config.ts (PayOS configuration)

Backend:
  - backend/src/modules/checkout/checkout.controller.ts
  - backend/src/modules/checkout/checkout.service.ts
  - backend/src/modules/payments/payments.controller.ts
  - backend/src/modules/payments/payments.service.ts
  - backend/src/modules/payments/payos.service.ts

Database:
  - Prisma schema: backend/prisma/schema.prisma

Documentation:
  - CHECKOUT_PAYOS_FLOW.md (Full flow diagram)
  - CHECKOUT_FIXES_SUMMARY.md (What was changed)
  - CHECKOUT_QUICK_REFERENCE.md (This file)
```

---

**Last Updated:** 2024-11-17
**Status:** ✅ Ready for Development & Testing
