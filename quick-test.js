const http = require('http');

console.log(' Audio Tài Lộc - Quick Connectivity Test');
console.log('==========================================');

// Test backend health
console.log('Testing backend on http://localhost:3010...');
const req = http.get('http://localhost:3010/api/v1/health', (res) => {
  console.log(' Backend responded with status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response:', data.substring(0, 200));
  });
}).on('error', (err) => {
  console.log(' Backend connection failed:', err.message);
  console.log(' Try starting backend: cd backend && npm run start:dev');
});

req.setTimeout(5000, () => {
  console.log(' Backend connection timeout');
  req.destroy();
});
