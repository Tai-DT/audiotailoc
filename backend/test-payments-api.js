const axios = require('axios');

async function testPaymentsAPI() {
  const baseURL = 'http://localhost:3010/api/v1';

  try {
    console.log('Testing Payments API...');

    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test payments endpoint (without auth for now)
    console.log('2. Testing payments endpoint...');
    try {
      const paymentsResponse = await axios.get(`${baseURL}/payments`);
      console.log('✅ Payments endpoint response:', paymentsResponse.data);
    } catch (error) {
      console.log('❌ Payments endpoint error:', error.response?.status, error.response?.data);
    }

    // Test payments stats endpoint
    console.log('3. Testing payments stats endpoint...');
    try {
      const statsResponse = await axios.get(`${baseURL}/payments/stats`);
      console.log('✅ Payments stats response:', statsResponse.data);
    } catch (error) {
      console.log('❌ Payments stats error:', error.response?.status, error.response?.data);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testPaymentsAPI();