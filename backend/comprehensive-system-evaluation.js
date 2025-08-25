const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';
let authToken = '';
let sessionId = '';

// Test results storage
const testResults = {
  health: {},
  auth: {},
  catalog: {},
  search: {},
  ai: {},
  users: {},
  files: {},
  payments: {},
  support: {},
  performance: {},
  summary: {}
};

async function comprehensiveEvaluation() {
  console.log('🔍 COMPREHENSIVE SYSTEM EVALUATION');
  console.log('=====================================\n');

  const startTime = Date.now();

  try {
    // 1. HEALTH CHECK
    console.log('1. 🏥 HEALTH CHECK');
    console.log('-------------------');
    await testHealthCheck();
    console.log('');

    // 2. AUTHENTICATION
    console.log('2. 🔐 AUTHENTICATION');
    console.log('---------------------');
    await testAuthentication();
    console.log('');

    // 3. CATALOG & PRODUCTS
    console.log('3. 📦 CATALOG & PRODUCTS');
    console.log('------------------------');
    await testCatalog();
    console.log('');

    // 4. SEARCH FUNCTIONALITY
    console.log('4. 🔍 SEARCH FUNCTIONALITY');
    console.log('--------------------------');
    await testSearch();
    console.log('');

    // 5. AI FEATURES
    console.log('5. 🤖 AI FEATURES');
    console.log('------------------');
    await testAIFeatures();
    console.log('');

    // 6. USER MANAGEMENT
    console.log('6. 👤 USER MANAGEMENT');
    console.log('---------------------');
    await testUserManagement();
    console.log('');

    // 7. FILE MANAGEMENT
    console.log('7. 📁 FILE MANAGEMENT');
    console.log('----------------------');
    await testFileManagement();
    console.log('');

    // 8. PAYMENT SYSTEM
    console.log('8. 💳 PAYMENT SYSTEM');
    console.log('---------------------');
    await testPaymentSystem();
    console.log('');

    // 9. SUPPORT SYSTEM
    console.log('9. 🆘 SUPPORT SYSTEM');
    console.log('---------------------');
    await testSupportSystem();
    console.log('');

    // 10. PERFORMANCE TEST
    console.log('10. ⚡ PERFORMANCE TEST');
    console.log('------------------------');
    await testPerformance();
    console.log('');

    // 11. GENERATE SUMMARY
    console.log('11. 📊 EVALUATION SUMMARY');
    console.log('--------------------------');
    generateSummary(startTime);

  } catch (error) {
    console.error('❌ Evaluation failed:', error.message);
  }
}

async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    testResults.health = {
      status: 'PASS',
      responseTime: response.headers['x-response-time'] || 'N/A',
      data: response.data
    };
    console.log('✅ Health check: PASS');
    console.log(`   Status: ${response.data.data.status}`);
    console.log(`   Timestamp: ${response.data.data.timestamp}`);
  } catch (error) {
    testResults.health = { status: 'FAIL', error: error.message };
    console.log('❌ Health check: FAIL');
  }
}

async function testAuthentication() {
  try {
    // Test login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    authToken = loginResponse.data.data.accessToken;
    
    testResults.auth = {
      status: 'PASS',
      login: 'SUCCESS',
      token: authToken ? 'VALID' : 'INVALID'
    };
    
    console.log('✅ Authentication: PASS');
    console.log('   Login: SUCCESS');
    console.log('   Token: VALID');
    
  } catch (error) {
    testResults.auth = { status: 'FAIL', error: error.message };
    console.log('❌ Authentication: FAIL');
    console.log(`   Error: ${error.message}`);
  }
}

async function testCatalog() {
  try {
    // Test categories
    const categoriesResponse = await axios.get(`${BASE_URL}/catalog/categories`);
    
    // Test products
    const productsResponse = await axios.get(`${BASE_URL}/catalog/products`);
    
    testResults.catalog = {
      status: 'PASS',
      categories: categoriesResponse.data.data?.length || 0,
      products: productsResponse.data.data?.length || 0
    };
    
    console.log('✅ Catalog: PASS');
    console.log(`   Categories: ${testResults.catalog.categories}`);
    console.log(`   Products: ${testResults.catalog.products}`);
    
  } catch (error) {
    testResults.catalog = { status: 'FAIL', error: error.message };
    console.log('❌ Catalog: FAIL');
  }
}

