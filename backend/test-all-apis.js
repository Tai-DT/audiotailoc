const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

// Test configuration
const TEST_CONFIG = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  errors: []
};

async function testEndpoint(name, method, url, data = null, expectedStatus = 200) {
  try {
    console.log(`🧪 Testing: ${name}`);
    
    const config = {
      ...TEST_CONFIG,
      method,
      url: `${API_BASE}${url}`,
      ...(data && { data })
    };

    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      console.log(`✅ ${name}: PASSED`);
      results.passed++;
      return true;
    } else {
      console.log(`❌ ${name}: FAILED (Expected ${expectedStatus}, got ${response.status})`);
      results.failed++;
      return false;
    }
  } catch (error) {
    const status = error.response?.status || 'NETWORK_ERROR';
    console.log(`❌ ${name}: FAILED (${status})`);
    results.failed++;
    results.errors.push({ name, error: error.message });
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Audio Tài Lộc - API Integration Test Suite\n');
  console.log('=' .repeat(60));

  // 1. Health Check
  console.log('\n📋 1. Health & System APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Health Check', 'GET', '/health');
  await testEndpoint('API Documentation', 'GET', '/docs');

  // 2. Authentication APIs
  console.log('\n📋 2. Authentication APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Login (POST)', 'POST', '/auth/login', {
    email: 'test@example.com',
    password: 'password123'
  }, 401); // Expected to fail without valid credentials

  // 3. User Management APIs
  console.log('\n📋 3. User Management APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Get Users (Admin)', 'GET', '/users', null, 401); // Requires admin auth
  await testEndpoint('Get User Profile', 'GET', '/users/profile', null, 401); // Requires auth
  await testEndpoint('Create User (Admin)', 'POST', '/users', {
    email: 'newuser@example.com',
    password: 'password123',
    name: 'Test User'
  }, 401); // Requires admin auth

  // 4. Product & Catalog APIs
  console.log('\n📋 4. Product & Catalog APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Get Products', 'GET', '/catalog/products');
  await testEndpoint('Get Product Categories', 'GET', '/catalog/categories');
  await testEndpoint('Search Products', 'GET', '/catalog/search?q=audio');

  // 5. Cart & Checkout APIs
  console.log('\n📋 5. Cart & Checkout APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Get Cart', 'GET', '/cart', null, 401); // Requires auth
  await testEndpoint('Add to Cart', 'POST', '/cart/items', {
    productId: 'test-product-id',
    quantity: 1
  }, 401); // Requires auth

  // 6. Payment APIs
  console.log('\n📋 6. Payment APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Create Payment Intent (PayOS)', 'POST', '/payments/intents', {
    orderId: 'test-order-id',
    provider: 'PAYOS',
    idempotencyKey: `test-${Date.now()}`,
    returnUrl: 'http://localhost:3000/checkout/return'
  }, 401); // Requires auth

  await testEndpoint('Create Payment Intent (VNPay)', 'POST', '/payments/intents', {
    orderId: 'test-order-id',
    provider: 'VNPAY',
    idempotencyKey: `test-${Date.now()}`,
    returnUrl: 'http://localhost:3000/checkout/return'
  }, 401); // Requires auth

  await testEndpoint('Create Payment Intent (MoMo)', 'POST', '/payments/intents', {
    orderId: 'test-order-id',
    provider: 'MOMO',
    idempotencyKey: `test-${Date.now()}`,
    returnUrl: 'http://localhost:3000/checkout/return'
  }, 401); // Requires auth

  // 7. Order Management APIs
  console.log('\n📋 7. Order Management APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Get Orders', 'GET', '/orders', null, 401); // Requires auth
  await testEndpoint('Create Order', 'POST', '/orders', {
    items: [{ productId: 'test-product', quantity: 1 }]
  }, 401); // Requires auth

  // 8. Analytics APIs
  console.log('\n📋 8. Analytics APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Dashboard Analytics', 'GET', '/analytics/dashboard', null, 401); // Requires admin
  await testEndpoint('Sales Analytics', 'GET', '/analytics/sales', null, 401); // Requires admin
  await testEndpoint('Customer Analytics', 'GET', '/analytics/customers', null, 401); // Requires admin
  await testEndpoint('Inventory Analytics', 'GET', '/analytics/inventory', null, 401); // Requires admin
  await testEndpoint('Business KPIs', 'GET', '/analytics/kpis', null, 401); // Requires admin

  // 9. Marketing APIs
  console.log('\n📋 9. Marketing APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Get Marketing Campaigns', 'GET', '/marketing/campaigns', null, 401); // Requires admin
  await testEndpoint('Create Campaign', 'POST', '/marketing/campaigns', {
    name: 'Test Campaign',
    description: 'Test campaign description',
    type: 'EMAIL'
  }, 401); // Requires admin

  // 10. Support & Chat APIs
  console.log('\n📋 10. Support & Chat APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Get Support Tickets', 'GET', '/support/tickets');
  await testEndpoint('Create Support Ticket', 'POST', '/support/tickets', {
    subject: 'Test Ticket',
    description: 'Test ticket description',
    priority: 'MEDIUM'
  });

  // 11. AI & Chat APIs
  console.log('\n📋 11. AI & Chat APIs');
  console.log('-'.repeat(40));
  await testEndpoint('AI Chat', 'POST', '/ai/chat', {
    message: 'Hello, how can you help me?',
    sessionId: 'test-session'
  });

  await testEndpoint('AI Search', 'GET', '/ai/search?q=audio equipment');

  // 12. Service Management APIs
  console.log('\n📋 12. Service Management APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Get Services', 'GET', '/services');
  await testEndpoint('Get Service Categories', 'GET', '/services/categories');
  await testEndpoint('Get Service Types', 'GET', '/services/types');

  // 13. Booking APIs
  console.log('\n📋 13. Booking APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Get Bookings', 'GET', '/bookings');
  await testEndpoint('Create Booking', 'POST', '/bookings', {
    serviceId: 'test-service-id',
    customerName: 'Test Customer',
    customerPhone: '0123456789',
    scheduledDate: new Date().toISOString()
  });

  // 14. Technician APIs
  console.log('\n📋 14. Technician APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Get Technicians', 'GET', '/technicians');
  await testEndpoint('Get Available Technicians', 'GET', '/technicians/available');

  // 15. File Management APIs
  console.log('\n📋 15. File Management APIs');
  console.log('-'.repeat(40));
  await testEndpoint('File Upload', 'POST', '/files/upload', null, 400); // Requires file

  // 16. Search APIs
  console.log('\n📋 16. Search APIs');
  console.log('-'.repeat(40));
  await testEndpoint('Global Search', 'GET', '/search?q=audio');

  // 17. Webhook APIs
  console.log('\n📋 17. Webhook APIs');
  console.log('-'.repeat(40));
  await testEndpoint('PayOS Webhook', 'POST', '/payments/payos/webhook', {
    data: { orderCode: 'test-order', code: '00' },
    signature: 'test-signature'
  });

  await testEndpoint('VNPay Webhook', 'POST', '/payments/vnpay/webhook', {
    vnp_TxnRef: 'test-ref',
    vnp_ResponseCode: '00'
  });

  await testEndpoint('MoMo Webhook', 'POST', '/payments/momo/webhook', {
    orderId: 'test-order',
    resultCode: 0
  });

  // Print results
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.errors.length > 0) {
    console.log('\n🔍 ERROR DETAILS:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.name}: ${error.error}`);
    });
  }

  console.log('\n💡 NOTES:');
  console.log('- 401 errors are expected for endpoints requiring authentication');
  console.log('- Some endpoints may need proper environment variables configured');
  console.log('- Database should be properly seeded with test data');
  console.log('- Payment providers need valid credentials in .env file');

  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Configure environment variables in .env file');
  console.log('2. Set up authentication tokens for protected endpoints');
  console.log('3. Seed database with test data');
  console.log('4. Configure payment provider credentials');
  console.log('5. Test with real authentication');

  console.log('\n🏁 Test suite completed!');
}

// Run tests
runAllTests().catch(console.error);
