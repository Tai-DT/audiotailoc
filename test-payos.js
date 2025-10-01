const crypto = require('crypto');

async function testPayOSPayment() {
  try {
    console.log('=== Testing PayOS Payment Link Creation ===');
    
    // PayOS test config (use environment variables if available)
    const config = {
      apiUrl: process.env.PAYOS_API_URL || 'https://api-merchant.payos.vn',
      clientId: process.env.PAYOS_CLIENT_ID || '',
      apiKey: process.env.PAYOS_API_KEY || '', 
      checksumKey: process.env.PAYOS_CHECKSUM_KEY || '',
      partnerCode: process.env.PAYOS_PARTNER_CODE || ''
    };

    console.log('Config check:');
    console.log('- API URL:', config.apiUrl);
    console.log('- Client ID:', config.clientId ? `${config.clientId.substring(0, 8)}...` : 'NOT SET');
    console.log('- API Key:', config.apiKey ? `${config.apiKey.substring(0, 8)}...` : 'NOT SET');
    console.log('- Checksum Key:', config.checksumKey ? `${config.checksumKey.substring(0, 8)}...` : 'NOT SET');
    
    if (!config.clientId || !config.apiKey || !config.checksumKey) {
      console.error('⚠️  PayOS credentials not configured properly');
      return;
    }

    // Create payment request
    const orderCode = Date.now(); // Unique order code
    const payload = {
      orderCode: orderCode,
      amount: 100000, // 1000 VND for test
      description: `Test payment - Audio Tai Loc - ${orderCode}`,
      items: [
        {
          name: 'Test Product - Cục đẩy âm thanh',
          quantity: 1,
          price: 100000
        }
      ],
      returnUrl: 'https://audiotailoc.com/payment/success',
      cancelUrl: 'https://audiotailoc.com/payment/cancel'
    };

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'x-client-id': config.clientId,
      'x-api-key': config.apiKey
    };

    // Create signature theo PayOS docs mới nhất
    // Thực tế PayOS có thể không cần signature cho API endpoint này
    // Hoặc signature được tạo bằng cách khác
    
    // Make API call without signature first
    console.log('\n=== Making PayOS API Call ===');
    console.log('Endpoint:', `${config.apiUrl}/v2/payment-requests`);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${config.apiUrl}/v2/payment-requests`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)  // Try without signature first
    });

    const result = await response.json();
    
    console.log('\n=== PayOS Response ===');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (result.code === '00' || result.error === 0) {
      const checkoutUrl = result.data?.checkoutUrl;
      if (checkoutUrl) {
        console.log('\n🎉 SUCCESS! Payment link created:');
        console.log('Payment URL:', checkoutUrl);
        console.log('\nYou can test this payment by opening the URL in your browser');
        console.log('Order Code:', orderCode);
        return { success: true, paymentUrl: checkoutUrl, orderCode };
      }
    } else {
      console.log('\n❌ Payment creation failed');
      console.log('Error:', result.desc || result.message || 'Unknown error');
    }
    
  } catch (error) {
    console.error('\n💥 Error creating payment:', error.message);
  }
}

testPayOSPayment();