#!/usr/bin/env node

/**
 * 🎵 Audio Tài Lộc - Deployment Manager
 * 
 * Hệ thống quản lý deployment tự động cho dự án Audio Tài Lộc
 * Bao gồm: Build, Test, Deploy, và Rollback
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

class DeployManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.deploymentConfig = {
      environments: {
        development: {
          backend: { port: 8000, host: 'localhost' },
          frontend: { port: 3000, host: 'localhost' },
          database: { url: 'file:./dev.db' }
        },
        staging: {
          backend: { port: 8001, host: 'localhost' },
          frontend: { port: 3001, host: 'localhost' },
          database: { url: 'postgresql://user:pass@localhost:5432/atl_staging' }
        },
        production: {
          backend: { port: 8000, host: '0.0.0.0' },
          frontend: { port: 3000, host: '0.0.0.0' },
          database: { url: 'postgresql://user:pass@localhost:5432/atl_production' }
        }
      },
      docker: {
        enabled: true,
        composeFile: 'docker-compose.yml',
        images: ['backend', 'frontend', 'database']
      }
    };
    this.currentEnvironment = 'development';
    this.deploymentHistory = [];
  }

  log(message, color = 'reset') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${colors[color]}${message}${colors.reset}`);
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

  // Pre-deployment checks
  async preDeploymentChecks() {
    this.logSection('PRE-DEPLOYMENT CHECKS');
    
    const checks = [];
    
    try {
      // Check Node.js version
      const nodeVersion = process.version;
      const requiredVersion = 'v18.0.0';
      if (this.compareVersions(nodeVersion, requiredVersion) >= 0) {
        this.logSuccess(`Node.js version: ${nodeVersion}`);
        checks.push({ name: 'Node.js Version', status: 'passed' });
      } else {
        this.logError(`Node.js version ${nodeVersion} is below required ${requiredVersion}`);
        checks.push({ name: 'Node.js Version', status: 'failed' });
      }

      // Check required directories
      const requiredDirs = ['backend', 'frontend', 'shared'];
      for (const dir of requiredDirs) {
        if (fs.existsSync(path.join(this.projectRoot, dir))) {
          this.logSuccess(`Directory found: ${dir}`);
          checks.push({ name: `Directory: ${dir}`, status: 'passed' });
        } else {
          this.logError(`Required directory not found: ${dir}`);
          checks.push({ name: `Directory: ${dir}`, status: 'failed' });
        }
      }

      // Check package.json files
      const packageFiles = [
        { path: 'backend/package.json', name: 'Backend Package' },
        { path: 'frontend/package.json', name: 'Frontend Package' }
      ];

      for (const pkg of packageFiles) {
        const pkgPath = path.join(this.projectRoot, pkg.path);
        if (fs.existsSync(pkgPath)) {
          try {
            const packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            this.logSuccess(`${pkg.name}: ${packageJson.name}@${packageJson.version}`);
            checks.push({ name: pkg.name, status: 'passed' });
          } catch (error) {
            this.logError(`Invalid ${pkg.name}: ${error.message}`);
            checks.push({ name: pkg.name, status: 'failed' });
          }
        } else {
          this.logError(`${pkg.name} not found`);
          checks.push({ name: pkg.name, status: 'failed' });
        }
      }

      // Check environment files
      const envFiles = [
        { path: 'backend/env-template.txt', name: 'Backend Env Template' },
        { path: 'frontend/.env.local.example', name: 'Frontend Env Template' }
      ];

      for (const env of envFiles) {
        const envPath = path.join(this.projectRoot, env.path);
        if (fs.existsSync(envPath)) {
          this.logSuccess(`${env.name} found`);
          checks.push({ name: env.name, status: 'passed' });
        } else {
          this.logWarning(`${env.name} not found`);
          checks.push({ name: env.name, status: 'warning' });
        }
      }

      // Check Docker configuration
      if (this.deploymentConfig.docker.enabled) {
        const dockerFiles = ['Dockerfile', 'docker-compose.yml'];
        for (const file of dockerFiles) {
          const filePath = path.join(this.projectRoot, file);
          if (fs.existsSync(filePath)) {
            this.logSuccess(`Docker file found: ${file}`);
            checks.push({ name: `Docker: ${file}`, status: 'passed' });
          } else {
            this.logWarning(`Docker file not found: ${file}`);
            checks.push({ name: `Docker: ${file}`, status: 'warning' });
          }
        }
      }

      // Check network connectivity
      const networkCheck = await this.checkNetworkConnectivity();
      if (networkCheck) {
        this.logSuccess('Network connectivity: OK');
        checks.push({ name: 'Network Connectivity', status: 'passed' });
      } else {
        this.logWarning('Network connectivity: Limited');
        checks.push({ name: 'Network Connectivity', status: 'warning' });
      }

      const failedChecks = checks.filter(check => check.status === 'failed');
      const warningChecks = checks.filter(check => check.status === 'warning');

      if (failedChecks.length > 0) {
        this.logError(`${failedChecks.length} checks failed. Deployment cannot proceed.`);
        return false;
      }

      if (warningChecks.length > 0) {
        this.logWarning(`${warningChecks.length} warnings found. Deployment may have issues.`);
      }

      this.logSuccess(`All critical checks passed (${checks.length} total)`);
      return true;

    } catch (error) {
      this.logError(`Pre-deployment checks failed: ${error.message}`);
      return false;
    }
  }

  // Install dependencies
  async installDependencies() {
    this.logSection('INSTALLING DEPENDENCIES');
    
    try {
      // Install backend dependencies
      this.logInfo('Installing backend dependencies...');
      execSync('cd backend && npm install', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      this.logSuccess('Backend dependencies installed');

      // Install frontend dependencies
      this.logInfo('Installing frontend dependencies...');
      execSync('cd frontend && npm install', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      this.logSuccess('Frontend dependencies installed');

      // Install dashboard dependencies if exists
      const dashboardPath = path.join(this.projectRoot, 'dashboard');
      if (fs.existsSync(dashboardPath)) {
        this.logInfo('Installing dashboard dependencies...');
        execSync('cd dashboard && npm install', { 
          stdio: 'inherit',
          cwd: this.projectRoot 
        });
        this.logSuccess('Dashboard dependencies installed');
      }

      this.logSuccess('All dependencies installed successfully');
      return true;

    } catch (error) {
      this.logError(`Dependency installation failed: ${error.message}`);
      return false;
    }
  }

  // Run tests
  async runTests() {
    this.logSection('RUNNING TESTS');
    
    try {
      // Run backend tests
      this.logInfo('Running backend tests...');
      execSync('cd backend && npm test', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      this.logSuccess('Backend tests passed');

      // Run frontend tests
      this.logInfo('Running frontend tests...');
      execSync('cd frontend && npm test', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      this.logSuccess('Frontend tests passed');

      this.logSuccess('All tests passed successfully');
      return true;

    } catch (error) {
      this.logError(`Tests failed: ${error.message}`);
      return false;
    }
  }

  // Build applications
  async buildApplications() {
    this.logSection('BUILDING APPLICATIONS');
    
    try {
      // Build backend
      this.logInfo('Building backend...');
      execSync('cd backend && npm run build', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      this.logSuccess('Backend built successfully');

      // Build frontend
      this.logInfo('Building frontend...');
      execSync('cd frontend && npm run build', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      this.logSuccess('Frontend built successfully');

      // Build dashboard if exists
      const dashboardPath = path.join(this.projectRoot, 'dashboard');
      if (fs.existsSync(dashboardPath)) {
        this.logInfo('Building dashboard...');
        execSync('cd dashboard && npm run build', { 
          stdio: 'inherit',
          cwd: this.projectRoot 
        });
        this.logSuccess('Dashboard built successfully');
      }

      this.logSuccess('All applications built successfully');
      return true;

    } catch (error) {
      this.logError(`Build failed: ${error.message}`);
      return false;
    }
  }

  // Database migration
  async runDatabaseMigrations() {
    this.logSection('DATABASE MIGRATIONS');
    
    try {
      const backendPath = path.join(this.projectRoot, 'backend');
      const prismaPath = path.join(backendPath, 'prisma');
      
      if (!fs.existsSync(prismaPath)) {
        this.logWarning('No Prisma schema found, skipping database migrations');
        return true;
      }

      // Generate Prisma client
      this.logInfo('Generating Prisma client...');
      execSync('cd backend && npx prisma generate', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      this.logSuccess('Prisma client generated');

      // Run database migrations
      this.logInfo('Running database migrations...');
      execSync('cd backend && npx prisma db push', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      this.logSuccess('Database migrations completed');

      // Seed database if seed script exists
      const packageJson = JSON.parse(fs.readFileSync(path.join(backendPath, 'package.json'), 'utf8'));
      if (packageJson.scripts && packageJson.scripts.seed) {
        this.logInfo('Seeding database...');
        execSync('cd backend && npm run seed', { 
          stdio: 'inherit',
          cwd: this.projectRoot 
        });
        this.logSuccess('Database seeded successfully');
      }

      return true;

    } catch (error) {
      this.logError(`Database migration failed: ${error.message}`);
      return false;
    }
  }

  // Docker deployment
  async deployWithDocker() {
    this.logSection('DOCKER DEPLOYMENT');
    
    try {
      if (!this.deploymentConfig.docker.enabled) {
        this.logInfo('Docker deployment disabled, skipping...');
        return true;
      }

      // Build Docker images
      this.logInfo('Building Docker images...');
      execSync('docker-compose build', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      this.logSuccess('Docker images built successfully');

      // Start services
      this.logInfo('Starting Docker services...');
      execSync('docker-compose up -d', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      this.logSuccess('Docker services started successfully');

      // Wait for services to be ready
      this.logInfo('Waiting for services to be ready...');
      await this.waitForServices();

      return true;

    } catch (error) {
      this.logError(`Docker deployment failed: ${error.message}`);
      return false;
    }
  }

  // Manual deployment
  async deployManually() {
    this.logSection('MANUAL DEPLOYMENT');
    
    try {
      const env = this.deploymentConfig.environments[this.currentEnvironment];
      
      // Start backend
      this.logInfo('Starting backend service...');
      const backendProcess = spawn('npm', ['run', 'start:prod'], {
        cwd: path.join(this.projectRoot, 'backend'),
        stdio: 'pipe',
        detached: true
      });
      
      // Start frontend
      this.logInfo('Starting frontend service...');
      const frontendProcess = spawn('npm', ['start'], {
        cwd: path.join(this.projectRoot, 'frontend'),
        stdio: 'pipe',
        detached: true
      });

      // Wait for services to be ready
      this.logInfo('Waiting for services to be ready...');
      await this.waitForServices();

      this.logSuccess('Manual deployment completed successfully');
      return true;

    } catch (error) {
      this.logError(`Manual deployment failed: ${error.message}`);
      return false;
    }
  }

  // Health check after deployment
  async healthCheck() {
    this.logSection('HEALTH CHECK');
    
    try {
      const env = this.deploymentConfig.environments[this.currentEnvironment];
      const checks = [];

      // Check backend health
      const backendHealth = await this.checkServiceHealth(
        `http://${env.backend.host}:${env.backend.port}/api/v1/health`
      );
      if (backendHealth) {
        this.logSuccess('Backend health check passed');
        checks.push({ service: 'Backend', status: 'healthy' });
      } else {
        this.logError('Backend health check failed');
        checks.push({ service: 'Backend', status: 'unhealthy' });
      }

      // Check frontend health
      const frontendHealth = await this.checkServiceHealth(
        `http://${env.frontend.host}:${env.frontend.port}`
      );
      if (frontendHealth) {
        this.logSuccess('Frontend health check passed');
        checks.push({ service: 'Frontend', status: 'healthy' });
      } else {
        this.logError('Frontend health check failed');
        checks.push({ service: 'Frontend', status: 'unhealthy' });
      }

      const healthyServices = checks.filter(check => check.status === 'healthy').length;
      const totalServices = checks.length;

      if (healthyServices === totalServices) {
        this.logSuccess(`All services healthy (${healthyServices}/${totalServices})`);
        return true;
      } else {
        this.logWarning(`${healthyServices}/${totalServices} services healthy`);
        return false;
      }

    } catch (error) {
      this.logError(`Health check failed: ${error.message}`);
      return false;
    }
  }

  // Utility methods
  compareVersions(version1, version2) {
    const v1 = version1.replace('v', '').split('.').map(Number);
    const v2 = version2.replace('v', '').split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0;
      const num2 = v2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
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

  async waitForServices() {
    const env = this.deploymentConfig.environments[this.currentEnvironment];
    const maxAttempts = 30;
    const delay = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      this.logInfo(`Waiting for services... (attempt ${attempt}/${maxAttempts})`);
      
      const backendReady = await this.checkServiceHealth(
        `http://${env.backend.host}:${env.backend.port}/api/v1/health`
      );
      
      const frontendReady = await this.checkServiceHealth(
        `http://${env.frontend.host}:${env.frontend.port}`
      );

      if (backendReady && frontendReady) {
        this.logSuccess('All services are ready!');
        return true;
      }

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Services failed to start within expected time');
  }

  async checkServiceHealth(url) {
    return new Promise((resolve) => {
      const req = http.get(url, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 300);
      });
      
      req.on('error', () => resolve(false));
      req.setTimeout(5000, () => resolve(false));
    });
  }

  // Record deployment
  recordDeployment(status, details = {}) {
    const deployment = {
      timestamp: new Date().toISOString(),
      environment: this.currentEnvironment,
      status,
      details,
      duration: Date.now() - this.startTime
    };

    this.deploymentHistory.unshift(deployment);
    
    // Keep only last 10 deployments
    if (this.deploymentHistory.length > 10) {
      this.deploymentHistory = this.deploymentHistory.slice(0, 10);
    }

    // Save to file
    const historyPath = path.join(this.projectRoot, 'deployment-history.json');
    fs.writeFileSync(historyPath, JSON.stringify(this.deploymentHistory, null, 2));
  }

  // Main deployment method
  async deploy(environment = 'development', options = {}) {
    this.currentEnvironment = environment;
    this.startTime = Date.now();

    this.log(`${colors.bright}${colors.magenta}🎵 Audio Tài Lộc - Deployment Manager${colors.reset}`);
    this.log(`${colors.cyan}Starting deployment to ${environment} environment...${colors.reset}\n`);

    try {
      // Pre-deployment checks
      const checksPassed = await this.preDeploymentChecks();
      if (!checksPassed) {
        this.recordDeployment('failed', { reason: 'Pre-deployment checks failed' });
        return false;
      }

      // Install dependencies
      const depsInstalled = await this.installDependencies();
      if (!depsInstalled) {
        this.recordDeployment('failed', { reason: 'Dependency installation failed' });
        return false;
      }

      // Run tests (if not skipped)
      if (!options.skipTests) {
        const testsPassed = await this.runTests();
        if (!testsPassed) {
          this.recordDeployment('failed', { reason: 'Tests failed' });
          return false;
        }
      }

      // Build applications
      const buildSuccess = await this.buildApplications();
      if (!buildSuccess) {
        this.recordDeployment('failed', { reason: 'Build failed' });
        return false;
      }

      // Database migrations
      const migrationSuccess = await this.runDatabaseMigrations();
      if (!migrationSuccess) {
        this.recordDeployment('failed', { reason: 'Database migration failed' });
        return false;
      }

      // Deploy
      let deploySuccess;
      if (options.useDocker) {
        deploySuccess = await this.deployWithDocker();
      } else {
        deploySuccess = await this.deployManually();
      }

      if (!deploySuccess) {
        this.recordDeployment('failed', { reason: 'Deployment failed' });
        return false;
      }

      // Health check
      const healthCheck = await this.healthCheck();
      if (!healthCheck) {
        this.recordDeployment('warning', { reason: 'Health check failed' });
      }

      const duration = Date.now() - this.startTime;
      this.logSection('DEPLOYMENT COMPLETE');
      this.logSuccess(`Deployment to ${environment} completed successfully`);
      this.logInfo(`Total deployment time: ${Math.round(duration / 1000)} seconds`);

      this.recordDeployment('success', { 
        duration,
        environment,
        healthCheck 
      });

      return true;

    } catch (error) {
      this.logError(`Deployment failed: ${error.message}`);
      this.recordDeployment('failed', { 
        reason: error.message,
        duration: Date.now() - this.startTime
      });
      return false;
    }
  }

  // Rollback deployment
  async rollback() {
    this.logSection('ROLLBACK DEPLOYMENT');
    
    try {
      if (this.deploymentConfig.docker.enabled) {
        // Docker rollback
        this.logInfo('Rolling back Docker deployment...');
        execSync('docker-compose down', { 
          stdio: 'inherit',
          cwd: this.projectRoot 
        });
        this.logSuccess('Docker services stopped');
      } else {
        // Manual rollback
        this.logInfo('Rolling back manual deployment...');
        // Kill processes and restart with previous version
        execSync('pkill -f "npm.*start"', { stdio: 'pipe' });
        this.logSuccess('Previous services stopped');
      }

      this.logSuccess('Rollback completed successfully');
      return true;

    } catch (error) {
      this.logError(`Rollback failed: ${error.message}`);
      return false;
    }
  }
}

// CLI interface
if (require.main === module) {
  const deployManager = new DeployManager();
  const args = process.argv.slice(2);
  const command = args[0];
  const environment = args[1] || 'development';
  const options = {
    skipTests: args.includes('--skip-tests'),
    useDocker: args.includes('--docker')
  };

  switch (command) {
    case 'deploy':
      deployManager.deploy(environment, options);
      break;
    case 'rollback':
      deployManager.rollback();
      break;
    case 'check':
      deployManager.preDeploymentChecks();
      break;
    default:
      console.log(`${colors.bright}${colors.magenta}🎵 Audio Tài Lộc - Deployment Manager${colors.reset}`);
      console.log(`${colors.cyan}Usage:${colors.reset}`);
      console.log('  node deploy-manager.js deploy [environment] [options]');
      console.log('  node deploy-manager.js rollback');
      console.log('  node deploy-manager.js check');
      console.log('');
      console.log(`${colors.cyan}Options:${colors.reset}`);
      console.log('  --skip-tests    Skip running tests');
      console.log('  --docker        Use Docker deployment');
      console.log('');
      console.log(`${colors.cyan}Environments:${colors.reset}`);
      console.log('  development (default)');
      console.log('  staging');
      console.log('  production');
  }
}

module.exports = DeployManager;