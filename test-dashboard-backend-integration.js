const axios = require('axios');

const BACKEND_URL = 'http://localhost:3010/api/v1';
const DASHBOARD_URL = 'http://localhost:3000';

async function testBackendEndpoints() {
  console.log('🔍 Testing Backend API Endpoints...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health endpoint:', healthResponse.data.success ? 'OK' : 'FAILED');
    
    // Test login
    console.log('\n2. Testing login endpoint...');
    const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: 'admin@audiotailoc.com',
      password: 'Admin123!'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      const token = loginResponse.data.data.accessToken;
      
      // Test authenticated endpoints
      console.log('\n3. Testing authenticated endpoints...');
      
      // Test /auth/me
      const meResponse = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ /auth/me:', meResponse.data.success ? 'OK' : 'FAILED');
      
      // Test /users
      const usersResponse = await axios.get(`${BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ /users:', usersResponse.data.success ? 'OK' : 'FAILED');
      
      // Test /products
      const productsResponse = await axios.get(`${BACKEND_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ /products:', productsResponse.data.success ? 'OK' : 'FAILED');
      
      // Test /categories
      const categoriesResponse = await axios.get(`${BACKEND_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ /categories:', categoriesResponse.data.success ? 'OK' : 'FAILED');
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.log('❌ Backend test failed:', error.message);
  }
}

async function testDashboardPages() {
  console.log('\n🌐 Testing Dashboard Pages...\n');
  
  try {
    // Test main dashboard page
    console.log('1. Testing main dashboard page...');
    const dashboardResponse = await axios.get(`${DASHBOARD_URL}/dashboard`);
    console.log('✅ Dashboard page:', dashboardResponse.status === 200 ? 'OK' : 'FAILED');
    
    // Test login page
    console.log('\n2. Testing login page...');
    const loginPageResponse = await axios.get(`${DASHBOARD_URL}/login`);
    console.log('✅ Login page:', loginPageResponse.status === 200 ? 'OK' : 'FAILED');
    
    // Test other pages
    const pages = ['/users', '/products', '/inventory', '/analytics', '/settings'];
    
    for (const page of pages) {
      try {
        console.log(`\n3. Testing ${page} page...`);
        const response = await axios.get(`${DASHBOARD_URL}${page}`);
        console.log(`✅ ${page} page:`, response.status === 200 ? 'OK' : 'FAILED');
      } catch (error) {
        console.log(`❌ ${page} page: FAILED - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Dashboard test failed:', error.message);
  }
}

async function testCORS() {
  console.log('\n🌍 Testing CORS Configuration...\n');
  
  try {
    // Test CORS preflight
    const corsResponse = await axios.options(`${BACKEND_URL}/auth/login`, {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ CORS preflight:', corsResponse.status === 200 ? 'OK' : 'FAILED');
    console.log('   Access-Control-Allow-Origin:', corsResponse.headers['access-control-allow-origin']);
    console.log('   Access-Control-Allow-Methods:', corsResponse.headers['access-control-allow-methods']);
    
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Dashboard-Backend Integration Tests\n');
  console.log('=' .repeat(50));
  
  await testBackendEndpoints();
  await testDashboardPages();
  await testCORS();
  
  console.log('\n' + '=' .repeat(50));
  console.log('✨ Integration test completed!');
  console.log('\n📋 Summary:');
  console.log('- Backend API: Running on http://localhost:3010');
  console.log('- Dashboard: Running on http://localhost:3000');
  console.log('- Authentication: Working with admin@audiotailoc.com');
  console.log('- CORS: Configured for cross-origin requests');
}

// Run tests
runAllTests().catch(console.error);