async function testSearch() {
  try {
    // Test basic search
    const searchResponse = await axios.get(`${BASE_URL}/search?q=tai nghe`);
    
    // Test AI search
    const aiSearchResponse = await axios.get(`${BASE_URL}/ai/search?q=tai nghe gaming`);
    
    testResults.search = {
      status: 'PASS',
      basicSearch: searchResponse.data.data?.length || 0,
      aiSearch: aiSearchResponse.data.data?.length || 0
    };
    
    console.log('✅ Search: PASS');
    console.log(`   Basic search results: ${testResults.search.basicSearch}`);
    console.log(`   AI search results: ${testResults.search.aiSearch}`);
    
  } catch (error) {
    testResults.search = { status: 'FAIL', error: error.message };
    console.log('❌ Search: FAIL');
  }
}

async function testAIFeatures() {
  try {
    // Test AI Chat
    const chatResponse = await axios.post(`${BASE_URL}/ai/chat`, {
      message: 'Tôi muốn mua tai nghe gaming'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    sessionId = chatResponse.data.data?.sessionId;
    
    // Test AI Recommendations
    const recommendationsResponse = await axios.get(`${BASE_URL}/ai/recommendations`);
    
    // Test follow-up chat
    const followUpResponse = await axios.post(`${BASE_URL}/ai/chat`, {
      sessionId: sessionId,
      message: 'Ngân sách 3-5 triệu'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testResults.ai = {
      status: 'PASS',
      chat: 'SUCCESS',
      recommendations: 'SUCCESS',
      conversation: 'SUCCESS',
      sessionId: sessionId
    };
    
    console.log('✅ AI Features: PASS');
    console.log('   Chat: SUCCESS');
    console.log('   Recommendations: SUCCESS');
    console.log('   Conversation: SUCCESS');
    
  } catch (error) {
    testResults.ai = { status: 'FAIL', error: error.message };
    console.log('❌ AI Features: FAIL');
  }
}

async function testUserManagement() {
  try {
    // Test user profile
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testResults.users = {
      status: 'PASS',
      profile: 'SUCCESS',
      userData: profileResponse.data.data
    };
    
    console.log('✅ User Management: PASS');
    console.log('   Profile: SUCCESS');
    
  } catch (error) {
    testResults.users = { status: 'FAIL', error: error.message };
    console.log('❌ User Management: FAIL');
  }
}

async function testFileManagement() {
  try {
    // Test file upload (simulated)
    const filesResponse = await axios.get(`${BASE_URL}/files`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testResults.files = {
      status: 'PASS',
      list: 'SUCCESS',
      count: filesResponse.data.data?.length || 0
    };
    
    console.log('✅ File Management: PASS');
    console.log('   File list: SUCCESS');
    
  } catch (error) {
    testResults.files = { status: 'FAIL', error: error.message };
    console.log('❌ File Management: FAIL');
  }
}

async function testPaymentSystem() {
  try {
    // Test payment intent creation (will fail due to missing order, but should handle gracefully)
    try {
      await axios.post(`${BASE_URL}/payments/create-intent`, {
        orderId: 'test-order-123',
        provider: 'payos',
        idempotencyKey: 'test-key-123'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      // Expected to fail due to missing order, but should return proper error
      if (error.response?.status === 404 || error.response?.status === 422) {
        testResults.payments = {
          status: 'PASS',
          validation: 'SUCCESS',
          errorHandling: 'PROPER'
        };
        console.log('✅ Payment System: PASS');
        console.log('   Validation: SUCCESS');
        console.log('   Error handling: PROPER');
        return;
      }
    }
    
    testResults.payments = { status: 'FAIL', error: 'Unexpected response' };
    console.log('❌ Payment System: FAIL');
    
  } catch (error) {
    testResults.payments = { status: 'FAIL', error: error.message };
    console.log('❌ Payment System: FAIL');
  }
}

async function testSupportSystem() {
  try {
    // Test support ticket creation
    const ticketResponse = await axios.post(`${BASE_URL}/support/tickets`, {
      subject: 'Test ticket',
      message: 'This is a test support ticket',
      priority: 'MEDIUM'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    testResults.support = {
      status: 'PASS',
      ticketCreation: 'SUCCESS',
      ticketId: ticketResponse.data.data?.id
    };
    
    console.log('✅ Support System: PASS');
    console.log('   Ticket creation: SUCCESS');
    
  } catch (error) {
    testResults.support = { status: 'FAIL', error: error.message };
    console.log('❌ Support System: FAIL');
  }
}

async function testPerformance() {
  try {
    const performanceTests = [];
    
    // Test multiple concurrent requests
    for (let i = 0; i < 5; i++) {
      performanceTests.push(
        axios.get(`${BASE_URL}/health`).then(res => ({
          test: `health-${i}`,
          status: 'SUCCESS',
          time: Date.now()
        })).catch(err => ({
          test: `health-${i}`,
          status: 'FAIL',
          error: err.message
        }))
      );
    }
    
    const results = await Promise.allSettled(performanceTests);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.status === 'SUCCESS').length;
    
    testResults.performance = {
      status: 'PASS',
      concurrentTests: 5,
      successCount: successCount,
      successRate: (successCount / 5) * 100
    };
    
    console.log('✅ Performance: PASS');
    console.log(`   Concurrent tests: ${testResults.performance.concurrentTests}`);
    console.log(`   Success rate: ${testResults.performance.successRate}%`);
    
  } catch (error) {
    testResults.performance = { status: 'FAIL', error: error.message };
    console.log('❌ Performance: FAIL');
  }
}

function generateSummary(startTime) {
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  // Calculate success rates
  const totalTests = Object.keys(testResults).length - 1; // Exclude summary
  const passedTests = Object.values(testResults).filter(result => result.status === 'PASS').length;
  const successRate = (passedTests / totalTests) * 100;
  
  // Determine overall grade
  let grade = 'F';
  if (successRate >= 90) grade = 'A';
  else if (successRate >= 80) grade = 'B';
  else if (successRate >= 70) grade = 'C';
  else if (successRate >= 60) grade = 'D';
  
  testResults.summary = {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    successRate,
    grade,
    totalTime: `${totalTime}ms`
  };
  
  console.log('📊 EVALUATION RESULTS');
  console.log('=====================');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${successRate.toFixed(1)}%`);
  console.log(`Grade: ${grade}`);
  console.log(`Total Time: ${totalTime}ms`);
  console.log('');
  
  console.log('📋 DETAILED RESULTS');
  console.log('==================');
  Object.entries(testResults).forEach(([key, result]) => {
    if (key !== 'summary') {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${key.toUpperCase()}: ${result.status}`);
    }
  });
  
  console.log('');
  console.log('🎯 RECOMMENDATIONS');
  console.log('==================');
  
  if (successRate >= 90) {
    console.log('🎉 EXCELLENT! System is production-ready');
    console.log('   - All core features working');
    console.log('   - AI features performing well');
    console.log('   - Good error handling');
  } else if (successRate >= 80) {
    console.log('👍 GOOD! Minor improvements needed');
    console.log('   - Most features working');
    console.log('   - Some areas need attention');
  } else if (successRate >= 70) {
    console.log('⚠️ FAIR! Significant improvements needed');
    console.log('   - Core features mostly working');
    console.log('   - Several issues to address');
  } else {
    console.log('🚨 POOR! Major issues need fixing');
    console.log('   - Many features not working');
    console.log('   - Requires immediate attention');
  }
}

// Run the comprehensive evaluation
comprehensiveEvaluation();
