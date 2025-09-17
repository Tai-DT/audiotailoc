const http = require('http');

console.log('  Testing Database Through API...');

const req = http.get('http://localhost:3010/api/v1/catalog/products', (res) => {
  console.log(' Products endpoint status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.success) {
        console.log(' Database working - products endpoint returned data');
        console.log('Product count:', json.data?.data?.length || 0);
      } else {
        console.log('  API returned error:', json.message);
      }
    } catch (e) {
      console.log(' Invalid JSON response');
    }
  });
}).on('error', (err) => {
  console.log(' API call failed:', err.message);
});

req.setTimeout(5000, () => {
  console.log(' API call timeout');
  req.destroy();
});
