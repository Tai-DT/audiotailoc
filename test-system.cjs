#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const BACKEND_URL = 'http://localhost:3010/api/v1';
const FRONTEND_URL = 'http://localhost:3001';

async function makeRequest(url) {
  try {
    const { stdout } = await execAsync(`curl -s "${url}"`);
    return { success: true, data: stdout };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testBackend() {
  console.log('🔧 Testing Backend API...');
  
  try {
    // Test health endpoint
    const healthResponse = await makeRequest(`${BACKEND_URL}/health`);
    if (healthResponse.success) {
      const data = JSON.parse(healthResponse.data);
      console.log('✅ Health check:', data.success ? 'PASS' : 'FAIL');
      console.log('✅ Backend connection: PASS');
      return true;
    } else {
      console.log('❌ Backend test failed:', healthResponse.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend test failed:', error.message);
    return false;
  }
}

async function testFrontend() {
  console.log('\n🎨 Testing Frontend...');
  
  try {
    const response = await makeRequest(FRONTEND_URL);
    if (response.success) {
      console.log('✅ Frontend connection: PASS');
      console.log('✅ Frontend is responding');
      return true;
    } else {
      console.log('❌ Frontend test failed:', response.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend test failed:', error.message);
    return false;
  }
}

async function testDatabase() {
  console.log('\n🗄️ Testing Database...');
  
  try {
    // Test if we can access the database through the API
    const response = await makeRequest(`${BACKEND_URL}/health`);
    if (response.success) {
      const data = JSON.parse(response.data);
      if (data.success) {
        console.log('✅ Database connection: PASS');
        return true;
      } else {
        console.log('❌ Database connection: FAIL');
        return false;
      }
    } else {
      console.log('❌ Database test failed:', response.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting System Tests...\n');
  
  const backendOk = await testBackend();
  const frontendOk = await testFrontend();
  const databaseOk = await testDatabase();
  
  console.log('\n📊 Test Results:');
  console.log('Backend:', backendOk ? '✅ PASS' : '❌ FAIL');
  console.log('Frontend:', frontendOk ? '✅ PASS' : '❌ FAIL');
  console.log('Database:', databaseOk ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = backendOk && frontendOk && databaseOk;
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! System is running correctly.');
    console.log('\n📱 Access your application:');
    console.log(`Frontend: ${FRONTEND_URL}`);
    console.log(`Backend API: ${BACKEND_URL}`);
    console.log(`API Documentation: ${BACKEND_URL.replace('/api/v1', '')}/docs`);
  } else {
    console.log('\n⚠️ Some tests failed. Please check the logs above.');
  }
  
  return allPassed;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testBackend, testFrontend, testDatabase };
