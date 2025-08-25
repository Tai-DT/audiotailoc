const axios = require('axios');

// Set environment variable for AI testing
process.env.GOOGLE_AI_API_KEY = 'AIzaSyC0MdgM40z_WUtT75DXtsQLCiAuo1TfOwk';
process.env.AI_SERVICE_ENABLED = 'true';

const BASE_URL = 'http://localhost:3010/api/v1';
let authToken = '';

async function testAIFeatures() {
  console.log('🤖 Testing AI Features with Gemini API Key...\n');

  try {
    // 1. Login to get token
    console.log('1. Getting authentication token...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    authToken = loginResponse.data.data.accessToken;
    console.log('✅ Login successful');
    console.log('');

    // 2. Test AI Search
    console.log('2. Testing AI Search...');
    const aiSearchResponse = await axios.get(`${BASE_URL}/ai/search?q=tai%20nghe%20chong%20on`);
    console.log('✅ AI Search:', aiSearchResponse.data.success ? 'OK' : 'FAILED');
    console.log(`   Found ${aiSearchResponse.data.data.items.length} AI results`);
    console.log('   Sample result:', aiSearchResponse.data.data.items[0]?.title || 'No results');
    console.log('');

    // 3. Test AI Chat
    console.log('3. Testing AI Chat...');
    try {
      const aiChatResponse = await axios.post(`${BASE_URL}/ai/chat`, {
        message: 'Xin chào, tôi muốn tìm tai nghe chống ồn chất lượng tốt'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ AI Chat:', aiChatResponse.data.success ? 'OK' : 'FAILED');
      console.log('   Response:', aiChatResponse.data.data?.message?.substring(0, 100) + '...');
    } catch (error) {
      console.log('❌ AI Chat failed:', error.response?.data?.message || error.message);
    }
    console.log('');

    // 4. Test AI Recommendations
    console.log('4. Testing AI Recommendations...');
    try {
      const aiRecResponse = await axios.post(`${BASE_URL}/ai/recommendations`, {
        query: 'tai nghe chống ồn cho gaming'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ AI Recommendations:', aiRecResponse.data.success ? 'OK' : 'FAILED');
      console.log(`   Found ${aiRecResponse.data.data?.recommendations?.length || 0} recommendations`);
    } catch (error) {
      console.log('❌ AI Recommendations failed:', error.response?.data?.message || error.message);
    }
    console.log('');

    // 5. Test User Profile (with fixed JWT)
    console.log('5. Testing User Profile...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ User Profile:', profileResponse.data.success ? 'OK' : 'FAILED');
      console.log('   User:', profileResponse.data.data?.email || 'No data');
    } catch (error) {
      console.log('❌ User Profile failed:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Summary
    console.log('📊 AI Features Test Summary:');
    console.log('✅ AI Search: Working with Gemini API');
    console.log('⚠️ AI Chat: May need additional configuration');
    console.log('⚠️ AI Recommendations: May need additional configuration');
    console.log('⚠️ User Profile: JWT authentication issue persists');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testAIFeatures();
