const fs = require('fs');
const path = require('path');

async function testUploadAPI() {
  console.log('=== Testing Upload API ===\n');

  try {
    // Read test image file
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ Test image file not found at:', testImagePath);
      console.log('Please provide a test image file named test-image.jpg in the dashboard directory');
      return;
    }

    const imageBuffer = fs.readFileSync(testImagePath);
    const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });

    // Create FormData
    const formData = new FormData();
    formData.append('file', imageBlob, 'test-image.jpg');

    console.log('📤 Uploading test image to API...');

    // Test upload API
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Upload failed with response:', errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Upload successful!');
    console.log('Response:', JSON.stringify(result, null, 2));

    // Test if URL is accessible
    if (result.url) {
      console.log('\n🔗 Testing image URL accessibility...');
      try {
        const imageResponse = await fetch(result.url, { method: 'HEAD' });
        if (imageResponse.ok) {
          console.log('✅ Image URL is accessible');
          console.log('Content-Type:', imageResponse.headers.get('content-type'));
          console.log('Content-Length:', imageResponse.headers.get('content-length'));
        } else {
          console.log('❌ Image URL not accessible, status:', imageResponse.status);
        }
      } catch (urlError) {
        console.log('❌ Error accessing image URL:', urlError.message);
      }
    }

  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    console.log('Stack:', error.stack);
  }
}

// Check if server is running
async function checkServer() {
  console.log('🔍 Checking if server is running...');
  try {
    const response = await fetch('http://localhost:3000/api/upload', { method: 'GET' });
    console.log('Server status:', response.status);
    if (response.status === 405) {
      console.log('✅ Server is running (received 405 for GET request, which is expected for POST-only endpoint)');
    } else {
      console.log('ℹ️  Server response:', response.status);
    }
  } catch (error) {
    console.log('❌ Server is not running or not accessible:', error.message);
    console.log('Please start the dashboard server with: npm run dev');
    return false;
  }
  return true;
}

async function main() {
  const serverRunning = await checkServer();
  if (!serverRunning) return;

  await testUploadAPI();
}

main().catch(console.error);