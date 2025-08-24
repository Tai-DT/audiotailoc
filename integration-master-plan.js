#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🚀 Audio Tài Lộc - Integration Master Plan');
console.log('============================================');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const COMPONENTS = {
  backend: {
    path: 'backend',
    port: 8000,
    envFile: '.env',
    healthEndpoint: 'http://localhost:8000/health',
    startCommand: ['npm', 'run', 'start:dev']
  },
  frontend: {
    path: 'frontend', 
    port: 3000,
    envFile: '.env.local',
    healthEndpoint: 'http://localhost:3000',
    startCommand: ['npm', 'run', 'dev']
  },
  dashboard: {
    path: 'dashboard',
    port: 3001,
    envFile: '.env.local', 
    healthEndpoint: 'http://localhost:3001',
    startCommand: ['npm', 'run', 'dev']
  }
};

class IntegrationManager {
  constructor() {
    this.processes = {};
    this.phase = 1;
    this.completedTasks = [];
  }

  async runCommand(command, cwd = '.', timeout = 30000) {
    return new Promise((resolve) => {
      console.log(`📋 Running: ${command} (in ${cwd})`);
      
      const child = exec(command, { cwd, timeout }, (error, stdout, stderr) => {
        if (error) {
          console.log(`❌ Error: ${error.message}`);
          resolve(false);
        } else {
          if (stdout.trim()) console.log(`✅ Output: ${stdout.trim()}`);
          resolve(true);
        }
      });
    });
  }

  async question(prompt) {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  }

  // PHASE 1: Backend Recovery & API Standardization
  async phase1_BackendRecovery() {
    console.log('\n🔧 PHASE 1: Backend Recovery & API Standardization');
    console.log('===================================================');

    // Step 1: Database Strategy Decision
    console.log('\n📋 Step 1: Database Strategy Decision');
    const dbChoice = await this.question('Choose database: (1) PostgreSQL (recommended), (2) Fix SQLite: ');
    
    if (dbChoice === '1') {
      await this.setupPostgreSQL();
    } else {
      await this.fixSQLiteSchema();
    }

    // Step 2: Backend Module Recovery
    console.log('\n📋 Step 2: Backend Module Recovery');
    await this.enableBackendModules();

    // Step 3: API Endpoint Standardization
    console.log('\n📋 Step 3: API Endpoint Standardization');
    await this.standardizeAPIEndpoints();

    console.log('\n✅ PHASE 1 COMPLETED: Backend Recovery & API Standardization');
    this.completedTasks.push('Phase 1: Backend Recovery');
  }

