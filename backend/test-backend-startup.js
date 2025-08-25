const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Testing Backend Startup...');

// Start the backend server
const server = spawn('npm', ['run', 'start:dev'], {
  stdio: 'pipe',
  shell: true
});

let serverReady = false;
let startupTimeout;

// Set timeout for startup
startupTimeout = setTimeout(() => {
  console.log('❌ Server startup timeout after 30 seconds');
  server.kill();
  process.exit(1);
}, 30000);

// Monitor server output
server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('📝 Server output:', output);
  
  // Check if server is ready
  if (output.includes('Application is running on: http://localhost:3010')) {
    serverReady = true;
    clearTimeout(startupTimeout);
    console.log('✅ Server started successfully!');
    
    // Test health endpoint
    testHealthEndpoint();
  }
});

server.stderr.on('data', (data) => {
  const error = data.toString();
  console.log('❌ Server error:', error);
  
  if (error.includes('Error') || error.includes('Failed')) {
    clearTimeout(startupTimeout);
    console.log('❌ Server failed to start');
    server.kill();
    process.exit(1);
  }
});

function testHealthEndpoint() {
  const options = {
    hostname: 'localhost',
    port: 3010,
    path: '/health',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Health check status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📊 Health check response:', data);
      console.log('✅ Backend is working correctly!');
      server.kill();
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.log('❌ Health check failed:', err.message);
    server.kill();
    process.exit(1);
  });

  req.on('timeout', () => {
    console.log('❌ Health check timeout');
    req.destroy();
    server.kill();
    process.exit(1);
  });

  req.end();
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down...');
  server.kill();
  process.exit(0);
});

