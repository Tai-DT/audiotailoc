// Test API login call
const fetch = require('node-fetch');

async function testApiLogin() {
  try {
    console.log('🔍 Testing API login call...');

    const response = await fetch('http://localhost:3010/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@audiotailoc.com',
        password: 'Admin1234'
      })
    });

    console.log(`📡 Response status: ${response.status}`);
    console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log(`📡 Response body:`, responseText);

    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Login successful!');
      console.log('🔑 Access Token:', data.accessToken ? 'Present' : 'Missing');
      console.log('🔄 Refresh Token:', data.refreshToken ? 'Present' : 'Missing');
    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testApiLogin();