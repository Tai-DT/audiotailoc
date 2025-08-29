#!/usr/bin/env node

/**
 * Backend API Test Script
 * Tests all dashboard-related endpoints to ensure data availability
 */

const BASE_URL = 'http://localhost:3010/api/v1';

async function testEndpoint(name, url) {
  console.log(`\n🔍 Testing ${name}...`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`✅ ${name} - Success`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Data keys: ${Object.keys(data).join(', ')}`);

    // Show sample data
    if (data.data) {
      if (Array.isArray(data.data)) {
        console.log(`   Items count: ${data.data.length}`);
        if (data.data.length > 0) {
          console.log(`   Sample item keys: ${Object.keys(data.data[0]).join(', ')}`);
        }
      } else if (typeof data.data === 'object') {
        console.log(`   Data keys: ${Object.keys(data.data).join(', ')}`);
      }
    }

    return { success: true, data };
  } catch (error) {
    console.log(`❌ ${name} - Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Audio Tài Lộc Backend API Test Suite');
  console.log('=====================================');

  const endpoints = [
    { name: 'Health Check', url: `${BASE_URL}/health` },
    { name: 'Products API', url: `${BASE_URL}/catalog/products` },
    { name: 'Categories API', url: `${BASE_URL}/catalog/categories` },
    { name: 'AI Capabilities', url: `${BASE_URL}/ai/capabilities` },
  ];

  const results = [];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.name, endpoint.url);
    results.push({ ...endpoint, ...result });
  }

  console.log('\n📊 Test Summary');
  console.log('===============');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed endpoints:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
  }

  // Check if we have the data needed for dashboard
  const productsResult = results.find(r => r.name === 'Products API');
  const categoriesResult = results.find(r => r.name === 'Categories API');
  const aiResult = results.find(r => r.name === 'AI Capabilities');

  if (productsResult?.success && categoriesResult?.success && aiResult?.success) {
    console.log('\n🎉 Dashboard Ready!');
    console.log('==================');
    console.log('✅ All required APIs are working');
    console.log('✅ Real data available for dashboard visualization');
    console.log('✅ Dashboard can be started with: npm run dev (in dashboard directory)');

    // Show data summary
    if (productsResult.data?.data?.total) {
      console.log(`📦 Products: ${productsResult.data.data.total} items`);
    }
    if (categoriesResult.data?.data?.length) {
      console.log(`📂 Categories: ${categoriesResult.data.data.length} categories`);
    }
    if (aiResult.data?.data?.capabilities?.length) {
      console.log(`🤖 AI Features: ${aiResult.data.data.capabilities.length} features`);
    }
  } else {
    console.log('\n⚠️  Dashboard Not Ready');
    console.log('=====================');
    console.log('❌ Some APIs are not working. Please check:');
    console.log('   1. Backend server is running on port 3010');
    console.log('   2. Database is connected and seeded');
    console.log('   3. All required endpoints are accessible');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testEndpoint };