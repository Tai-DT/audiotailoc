const axios = require('axios');

const BACKEND_URL = 'http://localhost:3010/api/v1';
const DASHBOARD_URL = 'http://localhost:3001';

// Test configuration
const TEST_USER = {
  email: 'admin@audiotailoc.com',
  password: 'Admin123!'
};

let authToken = null;

// Utility functions
const log = (message, type = 'INFO') => {
  const timestamp = new Date().toISOString();
  const color = type === 'ERROR' ? '\x1b[31m' : type === 'SUCCESS' ? '\x1b[32m' : type === 'WARNING' ? '\x1b[33m' : '\x1b[36m';
  console.log(`${color}[${timestamp}] ${type}: ${message}\x1b[0m`);
};

const testEndpoint = async (method, endpoint, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url: `${BACKEND_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      status: error.response?.status, 
      error: error.response?.data || error.message 
    };
  }
};

const testDashboardPage = async (path) => {
  try {
    const response = await axios.get(`${DASHBOARD_URL}${path}`);
    return { success: true, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      status: error.response?.status, 
      error: error.message 
    };
  }
};

// Test functions
async function testBackendHealth() {
  log('Testing backend health...');
  const result = await testEndpoint('GET', '/health');
  
  if (result.success) {
    log('✅ Backend is healthy', 'SUCCESS');
    return true;
  } else {
    log(`❌ Backend health check failed: ${result.error}`, 'ERROR');
    return false;
  }
}

async function testAuthentication() {
  log('Testing authentication system...');
  
  // Test login
  const loginResult = await testEndpoint('POST', '/auth/login', {
    email: TEST_USER.email,
    password: TEST_USER.password
  });
  
  if (loginResult.success) {
    authToken = loginResult.data.accessToken;
    log('✅ Login successful', 'SUCCESS');
  } else {
    log(`❌ Login failed: ${loginResult.error}`, 'ERROR');
    return false;
  }
  
  // Test get current user
  const meResult = await testEndpoint('GET', '/auth/me', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (meResult.success) {
    log('✅ Get current user successful', 'SUCCESS');
    log(`User: ${meResult.data.email} (${meResult.data.role})`, 'INFO');
  } else {
    log(`❌ Get current user failed: ${meResult.error}`, 'ERROR');
  }
  
  return true;
}

async function testPasswordFeatures() {
  log('Testing password management features...');
  
  // Test forgot password
  const forgotResult = await testEndpoint('POST', '/auth/forgot-password', {
    email: TEST_USER.email
  });
  
  if (forgotResult.success) {
    log('✅ Forgot password request successful', 'SUCCESS');
  } else {
    log(`❌ Forgot password failed: ${forgotResult.error}`, 'ERROR');
  }
  
  // Test change password
  const changeResult = await testEndpoint('PUT', '/auth/change-password', {
    currentPassword: TEST_USER.password,
    newPassword: 'NewPassword123!'
  }, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (changeResult.success) {
    log('✅ Change password successful', 'SUCCESS');
    
    // Test login with new password
    const newLoginResult = await testEndpoint('POST', '/auth/login', {
      email: TEST_USER.email,
      password: 'NewPassword123!'
    });
    
    if (newLoginResult.success) {
      log('✅ Login with new password successful', 'SUCCESS');
      
      // Change back to original password
      const revertResult = await testEndpoint('PUT', '/auth/change-password', {
        currentPassword: 'NewPassword123!',
        newPassword: TEST_USER.password
      }, {
        'Authorization': `Bearer ${newLoginResult.data.accessToken}`
      });
      
      if (revertResult.success) {
        log('✅ Password reverted to original', 'SUCCESS');
      } else {
        log(`❌ Password revert failed: ${revertResult.error}`, 'ERROR');
      }
    } else {
      log(`❌ Login with new password failed: ${newLoginResult.error}`, 'ERROR');
    }
  } else {
    log(`❌ Change password failed: ${changeResult.error}`, 'ERROR');
  }
  
  return true;
}

async function testUserManagement() {
  log('Testing user management...');
  
  const usersResult = await testEndpoint('GET', '/users', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (usersResult.success) {
    log('✅ Get users list successful', 'SUCCESS');
    log(`Found ${usersResult.data.length} users`, 'INFO');
  } else {
    log(`❌ Get users failed: ${usersResult.error}`, 'ERROR');
  }
  
  return true;
}

async function testDashboardPages() {
  log('Testing dashboard pages...');
  
  const pages = [
    '/',
    '/login',
    '/forgot-password',
    '/reset-password',
    '/dashboard',
    '/products',
    '/users',
    '/categories',
    '/settings',
    '/analytics',
    '/inventory',
    '/orders'
  ];
  
  for (const page of pages) {
    const result = await testDashboardPage(page);
    if (result.success) {
      log(`✅ Page ${page} accessible`, 'SUCCESS');
    } else {
      log(`❌ Page ${page} failed (${result.status}): ${result.error}`, 'ERROR');
    }
  }
  
  return true;
}

async function testAPIEndpoints() {
  log('Testing API endpoints...');
  
  const endpoints = [
    { method: 'GET', path: '/health', auth: false },
    { method: 'POST', path: '/auth/login', auth: false },
    { method: 'GET', path: '/auth/me', auth: true },
    { method: 'POST', path: '/auth/forgot-password', auth: false },
    { method: 'PUT', path: '/auth/change-password', auth: true },
    { method: 'GET', path: '/users', auth: true },
    { method: 'GET', path: '/products', auth: false },
    { method: 'GET', path: '/categories', auth: false }
  ];
  
  for (const endpoint of endpoints) {
    const headers = endpoint.auth && authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
    const result = await testEndpoint(endpoint.method, endpoint.path, null, headers);
    
    if (result.success) {
      log(`✅ ${endpoint.method} ${endpoint.path} working`, 'SUCCESS');
    } else {
      log(`❌ ${endpoint.method} ${endpoint.path} failed (${result.status})`, 'ERROR');
    }
  }
  
  return true;
}

async function testIntegration() {
  log('Testing frontend-backend integration...');
  
  // Test if dashboard can make API calls
  try {
    const response = await axios.get(`${DASHBOARD_URL}/api/healthz`);
    if (response.status === 200) {
      log('✅ Dashboard API health check working', 'SUCCESS');
    } else {
      log('❌ Dashboard API health check failed', 'ERROR');
    }
  } catch (error) {
    log('❌ Dashboard API health check failed', 'ERROR');
  }
  
  return true;
}

async function generateReport() {
  log('Generating comprehensive test report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    backend: {
      url: BACKEND_URL,
      status: 'unknown'
    },
    dashboard: {
      url: DASHBOARD_URL,
      status: 'unknown'
    },
    features: {
      authentication: false,
      passwordManagement: false,
      userManagement: false,
      dashboardPages: false,
      apiEndpoints: false,
      integration: false
    },
    summary: ''
  };
  
  // Test backend health
  const backendHealth = await testBackendHealth();
  report.backend.status = backendHealth ? 'healthy' : 'unhealthy';
  
  // Test dashboard accessibility
  const dashboardHealth = await testDashboardPage('/');
  report.dashboard.status = dashboardHealth.success ? 'accessible' : 'inaccessible';
  
  // Test features
  if (backendHealth) {
    report.features.authentication = await testAuthentication();
    report.features.passwordManagement = await testPasswordFeatures();
    report.features.userManagement = await testUserManagement();
    report.features.apiEndpoints = await testAPIEndpoints();
  }
  
  report.features.dashboardPages = await testDashboardPages();
  report.features.integration = await testIntegration();
  
  // Generate summary
  const passedTests = Object.values(report.features).filter(Boolean).length;
  const totalTests = Object.keys(report.features).length;
  const percentage = Math.round((passedTests / totalTests) * 100);
  
  report.summary = `${passedTests}/${totalTests} tests passed (${percentage}%)`;
  
  // Print report
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE TEST REPORT');
  console.log('='.repeat(60));
  console.log(`Backend: ${report.backend.status.toUpperCase()}`);
  console.log(`Dashboard: ${report.dashboard.status.toUpperCase()}`);
  console.log('');
  console.log('Feature Tests:');
  Object.entries(report.features).forEach(([feature, status]) => {
    const icon = status ? '✅' : '❌';
    console.log(`  ${icon} ${feature}: ${status ? 'PASSED' : 'FAILED'}`);
  });
  console.log('');
  console.log(`Overall: ${report.summary}`);
  console.log('='.repeat(60));
  
  return report;
}

// Main test execution
async function runAllTests() {
  log('Starting comprehensive dashboard-backend integration test...');
  
  try {
    const report = await generateReport();
    
    if (report.backend.status === 'healthy' && report.dashboard.status === 'accessible') {
      log('🎉 Basic connectivity established!', 'SUCCESS');
    } else {
      log('⚠️ Basic connectivity issues detected', 'WARNING');
    }
    
    const passedFeatures = Object.values(report.features).filter(Boolean).length;
    if (passedFeatures >= 4) {
      log('🎉 Dashboard-backend integration is working well!', 'SUCCESS');
    } else if (passedFeatures >= 2) {
      log('⚠️ Dashboard-backend integration needs improvement', 'WARNING');
    } else {
      log('❌ Dashboard-backend integration has significant issues', 'ERROR');
    }
    
    return report;
  } catch (error) {
    log(`❌ Test execution failed: ${error.message}`, 'ERROR');
    return null;
  }
}

// Run tests
runAllTests().catch(console.error);
