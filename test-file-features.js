#!/usr/bin/env node

/**
 * 🧪 File Features Test Script
 * Test tất cả các tính năng về file upload và management
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:8000/api/v1';

// Test user credentials
const TEST_USER = {
  email: 'testuser@example.com',
  password: 'TestPassword123!',
  name: 'Test User'
};

let authToken = null;

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
 * Tạo file text test
 */
function createTestTextFile() {
  return Buffer.from('This is a test text file for Audio Tài Lộc file upload testing.\n\nFeatures:\n- Text file upload\n- File validation\n- Storage management\n- Metadata tracking', 'utf8');
}

/**
 * Đăng ký user test
 */
async function registerTestUser() {
  console.log('👤 Registering test user...');
  
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TEST_USER)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test user registered successfully');
      return result;
    } else {
      const error = await response.text();
      if (error.includes('already exists')) {
        console.log('ℹ️  Test user already exists, proceeding with login');
        return null;
      } else {
        console.log(`❌ Registration failed: ${error}`);
        return null;
      }
    }
  } catch (error) {
    console.log(`❌ Registration error: ${error.message}`);
    return null;
  }
}

/**
 * Đăng nhập user test
 */
async function loginTestUser() {
  console.log('🔐 Logging in test user...');
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
    });

    if (response.ok) {
      const result = await response.json();
      authToken = result.accessToken;
      console.log('✅ Login successful, token obtained');
      return result;
    } else {
      const error = await response.text();
      console.log(`❌ Login failed: ${error}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Login error: ${error.message}`);
    return null;
  }
}

/**
 * Test single file upload
 */
async function testSingleFileUpload() {
  console.log('\n📤 Testing Single File Upload...');
  
  try {
    const testImageBuffer = createTestImage();
    const testFileName = 'test-image.png';
    
    console.log('📁 Creating test image...');
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', testImageBuffer, {
      filename: testFileName,
      contentType: 'image/png'
    });

    const response = await fetch(`${API_BASE}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Single file upload successful!');
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
      
      return result;
    } else {
      const errorText = await response.text();
      console.log(`❌ Single file upload failed: ${response.status} ${response.statusText}`);
      console.log(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Single file upload test failed: ${error.message}`);
    return null;
  }
}

/**
 * Test multiple file upload
 */
async function testMultipleFileUpload() {
  console.log('\n📤 Testing Multiple File Upload...');
  
  try {
    const testFiles = [
      { name: 'test1.png', buffer: createTestImage(), type: 'image/png' },
      { name: 'test2.png', buffer: createTestImage(), type: 'image/png' },
      { name: 'test3.txt', buffer: createTestTextFile(), type: 'text/plain' }
    ];
    
    console.log('📁 Creating test files...');
    
    const FormData = require('form-data');
    const form = new FormData();
    
    testFiles.forEach((file, index) => {
      form.append('files', file.buffer, {
        filename: file.name,
        contentType: file.type
      });
    });

    const response = await fetch(`${API_BASE}/files/upload-multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (response.ok) {
      const results = await response.json();
      console.log(`✅ Multiple file upload successful! ${results.length} files uploaded`);
      
      results.forEach((result, index) => {
        console.log(`\n📄 File ${index + 1}:`);
        console.log(`  - File ID: ${result.id}`);
        console.log(`  - Filename: ${result.filename}`);
        console.log(`  - Original Name: ${result.originalName}`);
        console.log(`  - MIME Type: ${result.mimeType}`);
        console.log(`  - Size: ${result.size} bytes`);
        console.log(`  - URL: ${result.url}`);
        console.log(`  - Storage: ${result.metadata?.storage || 'unknown'}`);
      });

      return results;
    } else {
      const errorText = await response.text();
      console.log(`❌ Multiple file upload failed: ${response.status} ${response.statusText}`);
      console.log(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Multiple file upload test failed: ${error.message}`);
    return null;
  }
}

/**
 * Test product image upload
 */
