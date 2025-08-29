#!/usr/bin/env node

/**
 * Comprehensive Backend & Dashboard Test Suite
 * Tests all APIs and management features
 */

const BASE_URL = 'http://localhost:3010/api/v1';
const DASHBOARD_URL = 'http://localhost:3000/dashboard';

async function testEndpoint(name, url, method = 'GET', body = null) {
  console.log(`\n🔍 Testing ${name}...`);
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    console.log(`✅ ${name} - Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);

    return { success: true, data, status: response.status };
  } catch (error) {
    console.log(`❌ ${name} - Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testManagementFeatures() {
  console.log('\n🏗️  TESTING MANAGEMENT FEATURES...');

  const managementTests = [
    { name: 'Users API', url: `${BASE_URL}/users` },
    { name: 'Users Stats', url: `${BASE_URL}/users/stats` },
    { name: 'Orders API', url: `${BASE_URL}/orders` },
    { name: 'Payments API', url: `${BASE_URL}/payments` },
    { name: 'Admin Dashboard', url: `${BASE_URL}/admin/dashboard` },
    { name: 'Product Management', url: `${BASE_URL}/catalog/products`, method: 'POST', body: {
      name: 'Test Product',
      description: 'Test Description',
      priceCents: 1000000,
      categoryId: 'test-category'
    }},
    { name: 'Category Management', url: `${BASE_URL}/catalog/categories`, method: 'POST', body: {
      name: 'Test Category',
      description: 'Test Category Description'
    }},
  ];

  const results = [];

  for (const test of managementTests) {
    const result = await testEndpoint(test.name, test.url, test.method, test.body);
    results.push({ ...test, ...result });
  }

  return results;
}

async function runFullTest() {
  console.log('🚀 Audio Tài Lộc Full System Test Suite');
  console.log('==========================================');

  // Test basic APIs
  console.log('\n📊 TESTING BASIC APIs...');
  const basicTests = [
    { name: 'Health Check', url: `${BASE_URL}/health` },
    { name: 'Products API', url: `${BASE_URL}/catalog/products` },
    { name: 'Categories API', url: `${BASE_URL}/catalog/categories` },
    { name: 'AI Capabilities', url: `${BASE_URL}/ai/capabilities` },
  ];

  const basicResults = [];
  for (const test of basicTests) {
    const result = await testEndpoint(test.name, test.url);
    basicResults.push({ ...test, ...result });
  }

  // Test management features
  const managementResults = await testManagementFeatures();

  // Summary
  console.log('\n📋 TEST SUMMARY');
  console.log('================');

  const allResults = [...basicResults, ...managementResults];
  const successful = allResults.filter(r => r.success).length;
  const failed = allResults.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total Tests: ${allResults.length}`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    allResults.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
  }

  // Management features analysis
  const managementSuccessful = managementResults.filter(r => r.success).length;
  const managementFailed = managementResults.filter(r => !r.success).length;

  console.log(`\n🏗️  MANAGEMENT FEATURES STATUS`);
  console.log('==============================');
  console.log(`✅ Working: ${managementSuccessful}`);
  console.log(`❌ Missing/Non-functional: ${managementFailed}`);

  if (managementFailed > 0) {
    console.log('\n📝 Missing Management Features:');
    managementResults.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}`);
    });
  }

  return { basicResults, managementResults, summary: { successful, failed, total: allResults.length } };
}

// Export for use in other scripts
module.exports = { runFullTest, testEndpoint, testManagementFeatures };

// Run if executed directly
if (require.main === module) {
  runFullTest().catch(console.error);
}
