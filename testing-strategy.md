# 🧪 Testing Strategy - Audio Tài Lộc Complete System

## 🎯 Testing Overview

Comprehensive testing strategy để đảm bảo quality và reliability của toàn bộ hệ thống Audio Tài Lộc bao gồm Backend APIs, Frontend UX, Dashboard functionality, và PayOS integration.

---

## 🏗️ **Testing Architecture**

### **Test Pyramid Structure**
```
                    🔺 E2E Tests (10%)
                   /   Production-like scenarios
                  /    Cross-component integration
                 /     User journey validation
                🔺 Integration Tests (20%)
               /   API endpoint testing
              /    Database integration
             /     Payment gateway testing
            🔺 Unit Tests (70%)
           /   Individual functions
          /    Component behavior
         /     Business logic validation
        🔺
```

### **Testing Scope Matrix**
| Component | Unit | Integration | E2E | Performance | Security |
|-----------|------|-------------|-----|-------------|----------|
| **Backend APIs** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Frontend UI** | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| **PayOS Integration** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Database** | ✅ | ✅ | ⚠️ | ✅ | ✅ |

---

## 🔧 **Phase 1: Unit Testing**

### **Backend Unit Tests**

#### **1. Authentication Module Testing**
```typescript
// backend/src/modules/auth/auth.service.spec.ts
describe('AuthService', () => {
  test('should create JWT token for valid user', async () => {
    const user = { id: '1', email: 'test@example.com' };
    const token = await authService.createToken(user);
    expect(token).toBeDefined();
    expect(jwt.verify(token, process.env.JWT_SECRET)).toBeTruthy();
  });

  test('should validate JWT token', async () => {
    const token = 'valid-jwt-token';
    const result = await authService.validateToken(token);
    expect(result.isValid).toBe(true);
  });

  test('should handle expired tokens', async () => {
    const expiredToken = 'expired-jwt-token';
    const result = await authService.validateToken(expiredToken);
    expect(result.isValid).toBe(false);
  });
});
```

#### **2. PayOS Integration Testing**
```typescript
// backend/src/modules/payments/payments.service.spec.ts
describe('PaymentsService', () => {
  test('should create PayOS payment intent', async () => {
    const orderData = { id: 'order-1', total: 50000 };
    const intent = await paymentsService.createIntent({
      orderId: orderData.id,
      provider: 'PAYOS'
    });
    
    expect(intent).toMatchObject({
      id: expect.any(String),
      provider: 'PAYOS',
      status: 'PENDING'
    });
  });

  test('should verify PayOS webhook signature', async () => {
    const payload = { orderCode: 'order-1', status: 'PAID' };
    const signature = generateTestSignature(payload);
    
    const isValid = await paymentsService.verifyWebhookSignature(
      payload, 
      signature
    );
    expect(isValid).toBe(true);
  });
});
```

#### **3. Product Catalog Testing**
```typescript
// backend/src/modules/catalog/catalog.service.spec.ts
describe('CatalogService', () => {
  test('should list products with filters', async () => {
    const filters = { category: 'audio', minPrice: 1000000 };
    const result = await catalogService.listProducts(filters);
    
    expect(result.items).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThan(0);
    expect(result.items[0]).toHaveProperty('price');
  });

  test('should search products by keyword', async () => {
    const query = 'loa bluetooth';
    const result = await catalogService.searchProducts(query);
    
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].name.toLowerCase()).toContain('loa');
  });
});
```

### **Frontend Unit Tests**

#### **1. Shopping Cart Component Testing**
```typescript
// frontend/components/ecommerce/ShoppingCart.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ShoppingCart } from './ShoppingCart';

describe('ShoppingCart', () => {
  test('should display cart items', () => {
    const mockItems = [
      { id: '1', name: 'Loa JBL', price: 2000000, quantity: 1 }
    ];
    
    render(<ShoppingCart items={mockItems} />);
    
    expect(screen.getByText('Loa JBL')).toBeInTheDocument();
    expect(screen.getByText('2,000,000 VNĐ')).toBeInTheDocument();
  });

  test('should update quantity', () => {
    const mockUpdateQuantity = jest.fn();
    render(
      <ShoppingCart 
        items={mockItems} 
        onUpdateQuantity={mockUpdateQuantity}
      />
    );
    
    fireEvent.click(screen.getByText('+'));
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 2);
  });
});
```

