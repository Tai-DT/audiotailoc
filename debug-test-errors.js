const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';

async function debugErrors() {
  console.log('🔍 DEBUGGING TEST ERRORS\n');

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

  // Test 1: Search
  console.log('\n1. Testing Search...');
  try {
    const searchResponse = await axios.get(`${BASE_URL}/search/products?q=tai nghe`);
    console.log('✅ Search PASS:', searchResponse.data);
  } catch (error) {
    console.log('❌ Search FAIL:', error.response?.data || error.message);
  }

  // Test 2: AI Features
  console.log('\n2. Testing AI Features...');
  try {
    const chatResponse = await axios.post(`${BASE_URL}/ai/chat`, {
      message: 'Tôi muốn mua tai nghe gaming'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ AI Chat PASS:', chatResponse.data);
  } catch (error) {
    console.log('❌ AI Chat FAIL:', error.response?.data || error.message);
  }

  // Test 3: Support System
  console.log('\n3. Testing Support System...');
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
    console.log('✅ Support PASS:', ticketResponse.data);
  } catch (error) {
    console.log('❌ Support FAIL:', error.response?.data || error.message);
  }
}

debugErrors();
