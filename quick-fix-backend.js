#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const readline = require('readline');

console.log('🔧 Audio Tài Lộc - Quick Backend Fix');
console.log('====================================');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function runCommand(command, cwd = '.') {
  return new Promise((resolve) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ Error: ${error.message}`);
        resolve(false);
      } else {
        console.log(stdout.trim());
        resolve(true);
      }
    });
  });
}

async function setupPostgreSQL() {
  console.log('\n🐘 Setting up PostgreSQL with Docker...');
  
  // Check if Docker is available
  const dockerAvailable = await runCommand('docker --version');
  if (!dockerAvailable) {
    console.log('❌ Docker is required but not found');
    return false;
  }

  // Stop existing container if any
  await runCommand('docker rm -f audiotailoc-postgres');

  // Start PostgreSQL container
  console.log('🚀 Starting PostgreSQL container...');
  const started = await runCommand(`
    docker run --name audiotailoc-postgres 
    -e POSTGRES_PASSWORD=audiotailoc123 
    -e POSTGRES_USER=audiotailoc 
    -e POSTGRES_DB=audiotailoc 
    -p 5432:5432 -d postgres:15
  `.replace(/\s+/g, ' ').trim());

  if (!started) return false;

  // Wait for container to start
  console.log('⏱️  Waiting for PostgreSQL to be ready...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  return true;
}

async function setupBackend() {
  console.log('\n🔧 Setting up Backend...');
  
  // Navigate to backend directory
  process.chdir('./backend');

  // Restore PostgreSQL schema
  if (fs.existsSync('prisma/schema-postgresql.prisma.backup')) {
    fs.copyFileSync('prisma/schema-postgresql.prisma.backup', 'prisma/schema.prisma');
    console.log('✅ Restored PostgreSQL schema');
  }

  // Set environment variable
  process.env.DATABASE_URL = 'postgresql://audiotailoc:audiotailoc123@localhost:5432/audiotailoc?schema=public';
  
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  const generated = await runCommand('npx prisma generate');
  if (!generated) return false;

  // Push database schema
  console.log('🗄️  Pushing database schema...');
  const pushed = await runCommand('npx prisma db push');
  if (!pushed) return false;

  console.log('✅ Backend setup completed!');
  return true;
}

async function testBackend() {
  console.log('\n🧪 Testing Backend...');
  
  // Start backend in background
  const backend = spawn('npm', ['run', 'start:dev'], { 
    detached: false,
    stdio: ['ignore', 'pipe', 'pipe'] 
  });

  let backendReady = false;
  
  backend.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('📋 Backend:', output.trim());
    
    if (output.includes('listening') || output.includes('Application is running')) {
      backendReady = true;
    }
  });

  backend.stderr.on('data', (data) => {
    console.log('❌ Backend Error:', data.toString().trim());
  });

  // Wait for backend to start
  console.log('⏱️  Waiting for backend to start...');
  let attempts = 0;
  while (!backendReady && attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  if (!backendReady) {
    console.log('❌ Backend failed to start within 30 seconds');
    backend.kill();
    return false;
  }

  // Test endpoints
  console.log('🔍 Testing endpoints...');
  const fetch = require('node-fetch').default || require('node-fetch');
  
  try {
    const healthResponse = await fetch('http://localhost:8000/health');
    if (healthResponse.ok) {
      console.log('✅ Health endpoint: OK');
    } else {
      console.log('⚠️  Health endpoint: Failed');
    }
  } catch (error) {
    console.log('❌ Health endpoint: Error');
  }

  return { backend, success: true };
}

async function main() {
  try {
    console.log('🎯 Choose your setup option:');
    console.log('1. PostgreSQL + Full Backend (Recommended)');
    console.log('2. SQLite + Minimal Backend (Quick test)');
    console.log('3. Skip setup (Manual configuration)');
    
    const choice = await question('\nEnter your choice (1-3): ');
    
    if (choice === '1') {
      console.log('\n🚀 Setting up Full Backend with PostgreSQL...');
      
      const postgresOk = await setupPostgreSQL();
      if (!postgresOk) {
        console.log('❌ PostgreSQL setup failed');
        process.exit(1);
      }
      
      const backendOk = await setupBackend();
      if (!backendOk) {
        console.log('❌ Backend setup failed');  
        process.exit(1);
      }
      
      const { backend, success } = await testBackend();
      if (success) {
        console.log('\n🎉 Backend is running successfully!');
        console.log('📋 Available endpoints:');
        console.log('  - Health: http://localhost:8000/health');
        console.log('  - API Docs: http://localhost:8000/api');
        console.log('  - Dashboard: http://localhost:3001');
        console.log('  - Frontend: http://localhost:3000');
        console.log('\n✋ Press Ctrl+C to stop');
        
        // Keep running
        process.on('SIGINT', () => {
          console.log('\n👋 Stopping backend...');
          backend.kill();
          process.exit(0);
        });
        
        // Keep alive
        setInterval(() => {}, 1000);
      }
    } 
    else if (choice === '2') {
      console.log('\n🚀 Starting Minimal Backend...');
      process.chdir('./backend');
      
      // Use existing SQLite setup
      console.log('📦 Using SQLite database...');
      const started = await runCommand('npm run start:simple');
      
      if (started) {
        console.log('✅ Minimal backend should be running on http://localhost:8000');
      } else {
        console.log('❌ Failed to start minimal backend');
      }
    }
    else if (choice === '3') {
      console.log('\n📚 Manual Configuration:');
      console.log('1. Read BACKEND_TROUBLESHOOTING_SUMMARY.md');
      console.log('2. Choose database strategy (PostgreSQL/SQLite)');
      console.log('3. Follow SETUP_GUIDE.md instructions');
      console.log('4. Configure PayOS credentials in .env');
    }
    else {
      console.log('❌ Invalid choice');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}
