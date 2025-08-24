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

// Test configuration
const testEndpoints = {
  health: [
    { name: 'Health Check', path: '/health', method: 'GET' },
    { name: 'Health DB', path: '/health/db', method: 'GET' },
    { name: 'Health Redis', path: '/health/redis', method: 'GET' }
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
  
  products: [
    { name: 'Products List', path: '/products', method: 'GET' },
    { name: 'Products with Pagination', path: '/products?page=1&limit=10', method: 'GET' },
    { name: 'Products by Category', path: '/products?category=audio', method: 'GET' },
    { name: 'Featured Products', path: '/products?featured=true', method: 'GET' }
  ],
  
  services: [
    { name: 'Services List', path: '/services', method: 'GET' },
    { name: 'Services with Pagination', path: '/services?page=1&limit=10', method: 'GET' },
    { name: 'Services by Category', path: '/services?category=karaoke', method: 'GET' }
  ],
  
  categories: [
    { name: 'Categories List', path: '/categories', method: 'GET' },
    { name: 'Categories with Products', path: '/categories?include=products', method: 'GET' }
  ],
  
  search: [
    { name: 'Search Products', path: '/search/products?q=audio', method: 'GET' },
    { name: 'Search Services', path: '/search/services?q=karaoke', method: 'GET' },
    { name: 'Search with Filters', path: '/search/products?q=mic&minPrice=100000&maxPrice=500000', method: 'GET' }
  ],
  
  users: [
    { name: 'Users List (Admin)', path: '/users', method: 'GET' },
    { name: 'User Profile', path: '/users/profile', method: 'GET' }
  ],
  
  bookings: [
    { name: 'Bookings List', path: '/bookings', method: 'GET' },
    { name: 'Create Booking', path: '/bookings', method: 'POST', data: {
      serviceId: 1,
      startDate: new Date(Date.now() + 86400000).toISOString(),
      endDate: new Date(Date.now() + 172800000).toISOString(),
      quantity: 1
    }}
  ],
  
  payments: [
    { name: 'Payment Methods', path: '/payments/methods', method: 'GET' },
    { name: 'Payment Intents', path: '/payments/intents', method: 'GET' }
  ],
  
  notifications: [
    { name: 'Notifications List', path: '/notifications', method: 'GET' },
    { name: 'Notifications Settings', path: '/notifications/settings', method: 'GET' }
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
        'User-Agent': 'AudioTàiLộc-API-Test/1.0'
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
    { name: 'Products List (100 items)', path: '/products?limit=100' },
    { name: 'Search with Complex Query', path: '/search/products?q=audio+microphone+wireless&limit=50' },
    { name: 'Categories with Products', path: '/categories?include=products' },
    { name: 'Services with Pagination', path: '/services?page=1&limit=20' }
  ];
  
  for (const test of performanceTests) {
    const startTime = Date.now();
    
    try {
      const response = await axios.get(`${API_BASE}${test.path}`, { timeout: 15000 });
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
}

async function main() {
  log('🚀 Starting Comprehensive Audio Tài Lộc API Test', 'bright');
  log(`📍 API Base URL: ${API_BASE}`, 'cyan');
  
  // Test basic connectivity first
  try {
    await axios.get(`${API_BASE}/health`, { timeout: 5000 });
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
