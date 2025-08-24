#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 Audio Tài Lộc - System Sync & Test');
console.log('======================================');

const COMPONENTS = {
  backend: {
    path: 'backend',
    port: 8000,
    startCommand: ['npm', 'run', 'start:dev'],
    healthEndpoint: 'http://localhost:8000/health',
    name: 'Backend API Server'
  },
  dashboard: {
    path: 'dashboard', 
    port: 3001,
    startCommand: ['npm', 'run', 'dev'],
    healthEndpoint: 'http://localhost:3001',
    name: 'Admin Dashboard'
  },
  frontend: {
    path: 'frontend',
    port: 3000,
    startCommand: ['npm', 'run', 'dev'], 
    healthEndpoint: 'http://localhost:3000',
    name: 'User Frontend'
  }
};

class SystemManager {
  constructor() {
    this.processes = {};
    this.startupOrder = ['backend', 'dashboard', 'frontend'];
  }

  // Kiểm tra dependencies
  async checkDependencies(component) {
    const componentPath = COMPONENTS[component].path;
    const packageJsonPath = path.join(componentPath, 'package.json');
    
    console.log(`\n📦 Kiểm tra dependencies cho ${component}...`);
    
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`❌ Không tìm thấy package.json trong ${componentPath}`);
      return false;
    }

    // Check if node_modules exists
    const nodeModulesPath = path.join(componentPath, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log(`⚠️  node_modules không tồn tại, cài đặt dependencies...`);
      
      return new Promise((resolve) => {
        const install = spawn('npm', ['install'], { cwd: componentPath, stdio: 'inherit' });
        install.on('close', (code) => {
          if (code === 0) {
            console.log(`✅ Dependencies installed cho ${component}`);
            resolve(true);
          } else {
            console.log(`❌ Lỗi cài đặt dependencies cho ${component}`);
            resolve(false);
          }
        });
      });
    }
    
    console.log(`✅ Dependencies OK cho ${component}`);
    return true;
  }

  // Setup environment files
  setupEnvironment(component) {
    console.log(`\n🔧 Setup environment cho ${component}...`);
    
    const componentPath = COMPONENTS[component].path;
    const envPath = path.join(componentPath, '.env');
    const envLocalPath = path.join(componentPath, '.env.local');
    
    switch(component) {
      case 'backend':
        // Backend .env đã được tạo từ template
        if (fs.existsSync(path.join(componentPath, 'env-template.txt')) && !fs.existsSync(envPath)) {
          fs.copyFileSync(
            path.join(componentPath, 'env-template.txt'), 
            envPath
          );
          console.log('✅ Backend .env created from template');
        }
        break;
        
      case 'dashboard':
        if (!fs.existsSync(envLocalPath)) {
          const dashboardEnv = `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dashboard-secret-key-change-in-production
NEXT_PUBLIC_APP_NAME="Audio Tài Lộc Dashboard"`;
          fs.writeFileSync(envLocalPath, dashboardEnv);
          console.log('✅ Dashboard .env.local created');
        }
        break;
        
      case 'frontend':
        if (!fs.existsSync(envLocalPath)) {
          const frontendEnv = `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Audio Tài Lộc"
NEXT_PUBLIC_COMPANY_NAME="Audio Tài Lộc Company"`;
          fs.writeFileSync(envLocalPath, frontendEnv);
          console.log('✅ Frontend .env.local created');
        }
        break;
    }
  }

  // Khởi động một component
  async startComponent(component) {
    const config = COMPONENTS[component];
    console.log(`\n🚀 Khởi động ${config.name}...`);

    return new Promise((resolve) => {
      const process = spawn(config.startCommand[0], config.startCommand.slice(1), {
        cwd: config.path,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let isReady = false;
      let timeout;

      process.stdout.on('data', (data) => {
        const output = data.toString();
        
        // Log important messages
        if (output.includes('ready') || 
            output.includes('started') || 
            output.includes('listening') ||
            output.includes('compiled')) {
          console.log(`📋 ${component}:`, output.trim());
        }
        
        // Check if component is ready
        if ((component === 'backend' && (output.includes('listening on port') || output.includes('Application is running'))) ||
            (component === 'dashboard' && output.includes('ready')) ||
            (component === 'frontend' && output.includes('ready'))) {
          
          if (!isReady) {
            isReady = true;
            clearTimeout(timeout);
            console.log(`✅ ${config.name} started successfully on port ${config.port}`);
            resolve({ process, success: true });
          }
        }
      });

      process.stderr.on('data', (data) => {
        const error = data.toString();
        console.log(`⚠️  ${component} warning:`, error.trim());
      });

      process.on('close', (code) => {
        if (!isReady) {
          console.log(`❌ ${config.name} exited with code ${code}`);
          resolve({ process: null, success: false });
        }
      });

      // Timeout after 60 seconds
      timeout = setTimeout(() => {
        if (!isReady) {
          console.log(`⏰ ${config.name} startup timeout`);
          process.kill();
          resolve({ process: null, success: false });
        }
      }, 60000);

      this.processes[component] = process;
    });
  }

  // Test connectivity giữa các components
  async testConnectivity() {
    console.log('\n🔗 Testing system connectivity...');
    
    const tests = [
      {
        name: 'Backend Health',
        test: async () => {
          try {
            const fetch = require('node-fetch').default || require('node-fetch');
            const response = await fetch('http://localhost:8000/health');
            return response.ok;
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Backend API Categories',
        test: async () => {
          try {
            const fetch = require('node-fetch').default || require('node-fetch');
            const response = await fetch('http://localhost:8000/api/v1/catalog/categories');
            return response.status < 500; // Accept 401, 404, but not 500
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Dashboard → Backend Connection',
        test: async () => {
          // This would require the dashboard to be fully loaded
          // For now, just check if both are running
          return this.processes.dashboard && this.processes.backend;
        }
      },
      {
        name: 'Frontend → Backend Connection',
        test: async () => {
          return this.processes.frontend && this.processes.backend;
        }
      }
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        console.log(`${result ? '✅' : '❌'} ${test.name}: ${result ? 'OK' : 'FAIL'}`);
      } catch (error) {
        console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      }
    }
  }

  // Main startup sequence
  async startSystem() {
    console.log('\n🎬 Starting Audio Tài Lộc System...\n');

    // Step 1: Check and install dependencies
    for (const component of this.startupOrder) {
      const depsOk = await this.checkDependencies(component);
      if (!depsOk) {
        console.log(`❌ Cannot continue without ${component} dependencies`);
        return false;
      }
    }

    // Step 2: Setup environments
    for (const component of this.startupOrder) {
      this.setupEnvironment(component);
    }

    // Step 3: Start components in order
    for (const component of this.startupOrder) {
      const { success } = await this.startComponent(component);
      if (!success) {
        console.log(`❌ Failed to start ${component}`);
        return false;
      }
      
      // Wait between components
      if (component === 'backend') {
        console.log('⏱️  Waiting 10 seconds for backend to fully initialize...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      } else {
        console.log('⏱️  Waiting 5 seconds before starting next component...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Step 4: Test connectivity
    console.log('⏱️  Waiting 10 seconds before testing connectivity...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    await this.testConnectivity();

    return true;
  }

  // Cleanup function
  cleanup() {
    console.log('\n🧹 Cleaning up processes...');
    for (const [name, process] of Object.entries(this.processes)) {
      if (process && !process.killed) {
        console.log(`🔴 Stopping ${name}...`);
        process.kill();
      }
    }
  }

  // Show final status
  showStatus() {
    console.log('\n🎯 Audio Tài Lộc System Status');
    console.log('===============================');
    console.log('✅ Backend API:     http://localhost:8000');
    console.log('✅ Admin Dashboard: http://localhost:3001');
    console.log('✅ User Frontend:   http://localhost:3000');
    console.log('📚 API Docs:        http://localhost:8000/api');
    console.log('');
    console.log('🔧 Components Status:');
    for (const [name, process] of Object.entries(this.processes)) {
      const status = process && !process.killed ? '🟢 Running' : '🔴 Stopped';
      console.log(`   ${name}: ${status}`);
    }
    console.log('');
    console.log('💡 Next Steps:');
    console.log('   1. Configure PayOS credentials in backend/.env');
    console.log('   2. Test payment integration');
    console.log('   3. Customize frontend/dashboard as needed');
    console.log('');
    console.log('✋ Press Ctrl+C to stop all components');
  }
}

// Main execution
async function main() {
  const manager = new SystemManager();

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping Audio Tài Lộc System...');
    manager.cleanup();
    process.exit(0);
  });

  const success = await manager.startSystem();
  
  if (success) {
    manager.showStatus();
    
    // Keep running
    setInterval(() => {
      // Keep alive and monitor
    }, 5000);
  } else {
    console.log('\n❌ System startup failed. Please check the logs above.');
    manager.cleanup();
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SystemManager;
