#!/usr/bin/env node

const fetch = require('node-fetch').default || require('node-fetch');
const crypto = require('crypto');

console.log('💳 PayOS Integration Test Script');
console.log('=================================');

// Test configuration
const API_BASE = 'http://localhost:8000/api/v1';
const TEST_ORDER = {
  orderId: `test-order-${Date.now()}`,
  amount: 50000, // 50,000 VND
  provider: 'PAYOS',
  returnUrl: 'http://localhost:3000/checkout/return'
};

class PayOSIntegrationTest {
  constructor() {
    this.testResults = [];
  }

  // Log test results
  logResult(testName, success, details = '') {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}${details ? ': ' + details : ''}`);
    this.testResults.push({ testName, success, details });
  }

  // Test 1: Backend Health Check
  async testBackendHealth() {
    console.log('\n🔍 Test 1: Backend Health Check');
    try {
      const response = await fetch(`${API_BASE}/../health`);
      const success = response.ok;
      this.logResult('Backend Health', success, `Status: ${response.status}`);
      return success;
    } catch (error) {
      this.logResult('Backend Health', false, error.message);
      return false;
    }
  }

  // Test 2: PayOS Configuration Check
  async testPayOSConfig() {
    console.log('\n🔍 Test 2: PayOS Configuration');
    
    // Read .env file to check configuration
    const fs = require('fs');
    const path = require('path');
    
    try {
      const envPath = path.join(__dirname, 'backend', '.env');
      if (!fs.existsSync(envPath)) {
        this.logResult('PayOS Config', false, 'File .env không tồn tại');
        return false;
      }
      
      const envContent = fs.readFileSync(envPath, 'utf8');
      const requiredKeys = ['PAYOS_CLIENT_ID', 'PAYOS_API_KEY', 'PAYOS_CHECKSUM_KEY'];
      
      let configOk = true;
      for (const key of requiredKeys) {
        if (envContent.includes(`${key}="your-`) || !envContent.includes(key)) {
          this.logResult('PayOS Config', false, `${key} chưa được cấu hình`);
          configOk = false;
        }
      }
      
      if (configOk) {
        this.logResult('PayOS Config', true, 'Tất cả keys đã được cấu hình');
      }
      
      return configOk;
    } catch (error) {
      this.logResult('PayOS Config', false, error.message);
      return false;
    }
  }

  // Test 3: Create Payment Intent
  async testCreatePaymentIntent() {
    console.log('\n🔍 Test 3: Create Payment Intent');
    
    try {
      const response = await fetch(`${API_BASE}/payments/intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(TEST_ORDER)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.logResult('Payment Intent Creation', true, `Intent ID: ${data.id || 'unknown'}`);
        return { success: true, data };
      } else {
        this.logResult('Payment Intent Creation', false, `${response.status}: ${data.message || data.error || 'Unknown error'}`);
        return { success: false, error: data };
      }
    } catch (error) {
      this.logResult('Payment Intent Creation', false, error.message);
      return { success: false, error: error.message };
    }
  }

  // Test 4: Payment Webhook Validation
  async testWebhookEndpoint() {
    console.log('\n🔍 Test 4: Webhook Endpoint');
    
    // Mock webhook payload
    const mockWebhook = {
      data: {
        orderCode: TEST_ORDER.orderId,
        amount: TEST_ORDER.amount,
        status: 'PAID'
      },
      signature: 'mock-signature'
    };
    
    try {
      const response = await fetch(`${API_BASE}/payments/payos/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signature': 'mock-signature'
        },
        body: JSON.stringify(mockWebhook)
      });
      
      // Webhook should accept the request (even if signature is invalid)
      const success = response.status < 500;
      this.logResult('Webhook Endpoint', success, `Status: ${response.status}`);
      return success;
    } catch (error) {
      this.logResult('Webhook Endpoint', false, error.message);
      return false;
    }
  }

  // Test 5: API Documentation Access
  async testAPIDocumentation() {
    console.log('\n🔍 Test 5: API Documentation');
    
    try {
      const response = await fetch(`${API_BASE}/../api`);
      const success = response.ok;
      this.logResult('API Documentation', success, `Swagger UI accessible at http://localhost:8000/api`);
      return success;
    } catch (error) {
      this.logResult('API Documentation', false, error.message);
      return false;
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting PayOS Integration Tests...\n');

    const tests = [
      () => this.testBackendHealth(),
      () => this.testPayOSConfig(),
      () => this.testCreatePaymentIntent(),
      () => this.testWebhookEndpoint(),
      () => this.testAPIDocumentation()
    ];

    for (const test of tests) {
      await test();
    }

    // Summary
    console.log('\n📊 Test Summary');
    console.log('================');
    
    const passCount = this.testResults.filter(r => r.success).length;
    const totalCount = this.testResults.length;
    
    console.log(`✅ Passed: ${passCount}/${totalCount} tests`);
    console.log(`❌ Failed: ${totalCount - passCount}/${totalCount} tests`);

    // Recommendations
    console.log('\n💡 Recommendations:');
    
    const failedTests = this.testResults.filter(r => !r.success);
    if (failedTests.length === 0) {
      console.log('🎉 All tests passed! PayOS integration is ready.');
      console.log('📝 Next steps:');
      console.log('   1. Test payment flow in frontend/dashboard');
      console.log('   2. Configure webhook URLs in PayOS dashboard');
      console.log('   3. Test with real PayOS credentials in production');
    } else {
      console.log('🔧 Fix the following issues:');
      failedTests.forEach(test => {
        console.log(`   - ${test.testName}: ${test.details}`);
      });
    }

    console.log('\n🔗 Useful Links:');
    console.log('   - Backend API: http://localhost:8000');
    console.log('   - API Docs: http://localhost:8000/api');
    console.log('   - PayOS Dashboard: https://payos.vn/dashboard');
    console.log('   - Setup Guide: ./SETUP_GUIDE.md');

    return passCount === totalCount;
  }
}

// Run tests if called directly
async function main() {
  const tester = new PayOSIntegrationTest();
  
  try {
    const allPassed = await tester.runAllTests();
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PayOSIntegrationTest;