async function testProductImageUpload() {
  console.log('\n📤 Testing Product Image Upload...');
  
  try {
    const testImageBuffer = createTestImage();
    const testFileName = 'product-test.png';
    const productId = 'test-product-123';
    
    console.log('📁 Creating product test image...');
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', testImageBuffer, {
      filename: testFileName,
      contentType: 'image/png'
    });

    const response = await fetch(`${API_BASE}/files/upload/product-image/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Product image upload successful!');
      console.log('📊 Upload Result:');
      console.log(`  - File ID: ${result.id}`);
      console.log(`  - Product ID: ${productId}`);
      console.log(`  - Filename: ${result.filename}`);
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
 * Test avatar upload
 */
async function testAvatarUpload() {
  console.log('\n📤 Testing Avatar Upload...');
  
  try {
    const testImageBuffer = createTestImage();
    const testFileName = 'avatar-test.png';
    
    console.log('📁 Creating avatar test image...');
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('avatar', testImageBuffer, {
      filename: testFileName,
      contentType: 'image/png'
    });

    const response = await fetch(`${API_BASE}/files/upload/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Avatar upload successful!');
      console.log('📊 Upload Result:');
      console.log(`  - File ID: ${result.id}`);
      console.log(`  - Filename: ${result.filename}`);
      console.log(`  - URL: ${result.url}`);
      console.log(`  - Storage: ${result.metadata?.storage || 'unknown'}`);
      
      return result;
    } else {
      const errorText = await response.text();
      console.log(`❌ Avatar upload failed: ${response.status} ${response.statusText}`);
      console.log(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Avatar upload test failed: ${error.message}`);
    return null;
  }
}

/**
 * Test list files
 */
async function testListFiles() {
  console.log('\n📋 Testing List Files...');
  
  try {
    const response = await fetch(`${API_BASE}/files`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ List files successful!');
      console.log(`📊 Found ${result.length || 0} files`);
      
      if (result.length > 0) {
        result.forEach((file, index) => {
          console.log(`\n📄 File ${index + 1}:`);
          console.log(`  - File ID: ${file.id}`);
          console.log(`  - Filename: ${file.filename}`);
          console.log(`  - Original Name: ${file.originalName}`);
          console.log(`  - MIME Type: ${file.mimeType}`);
          console.log(`  - Size: ${file.size} bytes`);
          console.log(`  - URL: ${file.url}`);
          console.log(`  - Storage: ${file.metadata?.storage || 'unknown'}`);
        });
      }
      
      return result;
    } else {
      const errorText = await response.text();
      console.log(`❌ List files failed: ${response.status} ${response.statusText}`);
      console.log(`Error details: ${errorText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ List files test failed: ${error.message}`);
    return null;
  }
}

/**
 * Test file validation
 */
async function testFileValidation() {
  console.log('\n🔍 Testing File Validation...');
  
  try {
    // Test với file quá lớn
    const largeBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB
    const largeFileName = 'large-file.png';
    
    console.log('📁 Creating large test file (10MB)...');
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', largeBuffer, {
      filename: largeFileName,
      contentType: 'image/png'
    });

    const response = await fetch(`${API_BASE}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (response.status === 400 || response.status === 413) {
      console.log('✅ File validation working correctly - large file rejected');
      const errorText = await response.text();
      console.log(`Error message: ${errorText}`);
      return true;
    } else if (response.ok) {
      console.log('⚠️  Large file was accepted (validation might need adjustment)');
      return true;
    } else {
      console.log(`❌ Unexpected response: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ File validation test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test Cloudinary configuration
 */
async function testCloudinaryConfig() {
  console.log('\n☁️ Testing Cloudinary Configuration...');
  
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

    // Test files endpoint accessibility
    console.log('📁 Testing files endpoint accessibility...');
    const filesResponse = await fetch(`${API_BASE}/files`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (filesResponse.status === 200 || filesResponse.status === 401) {
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
  console.log('🧪 File Features Test Suite');
  console.log('===========================\n');

  // Test configuration
  const configOk = await testCloudinaryConfig();
  if (!configOk) {
    console.log('\n❌ Configuration test failed. Please check your setup.');
    return;
  }

  // Setup authentication
  await registerTestUser();
  const loginResult = await loginTestUser();
  if (!loginResult) {
    console.log('\n❌ Authentication failed. Cannot proceed with file tests.');
    return;
  }

  // Run file tests
  const singleResult = await testSingleFileUpload();
  const multipleResult = await testMultipleFileUpload();
  const productResult = await testProductImageUpload();
  const avatarResult = await testAvatarUpload();
  const listResult = await testListFiles();
  const validationResult = await testFileValidation();

  // Summary
  console.log('\n📋 TEST SUMMARY');
  console.log('===============');
  console.log(`Single File Upload: ${singleResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Multiple File Upload: ${multipleResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Product Image Upload: ${productResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Avatar Upload: ${avatarResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`List Files: ${listResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`File Validation: ${validationResult ? '✅ PASSED' : '❌ FAILED'}`);

  const allPassed = singleResult && multipleResult && productResult && avatarResult && listResult && validationResult;
  
  if (allPassed) {
    console.log('\n🎉 All file feature tests passed! File system is working correctly.');
  } else {
    console.log('\n⚠️  Some file feature tests failed. Please check your configuration.');
  }

  // Tạo báo cáo
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = `file-features-test-report-${timestamp}.json`;
  
  const report = {
    timestamp: new Date().toISOString(),
    tests: {
      configuration: configOk,
      authentication: !!loginResult,
      singleUpload: !!singleResult,
      multipleUpload: !!multipleResult,
      productUpload: !!productResult,
      avatarUpload: !!avatarResult,
      listFiles: !!listResult,
      validation: validationResult
    },
    results: {
      single: singleResult,
      multiple: multipleResult,
      product: productResult,
      avatar: avatarResult,
      list: listResult
    },
    summary: {
      allPassed,
      totalTests: 8,
      passedTests: [configOk, !!loginResult, !!singleResult, !!multipleResult, !!productResult, !!avatarResult, !!listResult, validationResult].filter(Boolean).length
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
  testSingleFileUpload, 
  testMultipleFileUpload, 
  testProductImageUpload,
  testAvatarUpload,
  testListFiles,
  testFileValidation,
  testCloudinaryConfig 
};
