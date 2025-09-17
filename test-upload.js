const fs = require('fs');
const path = require('path');

// Test Cloudinary upload API
async function testUpload() {
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

    const formData = new FormData();
    formData.append('file', new Blob([testImageBuffer], { type: 'image/png' }), 'test.png');
    formData.append('folder', 'test');

    console.log('Testing Cloudinary upload...');

    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.status, errorText);
      return;
    }

    const result = await response.json();
    console.log('Upload successful:', result);

    if (result.success && result.url) {
      console.log('Image URL:', result.url);
      console.log('Public ID:', result.publicId);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testUpload();