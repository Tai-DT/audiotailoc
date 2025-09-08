const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Configuration
const API_URL = 'http://localhost:3000/api';
const TEST_IMAGE_PATH = './test-upload.png';
const JWT_TOKEN = 'YOUR_JWT_TOKEN'; // Replace with a valid JWT token

async function testUpload() {
  try {
    console.log('🚀 Starting MCP upload test...');
    
    // Check if test image exists
    if (!fs.existsSync(TEST_IMAGE_PATH)) {
      console.error(`❌ Test image not found at: ${TEST_IMAGE_PATH}`);
      console.log('ℹ️  Please place a test image named "test-upload.png" in the project root directory.');
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(TEST_IMAGE_PATH));

    console.log('📤 Uploading test image...');
    
    // Make the request to the upload endpoint
    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Upload failed with status ${response.status}`);
    }

    console.log('✅ Upload successful!');
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    
    if (data.url) {
      console.log(`\n🔗 File URL: ${data.url}`);
    }

    return data;

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testUpload().catch(() => process.exit(1));
}

module.exports = { testUpload };
