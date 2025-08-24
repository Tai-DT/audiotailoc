#!/usr/bin/env node

/**
 * 🧪 Cloudinary Upload Test Script
 * Test Cloudinary image upload functionality
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:8000/api/v1';

/**
 * Tạo file ảnh test
 */
function createTestImage() {
  // Tạo một ảnh PNG đơn giản (1x1 pixel màu đỏ)
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
    0xE2, 0x21, 0xBC, 0x33, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);

  return pngBuffer;
}

/**
 * Test upload file
 */
async function testFileUpload() {
  console.log('🧪 Testing Cloudinary File Upload...\n');

  try {
    // Tạo file ảnh test
    const testImageBuffer = createTestImage();
    const testFileName = 'test-image.png';
    
    console.log('📁 Creating test image...');
    
    // Tạo FormData
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', testImageBuffer, {
      filename: testFileName,
      contentType: 'image/png'
    });

    // Test upload
    console.log('📤 Uploading test image...');
    const response = await fetch(`${API_BASE}/files/upload`, {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful!');
      console.log('📊 Upload Result:');
      console.log(`  - File ID: ${result.id}`);
      console.log(`  - Filename: ${result.filename}`);
      console.log(`  - Original Name: ${result.originalName}`);
      console.log(`  - MIME Type: ${result.mimeType}`);
      console.log(`  - Size: ${result.size} bytes`);
      console.log(`  - URL: ${result.url}`);
      console.log(`  - Storage: ${result.metadata?.storage || 'unknown'}`);
      
      if (result.thumbnailUrl) {
        console.log(`  - Thumbnail URL: ${result.thumbnailUrl}`);
      }
      
      if (result.metadata?.publicId) {
        console.log(`  - Cloudinary Public ID: ${result.metadata.publicId}`);
      }

      return result;
    } else {
      const errorText = await response.text();
      console.log(`❌ Upload failed: ${response.status} ${response.statusText}`);
      console.log(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Upload test failed: ${error.message}`);
    return null;
  }
}

/**
 * Test multiple file upload
 */
async function testMultipleFileUpload() {
  console.log('\n🧪 Testing Multiple File Upload...\n');

  try {
    // Tạo nhiều file ảnh test
    const testImages = [
      { name: 'test1.png', buffer: createTestImage() },
      { name: 'test2.png', buffer: createTestImage() },
      { name: 'test3.png', buffer: createTestImage() }
    ];
    
    console.log('📁 Creating test images...');
    
    // Tạo FormData
    const FormData = require('form-data');
    const form = new FormData();
    
    testImages.forEach((image, index) => {
      form.append('files', image.buffer, {
        filename: image.name,
        contentType: 'image/png'
      });
    });

    // Test upload
    console.log('📤 Uploading multiple test images...');
    const response = await fetch(`${API_BASE}/files/upload-multiple`, {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      const results = await response.json();
      console.log(`✅ Multiple upload successful! ${results.length} files uploaded`);
      
      results.forEach((result, index) => {
        console.log(`\n📄 File ${index + 1}:`);
        console.log(`  - File ID: ${result.id}`);
        console.log(`  - Filename: ${result.filename}`);
        console.log(`  - URL: ${result.url}`);
        console.log(`  - Storage: ${result.metadata?.storage || 'unknown'}`);
      });

      return results;
    } else {
      const errorText = await response.text();
      console.log(`❌ Multiple upload failed: ${response.status} ${response.statusText}`);
      console.log(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Multiple upload test failed: ${error.message}`);
    return null;
  }
}

/**
 * Test product image upload
 */
async function testProductImageUpload() {
  console.log('\n🧪 Testing Product Image Upload...\n');

  try {
    // Tạo file ảnh test
    const testImageBuffer = createTestImage();
    const testFileName = 'product-test.png';
    
    console.log('📁 Creating product test image...');
    
    // Tạo FormData
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', testImageBuffer, {
      filename: testFileName,
      contentType: 'image/png'
    });

    // Test upload với product ID
    const productId = 'test-product-123';
    console.log(`📤 Uploading product image for product ID: ${productId}...`);
    
    const response = await fetch(`${API_BASE}/files/upload/product-image/${productId}`, {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Product image upload successful!');
      console.log('📊 Upload Result:');
      console.log(`  - File ID: ${result.id}`);
      console.log(`  - Product ID: ${productId}`);
      console.log(`  - URL: ${result.url}`);
      console.log(`  - Storage: ${result.metadata?.storage || 'unknown'}`);
      
      return result;
    } else {
      const errorText = await response.text();
      console.log(`❌ Product image upload failed: ${response.status} ${response.statusText}`);
      console.log(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Product image upload test failed: ${error.message}`);
    return null;
  }
}

/**
 * Test Cloudinary configuration
 */
async function testCloudinaryConfig() {
  console.log('☁️ Testing Cloudinary Configuration...\n');

  try {
    // Test health check
    console.log('🏥 Testing API health...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    
    if (healthResponse.ok) {
      console.log('✅ API is healthy');
    } else {
      console.log('❌ API health check failed');
      return false;
    }

    // Test files endpoint
    console.log('📁 Testing files endpoint...');
    const filesResponse = await fetch(`${API_BASE}/files`);
    
    if (filesResponse.ok) {
      console.log('✅ Files endpoint is accessible');
    } else {
      console.log(`❌ Files endpoint failed: ${filesResponse.status}`);
    }

    return true;
  } catch (error) {
    console.log(`❌ Configuration test failed: ${error.message}`);
    return false;
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🧪 Cloudinary Upload Test Suite');
  console.log('================================\n');

  // Test configuration
  const configOk = await testCloudinaryConfig();
  if (!configOk) {
    console.log('\n❌ Configuration test failed. Please check your setup.');
    return;
  }

  // Test single file upload
  const singleResult = await testFileUpload();
  
  // Test multiple file upload
  const multipleResult = await testMultipleFileUpload();
  
  // Test product image upload
  const productResult = await testProductImageUpload();

  // Summary
  console.log('\n📋 TEST SUMMARY');
  console.log('===============');
  console.log(`Single File Upload: ${singleResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Multiple File Upload: ${multipleResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Product Image Upload: ${productResult ? '✅ PASSED' : '❌ FAILED'}`);

  const allPassed = singleResult && multipleResult && productResult;
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Cloudinary is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your Cloudinary configuration.');
  }

  // Tạo báo cáo
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = `cloudinary-test-report-${timestamp}.json`;
  
  const report = {
    timestamp: new Date().toISOString(),
    tests: {
      configuration: configOk,
      singleUpload: !!singleResult,
      multipleUpload: !!multipleResult,
      productUpload: !!productResult
    },
    results: {
      single: singleResult,
      multiple: multipleResult,
      product: productResult
    },
    summary: {
      allPassed,
      totalTests: 4,
      passedTests: [configOk, !!singleResult, !!multipleResult, !!productResult].filter(Boolean).length
    }
  };

  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`\n📄 Test report saved: ${reportFile}`);

  return report;
}

// Chạy tests nếu được gọi trực tiếp
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { 
  runTests, 
  testFileUpload, 
  testMultipleFileUpload, 
  testProductImageUpload,
  testCloudinaryConfig 
};
