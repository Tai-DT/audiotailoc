# 💳 PayOS Integration Completion Guide - Audio Tài Lộc

## 🎯 Overview

Complete guide để hoàn thiện PayOS payment integration cho hệ thống Audio Tài Lộc, bao gồm backend API, frontend checkout, và dashboard monitoring.

---

## 📋 Phase-by-Phase PayOS Implementation

### **PHASE 1: PayOS Account & Credentials Setup**

#### Step 1: Merchant Registration
1. **Register PayOS Account**
   ```
   URL: https://payos.vn
   Account Type: Business Merchant
   Required: Business license, Tax code, Bank account
   ```

2. **Get API Credentials**
   - Login to PayOS Dashboard
   - Navigate to: **Integration** → **API Keys**
   - Copy the following:
     - `CLIENT_ID`
     - `API_KEY`
     - `CHECKSUM_KEY` 
     - `PARTNER_CODE`

3. **Configure Webhooks**
   ```
   Webhook URL: https://your-domain.com/api/v1/payments/payos/webhook
   Events: payment.succeeded, payment.failed, payment.cancelled
   Method: POST
   ```

#### Step 2: Environment Configuration
Update `backend/.env`:
```env
# PayOS Production Configuration
PAYOS_CLIENT_ID="your-actual-client-id"
PAYOS_API_KEY="your-actual-api-key"
PAYOS_CHECKSUM_KEY="your-actual-checksum-key"
PAYOS_PARTNER_CODE="your-actual-partner-code"
PAYOS_API_URL="https://api.payos.vn"

# Webhook URLs (Update with your domain)
PAYOS_WEBHOOK_URL="https://your-domain.com/api/v1/payments/payos/webhook"
PAYOS_RETURN_URL="https://your-domain.com/checkout/return"
PAYOS_CANCEL_URL="https://your-domain.com/checkout/cancel"
```

---

### **PHASE 2: Backend PayOS Integration**

#### Current Backend Status
```typescript
// ✅ Already implemented in PaymentsService
class PaymentsService {
  // Payment intent creation
  async createIntent(params: CreateIntentParams)
  
  // PayOS-specific payment URL generation
  private async buildRedirectUrl(intent, order): Promise<string>
  
  // Webhook signature verification
  async handleWebhook(provider: string, body: any)
}
```

#### Required Backend Completions

1. **Enable PaymentsModule** (Already done ✅)
   ```typescript
   // backend/src/modules/app.module.ts
   @Module({
     imports: [
       // ... other modules
       PaymentsModule, // ✅ Already enabled
     ]
   })
   ```

2. **Test PayOS API Connection**
   ```bash
   cd backend
   
   # Test payment intent creation
   curl -X POST http://localhost:8000/api/v1/payments/intents \
     -H "Content-Type: application/json" \
     -d '{
       "orderId": "test-order-001",
       "provider": "PAYOS",
       "returnUrl": "http://localhost:3000/checkout/return"
     }'
   ```

3. **Webhook Testing**
   ```bash
   # Test webhook endpoint
   curl -X POST http://localhost:8000/api/v1/payments/payos/webhook \
     -H "Content-Type: application/json" \
     -H "x-signature: test-signature" \
     -d '{
       "data": {
         "orderCode": "test-order-001",
         "amount": 50000,
         "status": "PAID"
       }
     }'
   ```

---

### **PHASE 3: Frontend PayOS Integration**

#### Current Frontend Status
Frontend đã có đầy đủ e-commerce components:
- ✅ ProductGrid, ProductDetail
- ✅ ShoppingCart
- ✅ Checkout component (4-step process)

#### Required Frontend Completions

1. **Payment Method Selection**
   ```tsx
   // frontend/components/ecommerce/Checkout.tsx
   const paymentMethods = [
     { id: 'payos', name: 'PayOS', logo: '/payos-logo.png' },
     { id: 'vnpay', name: 'VNPay', logo: '/vnpay-logo.png' },
     { id: 'momo', name: 'MoMo', logo: '/momo-logo.png' }
   ];
   ```

2. **PayOS Checkout Integration**
   ```typescript
   // frontend/lib/api/payments.ts
   export async function createPaymentIntent(orderData: OrderData) {
     const response = await apiClient.post('/payments/intents', {
       orderId: orderData.id,
       provider: 'PAYOS',
       returnUrl: `${window.location.origin}/checkout/return`
     });
     
     return response.data;
   }
   
   export async function redirectToPayOS(paymentUrl: string) {
     window.location.href = paymentUrl;
   }
   ```

3. **Payment Result Pages**
   ```tsx
   // frontend/app/checkout/return/page.tsx
   export default function PaymentReturnPage() {
     const searchParams = useSearchParams();
     const status = searchParams.get('status');
     const orderId = searchParams.get('orderId');
     
     // Handle payment success/failure/cancel
     return (
       <div>
         {status === 'success' && <PaymentSuccess orderId={orderId} />}
         {status === 'failed' && <PaymentFailed />}
         {status === 'cancelled' && <PaymentCancelled />}
       </div>
     );
   }
   ```

---

### **PHASE 4: Dashboard PayOS Monitoring**

#### Current Dashboard Status
Dashboard đã hoàn thiện 100% với:
- ✅ Order Management interface
- ✅ Payment monitoring
- ✅ Real-time updates

#### Required Dashboard Completions

