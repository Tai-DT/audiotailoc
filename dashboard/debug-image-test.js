const fs = require('fs');
const path = require('path');

// Load .env file manually
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });

    return envVars;
  } catch (error) {
    console.log('Error reading .env file:', error.message);
    return {};
  }
}

const envVars = loadEnv();
const cloudName = envVars.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

console.log('=== Cloudinary Image Debug Test ===\n');

// Test sample URLs
const testUrls = [
  `https://res.cloudinary.com/${cloudName}/image/upload/test.jpg`,
  `https://res.cloudinary.com/${cloudName}/image/upload/v1234567890/test.jpg`,
  `https://res.cloudinary.com/${cloudName}/image/upload/w_800,h_600,c_fill,q_auto/test.jpg`,
];

console.log('Testing Cloudinary URLs:');
console.log('Cloud Name:', cloudName);
console.log('');

testUrls.forEach((url, index) => {
  console.log(`Test URL ${index + 1}:`, url);

  // Test if URL is accessible
  fetch(url, { method: 'HEAD' })
    .then(response => {
      console.log(`  Status: ${response.status}`);
      console.log(`  Content-Type: ${response.headers.get('content-type')}`);
      console.log(`  Content-Length: ${response.headers.get('content-length')}`);
      if (response.status === 404) {
        console.log(`  ❌ Image not found at this URL`);
      } else if (response.status === 200) {
        console.log(`  ✅ URL is accessible`);
      }
    })
    .catch(error => {
      console.log(`  ❌ Error accessing URL: ${error.message}`);
    })
    .finally(() => {
      console.log('');
    });
});

console.log('=== Common Issues to Check ===');
console.log('1. Cloud name in .env matches your Cloudinary account');
console.log('2. Upload preset exists and is configured correctly');
console.log('3. API credentials are valid');
console.log('4. Images were actually uploaded to Cloudinary');
console.log('5. URL format is correct');
console.log('');
console.log('Next steps:');
console.log('- Check Cloudinary dashboard for uploaded images');
console.log('- Test upload API manually');
console.log('- Verify image URLs in browser developer tools');