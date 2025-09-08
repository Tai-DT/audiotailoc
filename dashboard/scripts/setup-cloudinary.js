#!/usr/bin/env node

/**
 * Script để cấu hình Cloudinary upload preset
 * Chạy: node scripts/setup-cloudinary.js
 */

const https = require('https');
const querystring = require('querystring');

// Cấu hình từ .env
const CLOUD_NAME = 'dib7tbv7w';
const API_KEY = '515973253722995';
const API_SECRET = 'JHQbBTbJicxxdF7qoJrLUBLYI7w';

async function createUploadPreset() {
  const presetName = 'audio-tailoc';
  const presetData = {
    name: presetName,
    unsigned: true,
    folder: 'products',
    format: 'auto',
    quality: 'auto',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    max_file_size: 5242880, // 5MB
    transformation: [
      {
        width: 800,
        height: 600,
        crop: 'limit',
        quality: 'auto'
      }
    ]
  };

  const postData = querystring.stringify({
    upload_preset: JSON.stringify(presetData),
    timestamp: Math.floor(Date.now() / 1000)
  });

  const signature = require('crypto')
    .createHash('sha1')
    .update(`upload_preset=${JSON.stringify(presetData)}&timestamp=${Math.floor(Date.now() / 1000)}${API_SECRET}`)
    .digest('hex');

  const options = {
    hostname: 'api.cloudinary.com',
    port: 443,
    path: `/v1_1/${CLOUD_NAME}/upload_presets`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log('✅ Upload preset created successfully:', response.name);
            resolve(response);
          } else {
            console.log('⚠️  Upload preset may already exist or error:', response);
            resolve(response);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testUpload() {
  console.log('🚀 Testing Cloudinary upload...');

  // Test upload a small image
  const testImageUrl = 'https://picsum.photos/200/200';

  try {
    const response = await fetch(testImageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'audio-tailoc');

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await uploadResponse.json();

    if (uploadResponse.ok) {
      console.log('✅ Upload test successful!');
      console.log('📁 Uploaded to:', result.secure_url);
      console.log('🆔 Public ID:', result.public_id);
    } else {
      console.log('❌ Upload test failed:', result.error?.message);
    }
  } catch (error) {
    console.error('❌ Upload test error:', error.message);
  }
}

async function main() {
  console.log('🔧 Setting up Cloudinary for Audio Tài Lộc Dashboard...\n');

  try {
    console.log('📝 Creating upload preset...');
    await createUploadPreset();

    console.log('\n🧪 Testing upload functionality...');
    await testUpload();

    console.log('\n🎉 Setup complete!');
    console.log('📋 Summary:');
    console.log('   - Cloud Name:', CLOUD_NAME);
    console.log('   - Upload Preset: audio-tailoc');
    console.log('   - Max File Size: 5MB');
    console.log('   - Allowed Formats: JPG, PNG, JPEG, GIF, WebP');
    console.log('   - Auto Optimization: Enabled');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
