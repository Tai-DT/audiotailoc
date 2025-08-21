const https = require('http');

// Test API to check if karaoke seeding worked
console.log('🧪 Testing Karaoke API endpoints...\n');

function makeRequest(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3010,
      path: `/api/v1${path}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`✅ ${description}`);
          console.log(`   📍 ${path}`);
          console.log(`   📊 Status: ${res.statusCode}`);
          console.log(`   📦 Data:`, JSON.stringify(result, null, 2).substring(0, 200) + '...\n');
          resolve(result);
        } catch (e) {
          console.log(`❌ ${description}`);
          console.log(`   📍 ${path}`);
          console.log(`   📊 Status: ${res.statusCode}`);
          console.log(`   ⚠️ Error parsing JSON:`, e.message);
          console.log(`   📝 Raw data:`, data.substring(0, 200) + '...\n');
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`❌ ${description}`);
      console.log(`   📍 ${path}`);
      console.log(`   ⚠️ Request Error:`, e.message, '\n');
      resolve(null);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`⏱️ ${description} - Timeout\n`);
      resolve(null);
    });

    req.end();
  });
}

async function testKaraokeAPI() {
  console.log('🏁 Starting Karaoke API Tests...\n');

  await makeRequest('/health', 'Health Check');
  await makeRequest('/catalog/categories', 'All Categories (should include Karaoke)');
  await makeRequest('/catalog/products?search=karaoke', 'Karaoke Products Search');
  await makeRequest('/services', 'All Services (should include Liquidation)');
  await makeRequest('/services/categories', 'Service Categories');
  await makeRequest('/services/types', 'Service Types');

  console.log('🎉 Test completed!');
}

// Run the test
testKaraokeAPI().catch(console.error);
