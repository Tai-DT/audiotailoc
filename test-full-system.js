#!/usr/bin/env node

/**
 * Test script để kiểm tra toàn bộ hệ thống Audio Tài Lộc
 * Bao gồm: Backend API, Frontend, AI Services
 */

const http = require('http');
const https = require('https');

const BACKEND_URL = 'http://localhost:3010';
const FRONTEND_URL = 'http://localhost:3000';

const tests = [
  {
    name: 'Backend Health Check',
    url: `${BACKEND_URL}/api/v1/health`,
    method: 'GET',
    expected: 200
  },
  {
    name: 'AI Health Check',
    url: `${BACKEND_URL}/api/v1/ai/health`,
    method: 'GET',
    expected: 200
  },
  {
    name: 'AI Capabilities',
    url: `${BACKEND_URL}/api/v1/ai/capabilities`,
    method: 'GET',
    expected: 200
  },
  {
    name: 'Frontend Home',
    url: `${FRONTEND_URL}/vi`,
    method: 'GET',
    expected: 200
  },
  {
    name: 'Frontend AI Tools',
    url: `${FRONTEND_URL}/ai-tools`,
    method: 'GET',
    expected: 200
  }
];

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing Audio Tài Lộc Full System...\n');
  console.log('📊 System Status:');
  console.log(`   Backend: ${BACKEND_URL}`);
  console.log(`   Frontend: ${FRONTEND_URL}`);
  console.log('');

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`🔍 Testing: ${test.name}`);
    console.log(`   URL: ${test.url}`);

    try {
      const response = await makeRequest(test.url, test.method);

      if (response.statusCode === test.expected) {
        console.log(`   ✅ Status: ${response.statusCode} - PASSED`);
        passed++;
      } else {
        console.log(`   ❌ Status: ${response.statusCode} (expected ${test.expected}) - FAILED`);
        failed++;
      }

      // Parse JSON response for AI endpoints
      if (test.url.includes('/api/v1/')) {
        try {
          const jsonData = JSON.parse(response.data);
          if (jsonData.success) {
            console.log(`   📊 Response: OK`);
          } else {
            console.log(`   📊 Response: Error - ${jsonData.message || 'Unknown'}`);
          }
        } catch (e) {
          console.log(`   📊 Response: Non-JSON response`);
        }
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message} - FAILED`);
      failed++;
    }

    console.log('');
  }

  // Summary
  console.log('📈 Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All systems are working perfectly!');
    console.log('\n🌐 Access your application:');
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   AI Tools: ${FRONTEND_URL}/ai-tools`);
    console.log(`   API Docs: ${BACKEND_URL}/api/docs`);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the services.');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n🛑 Test interrupted by user');
  process.exit(0);
});

// Run tests
runTests().catch((error) => {
  console.error('💥 Test script error:', error);
  process.exit(1);
});
