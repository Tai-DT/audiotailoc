const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';

async function debugTestScript() {
  console.log('🔍 DEBUGGING TEST SCRIPT\n');

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

  // Test Search exactly as in comprehensive script
  console.log('\n1. Testing Search (comprehensive script style)...');
  try {
    const searchResponse = await axios.get(`${BASE_URL}/search/products?q=tai nghe`);
    console.log('✅ Search PASS');
    console.log('   Data:', searchResponse.data);
  } catch (error) {
    console.log('❌ Search FAIL');
    console.log('   Error:', error.response?.data || error.message);
  }

  // Test AI Features exactly as in comprehensive script
  console.log('\n2. Testing AI Features (comprehensive script style)...');
  try {
    // Test AI Search
    const aiSearchResponse = await axios.get(`${BASE_URL}/ai/search?q=tai nghe gaming`);
    console.log('✅ AI Search PASS');
    
    // Test AI Recommendations
    let recommendationsStatus = 'SUCCESS';
    try {
      const recommendationsResponse = await axios.post(`${BASE_URL}/ai/recommendations`, {
        query: 'tai nghe gaming'
      });
      console.log('✅ AI Recommendations PASS');
    } catch (recError) {
      if (recError.response?.status === 500 && recError.response?.data?.message?.includes('rate limit')) {
        recommendationsStatus = 'RATE_LIMITED';
        console.log('⚠️ AI Recommendations RATE_LIMITED');
      } else {
        throw recError;
      }
    }
    
    // Test AI Chat
    let chatStatus = 'SKIPPED';
    try {
      const chatResponse = await axios.post(`${BASE_URL}/ai/chat`, {
        message: 'Tôi muốn mua tai nghe gaming'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      chatStatus = 'SUCCESS';
      console.log('✅ AI Chat PASS');
    } catch (chatError) {
      if (chatError.response?.status === 500 && chatError.response?.data?.message?.includes('rate limit')) {
        chatStatus = 'RATE_LIMITED';
        console.log('⚠️ AI Chat RATE_LIMITED');
      } else {
        throw chatError;
      }
    }
    
    console.log('✅ AI Features PASS');
    console.log(`   Search: SUCCESS, Recommendations: ${recommendationsStatus}, Chat: ${chatStatus}`);
    
  } catch (error) {
    console.log('❌ AI Features FAIL');
    console.log('   Error:', error.response?.data || error.message);
  }

  // Test Support exactly as in comprehensive script
  console.log('\n3. Testing Support (comprehensive script style)...');
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
    console.log('   Ticket ID:', ticketResponse.data.data?.id);
  } catch (error) {
    console.log('❌ Support FAIL');
    console.log('   Error:', error.response?.data || error.message);
  }
}

debugTestScript();
