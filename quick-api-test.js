const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

async function testAPI() {
  console.log('🔍 Testing Audio Tài Lộc API...\n');
  
  const tests = [
    { name: 'Health Check', url: `${API_BASE}/health` },
    { name: 'Products', url: `${API_BASE}/products` },
    { name: 'Services', url: `${API_BASE}/services` },
    { name: 'Categories', url: `${API_BASE}/categories` },
    { name: 'Search', url: `${API_BASE}/search/products?q=audio` }
  ];
  
  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await axios.get(test.url, { timeout: 5000 });
      console.log(`✅ ${test.name}: ${response.status} - ${response.data?.length || 'OK'}\n`);
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.response?.status || 'Connection failed'} - ${error.message}\n`);
    }
  }
}

testAPI();
