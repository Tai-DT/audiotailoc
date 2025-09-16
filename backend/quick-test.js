const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

async function quickTest() {
  try {
    console.log('Testing server connection...');

    // Test health check
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Server is running');

    // Test login
    console.log('🔐 Testing login...');
    const login = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@audiotailoc.com',
      password: 'Admin1234'
    });
    console.log('✅ Login successful');

    const token = login.data.data.data.token;
    const headers = { 'Authorization': `Bearer ${token}` };

    // Test payments
    console.log('📊 Testing payments endpoint...');
    const payments = await axios.get(`${API_BASE}/payments`, { headers });
    console.log('✅ Payments endpoint working!');
    console.log(`Found ${payments.data.payments?.length || 0} payments`);

    // Test stats
    console.log('📈 Testing payments stats...');
    const stats = await axios.get(`${API_BASE}/payments/stats`, { headers });
    console.log('✅ Payments stats working!');
    console.log('Stats:', JSON.stringify(stats.data, null, 2));

  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

quickTest();