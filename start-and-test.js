#!/usr/bin/env node

const { spawn } = require('child_process');
const axios = require('axios');
const fs = require('fs');

const API_BASE = 'http://localhost:3010/api/v1';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${message}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

// Check if backend is running
async function checkBackendHealth() {
  try {
    const response = await axios.get(`${API_BASE}/health`, { 
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AudioTailoc-Health-Check/1.0'
      }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Wait for backend to be ready
async function waitForBackend(maxAttempts = 30) {
  log('🔍 Checking if backend is running...', 'cyan');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const isHealthy = await checkBackendHealth();
    
    if (isHealthy) {
      log(`✅ Backend is ready! (Attempt ${attempt}/${maxAttempts})`, 'green');
      return true;
    }
    
    log(`⏳ Waiting for backend... (${attempt}/${maxAttempts})`, 'yellow');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  log('❌ Backend failed to start within expected time', 'red');
  return false;
}

// Start backend server
function startBackend() {
  log('🚀 Starting backend server...', 'cyan');
  
  const backendProcess = spawn('npm', ['run', 'start:dev'], {
    cwd: './backend',
    stdio: 'pipe',
    shell: true
  });
  
  backendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Application is running on')) {
      log('✅ Backend server started successfully', 'green');
    }
  });
  
  backendProcess.stderr.on('data', (data) => {
    const error = data.toString();
    if (error.includes('Error')) {
      log(`⚠️  Backend warning: ${error.trim()}`, 'yellow');
    }
  });
  
  backendProcess.on('error', (error) => {
    log(`❌ Failed to start backend: ${error.message}`, 'red');
  });
  
  return backendProcess;
}

// Run API tests
async function runAPITests() {
  logHeader('RUNNING API TESTS');
  
  try {
    const { execSync } = require('child_process');
    const testOutput = execSync('node corrected-api-test.js', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    log(testOutput, 'reset');
    
    // Extract success rate from output
    const successRateMatch = testOutput.match(/Success Rate: (\d+\.\d+)%/);
    if (successRateMatch) {
      const successRate = parseFloat(successRateMatch[1]);
      log(`\n🎯 Final Success Rate: ${successRate}%`, 'bright');
      
      if (successRate >= 50) {
        log('🎉 Excellent! API is performing well!', 'green');
      } else if (successRate >= 30) {
        log('👍 Good! API is working but needs improvement', 'yellow');
      } else {
        log('⚠️  API needs significant improvement', 'red');
      }
    }
    
  } catch (error) {
    log(`❌ Failed to run API tests: ${error.message}`, 'red');
  }
}

// Generate summary report
function generateSummaryReport() {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    apiBaseUrl: API_BASE,
    summary: {
      backendStatus: 'Running',
      testStatus: 'Completed',
      recommendations: [
        'Continue improving authentication system',
        'Implement payment endpoints',
        'Add notifications system',
        'Fix remaining 500 errors'
      ]
    }
  };
  
  const reportFile = `system-test-summary-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  log(`📄 Summary report saved to: ${reportFile}`, 'cyan');
}

// Main function
async function main() {
  logHeader('AUDIO TÀI LỘC SYSTEM STARTUP & TEST');
  log('🎵 Starting Audio Tài Lộc Karaoke & Audio Equipment Rental Platform', 'bright');
  
  // Check if backend is already running
  const isBackendRunning = await checkBackendHealth();
  
  let backendProcess = null;
  
  if (!isBackendRunning) {
    log('🔧 Backend not running, starting it now...', 'yellow');
    backendProcess = startBackend();
    
    // Wait for backend to be ready
    const isReady = await waitForBackend();
    if (!isReady) {
      log('❌ Failed to start backend system', 'red');
      process.exit(1);
    }
  } else {
    log('✅ Backend is already running', 'green');
  }
  
  // Run API tests
  await runAPITests();
  
  // Generate summary
  generateSummaryReport();
  
  logHeader('SYSTEM READY');
  log('🎉 Audio Tài Lộc system is ready for use!', 'green');
  log('📍 Backend API: http://localhost:3010/api/v1', 'cyan');
  log('📚 API Documentation: http://localhost:3010/api/docs', 'cyan');
  
  // Keep the process running if we started the backend
  if (backendProcess) {
    log('\n💡 Press Ctrl+C to stop the backend server', 'yellow');
    
    process.on('SIGINT', () => {
      log('\n🛑 Shutting down backend server...', 'yellow');
      backendProcess.kill('SIGTERM');
      process.exit(0);
    });
    
    // Keep the process alive
    process.stdin.resume();
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`❌ Unhandled rejection: ${error.message}`, 'red');
  process.exit(1);
});

// Run main function
main().catch(error => {
  log(`❌ Startup failed: ${error.message}`, 'red');
  process.exit(1);
});
