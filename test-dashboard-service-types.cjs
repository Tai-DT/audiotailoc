const axios = require('axios');

async function testDashboardServiceTypes() {
  try {
    console.log('🔍 Testing dashboard service types page...');

    // First login to get token
    console.log('📝 Logging in...');
    const loginResponse = await axios.post('http://localhost:3010/api/v1/auth/login', {
      email: 'admin@audiotailoc.com',
      password: 'admin123'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful');

    // Test the service types API that dashboard uses
    console.log('📋 Fetching service types from API...');
    const apiResponse = await axios.get('http://localhost:3010/api/v1/services/types', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ API returned ${apiResponse.data.data.length} service types:`);
    apiResponse.data.data.forEach((type, index) => {
      console.log(`${index + 1}. ${type.name} (slug: ${type.slug}, active: ${type.isActive})`);
    });

    // Test auth/me endpoint that dashboard might use
    console.log('🔐 Testing auth/me endpoint...');
    const authResponse = await axios.get('http://localhost:3010/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Auth check successful:', authResponse.data.data.email);

    console.log('\n🎯 Dashboard should be accessible at: http://localhost:3001/dashboard/services/types');
    console.log('📊 Expected to display', apiResponse.data.data.length, 'service types in a table');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testDashboardServiceTypes();