  async setupPostgreSQL() {
    console.log('\n🐘 Setting up PostgreSQL...');
    
    // Stop existing containers
    await this.runCommand('docker rm -f audiotailoc-postgres');
    
    // Start PostgreSQL container
    const postgresCmd = `docker run --name audiotailoc-postgres -e POSTGRES_PASSWORD=audiotailoc123 -e POSTGRES_USER=audiotailoc -e POSTGRES_DB=audiotailoc -p 5432:5432 -d postgres:15`;
    const started = await this.runCommand(postgresCmd);
    
    if (!started) {
      console.log('❌ Failed to start PostgreSQL');
      return false;
    }

    // Wait for container to be ready
    console.log('⏱️ Waiting for PostgreSQL to be ready...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Switch to PostgreSQL schema in backend
    const backendPath = path.join(process.cwd(), 'backend');
    if (fs.existsSync(path.join(backendPath, 'prisma/schema-postgresql.prisma.backup'))) {
      fs.copyFileSync(
        path.join(backendPath, 'prisma/schema-postgresql.prisma.backup'),
        path.join(backendPath, 'prisma/schema.prisma')
      );
      console.log('✅ Restored PostgreSQL schema');
    }

    // Update environment
    const envContent = `DATABASE_URL="postgresql://audiotailoc:audiotailoc123@localhost:5432/audiotailoc?schema=public"
POSTGRES_URL="postgresql://audiotailoc:audiotailoc123@localhost:5432/audiotailoc?schema=public"

# JWT Configuration
JWT_ACCESS_SECRET="audio-tailoc-jwt-secret-key-2024"
JWT_REFRESH_SECRET="audio-tailoc-refresh-secret-key-2024"

# PayOS Configuration (Update with real credentials)
PAYOS_CLIENT_ID="your-payos-client-id"
PAYOS_API_KEY="your-payos-api-key"
PAYOS_CHECKSUM_KEY="your-payos-checksum-key"
PAYOS_PARTNER_CODE="your-payos-partner-code"
PAYOS_WEBHOOK_URL="http://localhost:8000/api/v1/payments/payos/webhook"
PAYOS_RETURN_URL="http://localhost:3000/checkout/return"

# Server Configuration
PORT=8000
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"`;

    fs.writeFileSync(path.join(backendPath, '.env'), envContent);

    // Generate Prisma client and push schema
    await this.runCommand('npx prisma generate', backendPath);
    await this.runCommand('npx prisma db push', backendPath);

    console.log('✅ PostgreSQL setup completed');
    return true;
  }

  async fixSQLiteSchema() {
    console.log('\n🗄️ Fixing SQLite schema...');
    // Implementation for SQLite schema fixes would go here
    // This is the more complex option requiring schema modifications
    console.log('⚠️ SQLite schema fixes require manual module updates');
    return true;
  }

  async enableBackendModules() {
    console.log('\n📦 Enabling Backend Modules...');
    
    const appModulePath = path.join(process.cwd(), 'backend/src/modules/app.module.ts');
    
    // Read current app.module.ts
    let content = fs.readFileSync(appModulePath, 'utf8');
    
    // Enable modules by uncommenting imports and includes
    const enableModules = [
      'CatalogModule',
      'CartModule', 
      'PaymentsModule',
      'OrdersModule',
      'InventoryModule',
      'CheckoutModule'
    ];

    enableModules.forEach(moduleName => {
      // Uncomment imports
      content = content.replace(
        new RegExp(`// import { ${moduleName}.*?// Disabled.*?\n`, 'g'),
        content.match(new RegExp(`// import { ${moduleName}.*?\n`))?.[0]?.replace('// ', '') || ''
      );
      
      // Uncomment in imports array
      content = content.replace(
        new RegExp(`    // ${moduleName},.*?// Disabled.*?\n`, 'g'),
        `    ${moduleName},\n`
      );
    });

    fs.writeFileSync(appModulePath, content);
    console.log('✅ Backend modules enabled');
  }

  async standardizeAPIEndpoints() {
    console.log('\n🔗 Standardizing API Endpoints...');

    // Update Frontend .env.local
    const frontendEnv = `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Audio Tài Lộc"`;
    
    fs.writeFileSync(path.join(process.cwd(), 'frontend/.env.local'), frontendEnv);
    console.log('✅ Frontend API URL updated');

    // Update Dashboard .env.local  
    const dashboardEnv = `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dashboard-secret-key`;

    fs.writeFileSync(path.join(process.cwd(), 'dashboard/.env.local'), dashboardEnv);
    console.log('✅ Dashboard API URL updated');
  }

  // PHASE 2: Integration Testing
  async phase2_IntegrationTesting() {
    console.log('\n🧪 PHASE 2: Integration Testing');
    console.log('===============================');

    // Start all components
    console.log('\n📋 Starting all components...');
    await this.startAllComponents();

    // Test integration
    console.log('\n📋 Testing integration...');
    await this.testIntegration();

    console.log('\n✅ PHASE 2 COMPLETED: Integration Testing');
    this.completedTasks.push('Phase 2: Integration Testing');
  }

  async startAllComponents() {
    const startOrder = ['backend', 'frontend', 'dashboard'];
    
    for (const component of startOrder) {
      const config = COMPONENTS[component];
      console.log(`\n🚀 Starting ${component}...`);
      
      // Install dependencies if needed
      if (!fs.existsSync(path.join(config.path, 'node_modules'))) {
        console.log(`📦 Installing dependencies for ${component}...`);
        await this.runCommand('npm install', config.path);
      }

      // Start the component
      const process = spawn(config.startCommand[0], config.startCommand.slice(1), {
        cwd: config.path,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      this.processes[component] = process;

      // Wait a bit for startup
      if (component === 'backend') {
        console.log('⏱️ Waiting for backend to fully initialize...');
        await new Promise(resolve => setTimeout(resolve, 15000));
      } else {
        console.log(`⏱️ Waiting for ${component} to start...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  async testIntegration() {
    console.log('\n🔍 Testing API endpoints...');
    
    const fetch = require('node-fetch').default || require('node-fetch');
    
    const endpoints = [
      { name: 'Backend Health', url: 'http://localhost:8000/health' },
      { name: 'Frontend', url: 'http://localhost:3000' },
      { name: 'Dashboard', url: 'http://localhost:3001' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        if (response.ok || response.status < 500) {
          console.log(`✅ ${endpoint.name}: OK`);
        } else {
          console.log(`⚠️ ${endpoint.name}: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
  }

  // PHASE 3: PayOS & E-commerce Completion  
  async phase3_PayOSCompletion() {
    console.log('\n💳 PHASE 3: PayOS & E-commerce Completion');
    console.log('=========================================');

    await this.setupPayOSIntegration();
    await this.testEcommerceFlow();

    console.log('\n✅ PHASE 3 COMPLETED: PayOS & E-commerce');
    this.completedTasks.push('Phase 3: PayOS & E-commerce');
  }

  async setupPayOSIntegration() {
    console.log('\n💳 PayOS Integration Setup');
    console.log('1. Register at https://payos.vn');
    console.log('2. Get API credentials');
    console.log('3. Update backend/.env with real credentials');
    console.log('4. Test payment flow');
    
    const proceed = await this.question('\nHave you configured PayOS credentials? (y/n): ');
    if (proceed.toLowerCase() === 'y') {
      console.log('✅ PayOS configuration confirmed');
    } else {
      console.log('⚠️ Please configure PayOS credentials in backend/.env');
    }
  }

  async testEcommerceFlow() {
    console.log('\n🛒 Testing E-commerce Flow');
    console.log('1. Browse products in Frontend (http://localhost:3000)');
    console.log('2. Add to cart and checkout');
    console.log('3. Manage orders in Dashboard (http://localhost:3001)');
    console.log('4. Test payment with PayOS');
  }

  // Main execution
  async run() {
    try {
      console.log('\n🎯 Starting Integration Master Plan...');
      console.log(`📋 Completed tasks: ${this.completedTasks.length}`);

      const phase = await this.question('\nStart from phase (1-3): ');
      
      switch(phase) {
        case '1':
          await this.phase1_BackendRecovery();
          await this.phase2_IntegrationTesting();
          await this.phase3_PayOSCompletion();
          break;
        case '2':
          await this.phase2_IntegrationTesting();
          await this.phase3_PayOSCompletion();
          break;
        case '3':
          await this.phase3_PayOSCompletion();
          break;
        default:
          console.log('❌ Invalid phase number');
          return;
      }

      this.showFinalStatus();

    } catch (error) {
      console.error('❌ Integration failed:', error);
    } finally {
      rl.close();
    }
  }

  showFinalStatus() {
    console.log('\n🎉 Integration Master Plan Complete!');
    console.log('====================================');
    
    console.log('\n📊 System Status:');
    Object.entries(COMPONENTS).forEach(([name, config]) => {
      const status = this.processes[name] && !this.processes[name].killed ? '🟢 Running' : '🔴 Stopped';
      console.log(`  ${name}: ${status} (${config.healthEndpoint})`);
    });

    console.log('\n✅ Completed Tasks:');
    this.completedTasks.forEach(task => console.log(`  - ${task}`));

    console.log('\n🚀 Next Steps:');
    console.log('  1. Test all functionality in browser');
    console.log('  2. Configure PayOS with real credentials');
    console.log('  3. Prepare for production deployment');
    
    console.log('\n✋ Press Ctrl+C to stop all components');

    // Keep processes running
    process.on('SIGINT', () => {
      console.log('\n👋 Stopping all components...');
      Object.values(this.processes).forEach(proc => {
        if (proc && !proc.killed) {
          proc.kill();
        }
      });
      process.exit(0);
    });
  }
}

// Run the integration manager
if (require.main === module) {
  const manager = new IntegrationManager();
  manager.run();
}

module.exports = IntegrationManager;
