#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execSync } = require('child_process');

class AudioTailocMCP {
  constructor() {
    this.projectRoot = process.cwd();
    this.backendUrl = 'http://localhost:3010/api/v1';
    this.frontendUrl = 'http://localhost:3000';
    this.reports = {};
  }

  async healthCheck() {
    console.log('🔍 MCP: Health Check System');
    console.log('='.repeat(50));

    try {
      // Backend Health
      const backendHealth = await axios.get(`${this.backendUrl}/health`, { timeout: 5000 });
      console.log(`✅ Backend: ${backendHealth.status} - ${backendHealth.data.message}`);

      // Frontend Health
      const frontendHealth = await axios.get(`${this.frontendUrl}`, { timeout: 10000 });
      console.log(`✅ Frontend: ${frontendHealth.status} - Homepage loaded`);

      // Database Health (via API)
      const productsHealth = await axios.get(`${this.backendUrl}/catalog/products`, { timeout: 5000 });
      console.log(`✅ Database: ${productsHealth.data.data?.items?.length || 0} products available`);

      this.reports.health = {
        backend: backendHealth.status,
        frontend: frontendHealth.status,
        database: productsHealth.data.data?.items?.length || 0,
        timestamp: new Date().toISOString()
      };

      return true;
    } catch (error) {
      console.log(`❌ Health Check Failed: ${error.message}`);
      this.reports.health = { error: error.message };
      return false;
    }
  }

