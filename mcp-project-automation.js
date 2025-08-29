#!/usr/bin/env node

/**
 * 🎵 Audio Tài Lộc - MCP Project Automation System
 * 
 * Hệ thống tự động hóa toàn diện cho dự án Audio Tài Lộc
 * Bao gồm: Phân tích hệ thống, kiểm tra chất lượng, monitoring, và deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const http = require('http');
const https = require('https');

// Colors for console output
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

class MCPProjectAutomation {
  constructor() {
    this.projectRoot = process.cwd();
    this.results = {
      system: {},
      backend: {},
      frontend: {},
      database: {},
      security: {},
      performance: {},
      deployment: {}
    };
    this.startTime = Date.now();
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logSection(title) {
    console.log(`\n${colors.bright}${colors.cyan}=== ${title} ===${colors.reset}`);
  }

  logSuccess(message) {
    this.log(`✅ ${message}`, 'green');
  }

  logWarning(message) {
    this.log(`⚠️  ${message}`, 'yellow');
  }

  logError(message) {
    this.log(`❌ ${message}`, 'red');
  }

  logInfo(message) {
    this.log(`ℹ️  ${message}`, 'blue');
  }

  // System Analysis
  async analyzeSystem() {
    this.logSection('SYSTEM ANALYSIS');
    
    try {
      // Check Node.js version
      const nodeVersion = process.version;
      this.logInfo(`Node.js Version: ${nodeVersion}`);
      
      // Check available memory
      const memUsage = process.memoryUsage();
      this.logInfo(`Memory Usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
      
      // Check disk space
      const diskSpace = this.checkDiskSpace();
      this.logInfo(`Available Disk Space: ${diskSpace}GB`);
      
      // Check network connectivity
      const networkStatus = await this.checkNetworkConnectivity();
      this.logInfo(`Network Status: ${networkStatus ? 'Connected' : 'Disconnected'}`);
      
      this.results.system = {
        nodeVersion,
        memoryUsage: memUsage,
        diskSpace,
        networkStatus
      };
      
      this.logSuccess('System analysis completed');
    } catch (error) {
      this.logError(`System analysis failed: ${error.message}`);
    }
  }

  // Backend Analysis
  async analyzeBackend() {
    this.logSection('BACKEND ANALYSIS');
    
    try {
      const backendPath = path.join(this.projectRoot, 'backend');
      
      if (!fs.existsSync(backendPath)) {
        throw new Error('Backend directory not found');
      }
      
      // Check package.json
      const packageJson = JSON.parse(fs.readFileSync(path.join(backendPath, 'package.json'), 'utf8'));
      this.logInfo(`Backend Framework: ${packageJson.name}`);
      this.logInfo(`Version: ${packageJson.version}`);
      
      // Check dependencies
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      this.logInfo(`Dependencies: ${dependencies.length}`);
      this.logInfo(`Dev Dependencies: ${devDependencies.length}`);
      
      // Check TypeScript configuration
      const tsConfigPath = path.join(backendPath, 'tsconfig.json');
      if (fs.existsSync(tsConfigPath)) {
        this.logSuccess('TypeScript configuration found');
      }
      
      // Check environment files
      const envFiles = ['env-template.txt', '.env', '.env.example'];
      const existingEnvFiles = envFiles.filter(file => 
        fs.existsSync(path.join(backendPath, file))
      );
      this.logInfo(`Environment files: ${existingEnvFiles.join(', ')}`);
      
      // Check source code structure
      const srcPath = path.join(backendPath, 'src');
      if (fs.existsSync(srcPath)) {
        const modules = fs.readdirSync(srcPath).filter(item => 
          fs.statSync(path.join(srcPath, item)).isDirectory()
        );
        this.logInfo(`Modules: ${modules.join(', ')}`);
      }
      
      // Check database schema
      const prismaPath = path.join(backendPath, 'prisma');
      if (fs.existsSync(prismaPath)) {
        const schemaFiles = fs.readdirSync(prismaPath).filter(file => 
          file.endsWith('.prisma')
        );
        this.logInfo(`Database schemas: ${schemaFiles.join(', ')}`);
      }
      
      this.results.backend = {
        framework: packageJson.name,
        version: packageJson.version,
        dependencies: dependencies.length,
        devDependencies: devDependencies.length,
        modules: modules || [],
        hasTypeScript: fs.existsSync(tsConfigPath),
        hasPrisma: fs.existsSync(prismaPath)
      };
      
      this.logSuccess('Backend analysis completed');
    } catch (error) {
      this.logError(`Backend analysis failed: ${error.message}`);
    }
  }

  // Frontend Analysis
  async analyzeFrontend() {
    this.logSection('FRONTEND ANALYSIS');
    
    try {
      const frontendPath = path.join(this.projectRoot, 'frontend');
      
      if (!fs.existsSync(frontendPath)) {
        throw new Error('Frontend directory not found');
      }
      
      // Check package.json
      const packageJson = JSON.parse(fs.readFileSync(path.join(frontendPath, 'package.json'), 'utf8'));
      this.logInfo(`Frontend Framework: ${packageJson.name}`);
      this.logInfo(`Version: ${packageJson.version}`);
      
      // Check dependencies
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      this.logInfo(`Dependencies: ${dependencies.length}`);
      this.logInfo(`Dev Dependencies: ${devDependencies.length}`);
      
      // Check Next.js configuration
      const nextConfigPath = path.join(frontendPath, 'next.config.js');
      if (fs.existsSync(nextConfigPath)) {
        this.logSuccess('Next.js configuration found');
      }
      
      // Check app structure
      const appPath = path.join(frontendPath, 'app');
      if (fs.existsSync(appPath)) {
        const pages = this.getPagesRecursive(appPath);
        this.logInfo(`Pages: ${pages.length} found`);
      }
      
      // Check components
      const componentsPath = path.join(frontendPath, 'components');
      if (fs.existsSync(componentsPath)) {
        const components = this.getComponentsRecursive(componentsPath);
        this.logInfo(`Components: ${components.length} found`);
      }
      
      this.results.frontend = {
        framework: packageJson.name,
        version: packageJson.version,
        dependencies: dependencies.length,
        devDependencies: devDependencies.length,
        pages: pages || [],
        components: components || [],
        hasNextConfig: fs.existsSync(nextConfigPath)
      };
      
      this.logSuccess('Frontend analysis completed');
    } catch (error) {
      this.logError(`Frontend analysis failed: ${error.message}`);
    }
  }

  // Database Analysis
  async analyzeDatabase() {
    this.logSection('DATABASE ANALYSIS');
    
    try {
      const backendPath = path.join(this.projectRoot, 'backend');
      const prismaPath = path.join(backendPath, 'prisma');
      
      if (fs.existsSync(prismaPath)) {
        // Check schema files
        const schemaFiles = fs.readdirSync(prismaPath).filter(file => 
          file.endsWith('.prisma')
        );
        
        for (const schemaFile of schemaFiles) {
          const schemaPath = path.join(prismaPath, schemaFile);
          const schemaContent = fs.readFileSync(schemaPath, 'utf8');
          
          // Count models
          const modelMatches = schemaContent.match(/model\s+\w+/g);
          const models = modelMatches ? modelMatches.map(m => m.replace('model ', '')) : [];
          
          // Count enums
          const enumMatches = schemaContent.match(/enum\s+\w+/g);
          const enums = enumMatches ? enumMatches.map(e => e.replace('enum ', '')) : [];
          
          this.logInfo(`Schema: ${schemaFile}`);
          this.logInfo(`Models: ${models.length} (${models.join(', ')})`);
          this.logInfo(`Enums: ${enums.length} (${enums.join(', ')})`);
        }
        
        this.results.database = {
          schemas: schemaFiles,
          totalModels: schemaFiles.reduce((acc, file) => {
            const content = fs.readFileSync(path.join(prismaPath, file), 'utf8');
            const matches = content.match(/model\s+\w+/g);
            return acc + (matches ? matches.length : 0);
          }, 0),
          hasPrisma: true
        };
      } else {
        this.logWarning('No Prisma schema found');
        this.results.database = { hasPrisma: false };
      }
      
      this.logSuccess('Database analysis completed');
    } catch (error) {
      this.logError(`Database analysis failed: ${error.message}`);
    }
  }

  // Security Analysis
  async analyzeSecurity() {
    this.logSection('SECURITY ANALYSIS');
    
    try {
      const securityChecks = [];
      
      // Check for sensitive files
      const sensitiveFiles = ['.env', '.env.local', '.env.production'];
      for (const file of sensitiveFiles) {
        const filePath = path.join(this.projectRoot, file);
        if (fs.existsSync(filePath)) {
          this.logWarning(`Sensitive file found: ${file}`);
          securityChecks.push({ type: 'sensitive_file', file, status: 'warning' });
        }
      }
      
      // Check .gitignore
      const gitignorePath = path.join(this.projectRoot, '.gitignore');
      if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        const hasEnvIgnore = gitignoreContent.includes('.env');
        const hasNodeModulesIgnore = gitignoreContent.includes('node_modules');
        
        if (hasEnvIgnore && hasNodeModulesIgnore) {
          this.logSuccess('.gitignore properly configured');
          securityChecks.push({ type: 'gitignore', status: 'good' });
        } else {
          this.logWarning('.gitignore needs improvement');
          securityChecks.push({ type: 'gitignore', status: 'warning' });
        }
      }
      
      // Check package.json for security scripts
      const backendPackagePath = path.join(this.projectRoot, 'backend', 'package.json');
      if (fs.existsSync(backendPackagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
        const scripts = packageJson.scripts || {};
        
        if (scripts.audit) {
          this.logSuccess('Security audit script found');
          securityChecks.push({ type: 'audit_script', status: 'good' });
        } else {
          this.logWarning('No security audit script found');
          securityChecks.push({ type: 'audit_script', status: 'warning' });
        }
      }
      
      this.results.security = {
        checks: securityChecks,
        score: this.calculateSecurityScore(securityChecks)
      };
      
      this.logSuccess('Security analysis completed');
    } catch (error) {
      this.logError(`Security analysis failed: ${error.message}`);
    }
  }

  // Performance Analysis
  async analyzePerformance() {
    this.logSection('PERFORMANCE ANALYSIS');
    
    try {
      const performanceChecks = [];
      
      // Check bundle size
      const frontendPath = path.join(this.projectRoot, 'frontend');
      if (fs.existsSync(frontendPath)) {
        const nextConfigPath = path.join(frontendPath, 'next.config.js');
        if (fs.existsSync(nextConfigPath)) {
          const nextConfig = require(nextConfigPath);
          if (nextConfig.experimental && nextConfig.experimental.optimizeCss) {
            this.logSuccess('CSS optimization enabled');
            performanceChecks.push({ type: 'css_optimization', status: 'good' });
          }
        }
      }
      
      // Check for caching configuration
      const backendPath = path.join(this.projectRoot, 'backend');
      if (fs.existsSync(backendPath)) {
        const cacheFiles = ['cache.interceptor.ts', 'caching.service.ts'];
        for (const file of cacheFiles) {
          if (fs.existsSync(path.join(backendPath, 'src', 'modules', 'caching', file))) {
            this.logSuccess(`Caching found: ${file}`);
            performanceChecks.push({ type: 'caching', file, status: 'good' });
          }
        }
      }
      
      // Check for monitoring
      const monitoringPath = path.join(backendPath, 'src', 'modules', 'monitoring');
      if (fs.existsSync(monitoringPath)) {
        this.logSuccess('Monitoring system found');
        performanceChecks.push({ type: 'monitoring', status: 'good' });
      }
      
      this.results.performance = {
        checks: performanceChecks,
        score: this.calculatePerformanceScore(performanceChecks)
      };
      
      this.logSuccess('Performance analysis completed');
    } catch (error) {
      this.logError(`Performance analysis failed: ${error.message}`);
    }
  }

  // Deployment Analysis
  async analyzeDeployment() {
    this.logSection('DEPLOYMENT ANALYSIS');
    
    try {
      const deploymentChecks = [];
      
      // Check Docker configuration
      const dockerFiles = ['Dockerfile', 'docker-compose.yml', '.dockerignore'];
      for (const file of dockerFiles) {
        const filePath = path.join(this.projectRoot, file);
        if (fs.existsSync(filePath)) {
          this.logSuccess(`Docker file found: ${file}`);
          deploymentChecks.push({ type: 'docker', file, status: 'good' });
        }
      }
      
      // Check CI/CD configuration
      const githubPath = path.join(this.projectRoot, '.github');
      if (fs.existsSync(githubPath)) {
        const workflows = fs.readdirSync(githubPath).filter(item => 
          item.endsWith('.yml') || item.endsWith('.yaml')
        );
        if (workflows.length > 0) {
          this.logSuccess(`CI/CD workflows found: ${workflows.join(', ')}`);
          deploymentChecks.push({ type: 'cicd', workflows, status: 'good' });
        }
      }
      
      // Check environment templates
      const envTemplates = ['env-template.txt', '.env.example'];
      for (const template of envTemplates) {
        const templatePath = path.join(this.projectRoot, 'backend', template);
        if (fs.existsSync(templatePath)) {
          this.logSuccess(`Environment template found: ${template}`);
          deploymentChecks.push({ type: 'env_template', template, status: 'good' });
        }
      }
      
      this.results.deployment = {
        checks: deploymentChecks,
        score: this.calculateDeploymentScore(deploymentChecks)
      };
      
      this.logSuccess('Deployment analysis completed');
    } catch (error) {
      this.logError(`Deployment analysis failed: ${error.message}`);
    }
  }

  // Utility methods
  checkDiskSpace() {
    try {
      const stats = fs.statSync(this.projectRoot);
      return Math.round(stats.size / 1024 / 1024 / 1024 * 100) / 100;
    } catch (error) {
      return 'Unknown';
    }
  }

  async checkNetworkConnectivity() {
    return new Promise((resolve) => {
      const req = http.get('http://www.google.com', (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => resolve(false));
      req.setTimeout(5000, () => resolve(false));
    });
  }

  getPagesRecursive(dir, base = '') {
    const pages = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (item === 'page.tsx' || item === 'page.js') {
          pages.push(base);
        } else {
          pages.push(...this.getPagesRecursive(fullPath, path.join(base, item)));
        }
      }
    }
    
    return pages;
  }

  getComponentsRecursive(dir) {
    const components = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        components.push(item);
        components.push(...this.getComponentsRecursive(fullPath));
      } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
        components.push(item.replace(/\.(tsx|jsx)$/, ''));
      }
    }
    
    return components;
  }

  calculateSecurityScore(checks) {
    const goodChecks = checks.filter(check => check.status === 'good').length;
    const totalChecks = checks.length;
    return totalChecks > 0 ? Math.round((goodChecks / totalChecks) * 100) : 0;
  }

  calculatePerformanceScore(checks) {
    const goodChecks = checks.filter(check => check.status === 'good').length;
    const totalChecks = checks.length;
    return totalChecks > 0 ? Math.round((goodChecks / totalChecks) * 100) : 0;
  }

  calculateDeploymentScore(checks) {
    const goodChecks = checks.filter(check => check.status === 'good').length;
    const totalChecks = checks.length;
    return totalChecks > 0 ? Math.round((goodChecks / totalChecks) * 100) : 0;
  }

  // Generate comprehensive report
  generateReport() {
    this.logSection('GENERATING COMPREHENSIVE REPORT');
    
    const report = {
      timestamp: new Date().toISOString(),
      project: 'Audio Tài Lộc',
      duration: Date.now() - this.startTime,
      results: this.results,
      summary: {
        system: this.results.system,
        backend: this.results.backend,
        frontend: this.results.frontend,
        database: this.results.database,
        security: this.results.security,
        performance: this.results.performance,
        deployment: this.results.deployment
      }
    };
    
    // Save report to file
    const reportPath = path.join(this.projectRoot, 'mcp-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate HTML report
    this.generateHTMLReport(report);
    
    this.logSuccess(`Report saved to: ${reportPath}`);
    this.logSuccess(`HTML report saved to: mcp-analysis-report.html`);
    
    return report;
  }

  generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MCP Analysis Report - Audio Tài Lộc</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .metric-card h3 { color: #333; margin-bottom: 15px; font-size: 1.3em; }
        .metric-value { font-size: 2.5em; font-weight: bold; margin-bottom: 10px; }
        .metric-label { color: #666; font-size: 0.9em; }
        .status-good { color: #10b981; }
        .status-warning { color: #f59e0b; }
        .status-error { color: #ef4444; }
        .section { background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; padding: 20px; }
        .section h2 { color: #333; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        .detail-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
        .detail-item:last-child { border-bottom: none; }
        .detail-label { font-weight: 500; color: #555; }
        .detail-value { color: #333; }
        .timestamp { text-align: center; color: #666; margin-top: 20px; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 Audio Tài Lộc</h1>
            <p>MCP Analysis Report</p>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>Security Score</h3>
                <div class="metric-value status-good">${report.results.security.score}%</div>
                <div class="metric-label">Overall Security Rating</div>
            </div>
            
            <div class="metric-card">
                <h3>Performance Score</h3>
                <div class="metric-value status-good">${report.results.performance.score}%</div>
                <div class="metric-label">Performance Optimization</div>
            </div>
            
            <div class="metric-card">
                <h3>Deployment Score</h3>
                <div class="metric-value status-good">${report.results.deployment.score}%</div>
                <div class="metric-label">Deployment Readiness</div>
            </div>
            
            <div class="metric-card">
                <h3>Analysis Duration</h3>
                <div class="metric-value status-good">${Math.round(report.duration / 1000)}s</div>
                <div class="metric-label">Total Analysis Time</div>
            </div>
        </div>
        
        <div class="section">
            <h2>System Information</h2>
            <div class="detail-item">
                <span class="detail-label">Node.js Version:</span>
                <span class="detail-value">${report.results.system.nodeVersion}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Memory Usage:</span>
                <span class="detail-value">${Math.round(report.results.system.memoryUsage?.heapUsed / 1024 / 1024)}MB</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Network Status:</span>
                <span class="detail-value">${report.results.system.networkStatus ? 'Connected' : 'Disconnected'}</span>
            </div>
        </div>
        
        <div class="section">
            <h2>Backend Analysis</h2>
            <div class="detail-item">
                <span class="detail-label">Framework:</span>
                <span class="detail-value">${report.results.backend.framework}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Version:</span>
                <span class="detail-value">${report.results.backend.version}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Dependencies:</span>
                <span class="detail-value">${report.results.backend.dependencies}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Modules:</span>
                <span class="detail-value">${report.results.backend.modules?.join(', ') || 'N/A'}</span>
            </div>
        </div>
        
        <div class="section">
            <h2>Frontend Analysis</h2>
            <div class="detail-item">
                <span class="detail-label">Framework:</span>
                <span class="detail-value">${report.results.frontend.framework}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Version:</span>
                <span class="detail-value">${report.results.frontend.version}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Pages:</span>
                <span class="detail-value">${report.results.frontend.pages?.length || 0}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Components:</span>
                <span class="detail-value">${report.results.frontend.components?.length || 0}</span>
            </div>
        </div>
        
        <div class="section">
            <h2>Database Analysis</h2>
            <div class="detail-item">
                <span class="detail-label">Has Prisma:</span>
                <span class="detail-value">${report.results.database.hasPrisma ? 'Yes' : 'No'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Total Models:</span>
                <span class="detail-value">${report.results.database.totalModels || 0}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Schemas:</span>
                <span class="detail-value">${report.results.database.schemas?.join(', ') || 'N/A'}</span>
            </div>
        </div>
        
        <div class="timestamp">
            Report generated on: ${new Date(report.timestamp).toLocaleString()}
        </div>
    </div>
</body>
</html>
    `;
    
    fs.writeFileSync(path.join(this.projectRoot, 'mcp-analysis-report.html'), html);
  }

  // Main execution method
  async run() {
    this.log(`${colors.bright}${colors.magenta}🎵 Audio Tài Lộc - MCP Project Automation System${colors.reset}`);
    this.log(`${colors.cyan}Starting comprehensive project analysis...${colors.reset}\n`);
    
    try {
      await this.analyzeSystem();
      await this.analyzeBackend();
      await this.analyzeFrontend();
      await this.analyzeDatabase();
      await this.analyzeSecurity();
      await this.analyzePerformance();
      await this.analyzeDeployment();
      
      const report = this.generateReport();
      
      this.logSection('ANALYSIS COMPLETE');
      this.logSuccess(`Total analysis time: ${Math.round(report.duration / 1000)} seconds`);
      this.logSuccess(`Security Score: ${report.results.security.score}%`);
      this.logSuccess(`Performance Score: ${report.results.performance.score}%`);
      this.logSuccess(`Deployment Score: ${report.results.deployment.score}%`);
      
      this.log(`\n${colors.bright}${colors.green}🎉 MCP Analysis completed successfully!${colors.reset}`);
      this.log(`${colors.cyan}Check the generated reports for detailed information.${colors.reset}`);
      
    } catch (error) {
      this.logError(`MCP Analysis failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const mcp = new MCPProjectAutomation();
  mcp.run();
}

module.exports = MCPProjectAutomation;