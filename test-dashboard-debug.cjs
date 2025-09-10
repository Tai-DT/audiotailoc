const axios = require('axios');

async function debugDashboard() {
  try {
    console.log('🔍 Debugging dashboard service types...');

    // First login to get token
    console.log('📝 Logging in...');
    const loginResponse = await axios.post('http://localhost:3010/api/v1/auth/login', {
      email: 'admin@audiotailoc.com',
      password: 'admin123'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful');

    // Test auth/me endpoint
    console.log('🔐 Testing auth/me...');
    const authResponse = await axios.get('http://localhost:3010/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Auth check successful:', authResponse.data.data.email);

    // Test service types API
    console.log('📋 Testing service types API...');
    const apiResponse = await axios.get('http://localhost:3010/api/v1/services/types', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ API returned ${apiResponse.data.data.length} service types`);
    console.log('📊 Response structure:', {
      success: apiResponse.data.success,
      dataLength: apiResponse.data.data.length,
      firstItem: apiResponse.data.data[0] ? {
        id: apiResponse.data.data[0].id,
        name: apiResponse.data.data[0].name,
        slug: apiResponse.data.data[0].slug,
        isActive: apiResponse.data.data[0].isActive
      } : null
    });

    // Test dashboard page access
    console.log('🌐 Testing dashboard page access...');
    try {
      const dashboardResponse = await axios.get('http://localhost:3001/dashboard/services/types', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept redirects
        }
      });
      console.log('✅ Dashboard page accessible, status:', dashboardResponse.status);
    } catch (error) {
      if (error.response) {
        console.log('ℹ️  Dashboard response:', error.response.status, error.response.statusText);
      } else {
        console.log('⚠️  Dashboard access issue:', error.message);
      }
    }

    console.log('\n🎯 Summary:');
    console.log('- Backend API: ✅ Working');
    console.log('- Authentication: ✅ Working');
    console.log('- Service Types Data: ✅ Available');
    console.log('- Dashboard Server: Running on port 3001');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

debugDashboard();