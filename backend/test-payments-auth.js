const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

async function testPaymentsWithAuth() {
  try {
    console.log('🔐 Logging in as admin...');

    // Login to get JWT token
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@audiotailoc.com',
      password: 'Admin1234'
    });

    const token = loginResponse.data.data.data.token;
    console.log('✅ Login successful, got JWT token');

    // Set up headers for authenticated requests
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('\n📊 Testing payments endpoints...\n');

    // Test payments endpoint
    console.log('1️⃣ Testing GET /payments...');
    try {
      const paymentsResponse = await axios.get(`${API_BASE}/payments`, { headers });
      console.log('✅ Payments endpoint working!');
      console.log(`📄 Found ${paymentsResponse.data.payments?.length || 0} payments`);
      console.log(`📊 Pagination: Page ${paymentsResponse.data.pagination?.page || 'N/A'}, Total: ${paymentsResponse.data.pagination?.total || 'N/A'}`);
    } catch (error) {
      console.log('❌ Payments endpoint error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Test payments stats endpoint
    console.log('\n2️⃣ Testing GET /payments/stats...');
    try {
      const statsResponse = await axios.get(`${API_BASE}/payments/stats`, { headers });
      console.log('✅ Payments stats endpoint working!');
      console.log('📈 Stats data:', JSON.stringify(statsResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Payments stats error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Test payment methods (public endpoint)
    console.log('\n3️⃣ Testing GET /payments/methods (public)...');
    try {
      const methodsResponse = await axios.get(`${API_BASE}/payments/methods`);
      console.log('✅ Payment methods endpoint working!');
      console.log('💳 Available methods:', methodsResponse.data.methods?.map(m => m.name).join(', '));
    } catch (error) {
      console.log('❌ Payment methods error:', error.response?.status, error.message);
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.log('❌ Login failed:', error.response?.status, error.response?.data?.message || error.message);
    console.log('\n💡 Make sure to run the admin creation script first:');
    console.log('   cd /Users/macbook/Desktop/Code/audiotailoc/backend && node scripts/create-admin.js');
  }
}

testPaymentsWithAuth();