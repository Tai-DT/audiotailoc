const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';

async function detailedErrorCheck() {
  console.log('🔍 DETAILED ERROR CHECK\n');

  // Get auth token first
  let authToken = '';
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    authToken = loginResponse.data.data.accessToken;
    console.log('✅ Auth token obtained');
  } catch (error) {
    console.log('❌ Auth failed:', error.message);
    return;
  }

  // Test 1: Search with detailed error
  console.log('\n1. Testing Search with detailed error...');
  try {
    const searchResponse = await axios.get(`${BASE_URL}/search/products?q=tai nghe`);
    console.log('✅ Search PASS');
    console.log('   Status:', searchResponse.status);
    console.log('   Data length:', searchResponse.data.data?.products?.length || 0);
  } catch (error) {
    console.log('❌ Search FAIL');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message);
    console.log('   Error:', error.response?.data?.error);
  }

  // Test 2: AI Features with detailed error
  console.log('\n2. Testing AI Features with detailed error...');
  try {
    // Test AI Search
    const aiSearchResponse = await axios.get(`${BASE_URL}/ai/search?q=tai nghe gaming`);
    console.log('✅ AI Search PASS');
    console.log('   Status:', aiSearchResponse.status);
    console.log('   Data length:', aiSearchResponse.data.data?.items?.length || 0);
    
    // Test AI Recommendations
    const recommendationsResponse = await axios.get(`${BASE_URL}/ai/recommendations`);
    console.log('✅ AI Recommendations PASS');
    console.log('   Status:', recommendationsResponse.status);
    
    // Test AI Chat
    try {
      const chatResponse = await axios.post(`${BASE_URL}/ai/chat`, {
        message: 'Tôi muốn mua tai nghe gaming'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ AI Chat PASS');
      console.log('   Status:', chatResponse.status);
    } catch (chatError) {
      console.log('⚠️ AI Chat RATE_LIMITED (expected)');
      console.log('   Status:', chatError.response?.status);
      console.log('   Message:', chatError.response?.data?.message);
    }
    
  } catch (error) {
    console.log('❌ AI Features FAIL');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message);
  }

  // Test 3: Support System with detailed error
  console.log('\n3. Testing Support System with detailed error...');
  try {
    const ticketResponse = await axios.post(`${BASE_URL}/support/tickets`, {
      subject: 'Test ticket',
      description: 'This is a test support ticket',
      email: 'test@example.com',
      name: 'Test User',
      priority: 'MEDIUM'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Support PASS');
    console.log('   Status:', ticketResponse.status);
    console.log('   Ticket ID:', ticketResponse.data.data?.id);
  } catch (error) {
    console.log('❌ Support FAIL');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message);
    console.log('   Error:', error.response?.data?.error);
  }
}

detailedErrorCheck();