#### **2. Payment Integration Testing**
```typescript
// frontend/lib/api/payments.spec.ts
import { createPaymentIntent } from './payments';

describe('PaymentsAPI', () => {
  test('should create payment intent', async () => {
    const orderData = { id: 'order-1', total: 50000 };
    const intent = await createPaymentIntent(orderData);
    
    expect(intent).toHaveProperty('paymentUrl');
    expect(intent.provider).toBe('PAYOS');
  });
});
```

### **Dashboard Unit Tests**

#### **1. User Management Testing**
```typescript
// dashboard/src/components/users/UserManagement.spec.tsx
describe('UserManagement', () => {
  test('should display user list', async () => {
    const mockUsers = [
      { id: '1', name: 'John Doe', email: 'john@test.com' }
    ];
    
    render(<UserManagement users={mockUsers} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

---

## 🔗 **Phase 2: Integration Testing**

### **API Integration Tests**

#### **1. End-to-End API Workflow**
```javascript
// test/integration/api-workflow.test.js
describe('E-commerce API Workflow', () => {
  test('complete purchase flow', async () => {
    // 1. User registration
    const user = await apiClient.post('/auth/register', {
      email: 'test@example.com',
      password: 'password123'
    });
    expect(user.data.id).toBeDefined();

    // 2. User login
    const auth = await apiClient.post('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    const token = auth.data.accessToken;

    // 3. Browse products
    const products = await apiClient.get('/catalog/products');
    expect(products.data.items.length).toBeGreaterThan(0);

    // 4. Add to cart
    const cart = await apiClient.post('/cart/items', {
      productId: products.data.items[0].id,
      quantity: 1
    }, { headers: { Authorization: `Bearer ${token}` }});

    // 5. Create order
    const order = await apiClient.post('/orders', {
      cartId: cart.data.cartId
    }, { headers: { Authorization: `Bearer ${token}` }});

    // 6. Create payment intent
    const payment = await apiClient.post('/payments/intents', {
      orderId: order.data.id,
      provider: 'PAYOS'
    }, { headers: { Authorization: `Bearer ${token}` }});

    expect(payment.data.paymentUrl).toContain('payos');
  });
});
```

#### **2. PayOS Integration Tests**
```javascript
// test/integration/payos.test.js
describe('PayOS Integration', () => {
  test('should handle successful payment webhook', async () => {
    const webhookPayload = {
      data: {
        orderCode: 'order-123',
        amount: 50000,
        status: 'PAID',
        transactionDateTime: new Date().toISOString()
      }
    };

    const signature = generatePayOSSignature(webhookPayload);

    const response = await apiClient.post('/payments/payos/webhook', 
      webhookPayload,
      { headers: { 'x-signature': signature }}
    );

    expect(response.status).toBe(200);
    
    // Verify order status updated
    const order = await apiClient.get(`/orders/order-123`);
    expect(order.data.status).toBe('PAID');
  });
});
```

### **Database Integration Tests**

```javascript
// test/integration/database.test.js
describe('Database Integration', () => {
  test('should handle concurrent cart updates', async () => {
    const cartId = 'cart-123';
    const productId = 'product-456';

    // Simulate concurrent requests
    const promises = Array.from({ length: 5 }, () =>
      apiClient.post('/cart/items', {
        cartId,
        productId, 
        quantity: 1
      })
    );

    const results = await Promise.allSettled(promises);
    
    // Check final cart state is consistent
    const cart = await apiClient.get(`/cart/${cartId}`);
    expect(cart.data.items[0].quantity).toBeLessThanOrEqual(5);
  });
});
```

---

## 🌐 **Phase 3: End-to-End Testing**

### **User Journey Tests**

#### **1. Customer Purchase Journey**
```javascript
// test/e2e/customer-journey.spec.js
describe('Customer Purchase Journey', () => {
  test('complete purchase from browse to payment', async () => {
    await page.goto('http://localhost:3000');

    // Browse products
    await page.click('[data-testid="products-link"]');
    await page.waitForSelector('[data-testid="product-card"]');

    // View product detail
    await page.click('[data-testid="product-card"]:first-child');
    await page.waitForSelector('[data-testid="product-detail"]');

    // Add to cart
    await page.click('[data-testid="add-to-cart"]');
    await page.waitForSelector('[data-testid="cart-notification"]');

    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    await page.waitForSelector('[data-testid="cart-items"]');

    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    await page.waitForSelector('[data-testid="checkout-form"]');

    // Fill customer information
    await page.fill('[data-testid="customer-name"]', 'Nguyen Van A');
    await page.fill('[data-testid="customer-email"]', 'test@example.com');
    await page.fill('[data-testid="customer-phone"]', '0123456789');

    // Select PayOS payment
    await page.click('[data-testid="payment-payos"]');

    // Complete checkout
    await page.click('[data-testid="complete-order"]');
    await page.waitForSelector('[data-testid="payment-redirect"]');

    // Verify redirect to PayOS
    const currentUrl = page.url();
    expect(currentUrl).toContain('payos');
  });
});
```

#### **2. Admin Management Journey**
```javascript
// test/e2e/admin-journey.spec.js
describe('Admin Management Journey', () => {
  test('manage products and monitor orders', async () => {
    await page.goto('http://localhost:3001');

    // Admin login
    await page.fill('[data-testid="admin-email"]', 'admin@audiotailoc.com');
    await page.fill('[data-testid="admin-password"]', 'admin123');
    await page.click('[data-testid="login-button"]');

    // Navigate to products
    await page.click('[data-testid="products-menu"]');
    await page.waitForSelector('[data-testid="products-table"]');

    // Add new product
    await page.click('[data-testid="add-product"]');
    await page.fill('[data-testid="product-name"]', 'Test Product');
    await page.fill('[data-testid="product-price"]', '1000000');
    await page.click('[data-testid="save-product"]');

    // Verify product added
    await page.waitForSelector('text=Test Product');

    // Navigate to orders
    await page.click('[data-testid="orders-menu"]');
    await page.waitForSelector('[data-testid="orders-table"]');

    // Verify order monitoring works
    const orderRows = await page.locator('[data-testid="order-row"]').count();
    expect(orderRows).toBeGreaterThanOrEqual(0);
  });
});
```

---

## ⚡ **Phase 4: Performance Testing**

### **Load Testing**

#### **1. API Load Testing**
```javascript
// test/performance/api-load.test.js
import { check } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '5m', target: 100 }, // Ramp-up
    { duration: '10m', target: 100 }, // Steady state
    { duration: '5m', target: 0 }, // Ramp-down
  ],
};

