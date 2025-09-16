const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';

const endpoints = [
  { path: '/health', description: 'Health Check' },
  { path: '/', description: 'Root' },
  { path: '/users', description: 'Users' },
  { path: '/catalog/products', description: 'Products' },
  { path: '/orders', description: 'Orders' },
  { path: '/services', description: 'Services' },
  { path: '/cart', description: 'Cart' },
  { path: '/payments/methods', description: 'Payments' },
  { path: '/search', description: 'Search' },
  { path: '/files', description: 'Files' },
  { path: '/notifications', description: 'Notifications' },
  { path: '/support/tickets', description: 'Support' },
  { path: '/analytics/overview', description: 'Analytics' },
  { path: '/admin/dashboard', description: 'Admin' },
  { path: '/monitoring/metrics', description: 'Monitoring' },
  { path: '/testing/health', description: 'Testing' },
  { path: '/ai/chat', description: 'AI' },
  { path: '/maps/locations', description: 'Maps' },
  { path: '/promotions', description: 'Promotions' },
  { path: '/inventory', description: 'Inventory' },
  { path: '/technicians', description: 'Technicians' },
  { path: '/projects', description: 'Projects' },
  { path: '/pages', description: 'Pages' },
  { path: '/chat/sessions', description: 'Chat' },
  { path: '/customer/profile', description: 'Customer' },
  { path: '/checkout/cart', description: 'Checkout' },
  { path: '/customer-insights/overview', description: 'Customer Insights' },
  { path: '/data-collection/events', description: 'Data Collection' },
  { path: '/documentation', description: 'Documentation' },
  { path: '/graceful-shutdown/status', description: 'Graceful Shutdown' },
  { path: '/api-versioning/info', description: 'API Versioning' },
  { path: '/i18n/languages', description: 'I18n' },
  { path: '/integrations/status', description: 'Integrations' },
  { path: '/logger/status', description: 'Logger' },
  { path: '/logging/status', description: 'Logging' },
  { path: '/marketing/campaigns', description: 'Marketing' },
  { path: '/seo/meta', description: 'SEO' },
  { path: '/security/status', description: 'Security' },
  { path: '/system/info', description: 'System' },
  { path: '/booking/slots', description: 'Booking' },
  { path: '/cache/status', description: 'Cache' },
  { path: '/caching/status', description: 'Caching' },
];

async function testEndpoint(endpoint) {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint.path}`, { timeout: 3000 });
    return { success: true, status: response.status, path: endpoint.path, description: endpoint.description };
  } catch (error) {
    return { 
      success: false, 
      status: error.response?.status || 'ERROR', 
      path: endpoint.path, 
      description: endpoint.description,
      error: error.response?.data?.message || error.message 
    };
  }
}

async function testAll() {
  console.log('🚀 Testing all modules...\n');
  
  const results = [];
  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint.description}`);
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.status} - ${result.description}`);
    } else {
      console.log(`❌ ${result.status} - ${result.description}: ${result.error}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n📊 Summary: ${successful.length}/${results.length} working (${((successful.length/results.length)*100).toFixed(1)}%)`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed:');
    failed.forEach(f => console.log(`  - ${f.path}: ${f.error}`));
  }
}

testAll().catch(console.error);
