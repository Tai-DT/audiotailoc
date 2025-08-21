const axios = require('axios');

const API_BASE = 'http://localhost:3010/api/v1';

// Test data
const testOrder = {
  orderNo: `TEST-${Date.now()}`,
  totalCents: 100000, // 1,000,000 VND
  items: [
    {
      name: 'Test Product',
      quantity: 1,
      unitPrice: 100000
    }
  ]
};

async function testPaymentFlow() {
  console.log('🧪 Testing Payment Integration...\n');

  try {
    // 1. Test PayOS Payment Intent Creation
    console.log('1️⃣ Testing PayOS Payment Intent Creation...');
    const payosIntent = await axios.post(`${API_BASE}/payments/intents`, {
      orderId: 'test-order-id',
      provider: 'PAYOS',
      idempotencyKey: `payos-test-${Date.now()}`,
      returnUrl: 'http://localhost:3000/checkout/return'
    });
    console.log('✅ PayOS Intent created:', payosIntent.data);
    console.log('🔗 Redirect URL:', payosIntent.data.redirectUrl);
    console.log('');

    // 2. Test VNPay Payment Intent Creation
    console.log('2️⃣ Testing VNPay Payment Intent Creation...');
    const vnpayIntent = await axios.post(`${API_BASE}/payments/intents`, {
      orderId: 'test-order-id',
      provider: 'VNPAY',
      idempotencyKey: `vnpay-test-${Date.now()}`,
      returnUrl: 'http://localhost:3000/checkout/return'
    });
    console.log('✅ VNPay Intent created:', vnpayIntent.data);
    console.log('🔗 Redirect URL:', vnpayIntent.data.redirectUrl);
    console.log('');

    // 3. Test MoMo Payment Intent Creation
    console.log('3️⃣ Testing MoMo Payment Intent Creation...');
    const momoIntent = await axios.post(`${API_BASE}/payments/intents`, {
      orderId: 'test-order-id',
      provider: 'MOMO',
      idempotencyKey: `momo-test-${Date.now()}`,
      returnUrl: 'http://localhost:3000/checkout/return'
    });
    console.log('✅ MoMo Intent created:', momoIntent.data);
    console.log('🔗 Redirect URL:', momoIntent.data.redirectUrl);
    console.log('');

    // 4. Test Webhook Endpoints
    console.log('4️⃣ Testing Webhook Endpoints...');
    
    // Test PayOS webhook
    const payosWebhook = await axios.post(`${API_BASE}/payments/payos/webhook`, {
      data: {
        orderCode: 'test-order',
        code: '00',
        id: 'payos-transaction-id'
      },
      signature: 'test-signature'
    });
    console.log('✅ PayOS webhook response:', payosWebhook.data);

    // Test VNPay webhook
    const vnpayWebhook = await axios.post(`${API_BASE}/payments/vnpay/webhook`, {
      vnp_TxnRef: 'test-txn-ref',
      vnp_ResponseCode: '00',
      vnp_TransactionNo: 'vnpay-transaction-id'
    });
    console.log('✅ VNPay webhook response:', vnpayWebhook.data);

    // Test MoMo webhook
    const momoWebhook = await axios.post(`${API_BASE}/payments/momo/webhook`, {
      orderId: 'test-order',
      resultCode: 0,
      transId: 'momo-transaction-id'
    });
    console.log('✅ MoMo webhook response:', momoWebhook.data);
    console.log('');

    // 5. Test Callback Endpoints
    console.log('5️⃣ Testing Callback Endpoints...');
    
    const payosCallback = await axios.get(`${API_BASE}/payments/payos/callback?orderCode=test-order`);
    console.log('✅ PayOS callback response:', payosCallback.data);

    const vnpayCallback = await axios.get(`${API_BASE}/payments/vnpay/callback?vnp_TxnRef=test-ref`);
    console.log('✅ VNPay callback response:', vnpayCallback.data);

    const momoCallback = await axios.get(`${API_BASE}/payments/momo/callback?momo_txn=test-txn`);
    console.log('✅ MoMo callback response:', momoCallback.data);
    console.log('');

    console.log('🎉 All payment tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ PayOS integration working');
    console.log('✅ VNPay integration working');
    console.log('✅ MoMo integration working');
    console.log('✅ Webhook endpoints responding');
    console.log('✅ Callback endpoints responding');

  } catch (error) {
    console.error('❌ Payment test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Note: Some endpoints may require authentication');
    }
    
    if (error.response?.status === 500) {
      console.log('\n💡 Note: Check if environment variables are properly configured');
    }
  }
}

// Test environment variables
function checkEnvironmentVariables() {
  console.log('🔍 Checking Environment Variables...\n');
  
  const requiredVars = [
    'PAYOS_CLIENT_ID',
    'PAYOS_API_KEY', 
    'PAYOS_CHECKSUM_KEY',
    'VNPAY_TMN_CODE',
    'VNPAY_HASH_SECRET',
    'MOMO_PARTNER_CODE',
    'MOMO_ACCESS_KEY',
    'MOMO_SECRET_KEY'
  ];

  const missing = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
      console.log(`❌ Missing: ${varName}`);
    } else {
      console.log(`✅ Found: ${varName}`);
    }
  });

  if (missing.length > 0) {
    console.log(`\n⚠️  Missing ${missing.length} environment variables.`);
    console.log('Please add them to your .env file:');
    missing.forEach(varName => {
      console.log(`${varName}=your-${varName.toLowerCase()}`);
    });
    console.log('\n💡 Note: Tests may fail without proper configuration');
  } else {
    console.log('\n✅ All required environment variables are set!');
  }
  
  console.log('');
}

// Run tests
async function main() {
  console.log('🚀 Audio Tài Lộc - Payment Integration Test\n');
  console.log('=' .repeat(50));
  
  checkEnvironmentVariables();
  await testPaymentFlow();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Test completed!');
}

main().catch(console.error);
