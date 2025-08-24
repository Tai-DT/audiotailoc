const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${message}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logTest(name, status, details = '') {
  const icon = status === 'success' ? '✅' : status === 'warning' ? '⚠️' : '❌';
  const color = status === 'success' ? 'green' : status === 'warning' ? 'yellow' : 'red';
  log(`${icon} ${name}: ${details}`, color);
}

// Test configuration with correct endpoints and valid enum values
const testEndpoints = {
  health: [
    { name: 'Health Check', path: '/health', method: 'GET' },
    { name: 'Health Database', path: '/health/database', method: 'GET' },
    { name: 'Health Performance', path: '/health/performance', method: 'GET' },
    { name: 'Health System', path: '/health/system', method: 'GET' },
    { name: 'Health Uptime', path: '/health/uptime', method: 'GET' },
    { name: 'Health Version', path: '/health/version', method: 'GET' }
  ],
  
  auth: [
    { name: 'Auth Status', path: '/auth/status', method: 'GET' },
    { name: 'Register', path: '/auth/register', method: 'POST', data: {
      email: 'test@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    }},
    { name: 'Login', path: '/auth/login', method: 'POST', data: {
      email: 'test@example.com',
      password: 'testpassword123'
    }}
  ],
  
  catalog: [
    { name: 'Products List', path: '/catalog/products', method: 'GET' },
    { name: 'Products with Pagination', path: '/catalog/products?page=1&pageSize=10', method: 'GET' },
    { name: 'Products by Category', path: '/catalog/products?categoryId=1', method: 'GET' },
    { name: 'Featured Products', path: '/catalog/products?featured=true', method: 'GET' },
    { name: 'Advanced Search', path: '/catalog/search/advanced?q=audio', method: 'GET' }
  ],
  
  services: [
    { name: 'Services List', path: '/services', method: 'GET' },
    { name: 'Services with Pagination', path: '/services?page=1&pageSize=10', method: 'GET' },
    { name: 'Services by Category (RENTAL)', path: '/services?category=RENTAL', method: 'GET' },
    { name: 'Services by Category (INSTALLATION)', path: '/services?category=INSTALLATION', method: 'GET' },
    { name: 'Service Categories', path: '/services/categories', method: 'GET' },
    { name: 'Service Types', path: '/services/types', method: 'GET' },
    { name: 'Service Stats', path: '/services/stats', method: 'GET' }
  ],
  
  categories: [
    { name: 'Categories List', path: '/catalog/categories', method: 'GET' },
    { name: 'Categories with Products', path: '/catalog/categories?include=products', method: 'GET' }
  ],
  
  search: [
    { name: 'Search Products', path: '/search/products?q=audio', method: 'GET' },
    { name: 'Search Services', path: '/search/services?q=audio', method: 'GET' },
    { name: 'Search with Filters', path: '/search/products?q=mic&minPrice=100000&maxPrice=500000', method: 'GET' }
  ],
  
  users: [
    { name: 'Users List (Admin)', path: '/users', method: 'GET' },
    { name: 'User Profile', path: '/users/profile', method: 'GET' }
  ],
  
  bookings: [
    { name: 'Bookings List', path: '/bookings', method: 'GET' },
    { name: 'Create Booking', path: '/bookings', method: 'POST', data: {
      serviceId: '1',
      customerName: 'Nguyễn Văn Test',
      customerPhone: '0123456789',
      customerEmail: 'test@example.com',
      customerAddress: '123 Đường Test, Quận 1, TP.HCM',
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduledTime: '14:00',
      notes: 'Test booking for API testing'
    }}
  ],
  
  payments: [
    { name: 'Payment Methods', path: '/payments/methods', method: 'GET' },
    { name: 'Payment Intents', path: '/payments/intents', method: 'GET' },
    { name: 'Payment Status', path: '/payments/status', method: 'GET' }
  ],
  
  notifications: [
    { name: 'Notifications List', path: '/notifications', method: 'GET' },
    { name: 'Notifications Settings', path: '/notifications/settings', method: 'GET' }
  ],
  
  orders: [
    { name: 'Orders List', path: '/orders', method: 'GET' },
    { name: 'Create Order', path: '/orders', method: 'POST', data: {
      items: [{ productId: 1, quantity: 1 }],
      shippingAddress: 'Test Address'
    }}
  ],
  
  cart: [
    { name: 'Cart Items', path: '/cart', method: 'GET' },
    { name: 'Add to Cart', path: '/cart/items', method: 'POST', data: {
      productId: 1,
      quantity: 1
    }}
  ]
};

async function testEndpoint(endpoint) {
  const startTime = Date.now();
  const url = `${API_BASE}${endpoint.path}`;
  
  try {
    const config = {
      method: endpoint.method,
      url: url,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AudioTailoc-API-Test/1.0'
      }
    };
    
    if (endpoint.data) {
      config.data = endpoint.data;
    }
    
    const response = await axios(config);
    const duration = Date.now() - startTime;
    
    const status = response.status >= 200 && response.status < 300 ? 'success' : 'warning';
    const details = `${response.status} (${duration}ms)`;
    
    return { name: endpoint.name, status, details, response: response.data };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const statusCode = error.response?.status || 'NETWORK_ERROR';
    const details = `${statusCode} (${duration}ms) - ${error.message}`;
    
    return { name: endpoint.name, status: 'error', details, error: error.message };
  }
}

async function testCategory(categoryName, endpoints) {
  logHeader(`${categoryName.toUpperCase()} ENDPOINTS`);
  
  const results = [];
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    logTest(result.name, result.status, result.details);
    results.push(result);
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

async function runPerformanceTest() {
  logHeader('PERFORMANCE TESTS');
  
  const performanceTests = [
    { name: 'Products List (100 items)', path: '/catalog/products?pageSize=100' },
    { name: 'Search with Complex Query', path: '/search/products?q=audio+microphone+wireless&limit=50' },
    { name: 'Services with Pagination', path: '/services?page=1&pageSize=20' },
    { name: 'Advanced Search', path: '/catalog/search/advanced?q=audio&pageSize=50' }
  ];
  
  for (const test of performanceTests) {
    const startTime = Date.now();
    
    try {
      const response = await axios.get(`${API_BASE}${test.path}`, { 
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AudioTailoc-API-Test/1.0'
        }
      });
      const duration = Date.now() - startTime;
      
      let status = 'success';
      let performance = 'Fast';
      
      if (duration > 3000) {
        status = 'error';
        performance = 'Very Slow';
      } else if (duration > 1000) {
        status = 'warning';
        performance = 'Slow';
      }
      
      logTest(test.name, status, `${duration}ms (${performance})`);
      
    } catch (error) {
      logTest(test.name, 'error', `Failed: ${error.message}`);
    }
  }
}

async function generateReport(allResults) {
  logHeader('TEST SUMMARY REPORT');
  
  const summary = {
    total: 0,
    success: 0,
    warning: 0,
    error: 0
  };
  
  allResults.forEach(categoryResults => {
    categoryResults.forEach(result => {
      summary.total++;
      summary[result.status]++;
    });
  });
  
  log(`📊 Total Tests: ${summary.total}`, 'bright');
  log(`✅ Successful: ${summary.success}`, 'green');
  log(`⚠️  Warnings: ${summary.warning}`, 'yellow');
  log(`❌ Errors: ${summary.error}`, 'red');
  
  const successRate = ((summary.success / summary.total) * 100).toFixed(1);
  log(`📈 Success Rate: ${successRate}%`, 'bright');
  
  // Show errors
  if (summary.error > 0) {
    log('\n❌ Failed Endpoints:', 'red');
    allResults.forEach(categoryResults => {
      categoryResults.forEach(result => {
        if (result.status === 'error') {
          log(`   - ${result.name}: ${result.error || 'Request failed'}`, 'red');
        }
      });
    });
  }
  
  // Show warnings
  if (summary.warning > 0) {
    log('\n⚠️  Endpoints with Warnings:', 'yellow');
    allResults.forEach(categoryResults => {
      categoryResults.forEach(result => {
        if (result.status === 'warning') {
          log(`   - ${result.name}: ${result.details}`, 'yellow');
        }
      });
    });
  }
  
  // Show successful endpoints
  if (summary.success > 0) {
    log('\n✅ Working Endpoints:', 'green');
    allResults.forEach(categoryResults => {
      categoryResults.forEach(result => {
        if (result.status === 'success') {
          log(`   - ${result.name}: ${result.details}`, 'green');
        }
      });
    });
  }
}

async function main() {
  log('🚀 Starting Corrected Audio Tài Lộc API Test', 'bright');
  log(`📍 API Base URL: ${API_BASE}`, 'cyan');
  
  // Test basic connectivity first
  try {
    await axios.get(`${API_BASE}/health`, { 
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AudioTailoc-API-Test/1.0'
      }
    });
    log('✅ API server is reachable', 'green');
  } catch (error) {
    log('❌ API server is not reachable', 'red');
    log('💡 Make sure the backend server is running on port 3010', 'yellow');
    process.exit(1);
  }
  
  const allResults = [];
  
  // Test each category
  for (const [categoryName, endpoints] of Object.entries(testEndpoints)) {
    const results = await testCategory(categoryName, endpoints);
    allResults.push(results);
  }
  
  // Run performance tests
  await runPerformanceTest();
  
  // Generate final report
  await generateReport(allResults);
  
  log('\n🎉 API testing completed!', 'bright');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`❌ Unhandled rejection: ${error.message}`, 'red');
  process.exit(1);
});

// Run tests
main().catch(error => {
  log(`❌ Test runner failed: ${error.message}`, 'red');
  process.exit(1);
});