export default function () {
  // Test product listing performance
  let response = http.get('http://localhost:8000/api/v1/catalog/products');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  // Test search performance
  response = http.get('http://localhost:8000/api/v1/catalog/products?q=loa');
  check(response, {
    'search response time < 3000ms': (r) => r.timings.duration < 3000,
  });
}
```

#### **2. Payment Processing Load Test**
```javascript
// test/performance/payment-load.test.js
export default function () {
  // Test payment intent creation under load
  const payload = JSON.stringify({
    orderId: `order-${Math.random()}`,
    provider: 'PAYOS',
    amount: 50000
  });

  const response = http.post('http://localhost:8000/api/v1/payments/intents', 
    payload, 
    { headers: { 'Content-Type': 'application/json' }}
  );

  check(response, {
    'payment intent created': (r) => r.status === 201,
    'payment response time < 5000ms': (r) => r.timings.duration < 5000,
  });
}
```

### **Frontend Performance Testing**

#### **1. Page Load Performance**
```javascript
// test/performance/frontend-performance.spec.js
describe('Frontend Performance', () => {
  test('homepage loads within 3 seconds', async () => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForSelector('[data-testid="homepage-loaded"]');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('product page renders under 2 seconds', async () => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000/products');
    await page.waitForSelector('[data-testid="products-loaded"]');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });
});
```

---

## 🔒 **Phase 5: Security Testing**

### **Authentication Security Tests**

```javascript
// test/security/auth-security.test.js
describe('Authentication Security', () => {
  test('should prevent brute force attacks', async () => {
    const attemptLogin = () => apiClient.post('/auth/login', {
      email: 'test@example.com',
      password: 'wrong-password'
    });

    // Attempt multiple failed logins
    for (let i = 0; i < 6; i++) {
      await attemptLogin();
    }

    // Next attempt should be rate limited
    const response = await attemptLogin();
    expect(response.status).toBe(429); // Too Many Requests
  });

  test('should validate JWT tokens properly', async () => {
    const invalidToken = 'invalid-jwt-token';
    const response = await apiClient.get('/users/profile', {
      headers: { Authorization: `Bearer ${invalidToken}` }
    });
    
    expect(response.status).toBe(401);
  });
});
```

### **PayOS Security Tests**

```javascript
// test/security/payos-security.test.js
describe('PayOS Security', () => {
  test('should reject webhooks with invalid signature', async () => {
    const payload = { orderCode: 'test', status: 'PAID' };
    const invalidSignature = 'invalid-signature';

    const response = await apiClient.post('/payments/payos/webhook',
      payload,
      { headers: { 'x-signature': invalidSignature }}
    );

    expect(response.status).toBe(401);
  });

  test('should prevent payment amount manipulation', async () => {
    // Test that backend validates payment amounts match orders
    const manipulatedWebhook = {
      orderCode: 'order-100k',
      amount: 1000000, // Original order was 50000
      status: 'PAID'
    };

    const signature = generatePayOSSignature(manipulatedWebhook);
    const response = await apiClient.post('/payments/payos/webhook',
      manipulatedWebhook,
      { headers: { 'x-signature': signature }}
    );

    // Should reject due to amount mismatch
    expect(response.status).toBe(400);
  });
});
```

---

## 📊 **Test Execution & Reporting**

### **Test Automation Scripts**

#### **1. Complete Test Suite Runner**
```bash
#!/bin/bash
# run-all-tests.sh

