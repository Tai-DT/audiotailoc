const crypto = require('crypto');

// PayOS credentials
const CLIENT_ID = "c666c1e6-26c6-4264-b5a5-4de552535065";
const API_KEY = "43e30c48-a208-47ad-855a-c1bdf18d748b";
const CHECKSUM_KEY = "33642e2b053986dbdb178487479fb0191371435d1f9328b8fba61ef6c20a65ab";
const PARTNER_CODE = "DOTAI3004";

async function testPayOSPayment() {
  try {
    // Tạo orderCode unique
    const orderCode = Date.now();
    
    // Tạo payment data
    const paymentData = {
      orderCode: orderCode,
      amount: 50000,
      description: "Test Payment from Audio Tai Loc",
      items: [
        {
          name: "Test Product",
          quantity: 1,
          price: 50000
        }
      ],
      returnUrl: "https://frontend-audiotailoc.vercel.app/payment/success",
      cancelUrl: "https://frontend-audiotailoc.vercel.app/payment/cancel"
    };

    // Tạo signature theo PayOS spec
    const sortedData = Object.keys(paymentData)
      .sort()
      .reduce((result, key) => {
        if (key === 'items') {
          result[key] = JSON.stringify(paymentData[key]);
        } else {
          result[key] = paymentData[key];
        }
        return result;
      }, {});

    const dataString = Object.values(sortedData).join('&');
    const signature = crypto
      .createHmac('sha256', CHECKSUM_KEY)
      .update(dataString)
      .digest('hex');

    const requestBody = {
      ...paymentData,
      signature: signature
    };

    console.log('Testing PayOS Payment Creation...');
    console.log('Order Code:', orderCode);
    console.log('Amount:', paymentData.amount);
    console.log('Signature:', signature);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // Gọi API PayOS
    const response = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CLIENT_ID,
        'x-api-key': API_KEY,
        'x-partner-code': PARTNER_CODE
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    
    console.log('\n--- PayOS API Response ---');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.data && result.data.checkoutUrl) {
      console.log('\n✅ SUCCESS! Payment link created:');
      console.log('Payment URL:', result.data.checkoutUrl);
      console.log('QR Code:', result.data.qrCode);
    } else {
      console.log('\n❌ Failed to create payment link');
    }

  } catch (error) {
    console.error('❌ Error testing PayOS:', error.message);
  }
}

testPayOSPayment();