const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Configuration
const API_URL = 'http://localhost:3000';
const TEST_IMAGE_PATH = path.join(__dirname, 'test-upload.png');
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with a valid JWT token

async function testMCPUpload() {
  try {
    console.log('Starting MCP upload test...');
    
    // Check if test image exists
    if (!fs.existsSync(TEST_IMAGE_PATH)) {
      console.error(`Test image not found at: ${TEST_IMAGE_PATH}`);
      console.log('Please place a test image named "test-upload.png" in the project root directory.');
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(TEST_IMAGE_PATH));

    console.log('Uploading test image...');
    
    // Make the request
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    console.log('✅ Upload successful!');
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.url) {
      console.log(`\n📎 Image URL: ${data.url}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testMCPUpload();