echo "🧪 Running Complete Test Suite for Audio Tài Lộc"
echo "================================================"

# Setup test environment
echo "📋 Setting up test environment..."
docker-compose -f docker-compose.test.yml up -d
sleep 10

# Run unit tests
echo "🔬 Running unit tests..."
cd backend && npm run test:unit
cd ../frontend && npm run test:unit  
cd ../dashboard && npm run test:unit

# Run integration tests
echo "🔗 Running integration tests..."
cd ../backend && npm run test:integration

# Run E2E tests
echo "🌐 Running E2E tests..."
npm run test:e2e

# Run performance tests
echo "⚡ Running performance tests..."
k6 run test/performance/api-load.test.js

# Run security tests
echo "🔒 Running security tests..."
npm run test:security

# Generate test report
echo "📊 Generating test report..."
npm run test:report

echo "✅ Test suite completed!"
```

#### **2. Continuous Integration Setup**
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
          cd ../dashboard && npm ci
          
      - name: Run tests
        run: ./run-all-tests.sh
        
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

### **Test Coverage Requirements**

| Component | Unit Tests | Integration Tests | E2E Tests | Min Coverage |
|-----------|------------|-------------------|-----------|--------------|
| **Backend APIs** | 90%+ | 80%+ | 70%+ | 85% |
| **Frontend Components** | 80%+ | 60%+ | 50%+ | 75% |
| **Dashboard** | 75%+ | 60%+ | 50%+ | 70% |
| **PayOS Integration** | 95%+ | 90%+ | 80%+ | 90% |

---

## 🎯 **Success Criteria**

### **Functional Testing**
- [ ] All critical user journeys pass E2E tests
- [ ] Payment processing works reliably
- [ ] Admin functions operate correctly
- [ ] Data consistency maintained across all operations

### **Performance Testing**
- [ ] Page load times < 3 seconds
- [ ] API response times < 2 seconds
- [ ] Payment processing < 5 seconds
- [ ] System handles 100+ concurrent users

### **Security Testing**  
- [ ] No critical security vulnerabilities
- [ ] Authentication & authorization secure
- [ ] Payment data properly encrypted
- [ ] Input validation prevents injections

### **Reliability Testing**
- [ ] 99.9% uptime under normal load
- [ ] Graceful handling of external service failures
- [ ] Data backup and recovery verified
- [ ] Error handling and logging comprehensive

---

**🎯 Total Testing Timeline: 2 weeks**
**📊 Expected Outcome: Production-ready system with 90%+ reliability**

---

*Next: Production deployment with monitoring and alerting*
