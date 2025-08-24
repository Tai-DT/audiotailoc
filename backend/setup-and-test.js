#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch').default || require('node-fetch');

console.log('🚀 Audio Tài Lộc - Backend Setup & Test Script');
console.log('====================================================');

// Kiểm tra file .env
function checkEnvFile() {
  console.log('\n📋 Kiểm tra cấu hình .env...');
  
  if (!fs.existsSync('.env')) {
    console.log('❌ File .env không tồn tại');
    console.log('✅ Tự động copy từ env-template.txt...');
    if (fs.existsSync('env-template.txt')) {
      fs.copyFileSync('env-template.txt', '.env');
      console.log('✅ Đã tạo file .env từ template');
    } else {
      console.log('❌ Không tìm thấy env-template.txt');
      return false;
    }
  }

  // Đọc và kiểm tra các cấu hình quan trọng
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET', 
    'PAYOS_CLIENT_ID',
    'PAYOS_API_KEY',
    'PAYOS_CHECKSUM_KEY'
  ];

  console.log('\n🔍 Kiểm tra biến môi trường quan trọng:');
  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}="your-`) || envContent.includes(`${varName}=your-`)) {
      console.log(`⚠️  ${varName}: CẦN CẬP NHẬT`);
    } else {
      console.log(`✅ ${varName}: Đã cấu hình`);
    }
  });

  return true;
}

// Kiểm tra database
async function checkDatabase() {
  console.log('\n🗄️  Kiểm tra cơ sở dữ liệu...');
  
  return new Promise((resolve) => {
    exec('npm run prisma:generate', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Lỗi Prisma generate:', error.message);
        resolve(false);
      } else {
        console.log('✅ Prisma client generated thành công');
        resolve(true);
      }
    });
  });
}

// Khởi động backend
async function startBackend() {
  console.log('\n🚀 Khởi động backend server...');
  
  return new Promise((resolve) => {
    const backend = spawn('npm', ['run', 'start:dev'], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let startupComplete = false;
    let timeout;

    backend.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('📋 Backend Log:', output.trim());
      
      if (output.includes('listening on port') || output.includes('Application is running on')) {
        startupComplete = true;
        clearTimeout(timeout);
        console.log('✅ Backend khởi động thành công!');
        resolve({ process: backend, success: true });
      }
    });

    backend.stderr.on('data', (data) => {
      const error = data.toString();
      console.log('❌ Backend Error:', error.trim());
    });

    // Timeout sau 30 giây
    timeout = setTimeout(() => {
      if (!startupComplete) {
        console.log('⏰ Timeout: Backend khởi động quá lâu');
        backend.kill();
        resolve({ process: null, success: false });
      }
    }, 30000);

    backend.on('close', (code) => {
      if (!startupComplete) {
        console.log(`❌ Backend thoát với mã lỗi: ${code}`);
        resolve({ process: null, success: false });
      }
    });
  });
}

// Test API endpoints
async function testApiEndpoints() {
  console.log('\n🔍 Kiểm tra API endpoints...');
  
  const endpoints = [
    { url: 'http://localhost:8000/health', name: 'Health Check' },
    { url: 'http://localhost:8000/api/v1/catalog/categories', name: 'Categories API' },
    { url: 'http://localhost:8000/api/v1/catalog/products', name: 'Products API' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url);
      if (response.ok) {
        console.log(`✅ ${endpoint.name}: OK`);
      } else {
        console.log(`⚠️  ${endpoint.name}: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
    }
  }
}

// Hiển thị hướng dẫn PayOS
function showPayOSGuide() {
  console.log('\n💳 Hướng dẫn cấu hình PayOS:');
  console.log('=====================================');
  console.log('1. Truy cập: https://payos.vn');
  console.log('2. Đăng ký tài khoản merchant');
  console.log('3. Lấy thông tin API credentials:');
  console.log('   - PAYOS_CLIENT_ID');
  console.log('   - PAYOS_API_KEY');
  console.log('   - PAYOS_CHECKSUM_KEY');
  console.log('   - PAYOS_PARTNER_CODE');
  console.log('');
  console.log('4. Cập nhật file .env với credentials thực tế');
  console.log('5. Khởi động lại backend: npm run start:dev');
  console.log('');
  console.log('📋 Test API thanh toán:');
  console.log('curl -X POST http://localhost:8000/api/v1/payments/intents \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"orderId":"test-order","provider":"PAYOS"}\'');
}

// Main function
async function main() {
  try {
    // Bước 1: Kiểm tra .env
    if (!checkEnvFile()) {
      console.log('❌ Không thể tiếp tục mà không có cấu hình .env');
      return;
    }

    // Bước 2: Kiểm tra database
    const dbOk = await checkDatabase();
    if (!dbOk) {
      console.log('❌ Vấn đề với database, vui lòng kiểm tra lại');
      return;
    }

    // Bước 3: Khởi động backend
    const { process: backendProcess, success } = await startBackend();
    
    if (!success) {
      console.log('❌ Không thể khởi động backend');
      showPayOSGuide();
      return;
    }

    // Bước 4: Test APIs
    setTimeout(async () => {
      await testApiEndpoints();
      
      // Hiển thị hướng dẫn
      showPayOSGuide();
      
      console.log('\n🎉 Setup hoàn tất! Backend đang chạy tại: http://localhost:8000');
      console.log('📚 API Documentation: http://localhost:8000/api');
      console.log('');
      console.log('✋ Nhấn Ctrl+C để dừng backend');
      
      // Giữ process chạy
      process.on('SIGINT', () => {
        console.log('\n👋 Đang dừng backend...');
        if (backendProcess) {
          backendProcess.kill();
        }
        process.exit(0);
      });
      
    }, 5000);

  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkEnvFile, checkDatabase, startBackend, testApiEndpoints };
