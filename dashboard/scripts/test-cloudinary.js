#!/usr/bin/env node

/**
 * Script để test Cloudinary upload
 * Chạy: node scripts/test-cloudinary.js
 */

async function testCloudinaryUpload() {
  console.log('🧪 Testing Cloudinary upload functionality...\n');

  const CLOUD_NAME = 'dib7tbv7w';
  const UPLOAD_PRESET = 'audio-tailoc';

  console.log('📋 Current configuration:');
  console.log('   Cloud Name:', CLOUD_NAME);
  console.log('   Upload Preset:', UPLOAD_PRESET);
  console.log('');

  try {
    // Test upload với một hình ảnh mẫu từ picsum
    console.log('📥 Downloading test image...');
    const response = await fetch('https://picsum.photos/300/200');
    const blob = await response.blob();

    console.log('☁️  Uploading to Cloudinary...');
    const formData = new FormData();
    formData.append('file', blob, 'test-image.jpg');
    formData.append('upload_preset', UPLOAD_PRESET);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await uploadResponse.json();

    if (uploadResponse.ok) {
      console.log('✅ Upload successful!');
      console.log('🔗 URL:', result.secure_url);
      console.log('🆔 Public ID:', result.public_id);
      console.log('📏 Dimensions:', result.width, 'x', result.height);
      console.log('📊 File size:', Math.round(result.bytes / 1024), 'KB');
      console.log('');
      console.log('🎉 Cloudinary is ready for your dashboard!');
    } else {
      console.log('❌ Upload failed!');
      console.log('Error:', result.error?.message || 'Unknown error');
      console.log('');

      if (result.error?.message?.includes('preset')) {
        console.log('� SOLUTION: Create Upload Preset in Cloudinary Dashboard');
        console.log('');
        console.log('Step 1: Go to https://cloudinary.com/console/settings/upload');
        console.log('Step 2: Click "Add upload preset"');
        console.log('Step 3: Configure:');
        console.log('   - Name: audio-tailoc');
        console.log('   - Mode: Unsigned');
        console.log('   - Folder: products');
        console.log('Step 4: Save and run this test again');
        console.log('');
        console.log('📖 Or read the full guide: cat CLOUDINARY_SETUP.md');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('💡 Possible solutions:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify Cloudinary credentials in .env.local');
    console.log('   3. Create upload preset as described above');
  }
}

testCloudinaryUpload();
