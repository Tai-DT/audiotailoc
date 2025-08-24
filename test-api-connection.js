#!/usr/bin/env node

/**
 * Script kiểm tra kết nối API toàn diện
 * Kiểm tra backend, dashboard và các endpoint quan trọng
 */

const https = require('https');
const http = require('http');

// Cấu hình
const config = {
  backend: {
    baseUrl: 'http://localhost:3010',
    endpoints: [
      '/api/v1/health',
      '/api/v1/catalog/products?pageSize=1',
      '/api/v1/users?pageSize=1',
      '/api/v1/orders?pageSize=1',
      '/docs'
    ]
  },
  dashboard: {
    baseUrl: 'http://localhost:3001',
    endpoints: [
      '/',
      '/vi',
      '/login',
      '/dashboard'
    ]
  }
};

// Colors cho console
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

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'API-Connection-Tester/1.0',
        ...options.headers
      },
      timeout: 10000
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });

    req.on('error', (error) => {
      reject({
        error: error.message,
        url: url
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        url: url
      });
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testEndpoint(baseUrl, endpoint, description) {
  const url = `${baseUrl}${endpoint}`;
  
  try {
    log(`🔍 Testing: ${description}`, 'cyan');
    log(`   URL: ${url}`, 'blue');
    
    const response = await makeRequest(url);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      log(`   ✅ Status: ${response.statusCode} - SUCCESS`, 'green');
      
      // Kiểm tra response data
      if (response.data) {
        try {
          const jsonData = JSON.parse(response.data);
          if (jsonData.success !== undefined) {
            log(`   📊 API Response: ${jsonData.success ? 'Success' : 'Error'}`, 
                jsonData.success ? 'green' : 'yellow');
          }
          if (jsonData.data) {
            log(`   📦 Data available: ${typeof jsonData.data}`, 'green');
          }
        } catch (e) {
          // Không phải JSON, có thể là HTML
          if (response.data.includes('<!DOCTYPE html>')) {
            log(`   📄 HTML Response: ${response.data.length} bytes`, 'green');
          } else {
            log(`   📄 Text Response: ${response.data.length} bytes`, 'green');
          }
        }
      }
    } else if (response.statusCode === 403) {
      log(`   ⚠️  Status: ${response.statusCode} - FORBIDDEN (Authentication required)`, 'yellow');
    } else if (response.statusCode === 404) {
      log(`   ❌ Status: ${response.statusCode} - NOT FOUND`, 'red');
    } else {
      log(`   ⚠️  Status: ${response.statusCode} - UNEXPECTED`, 'yellow');
    }
    
    return { success: true, statusCode: response.statusCode };
    
  } catch (error) {
    log(`   ❌ Error: ${error.error}`, 'red');
    return { success: false, error: error.error };
  }
}

async function testBackendConnection() {
  log('\n🚀 TESTING BACKEND CONNECTION', 'bright');
  log('=' .repeat(50), 'blue');
  
  const results = [];
  
  for (const endpoint of config.backend.endpoints) {
    const description = endpoint === '/api/v1/health' ? 'Health Check' :
                       endpoint.includes('/catalog') ? 'Products API' :
                       endpoint.includes('/users') ? 'Users API' :
                       endpoint.includes('/orders') ? 'Orders API' :
                       endpoint === '/docs' ? 'API Documentation' : 'Unknown';
    
    const result = await testEndpoint(config.backend.baseUrl, endpoint, description);
    results.push({ endpoint, ...result });
    
    // Delay giữa các request
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

async function testDashboardConnection() {
  log('\n🎨 TESTING DASHBOARD CONNECTION', 'bright');
  log('=' .repeat(50), 'blue');
  
  const results = [];
  
  for (const endpoint of config.dashboard.endpoints) {
    const description = endpoint === '/' ? 'Dashboard Root' :
                       endpoint === '/vi' ? 'Dashboard Vietnamese' :
                       endpoint === '/login' ? 'Login Page' :
                       endpoint === '/dashboard' ? 'Dashboard Page' : 'Unknown';
    
    const result = await testEndpoint(config.dashboard.baseUrl, endpoint, description);
    results.push({ endpoint, ...result });
    
    // Delay giữa các request
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

async function testApiIntegration() {
  log('\n🔗 TESTING API INTEGRATION', 'bright');
  log('=' .repeat(50), 'blue');
  
  try {
    // Test login API
    log('🔐 Testing Login API', 'cyan');
    const loginUrl = `${config.backend.baseUrl}/api/v1/auth/login`;
    const loginData = JSON.stringify({
      email: 'admin@audiotailoc.com',
      password: 'admin123'
    });
    
    const loginResponse = await makeRequest(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: loginData
    });
    
    if (loginResponse.statusCode === 200) {
      log('   ✅ Login API: SUCCESS', 'green');
      try {
        const loginResult = JSON.parse(loginResponse.data);
        if (loginResult.accessToken) {
          log('   🔑 Access Token: Available', 'green');
          
          // Test authenticated endpoint
          log('   🔒 Testing Authenticated Request', 'cyan');
          const authResponse = await makeRequest(`${config.backend.baseUrl}/api/v1/users?pageSize=1`, {
            headers: {
              'Authorization': `Bearer ${loginResult.accessToken}`
            }
          });
          
          if (authResponse.statusCode === 200) {
            log('   ✅ Authenticated Request: SUCCESS', 'green');
          } else {
            log(`   ⚠️  Authenticated Request: ${authResponse.statusCode}`, 'yellow');
          }
        }
      } catch (e) {
        log('   ⚠️  Could not parse login response', 'yellow');
      }
    } else {
      log(`   ❌ Login API: ${loginResponse.statusCode}`, 'red');
    }
    
  } catch (error) {
    log(`   ❌ Login API Error: ${error.error}`, 'red');
  }
}

function generateReport(backendResults, dashboardResults) {
  log('\n📊 CONNECTION TEST REPORT', 'bright');
  log('=' .repeat(50), 'blue');
  
  // Backend Summary
  const backendSuccess = backendResults.filter(r => r.success && r.statusCode >= 200 && r.statusCode < 300).length;
  const backendTotal = backendResults.length;
  
  log(`\n🔧 Backend API: ${backendSuccess}/${backendTotal} endpoints working`, 
      backendSuccess === backendTotal ? 'green' : 'yellow');
  
  backendResults.forEach(result => {
    const status = result.success && result.statusCode >= 200 && result.statusCode < 300 ? '✅' : 
                   result.statusCode === 403 ? '🔒' : '❌';
    log(`   ${status} ${result.endpoint}`, result.success ? 'green' : 'red');
  });
  
  // Dashboard Summary
  const dashboardSuccess = dashboardResults.filter(r => r.success && r.statusCode >= 200 && r.statusCode < 300).length;
  const dashboardTotal = dashboardResults.length;
  
  log(`\n🎨 Dashboard: ${dashboardSuccess}/${dashboardTotal} pages accessible`, 
      dashboardSuccess === dashboardTotal ? 'green' : 'yellow');
  
  dashboardResults.forEach(result => {
    const status = result.success && result.statusCode >= 200 && result.statusCode < 300 ? '✅' : '❌';
    log(`   ${status} ${result.endpoint}`, result.success ? 'green' : 'red');
  });
  
  // Overall Status
  const totalSuccess = backendSuccess + dashboardSuccess;
  const totalEndpoints = backendTotal + dashboardTotal;
  
  log(`\n🎯 Overall Status: ${totalSuccess}/${totalEndpoints} endpoints working`, 
      totalSuccess === totalEndpoints ? 'green' : 
      totalSuccess > totalEndpoints * 0.7 ? 'yellow' : 'red');
  
  // Recommendations
  log('\n💡 RECOMMENDATIONS:', 'bright');
  
  if (backendSuccess < backendTotal) {
    log('   🔧 Backend issues detected:', 'yellow');
    backendResults.filter(r => !r.success || (r.statusCode < 200 || r.statusCode >= 300)).forEach(result => {
      log(`      - Check ${result.endpoint}`, 'red');
    });
  }
  
  if (dashboardSuccess < dashboardTotal) {
    log('   🎨 Dashboard issues detected:', 'yellow');
    dashboardResults.filter(r => !r.success || (r.statusCode < 200 || r.statusCode >= 300)).forEach(result => {
      log(`      - Check ${result.endpoint}`, 'red');
    });
  }
  
  if (totalSuccess === totalEndpoints) {
    log('   ✅ All systems operational!', 'green');
  }
}

async function main() {
  log('🔍 AUDIOTAILOC API CONNECTION TESTER', 'bright');
  log('=' .repeat(50), 'blue');
  log(`⏰ Started at: ${new Date().toLocaleString('vi-VN')}`, 'cyan');
  
  try {
    // Test Backend
    const backendResults = await testBackendConnection();
    
    // Test Dashboard
    const dashboardResults = await testDashboardConnection();
    
    // Test API Integration
    await testApiIntegration();
    
    // Generate Report
    generateReport(backendResults, dashboardResults);
    
  } catch (error) {
    log(`\n❌ Test failed: ${error.message}`, 'red');
    process.exit(1);
  }
  
  log(`\n⏰ Completed at: ${new Date().toLocaleString('vi-VN')}`, 'cyan');
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testBackendConnection, testDashboardConnection, testApiIntegration };
