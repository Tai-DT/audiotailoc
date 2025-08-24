const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

async function testEndpoint(name, path, method = 'GET', data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE}${path}`,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    console.log(`✅ ${name}: ${response.status}`);
    return { success: true, status: response.status };
  } catch (error) {
    console.log(`❌ ${name}: ${error.response?.status || 'ERROR'} - ${error.message}`);
    return { success: false, status: error.response?.status || 'ERROR' };
  }
}

async function main() {
  console.log('🧪 Final API Test - Audio Tài Lộc\n');
  
  const tests = [
    // Health endpoints
    { name: 'Health Check', path: '/health' },
    { name: 'Health Uptime', path: '/health/uptime' },
    { name: 'Health Version', path: '/health/version' },
    
    // Auth endpoints
    { name: 'Auth Status', path: '/auth/status' },
    
    // Catalog endpoints
    { name: 'Products List', path: '/catalog/products' },
    { name: 'Categories List', path: '/catalog/categories' },
    { name: 'Advanced Search', path: '/catalog/search/advanced?q=audio' },
    
    // Services endpoints
    { name: 'Services List', path: '/services' },
    { name: 'Service Categories', path: '/services/categories' },
    { name: 'Service Types', path: '/services/types' },
    { name: 'Service Stats', path: '/services/stats' },
    
    // Search endpoints
    { name: 'Search Products', path: '/search/products?q=audio' },
    { name: 'Search Services', path: '/search/services?q=audio' },
    
    // Bookings endpoints
    { name: 'Bookings List', path: '/bookings' },
    
    // Payments endpoints
    { name: 'Payment Methods', path: '/payments/methods' },
    { name: 'Payment Status', path: '/payments/status' },
    { name: 'Payment Intents', path: '/payments/intents' },
    
    // Notifications endpoints
    { name: 'Notifications List', path: '/notifications' },
    { name: 'Notifications Settings', path: '/notifications/settings' },
    
    // Cart endpoints
    { name: 'Cart Items', path: '/cart' },
    
    // Test POST endpoints
    { name: 'Create Order', path: '/orders', method: 'POST', data: {
      items: [{ productId: 'test-product', quantity: 1 }],
      shippingAddress: 'Test Address'
    }},
    { name: 'Add to Cart', path: '/cart/items', method: 'POST', data: {
      productId: 'test-product',
      quantity: 1
    }}
  ];
  
  let successCount = 0;
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.path, test.method, test.data);
    results.push({ ...test, ...result });
    if (result.success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Final Results: ${successCount}/${tests.length} endpoints working (${((successCount/tests.length)*100).toFixed(1)}%)`);
  
  // Show failed endpoints
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed Endpoints:');
    failed.forEach(f => {
      console.log(`   - ${f.name}: ${f.status}`);
    });
  }
  
  // Show working endpoints
  const working = results.filter(r => r.success);
  if (working.length > 0) {
    console.log('\n✅ Working Endpoints:');
    working.forEach(w => {
      console.log(`   - ${w.name}: ${w.status}`);
    });
  }
  
  // Performance summary
  console.log('\n🚀 Performance Summary:');
  console.log(`   - Total endpoints tested: ${tests.length}`);
  console.log(`   - Success rate: ${((successCount/tests.length)*100).toFixed(1)}%`);
  console.log(`   - Backend status: ${successCount > 0 ? '✅ Operational' : '❌ Issues detected'}`);
  
  if (successCount >= tests.length * 0.7) {
    console.log('\n🎉 Backend is ready for frontend development!');
  } else if (successCount >= tests.length * 0.5) {
    console.log('\n⚠️  Backend has some issues but core functionality works');
  } else {
    console.log('\n❌ Backend needs more work before frontend development');
  }
}

main().catch(console.error);
