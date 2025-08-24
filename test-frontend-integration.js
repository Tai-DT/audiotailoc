#!/usr/bin/env node

/**
 * 🧪 Frontend Integration Test Script
 * Tests frontend components and API integration
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:8000/api/v1';

// Test scenarios
const testScenarios = [
  {
    name: 'Homepage Load',
    description: 'Test homepage components and API calls',
    tests: [
      { name: 'API Health Check', endpoint: '/health', method: 'GET' },
      { name: 'Products List', endpoint: '/catalog/products', method: 'GET' },
      { name: 'Categories List', endpoint: '/catalog/categories', method: 'GET' },
      { name: 'Search Functionality', endpoint: '/search/products', method: 'GET' }
    ]
  },
  {
    name: 'User Authentication Flow',
    description: 'Test user registration and login',
    tests: [
      { 
        name: 'User Registration', 
        endpoint: '/auth/register', 
        method: 'POST',
        body: {
          email: 'testuser@example.com',
          password: 'TestPassword123!',
          name: 'Test User'
        }
      },
      { 
        name: 'User Login', 
        endpoint: '/auth/login', 
        method: 'POST',
        body: {
          email: 'testuser@example.com',
          password: 'TestPassword123!'
        }
      }
    ]
  },
  {
    name: 'AI Features',
    description: 'Test AI integration features',
    tests: [
      { name: 'AI Health Check', endpoint: '/ai/health', method: 'GET' },
      { name: 'AI Capabilities', endpoint: '/ai/capabilities', method: 'GET' },
      { name: 'Chat Sessions', endpoint: '/ai/chat-sessions', method: 'GET' }
    ]
  },
  {
    name: 'Support System',
    description: 'Test support and help features',
    tests: [
      { name: 'Knowledge Base', endpoint: '/support/kb/articles', method: 'GET' },
      { name: 'FAQ List', endpoint: '/support/faq', method: 'GET' },
      { name: 'KB Categories', endpoint: '/support/kb/categories', method: 'GET' }
    ]
  },
  {
    name: 'Search & Discovery',
    description: 'Test search and discovery features',
    tests: [
      { name: 'Product Search', endpoint: '/search/products', method: 'GET' },
      { name: 'Service Search', endpoint: '/search/services', method: 'GET' },
      { name: 'Global Search', endpoint: '/search/global', method: 'GET' },
      { name: 'Search Suggestions', endpoint: '/search/suggestions', method: 'GET' },
      { name: 'Popular Searches', endpoint: '/search/popular', method: 'GET' },
      { name: 'Search Filters', endpoint: '/search/filters', method: 'GET' }
    ]
  }
];

// Test results
const results = {
  scenarios: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    successRate: 0
  }
};

/**
 * Test a single API endpoint
 */
async function testEndpoint(test) {
  const url = `${API_BASE}${test.endpoint}`;
  const options = {
    method: test.method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (test.body) {
    options.body = JSON.stringify(test.body);
  }

  try {
    const startTime = Date.now();
    const response = await fetch(url, options);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const result = {
      name: test.name,
      endpoint: test.endpoint,
      method: test.method,
      status: response.status,
      statusText: response.statusText,
      responseTime: `${responseTime}ms`,
      success: response.ok,
      url: url
    };

    if (response.ok) {
      try {
        const data = await response.json();
        result.data = data;
      } catch (e) {
        result.data = 'Non-JSON response';
      }
    } else {
      result.error = `HTTP ${response.status}: ${response.statusText}`;
    }

    return result;
  } catch (error) {
    return {
      name: test.name,
      endpoint: test.endpoint,
      method: test.method,
      status: 'ERROR',
      statusText: error.message,
      responseTime: 'N/A',
      success: false,
      url: url,
      error: error.message
    };
  }
}

/**
 * Test a scenario
 */
async function testScenario(scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  console.log(`📝 ${scenario.description}`);
  console.log('─'.repeat(50));

  const scenarioResult = {
    name: scenario.name,
    description: scenario.description,
    tests: [],
    passed: 0,
    failed: 0
  };

  for (const test of scenario.tests) {
    console.log(`  Testing: ${test.name} (${test.method} ${test.endpoint})`);
    const result = await testEndpoint(test);
    
    if (result.success) {
      console.log(`    ✅ ${result.status} - ${result.responseTime}`);
      scenarioResult.passed++;
    } else {
      console.log(`    ❌ ${result.status} - ${result.error || result.statusText}`);
      scenarioResult.failed++;
    }
    
    scenarioResult.tests.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const successRate = ((scenarioResult.passed / scenarioResult.tests.length) * 100).toFixed(1);
  console.log(`  📊 ${scenarioResult.passed}/${scenarioResult.tests.length} passed (${successRate}%)`);

  return scenarioResult;
}

/**
 * Check frontend files
 */
function checkFrontendFiles() {
  const frontendPath = path.join(__dirname, 'frontend');
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'app/layout.tsx',
    'app/page.tsx',
    'lib/api-client.ts',
    '.env.local.example'
  ];

  const fileChecks = [];
  
  for (const file of requiredFiles) {
    const filePath = path.join(frontendPath, file);
    const exists = fs.existsSync(filePath);
    fileChecks.push({
      file: file,
      exists: exists,
      status: exists ? '✅' : '❌'
    });
  }

  return fileChecks;
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 Frontend Integration Test Script');
  console.log('===================================\n');

  // Check frontend files
  console.log('📁 Checking Frontend Files...');
  const fileChecks = checkFrontendFiles();
  fileChecks.forEach(check => {
    console.log(`  ${check.status} ${check.file}`);
  });

  // Test API scenarios
  console.log('\n🌐 Testing API Integration...');
  
  for (const scenario of testScenarios) {
    const scenarioResult = await testScenario(scenario);
    results.scenarios.push(scenarioResult);
    
    results.summary.total += scenarioResult.tests.length;
    results.summary.passed += scenarioResult.passed;
    results.summary.failed += scenarioResult.failed;
  }

  // Calculate success rate
  results.summary.successRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);

  // Print summary
  console.log('\n📊 Integration Test Summary');
  console.log('===========================');
  console.log(`✅ Total Passed: ${results.summary.passed}`);
  console.log(`❌ Total Failed: ${results.summary.failed}`);
  console.log(`📈 Success Rate: ${results.summary.successRate}%`);

  // Print scenario breakdown
  console.log('\n📋 Scenario Breakdown:');
  results.scenarios.forEach(scenario => {
    const rate = ((scenario.passed / scenario.tests.length) * 100).toFixed(1);
    console.log(`  ${scenario.name}: ${scenario.passed}/${scenario.tests.length} (${rate}%)`);
  });

  // Save detailed results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = `frontend-integration-test-report-${timestamp}.json`;
  
  fs.writeFileSync(reportFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    fileChecks: fileChecks,
    summary: results.summary,
    scenarios: results.scenarios
  }, null, 2));

  console.log(`\n📄 Detailed report saved: ${reportFile}`);
  
  return results;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testScenario, checkFrontendFiles };
