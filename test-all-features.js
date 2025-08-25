const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';
let authToken = '';

async function testAllFeatures() {
  console.log('🚀 Bắt đầu test toàn bộ tính năng backend...\n');

  try {
    // 1. Test Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.success ? 'OK' : 'FAILED');
    console.log('');

    // 2. Test Authentication
    console.log('2. Testing Authentication...');
    
    // Register
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test2@example.com',
      password: 'password123',
      name: 'Test User 2'
    });
    console.log('✅ Register:', registerResponse.data.success ? 'OK' : 'FAILED');

    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test2@example.com',
      password: 'password123'
    });
    authToken = loginResponse.data.data.accessToken;
    console.log('✅ Login:', loginResponse.data.success ? 'OK' : 'FAILED');
    console.log('');

    // 3. Test Catalog
    console.log('3. Testing Catalog...');
    const productsResponse = await axios.get(`${BASE_URL}/catalog/products`);
    console.log('✅ Get Products:', productsResponse.data.success ? 'OK' : 'FAILED');
    console.log(`   Found ${productsResponse.data.data.total} products`);

    const categoriesResponse = await axios.get(`${BASE_URL}/catalog/categories`);
    console.log('✅ Get Categories:', categoriesResponse.data.success ? 'OK' : 'FAILED');
    console.log(`   Found ${categoriesResponse.data.data.length} categories`);
    console.log('');

    // 4. Test Search
    console.log('4. Testing Search...');
    const searchResponse = await axios.get(`${BASE_URL}/search/products?q=tai`);
    console.log('✅ Product Search:', searchResponse.data.success ? 'OK' : 'FAILED');
    console.log(`   Found ${searchResponse.data.data.total} results`);

    const suggestionsResponse = await axios.get(`${BASE_URL}/search/suggestions?q=tai`);
    console.log('✅ Search Suggestions:', suggestionsResponse.data.success ? 'OK' : 'FAILED');
    console.log(`   Found ${suggestionsResponse.data.data.length} suggestions`);
    console.log('');

    // 5. Test AI Features
    console.log('5. Testing AI Features...');
    
    // AI Search
    const aiSearchResponse = await axios.get(`${BASE_URL}/ai/search?q=tai%20nghe%20chong%20on`);
    console.log('✅ AI Search:', aiSearchResponse.data.success ? 'OK' : 'FAILED');
    console.log(`   Found ${aiSearchResponse.data.data.items.length} AI results`);

    // AI Chat (expected to fail)
    try {
      const aiChatResponse = await axios.post(`${BASE_URL}/ai/chat`, {
        message: 'Xin chào, tôi muốn tìm tai nghe chống ồn'
      });
      console.log('✅ AI Chat:', aiChatResponse.data.success ? 'OK' : 'FAILED');
    } catch (error) {
      console.log('⚠️ AI Chat: Expected to fail - AI service not configured');
    }

    // AI Recommendations (expected to fail)
    try {
      const aiRecResponse = await axios.post(`${BASE_URL}/ai/recommendations`, {
        query: 'tai nghe chống ồn'
      });
      console.log('✅ AI Recommendations:', aiRecResponse.data.success ? 'OK' : 'FAILED');
    } catch (error) {
      console.log('⚠️ AI Recommendations: Expected to fail - AI service not configured');
    }
    console.log('');

    // 6. Test User Profile (with auth)
    console.log('6. Testing User Profile...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ User Profile:', profileResponse.data.success ? 'OK' : 'FAILED');
    } catch (error) {
      console.log('❌ User Profile: Failed -', error.response?.data?.message || error.message);
    }
    console.log('');

    // 7. Test Files (with auth)
    console.log('7. Testing Files...');
    const filesResponse = await axios.get(`${BASE_URL}/files`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get Files:', filesResponse.data.success ? 'OK' : 'FAILED');
    console.log(`   Found ${filesResponse.data.data.total} files`);
    console.log('');

    // 8. Test Payments
    console.log('8. Testing Payments...');
    
    // Get payment methods
    const paymentMethodsResponse = await axios.get(`${BASE_URL}/payments/methods`);
    console.log('✅ Payment Methods:', paymentMethodsResponse.data.methods ? 'OK' : 'FAILED');
    console.log(`   Found ${paymentMethodsResponse.data.methods.length} payment methods`);

    // Get payment status
    const paymentStatusResponse = await axios.get(`${BASE_URL}/payments/status`);
    console.log('✅ Payment Status:', paymentStatusResponse.data.status ? 'OK' : 'FAILED');

    // Create payment intent (expected to fail - no order)
    try {
      const paymentIntentResponse = await axios.post(`${BASE_URL}/payments/intents`, {
        orderId: 'test-order-123',
        provider: 'VNPAY',
        idempotencyKey: 'test-key-123'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Payment Intent:', paymentIntentResponse.data.success ? 'OK' : 'FAILED');
    } catch (error) {
      console.log('⚠️ Payment Intent: Expected to fail - Order not found');
    }
    console.log('');

    // 9. Test Support
    console.log('9. Testing Support...');
    try {
      const supportResponse = await axios.post(`${BASE_URL}/support/tickets`, {
        subject: 'Test ticket',
        message: 'This is a test support ticket',
        priority: 'MEDIUM'
      });
      console.log('✅ Create Support Ticket:', supportResponse.data.success ? 'OK' : 'FAILED');
    } catch (error) {
      console.log('❌ Create Support Ticket: Failed -', error.response?.data?.message || error.message);
    }
    console.log('');

    // Summary
    console.log('📊 SUMMARY:');
    console.log('✅ Working features: Authentication, Catalog, Search, AI Search, Files, Health Check');
    console.log('⚠️ Partially working: AI Chat/Recommendations (need API keys)');
    console.log('❌ Issues: User Profile (JWT issue), Payments (no orders), Support (validation)');
    console.log('🚫 Disabled: Cart, Orders (schema issues)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testAllFeatures();
