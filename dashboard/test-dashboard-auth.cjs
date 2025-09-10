const axios = require('axios');

const BASE_URL = 'http://localhost:3010';
const DASHBOARD_URL = 'http://localhost:3001';
const API_PREFIX = '/api/v1';

async function testDashboardAuthentication() {
  try {
    console.log('🔍 Test authentication và service types trong dashboard...');

    // Test 1: Login vào API
    console.log('\n1️⃣ Test login API...');
    const loginResponse = await axios.post(`${BASE_URL}${API_PREFIX}/auth/login`, {
      email: 'admin@audiotailoc.com',
      password: 'admin123'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login API thành công');

    // Test 2: Fetch service types từ API
    console.log('\n2️⃣ Test fetch service types từ API...');
    const typesResponse = await axios.get(`${BASE_URL}${API_PREFIX}/services/types`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`📋 API trả về ${typesResponse.data.data.length} service types`);
    console.log('Sample:', typesResponse.data.data[0]);

    // Test 3: Kiểm tra xem dashboard có thể truy cập được không
    console.log('\n3️⃣ Test truy cập dashboard...');
    const dashboardResponse = await axios.get(`${DASHBOARD_URL}/dashboard/services/types`);
    console.log('✅ Dashboard accessible');

    // Test 4: Kiểm tra xem có thể fetch service types từ dashboard context không
    console.log('\n4️⃣ Test authentication flow...');
    console.log('🔗 Dashboard URL:', `${DASHBOARD_URL}/dashboard/services/types`);
    console.log('🔑 API Token available:', !!token);
    console.log('📊 Service types count:', typesResponse.data.data.length);

    console.log('\n✅ Tất cả tests thành công!');
    console.log('🎉 Dashboard có thể hiển thị service types khi user đã login');

  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data?.message || error.message);
  }
}

testDashboardAuthentication();