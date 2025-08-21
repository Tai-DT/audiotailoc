const axios = require('axios');
const API_BASE = 'http://localhost:3010/api/v1';

// Test helper function
async function testEndpoint(name, method, endpoint, data = null, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: { 'Content-Type': 'application/json' }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      console.log(`✅ ${name}: PASSED`);
      return { success: true, data: response.data };
    } else {
      console.log(`❌ ${name}: FAILED (Expected ${expectedStatus}, got ${response.status})`);
      return { success: false, error: `Status ${response.status}` };
    }
  } catch (error) {
    if (error.response && error.response.status === expectedStatus) {
      console.log(`✅ ${name}: PASSED (Expected ${expectedStatus})`);
      return { success: true, data: error.response.data };
    } else {
      console.log(`❌ ${name}: FAILED - ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

async function testEnhancedFeatures() {
  console.log('🚀 Testing Enhanced Backend Features\n');

  // Test Guest Cart System
  console.log('📋 1. Guest Cart System');
  console.log('----------------------------------------');
  
  const guestCart = await testEndpoint('Create Guest Cart', 'POST', '/cart/guest');
  if (guestCart.success) {
    const guestId = guestCart.data.guestId;
    
    await testEndpoint('Get Guest Cart', 'GET', `/cart/guest/${guestId}`);
    await testEndpoint('Add to Guest Cart', 'POST', `/cart/guest/${guestId}/items`, {
      productId: 'test-product-id',
      quantity: 2
    }, 404); // Expected 404 since product doesn't exist
    await testEndpoint('Update Guest Cart Item', 'PUT', `/cart/guest/${guestId}/items/test-product-id`, {
      quantity: 1
    }, 404);
    await testEndpoint('Remove from Guest Cart', 'DELETE', `/cart/guest/${guestId}/items/test-product-id`);
    await testEndpoint('Clear Guest Cart', 'DELETE', `/cart/guest/${guestId}/clear`);
  }

  // Test Advanced Search System
  console.log('\n📋 2. Advanced Search System');
  console.log('----------------------------------------');
  
  await testEndpoint('Product Search', 'GET', '/search/products?q=loa');
  await testEndpoint('Product Search with Filters', 'GET', '/search/products?q=loa&minPrice=100000&maxPrice=1000000&inStock=true');
  await testEndpoint('Global Search', 'GET', '/search/global?q=audio');
  await testEndpoint('Search Suggestions', 'GET', '/search/suggestions?q=loa');
  await testEndpoint('Popular Searches', 'GET', '/search/popular');
  await testEndpoint('Available Filters', 'GET', '/search/filters?q=loa');
  await testEndpoint('Search History', 'GET', '/search/history?userId=test-user', null, 404);

  // Test Enhanced Cart Features
  console.log('\n📋 3. Enhanced Cart Features');
  console.log('----------------------------------------');
  
  await testEndpoint('User Cart (Protected)', 'GET', '/cart/user?userId=test-user', null, 401);
  await testEndpoint('Add to User Cart (Protected)', 'POST', '/cart/user/items?userId=test-user', {
    productId: 'test-product-id',
    quantity: 1
  }, 401);
  await testEndpoint('Update User Cart Item (Protected)', 'PUT', '/cart/user/items/test-product-id?userId=test-user', {
    quantity: 2
  }, 401);
  await testEndpoint('Remove from User Cart (Protected)', 'DELETE', '/cart/user/items/test-product-id?userId=test-user', null, 401);
  await testEndpoint('Clear User Cart (Protected)', 'DELETE', '/cart/user/clear?userId=test-user', null, 401);

  // Test Legacy Cart Endpoints
  console.log('\n📋 4. Legacy Cart Endpoints');
  console.log('----------------------------------------');
  
  await testEndpoint('Legacy Get Cart (Protected)', 'GET', '/cart?userId=test-user', null, 401);
  await testEndpoint('Legacy Add Item (Protected)', 'POST', '/cart/items?userId=test-user', {
    productId: 'test-product-id',
    quantity: 1
  }, 401);
  await testEndpoint('Legacy Update Item (Protected)', 'PUT', '/cart/items/test-product-id?userId=test-user', {
    quantity: 2
  }, 401);
  await testEndpoint('Legacy Remove Item (Protected)', 'DELETE', '/cart/items/test-product-id?userId=test-user', null, 401);

  // Test Marketing System
  console.log('\n📋 5. Marketing System');
  console.log('----------------------------------------');
  
  await testEndpoint('Get Marketing Campaigns (Protected)', 'GET', '/marketing/campaigns', null, 401);
  await testEndpoint('Create Campaign (Protected)', 'POST', '/marketing/campaigns', {
    name: 'Test Campaign',
    description: 'Test campaign description',
    type: 'EMAIL',
    targetAudience: 'new-customers'
  }, 401);
  await testEndpoint('Get Email Templates (Protected)', 'GET', '/marketing/email/templates', null, 401);
  await testEndpoint('Get Email Stats (Protected)', 'GET', '/marketing/email/stats', null, 401);
  await testEndpoint('Get Audience Segments (Protected)', 'GET', '/marketing/audience/segments', null, 401);
  await testEndpoint('Get ROI Analysis (Protected)', 'GET', '/marketing/roi/analysis', null, 401);
  await testEndpoint('Get Conversion Funnel (Protected)', 'GET', '/marketing/conversion/funnel', null, 401);

  // Test Analytics System
  console.log('\n📋 6. Analytics System');
  console.log('----------------------------------------');
  
  await testEndpoint('Dashboard Analytics (Protected)', 'GET', '/analytics/dashboard', null, 401);
  await testEndpoint('Sales Analytics (Protected)', 'GET', '/analytics/sales', null, 401);
  await testEndpoint('Customer Analytics (Protected)', 'GET', '/analytics/customers', null, 401);
  await testEndpoint('Inventory Analytics (Protected)', 'GET', '/analytics/inventory', null, 401);
  await testEndpoint('Business KPIs (Protected)', 'GET', '/analytics/kpis', null, 401);
  await testEndpoint('Export Analytics (Protected)', 'GET', '/analytics/export?type=sales&format=csv', null, 401);

  // Test User Management
  console.log('\n📋 7. User Management');
  console.log('----------------------------------------');
  
  await testEndpoint('Get Users (Protected)', 'GET', '/users', null, 401);
  await testEndpoint('Get User Profile (Protected)', 'GET', '/users/profile', null, 401);
  await testEndpoint('Create User (Protected)', 'POST', '/users', {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  }, 401);
  await testEndpoint('Get User Stats (Protected)', 'GET', '/users/stats', null, 401);
  await testEndpoint('Get User Activity (Protected)', 'GET', '/users/activity?days=30', null, 401);

  // Test Payment Integration
  console.log('\n📋 8. Payment Integration');
  console.log('----------------------------------------');
  
  await testEndpoint('Create PayOS Intent', 'POST', '/payments/intents', {
    provider: 'PAYOS',
    amountCents: 100000,
    orderId: 'test-order-id',
    returnUrl: 'http://localhost:3000/checkout/success'
  }, 404); // Expected 404 since order doesn't exist
  
  await testEndpoint('Create VNPay Intent', 'POST', '/payments/intents', {
    provider: 'VNPAY',
    amountCents: 100000,
    orderId: 'test-order-id',
    returnUrl: 'http://localhost:3000/checkout/success'
  }, 404);
  
  await testEndpoint('Create MoMo Intent', 'POST', '/payments/intents', {
    provider: 'MOMO',
    amountCents: 100000,
    orderId: 'test-order-id',
    returnUrl: 'http://localhost:3000/checkout/success'
  }, 404);

  // Test AI Integration
  console.log('\n📋 9. AI Integration');
  console.log('----------------------------------------');
  
  await testEndpoint('AI Chat', 'POST', '/ai/chat', {
    message: 'Hello, I need help with audio equipment',
    sessionId: 'test-session-id'
  }, 201); // Expected 201 for successful chat creation
  
  await testEndpoint('AI Search', 'GET', '/ai/search?q=best speakers for home theater');

  // Test Service Management
  console.log('\n📋 10. Service Management');
  console.log('----------------------------------------');
  
  await testEndpoint('Get Services', 'GET', '/services');
  await testEndpoint('Get Service Categories', 'GET', '/services/categories');
  await testEndpoint('Get Service Types', 'GET', '/services/types');
  await testEndpoint('Get Bookings', 'GET', '/bookings');
  await testEndpoint('Create Booking (Protected)', 'POST', '/bookings', {
    serviceId: 'test-service-id',
    scheduledAt: new Date().toISOString(),
    customerName: 'Test Customer',
    customerPhone: '0123456789'
  }, 404); // Expected 404 since service doesn't exist

  // Test Health and System
  console.log('\n📋 11. Health and System');
  console.log('----------------------------------------');
  
  await testEndpoint('Health Check', 'GET', '/health');
  await testEndpoint('API Documentation', 'GET', '/docs', null, 404);

  console.log('\n============================================================');
  console.log('🏁 Enhanced Features Test Completed!');
  console.log('============================================================');
}

// Run tests
testEnhancedFeatures().catch(console.error);
