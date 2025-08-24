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
    return true;
  } catch (error) {
    console.log(`❌ ${name}: ${error.response?.status || 'ERROR'} - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Testing new endpoints...\n');
  
  const tests = [
    { name: 'Auth Status', path: '/auth/status' },
    { name: 'Payment Methods', path: '/payments/methods' },
    { name: 'Payment Status', path: '/payments/status' },
    { name: 'Notifications List', path: '/notifications' },
    { name: 'Notifications Settings', path: '/notifications/settings' },
    { name: 'Search Services', path: '/search/services?q=audio' },
    { name: 'Cart Items', path: '/cart' },
    { name: 'Create Order', path: '/orders', method: 'POST', data: {
      items: [{ productId: '1', quantity: 1 }],
      shippingAddress: 'Test Address'
    }},
    { name: 'Create Booking', path: '/bookings', method: 'POST', data: {
      serviceId: '1',
      customerName: 'Test User',
      customerPhone: '0123456789',
      customerAddress: 'Test Address',
      scheduledDate: '2025-08-23',
      scheduledTime: '14:00'
    }}
  ];
  
  let successCount = 0;
  
  for (const test of tests) {
    const success = await testEndpoint(test.name, test.path, test.method, test.data);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Results: ${successCount}/${tests.length} endpoints working`);
}

main().catch(console.error);
