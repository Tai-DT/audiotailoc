const http = require('http');

function apiTest(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3010,
      path: `/api/v1${path}`,
      method: 'GET',
    };

    console.log(`\n🔍 Testing: ${description}`);
    console.log(`📡 URL: http://localhost:3010/api/v1${path}`);

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`);
        try {
          const result = JSON.parse(data);
          console.log(`📦 Response:`, JSON.stringify(result, null, 2));
        } catch (e) {
          console.log(`📝 Raw Response:`, data);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`❌ Error:`, e.message);
      resolve();
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`⏱️ Timeout`);
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Audio Tài Lộc API...\n');

  await apiTest('/health', 'Health Check');
  await apiTest('/catalog/categories', 'Categories List');
  await apiTest('/catalog/products', 'Products List');
  await apiTest('/services', 'Services List');
  await apiTest('/services/categories', 'Service Categories');

  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);