1. **Payment Analytics Dashboard**
   ```tsx
   // dashboard/src/components/payments/PaymentAnalytics.tsx
   export function PaymentAnalytics() {
     const { data: paymentStats } = usePaymentStats();
     
     return (
       <div className="grid grid-cols-4 gap-4">
         <MetricCard title="Total Revenue" value={paymentStats.totalRevenue} />
         <MetricCard title="PayOS Success Rate" value={`${paymentStats.payosSuccessRate}%`} />
         <MetricCard title="Failed Payments" value={paymentStats.failedCount} />
         <MetricCard title="Refunds" value={paymentStats.refundCount} />
       </div>
     );
   }
   ```

2. **Payment Method Breakdown**
   ```tsx
   // Payment provider statistics
   const paymentProviderStats = {
     PAYOS: { transactions: 150, successRate: 98.5, revenue: 15000000 },
     VNPAY: { transactions: 80, successRate: 95.2, revenue: 8500000 },
     MOMO: { transactions: 45, successRate: 92.1, revenue: 4200000 }
   };
   ```

---

### **PHASE 5: Testing & Validation**

#### Test Scenarios

1. **PayOS Sandbox Testing**
   ```bash
   # Test with PayOS sandbox credentials
   PAYOS_API_URL="https://api-sandbox.payos.vn"
   
   # Test successful payment
   # Test failed payment  
   # Test cancelled payment
   # Test webhook delivery
   ```

2. **End-to-End Testing Flow**
   ```
   1. Browse products (Frontend)
   2. Add to cart
   3. Proceed to checkout
   4. Select PayOS payment
   5. Complete payment on PayOS
   6. Return to success page
   7. Verify order status (Dashboard)
   8. Check payment webhook received
   ```

3. **Error Handling Tests**
   ```
   - Network timeout during payment
   - Invalid PayOS credentials
   - Webhook signature mismatch
   - Payment amount mismatch
   - User cancels payment
   ```

---

## 🚀 **Implementation Scripts**

### **1. PayOS Test Script**
```javascript
// test-payos-integration.js
const PayOSIntegrationTest = require('./test-payos-integration.js');

async function runPayOSTests() {
  const tester = new PayOSIntegrationTest();
  
  console.log('🧪 Running PayOS Integration Tests...');
  
  // Test 1: Backend health
  await tester.testBackendHealth();
  
  // Test 2: PayOS config
  await tester.testPayOSConfig();
  
  // Test 3: Payment intent creation
  await tester.testCreatePaymentIntent();
  
  // Test 4: Webhook endpoint
  await tester.testWebhookEndpoint();
  
  // Test 5: Full payment flow
  await tester.testFullPaymentFlow();
}

runPayOSTests();
```

### **2. Environment Setup Script**
```bash
#!/bin/bash
# setup-payos.sh

echo "🔧 Setting up PayOS Integration..."

# Check if PayOS credentials are configured
if grep -q "your-payos-client-id" backend/.env; then
  echo "⚠️ Please update PayOS credentials in backend/.env"
  echo "Visit https://payos.vn to get your credentials"
  exit 1
fi

# Test backend connection
echo "🔍 Testing backend connection..."
curl -f http://localhost:8000/health || {
  echo "❌ Backend is not running"
  echo "Run: cd backend && npm run start:dev"
  exit 1
}

# Test PayOS API connection
echo "🔍 Testing PayOS API..."
cd backend
npm run test:payos

echo "✅ PayOS setup complete!"
```

---

## 📊 **Success Metrics & KPIs**

### **Technical Metrics**
- [ ] Payment intent creation success rate: >99%
- [ ] PayOS API response time: <2 seconds
- [ ] Webhook delivery success rate: >95%
- [ ] Payment completion success rate: >98%

### **Business Metrics**
- [ ] Average transaction value
- [ ] Payment method adoption (PayOS vs VNPay vs MoMo)
- [ ] Cart abandonment rate at payment step
- [ ] Customer payment experience rating

### **Monitoring & Alerting**
- [ ] Failed payment rate threshold: >5%
- [ ] Webhook delivery failure alerts
- [ ] PayOS API downtime alerts
- [ ] Unusual transaction pattern detection

---

## 🔒 **Security Checklist**

### **PayOS Security Best Practices**
- [ ] Webhook signature verification implemented
- [ ] API keys stored securely (not in code)
- [ ] HTTPS enforcement for all payment URLs
- [ ] Payment amount validation on webhook
- [ ] Order ID uniqueness verification
- [ ] Rate limiting on payment endpoints
- [ ] PCI DSS compliance review

### **Additional Security Measures**
- [ ] Payment fraud detection
- [ ] Transaction logging and audit trail
- [ ] Customer payment data encryption
- [ ] Regular security penetration testing

---

## 📞 **Support & Resources**

### **PayOS Documentation**
- API Documentation: https://docs.payos.vn
- Integration Guide: https://docs.payos.vn/integration
- Webhook Reference: https://docs.payos.vn/webhooks
- Support: support@payos.vn

### **Internal Resources**
- Backend API docs: http://localhost:8000/api
- Test scripts: `./test-payos-integration.js`
- Error logs: `backend/logs/payment-errors.log`
- Dashboard monitoring: http://localhost:3001/payments

---

**🎯 Timeline: 1 week for complete PayOS integration**
**💰 Expected outcome: Production-ready payment system with PayOS**

---

*Next: Move to production deployment and monitoring setup*
