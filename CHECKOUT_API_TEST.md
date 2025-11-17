# 🧪 Quick API Test - Checkout Endpoints

## Prerequisites
- Backend running on `http://localhost:3010`
- Frontend running on `http://localhost:3000`
- Have items in cart

## Test Requests

### 1. Test Endpoint: POST /checkout

```bash
curl -X POST http://localhost:3010/api/v1/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "fullName": "Test User",
      "phone": "0912345678",
      "email": "test@example.com",
      "address": "123 Test Street"
    }
  }'
```

**Expected Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "orderNo": "ATL1731827200000",
  "totalCents": 2530000,
  "status": "PENDING",
  "shippingAddress": {
    "fullName": "Test User",
    "phone": "0912345678",
    "email": "test@example.com",
    "address": "123 Test Street"
  }
}
```

---

### 2. Test Endpoint: POST /payments/intents (COD)

```bash
curl -X POST http://localhost:3010/api/v1/payments/intents \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "provider": "COD",
    "idempotencyKey": "test-key-123"
  }'
```

**Expected Response (200 OK):**
```json
{
  "intentId": "payment-intent-uuid",
  "redirectUrl": null,
  "paymentMethod": "COD"
}
```

---

### 3. Test Endpoint: POST /payments/intents (PayOS)

```bash
curl -X POST http://localhost:3010/api/v1/payments/intents \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "provider": "PAYOS",
    "idempotencyKey": "test-key-456"
  }'
```

**Expected Response (200 OK):**
```json
{
  "intentId": "payment-intent-uuid",
  "redirectUrl": "https://api.payos.vn/checkout?token=...",
  "paymentMethod": "PAYOS"
}
```

---

## Using Postman

### Step 1: Create Order
- **Method:** POST
- **URL:** `http://localhost:3010/api/v1/checkout`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "shippingAddress": {
    "fullName": "Postman Test",
    "phone": "0912345678",
    "email": "postman@test.com",
    "address": "Test Address"
  }
}
```
- **Send** → Copy `id` from response

### Step 2: Create Payment Intent
- **Method:** POST
- **URL:** `http://localhost:3010/api/v1/payments/intents`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "orderId": "PASTE_ID_FROM_STEP_1",
  "provider": "COD",
  "idempotencyKey": "postman-test-001"
}
```
- **Send** → Should get `redirectUrl: null` for COD

---

## Browser Console Test

### Step 1: Open DevTools Console
1. Press `F12` or right-click → Inspect
2. Go to Console tab

### Step 2: Test with fetch
```javascript
// Test POST /checkout
const checkoutResponse = await fetch('http://localhost:3010/api/v1/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    shippingAddress: {
      fullName: 'Console Test',
      phone: '0912345678',
      email: 'console@test.com',
      address: '456 Test Ave'
    }
  })
});

const order = await checkoutResponse.json();
console.log('Order Created:', order);

// Test POST /payments/intents
const paymentsResponse = await fetch('http://localhost:3010/api/v1/payments/intents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: order.id,
    provider: 'COD',
    idempotencyKey: `console-test-${Date.now()}`
  })
});

const intent = await paymentsResponse.json();
console.log('Payment Intent:', intent);
```

---

## Troubleshooting

### Error: 404 Not Found
- ✅ Fixed - CheckoutModule now imported in AppModule
- Rebuild backend: `cd backend && npm run build`

### Error: Request failed with status code 404
- Check that modules are imported
- Check backend console for errors
- Verify API endpoints are registered

### Error: "Giỏ hàng trống" (Empty Cart)
- This is expected - add items to cart first
- Use the app to add products

### Error: "Thông tin giao hàng là bắt buộc"
- Ensure all required fields in shippingAddress are provided:
  - fullName (required)
  - phone (required)
  - email (required)
  - address (required)

---

## Success Indicators

✅ POST /checkout returns order with `id` and `orderNo`
✅ POST /payments/intents returns `intentId` and `paymentMethod`
✅ For COD: `redirectUrl` is `null`
✅ For PayOS: `redirectUrl` starts with `https://api.payos.vn`
✅ No 404 errors
✅ No validation errors

---

## Next Steps

If all tests pass:
1. Test full checkout flow in frontend (http://localhost:3000/checkout)
2. Verify database records created (check orders table)
3. Check email notifications received
4. Test PayOS QR code (if using sandbox)

If tests fail:
1. Check backend logs
2. Verify .env configuration
3. Check module imports
4. Rebuild backend: `npm run build`
