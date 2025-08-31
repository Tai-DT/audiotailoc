#!/usr/bin/env node

import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const BACKEND_URL = 'http://localhost:3010/api/v1';
const FRONTEND_URL = 'http://localhost:3001';

let backendProcess = null;
let frontendProcess = null;

async function checkPort(port) {
  try {
    await execAsync(`lsof -i :${port}`);
    return true;
  } catch {
    return false;
  }
}

async function waitForService(url, serviceName, maxAttempts = 30) {
  console.log(`⏳ Waiting for ${serviceName} to be ready...`);
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const { stdout } = await execAsync(`curl -s "${url}"`);
      if (stdout && !stdout.includes('Connection refused')) {
        console.log(`✅ ${serviceName} is ready!`);
        return true;
      }
    } catch (error) {
      // Ignore errors during startup
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    process.stdout.write('.');
  }
  
  console.log(`\n❌ ${serviceName} failed to start within ${maxAttempts * 2} seconds`);
  return false;
}

function startBackend() {
  console.log('🚀 Starting Backend...');
  
  backendProcess = spawn('npm', ['run', 'dev'], {
    cwd: './backend',
    stdio: 'pipe',
    shell: true
  });

  backendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Nest application successfully started')) {
      console.log('✅ Backend started successfully!');
    }
  });

  backendProcess.stderr.on('data', (data) => {
    console.error('Backend Error:', data.toString());
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  return backendProcess;
}

function startFrontend() {
  console.log('🎨 Starting Frontend...');
  
  frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: './frontend',
    stdio: 'pipe',
    shell: true
  });

  frontendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Ready in')) {
      console.log('✅ Frontend started successfully!');
    }
  });

  frontendProcess.stderr.on('data', (data) => {
    console.error('Frontend Error:', data.toString());
  });

  frontendProcess.on('close', (code) => {
    console.log(`Frontend process exited with code ${code}`);
  });

  return frontendProcess;
}

async function setupDatabase() {
  console.log('🗄️ Setting up database...');
  
  try {
    // Check if database needs setup
    const { stdout } = await execAsync('cd backend && npx prisma db push --accept-data-loss', { 
      stdio: 'pipe' 
    });
    console.log('✅ Database setup completed');
  } catch (error) {
    console.log('⚠️ Database setup warning:', error.message);
  }
}

function cleanup() {
  console.log('\n🛑 Shutting down services...');
  
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
  
  if (frontendProcess) {
    frontendProcess.kill('SIGTERM');
  }
  
  process.exit(0);
}

async function main() {
  console.log('🎵 Audio Tài Lộc - System Startup\n');
  
  // Handle graceful shutdown
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
  try {
    // Setup database first
    await setupDatabase();
    
    // Start backend
    startBackend();
    await waitForService(`${BACKEND_URL}/health`, 'Backend');
    
    // Start frontend
    startFrontend();
    await waitForService(FRONTEND_URL, 'Frontend');
    
    console.log('\n🎉 System is ready!');
    console.log('\n📱 Access your application:');
    console.log(`Frontend: ${FRONTEND_URL}`);
    console.log(`Backend API: ${BACKEND_URL}`);
    console.log(`API Documentation: ${BACKEND_URL.replace('/api/v1', '')}/docs`);
    console.log('\nPress Ctrl+C to stop all services');
    
  } catch (error) {
    console.error('❌ Failed to start system:', error.message);
    cleanup();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main, startBackend, startFrontend, cleanup };