  async codeQualityAnalysis() {
    console.log('\n🔍 MCP: Code Quality Analysis');
    console.log('='.repeat(50));

    try {
      // Backend TypeScript Analysis
      if (fs.existsSync('backend/tsconfig.json')) {
        console.log('✅ Backend: TypeScript configured');
      }

      // Frontend Next.js Analysis
      if (fs.existsSync('frontend/package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
        console.log(`✅ Frontend: Next.js ${packageJson.dependencies?.next || 'unknown'}`);
      }

      // Check for critical files
      const criticalFiles = [
        'backend/src/main.ts',
        'frontend/app/page.tsx',
        'backend/prisma/schema.prisma',
        'frontend/lib/api-client.ts'
      ];

      let filesPresent = 0;
      criticalFiles.forEach(file => {
        if (fs.existsSync(file)) {
          filesPresent++;
          console.log(`✅ ${file} - Present`);
        } else {
          console.log(`❌ ${file} - Missing`);
        }
      });

      this.reports.quality = {
        criticalFiles: `${filesPresent}/${criticalFiles.length}`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.log(`❌ Code Analysis Failed: ${error.message}`);
    }
  }

  async performanceMonitoring() {
    console.log('\n🔍 MCP: Performance Monitoring');
    console.log('='.repeat(50));

    try {
      const apis = [
        { name: 'Health', endpoint: '/health' },
        { name: 'Products', endpoint: '/catalog/products' },
        { name: 'Categories', endpoint: '/catalog/categories' },
        { name: 'Auth', endpoint: '/auth/status' },
        { name: 'Cart', endpoint: '/cart' }
      ];

      const results = {};

      for (const api of apis) {
        try {
          const startTime = Date.now();
          const response = await axios.get(`${this.backendUrl}${api.endpoint}`, { timeout: 5000 });
          const endTime = Date.now();
          const responseTime = endTime - startTime;

          results[api.name] = {
            status: response.status,
            responseTime,
            success: response.status === 200
          };

          const status = responseTime < 100 ? '⚡ FAST' :
                        responseTime < 500 ? '✅ GOOD' :
                        '⚠️ SLOW';

          console.log(`   ${api.name}: ${responseTime}ms ${status}`);

        } catch (error) {
          results[api.name] = { error: error.message };
          console.log(`   ${api.name}: ❌ ERROR`);
        }
      }

      this.reports.performance = results;

      // Calculate overall performance score
      const successfulApis = Object.values(results).filter(r => r.success).length;
      const performanceScore = Math.round((successfulApis / apis.length) * 100);

      console.log(`\n📊 Performance Score: ${performanceScore}%`);
      console.log(`   ${successfulApis}/${apis.length} APIs responding correctly`);

    } catch (error) {
      console.log(`❌ Performance Monitoring Failed: ${error.message}`);
    }
  }

  async securityAnalysis() {
    console.log('\n🔍 MCP: Security Analysis');
    console.log('='.repeat(50));

    try {
      // Check for security headers
      const healthResponse = await axios.get(`${this.backendUrl}/health`);

      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection',
        'content-security-policy'
      ];

      let securityScore = 0;
      securityHeaders.forEach(header => {
        const hasHeader = Object.keys(healthResponse.headers).some(h =>
          h.toLowerCase().includes(header.toLowerCase())
        );
        if (hasHeader) securityScore += 25;
        console.log(`   ${header}: ${hasHeader ? '✅ Present' : '❌ Missing'}`);
      });

      // Check CORS
      const corsHeaders = Object.keys(healthResponse.headers).filter(h =>
        h.toLowerCase().includes('access-control')
      );
      console.log(`   CORS Headers: ${corsHeaders.length > 0 ? '✅ Configured' : '⚠️ Not found'}`);

      this.reports.security = {
        securityScore: `${securityScore}%`,
        corsConfigured: corsHeaders.length > 0,
        timestamp: new Date().toISOString()
      };

      console.log(`\n🛡️ Security Score: ${securityScore}%`);

    } catch (error) {
      console.log(`❌ Security Analysis Failed: ${error.message}`);
    }
  }

  async dataConsistencyCheck() {
    console.log('\n🔍 MCP: Data Consistency Check');
    console.log('='.repeat(50));

    try {
      // Check products data
      const productsResponse = await axios.get(`${this.backendUrl}/catalog/products`);
      const products = productsResponse.data.data?.items || productsResponse.data.data || [];

      console.log(`   Products in Database: ${products.length}`);

      if (products.length > 0) {
        const validProducts = products.filter(p =>
          p.id && (p.name || p.title) && (p.priceCents || p.price)
        ).length;

        console.log(`   Valid Products: ${validProducts}/${products.length} (${Math.round((validProducts/products.length)*100)}%)`);

        // Sample product validation
        const sampleProduct = products[0];
        console.log(`   Sample Product: ${sampleProduct.name || sampleProduct.title} - ${sampleProduct.priceCents || sampleProduct.price} cents`);
      }

      // Check categories data
      const categoriesResponse = await axios.get(`${this.backendUrl}/catalog/categories`);
      const categories = categoriesResponse.data.data?.items || categoriesResponse.data.data || [];

      console.log(`   Categories in Database: ${categories.length}`);

      if (categories.length > 0) {
        const validCategories = categories.filter(c =>
          c.id && (c.name || c.title) && c.slug
        ).length;

        console.log(`   Valid Categories: ${validCategories}/${categories.length} (${Math.round((validCategories/categories.length)*100)}%)`);
      }

      this.reports.dataConsistency = {
        productsCount: products.length,
        categoriesCount: categories.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.log(`❌ Data Consistency Check Failed: ${error.message}`);
    }
  }

  async generateMCPReport() {
    console.log('\n🔍 MCP: Generating Comprehensive Report');
    console.log('='.repeat(50));

    const report = {
      project: 'Audio Tài Lộc',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mcpVersion: '1.0',
      status: 'ACTIVE',
      ...this.reports
    };

    // Calculate overall score
    let overallScore = 0;
    let components = 0;

    if (this.reports.health && !this.reports.health.error) {
      overallScore += 25;
      components++;
    }
    if (this.reports.performance) {
      const perfScore = Object.values(this.reports.performance).filter(r => r.success).length / 5 * 100;
      overallScore += (perfScore * 0.25);
      components++;
    }
    if (this.reports.security) {
      overallScore += parseInt(this.reports.security.securityScore);
      components++;
    }
    if (this.reports.dataConsistency) {
      overallScore += 25;
      components++;
    }

    const finalScore = components > 0 ? Math.round(overallScore / components) : 0;
    report.overallScore = `${finalScore}%`;

    // Save report
    const reportPath = 'mcp-system-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`\n📊 MCP SYSTEM REPORT`);
    console.log('='.repeat(50));
    console.log(`Project: ${report.project}`);
    console.log(`Status: ${report.status}`);
    console.log(`Overall Score: ${report.overallScore}`);
    console.log(`Report saved to: ${reportPath}`);

    if (finalScore >= 90) {
      console.log('🎉 System is in EXCELLENT condition!');
    } else if (finalScore >= 75) {
      console.log('✅ System is in GOOD condition.');
    } else if (finalScore >= 50) {
      console.log('⚠️ System needs attention.');
    } else {
      console.log('❌ System needs immediate attention.');
    }

    return report;
  }

  async runFullMCPScan() {
    console.log('🤖 AUDIO TAILOC MCP - COMPREHENSIVE SYSTEM SCAN');
    console.log('='.repeat(60));
    console.log(`Scan started at: ${new Date().toISOString()}`);
    console.log('='.repeat(60));

    const startTime = Date.now();

    await this.healthCheck();
    await this.codeQualityAnalysis();
    await this.performanceMonitoring();
    await this.securityAnalysis();
    await this.dataConsistencyCheck();

    const endTime = Date.now();
    const scanTime = endTime - startTime;

    console.log(`\n⏱️ Scan completed in ${scanTime}ms`);

    return await this.generateMCPReport();
  }

  async createAutomationScripts() {
    console.log('\n🔧 MCP: Creating Automation Scripts');
    console.log('='.repeat(50));

    // Create development workflow script
    const devWorkflowScript = `#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

class DevWorkflow {
  async start() {
    console.log('🚀 Starting Audio Tailoc Development Environment');

    try {
      // Start backend
      console.log('📡 Starting Backend...');
      execSync('cd backend && npm run start:dev', { stdio: 'inherit' });

    } catch (error) {
      console.log('❌ Failed to start backend:', error.message);
    }
  }

  async test() {
    console.log('🧪 Running Tests...');
    // Add test commands here
  }

  async build() {
    console.log('🔨 Building Project...');
    // Add build commands here
  }
}

// Run if called directly
if (require.main === module) {
  const workflow = new DevWorkflow();
  const command = process.argv[2] || 'start';
  workflow[command]();
}

module.exports = DevWorkflow;
`;

    fs.writeFileSync('dev-workflow.js', devWorkflowScript);
    console.log('✅ Created dev-workflow.js');

    // Create monitoring script
    const monitoringScript = `#!/usr/bin/env node

const axios = require('axios');

class SystemMonitor {
  constructor() {
    this.backendUrl = 'http://localhost:3010/api/v1';
    this.alerts = [];
  }

  async checkHealth() {
    try {
      const response = await axios.get(\`\${this.backendUrl}/health\`, { timeout: 5000 });
      return { status: 'healthy', response: response.status };
    } catch (error) {
      this.alerts.push(\`Backend health check failed: \${error.message}\`);
      return { status: 'unhealthy', error: error.message };
    }
  }

  async checkFrontend() {
    try {
      const response = await axios.get('http://localhost:3000', { timeout: 10000 });
      return { status: 'healthy', response: response.status };
    } catch (error) {
      this.alerts.push(\`Frontend health check failed: \${error.message}\`);
      return { status: 'unhealthy', error: error.message };
    }
  }

  async runMonitoring() {
    console.log('🔍 System Monitoring Check');
    console.log('='.repeat(40));

    const backend = await this.checkHealth();
    const frontend = await this.checkFrontend();

    console.log(\`Backend: \${backend.status.toUpperCase()}\`);
    console.log(\`Frontend: \${frontend.status.toUpperCase()}\`);

    if (this.alerts.length > 0) {
      console.log('\n⚠️ ALERTS:');
      this.alerts.forEach(alert => console.log(\`  - \${alert}\`));
    } else {
      console.log('\n✅ All systems healthy!');
    }

    return {
      backend,
      frontend,
      alerts: this.alerts,
      timestamp: new Date().toISOString()
    };
  }
}

if (require.main === module) {
  const monitor = new SystemMonitor();
  monitor.runMonitoring();
}

module.exports = SystemMonitor;
`;

    fs.writeFileSync('system-monitor.js', monitoringScript);
    console.log('✅ Created system-monitor.js');

    // Create deployment script
    const deployScript = `#!/usr/bin/env node

const { execSync } = require('child_process');

class DeployManager {
  async build() {
    console.log('🔨 Building Audio Tailoc...');

    try {
      // Build backend
      console.log('📦 Building Backend...');
      execSync('cd backend && npm run build', { stdio: 'inherit' });

      // Build frontend
      console.log('🌐 Building Frontend...');
      execSync('cd frontend && npm run build', { stdio: 'inherit' });

      console.log('✅ Build completed successfully!');
    } catch (error) {
      console.log('❌ Build failed:', error.message);
    }
  }

  async deploy() {
    console.log('🚀 Deploying Audio Tailoc...');
    // Add deployment logic here
  }
}

if (require.main === module) {
  const deploy = new DeployManager();
  const command = process.argv[2] || 'build';
  deploy[command]();
}

module.exports = DeployManager;
`;

    fs.writeFileSync('deploy-manager.js', deployScript);
    console.log('✅ Created deploy-manager.js');
  }
}

// Run MCP scan
async function main() {
  const mcp = new AudioTailocMCP();

  console.log('🤖 AUDIO TAILOC MCP SYSTEM');
  console.log('Model Context Protocol Implementation');
  console.log('=====================================\n');

  // Run comprehensive scan
  const report = await mcp.runFullMCPScan();

  // Create automation scripts
  await mcp.createAutomationScripts();

  console.log('\n🎉 MCP Setup Complete!');
  console.log('Available commands:');
  console.log('  node mcp-project-automation.js    # Run full MCP scan');
  console.log('  node dev-workflow.js              # Development workflow');
  console.log('  node system-monitor.js            # System monitoring');
  console.log('  node deploy-manager.js            # Deployment management');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AudioTailocMCP;
