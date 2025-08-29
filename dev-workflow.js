#!/usr/bin/env node

/**
 * 🎵 Audio Tài Lộc - Development Workflow Manager
 * 
 * Hệ thống quản lý workflow development cho dự án Audio Tài Lộc
 * Bao gồm: Code quality, Testing, Linting, và Development tasks
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const chokidar = require('chokidar');

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

class DevWorkflowManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.workflowConfig = {
      watch: {
        enabled: true,
        patterns: [
          'backend/src/**/*.{ts,js}',
          'frontend/src/**/*.{ts,tsx,js,jsx}',
          'shared/**/*.{ts,js}'
        ],
        ignore: [
          '**/node_modules/**',
          '**/dist/**',
          '**/build/**',
          '**/.git/**'
        ]
      },
      linting: {
        backend: {
          enabled: true,
          command: 'cd backend && npm run lint',
          files: ['backend/src/**/*.{ts,js}']
        },
        frontend: {
          enabled: true,
          command: 'cd frontend && npm run lint',
          files: ['frontend/**/*.{ts,tsx,js,jsx}']
        }
      },
      testing: {
        backend: {
          enabled: true,
          command: 'cd backend && npm test',
          watch: 'cd backend && npm run test:watch'
        },
        frontend: {
          enabled: true,
          command: 'cd frontend && npm test',
          watch: 'cd frontend && npm run test:watch'
        }
      },
      formatting: {
        enabled: true,
        command: 'prettier --write',
        files: [
          'backend/src/**/*.{ts,js,json}',
          'frontend/**/*.{ts,tsx,js,jsx,json,css,scss}',
          'shared/**/*.{ts,js,json}'
        ]
      }
    };
    this.isWatching = false;
    this.watcher = null;
    this.processes = new Map();
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

  // Code quality checks
  async runCodeQualityChecks() {
    this.logSection('CODE QUALITY CHECKS');
    
    const results = {
      linting: {},
      formatting: {},
      testing: {},
      overall: { passed: 0, failed: 0, total: 0 }
    };

    try {
      // Run linting
      if (this.workflowConfig.linting.backend.enabled) {
        this.logInfo('Running backend linting...');
        try {
          execSync(this.workflowConfig.linting.backend.command, { 
            stdio: 'inherit',
            cwd: this.projectRoot 
          });
          this.logSuccess('Backend linting passed');
          results.linting.backend = { status: 'passed' };
          results.overall.passed++;
        } catch (error) {
          this.logError('Backend linting failed');
          results.linting.backend = { status: 'failed', error: error.message };
          results.overall.failed++;
        }
        results.overall.total++;
      }

      if (this.workflowConfig.linting.frontend.enabled) {
        this.logInfo('Running frontend linting...');
        try {
          execSync(this.workflowConfig.linting.frontend.command, { 
            stdio: 'inherit',
            cwd: this.projectRoot 
          });
          this.logSuccess('Frontend linting passed');
          results.linting.frontend = { status: 'passed' };
          results.overall.passed++;
        } catch (error) {
          this.logError('Frontend linting failed');
          results.linting.frontend = { status: 'failed', error: error.message };
          results.overall.failed++;
        }
        results.overall.total++;
      }

      // Run formatting check
      if (this.workflowConfig.formatting.enabled) {
        this.logInfo('Checking code formatting...');
        try {
          const formatCommand = `${this.workflowConfig.formatting.command} ${this.workflowConfig.formatting.files.join(' ')}`;
          execSync(formatCommand, { 
            stdio: 'inherit',
            cwd: this.projectRoot 
          });
          this.logSuccess('Code formatting passed');
          results.formatting = { status: 'passed' };
          results.overall.passed++;
        } catch (error) {
          this.logError('Code formatting failed');
          results.formatting = { status: 'failed', error: error.message };
          results.overall.failed++;
        }
        results.overall.total++;
      }

      // Run tests
      if (this.workflowConfig.testing.backend.enabled) {
        this.logInfo('Running backend tests...');
        try {
          execSync(this.workflowConfig.testing.backend.command, { 
            stdio: 'inherit',
            cwd: this.projectRoot 
          });
          this.logSuccess('Backend tests passed');
          results.testing.backend = { status: 'passed' };
          results.overall.passed++;
        } catch (error) {
          this.logError('Backend tests failed');
          results.testing.backend = { status: 'failed', error: error.message };
          results.overall.failed++;
        }
        results.overall.total++;
      }

      if (this.workflowConfig.testing.frontend.enabled) {
        this.logInfo('Running frontend tests...');
        try {
          execSync(this.workflowConfig.testing.frontend.command, { 
            stdio: 'inherit',
            cwd: this.projectRoot 
          });
          this.logSuccess('Frontend tests passed');
          results.testing.frontend = { status: 'passed' };
          results.overall.passed++;
        } catch (error) {
          this.logError('Frontend tests failed');
          results.testing.frontend = { status: 'failed', error: error.message };
          results.overall.failed++;
        }
        results.overall.total++;
      }

      // Summary
      this.logSection('CODE QUALITY SUMMARY');
      this.logInfo(`Total checks: ${results.overall.total}`);
      this.logInfo(`Passed: ${results.overall.passed}`);
      this.logInfo(`Failed: ${results.overall.failed}`);

      if (results.overall.failed === 0) {
        this.logSuccess('All code quality checks passed!');
        return true;
      } else {
        this.logWarning(`${results.overall.failed} checks failed. Please fix the issues.`);
        return false;
      }

    } catch (error) {
      this.logError(`Code quality checks failed: ${error.message}`);
      return false;
    }
  }

  // Start development servers
  async startDevServers() {
    this.logSection('STARTING DEVELOPMENT SERVERS');
    
    try {
      // Start backend development server
      this.logInfo('Starting backend development server...');
      const backendProcess = spawn('npm', ['run', 'start:dev'], {
        cwd: path.join(this.projectRoot, 'backend'),
        stdio: 'pipe',
        detached: false
      });

      backendProcess.stdout.on('data', (data) => {
        this.log(`[Backend] ${data.toString().trim()}`, 'blue');
      });

      backendProcess.stderr.on('data', (data) => {
        this.log(`[Backend Error] ${data.toString().trim()}`, 'red');
      });

      this.processes.set('backend', backendProcess);
      this.logSuccess('Backend development server started');

      // Start frontend development server
      this.logInfo('Starting frontend development server...');
      const frontendProcess = spawn('npm', ['run', 'dev'], {
        cwd: path.join(this.projectRoot, 'frontend'),
        stdio: 'pipe',
        detached: false
      });

      frontendProcess.stdout.on('data', (data) => {
        this.log(`[Frontend] ${data.toString().trim()}`, 'green');
      });

      frontendProcess.stderr.on('data', (data) => {
        this.log(`[Frontend Error] ${data.toString().trim()}`, 'red');
      });

      this.processes.set('frontend', frontendProcess);
      this.logSuccess('Frontend development server started');

      // Start dashboard if exists
      const dashboardPath = path.join(this.projectRoot, 'dashboard');
      if (fs.existsSync(dashboardPath)) {
        this.logInfo('Starting dashboard development server...');
        const dashboardProcess = spawn('npm', ['run', 'dev'], {
          cwd: dashboardPath,
          stdio: 'pipe',
          detached: false
        });

        dashboardProcess.stdout.on('data', (data) => {
          this.log(`[Dashboard] ${data.toString().trim()}`, 'magenta');
        });

        dashboardProcess.stderr.on('data', (data) => {
          this.log(`[Dashboard Error] ${data.toString().trim()}`, 'red');
        });

        this.processes.set('dashboard', dashboardProcess);
        this.logSuccess('Dashboard development server started');
      }

      this.logSuccess('All development servers started successfully');
      return true;

    } catch (error) {
      this.logError(`Failed to start development servers: ${error.message}`);
      return false;
    }
  }

  // Start file watching
  async startFileWatching() {
    if (!this.workflowConfig.watch.enabled) {
      this.logInfo('File watching disabled');
      return;
    }

    this.logSection('STARTING FILE WATCHER');
    
    try {
      this.watcher = chokidar.watch(this.workflowConfig.watch.patterns, {
        ignored: this.workflowConfig.watch.ignore,
        persistent: true,
        ignoreInitial: true
      });

      this.watcher
        .on('add', (path) => this.handleFileChange('add', path))
        .on('change', (path) => this.handleFileChange('change', path))
        .on('unlink', (path) => this.handleFileChange('unlink', path))
        .on('error', (error) => this.logError(`Watcher error: ${error.message}`));

      this.isWatching = true;
      this.logSuccess('File watcher started successfully');
      this.logInfo(`Watching patterns: ${this.workflowConfig.watch.patterns.join(', ')}`);

    } catch (error) {
      this.logError(`Failed to start file watcher: ${error.message}`);
    }
  }

  // Handle file changes
  async handleFileChange(event, filePath) {
    const relativePath = path.relative(this.projectRoot, filePath);
    this.logInfo(`File ${event}: ${relativePath}`);

    // Determine which service the file belongs to
    let service = 'unknown';
    if (filePath.includes('backend/')) {
      service = 'backend';
    } else if (filePath.includes('frontend/')) {
      service = 'frontend';
    } else if (filePath.includes('dashboard/')) {
      service = 'dashboard';
    }

    // Run appropriate checks based on file type
    if (filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      await this.runQuickChecks(service, filePath);
    }
  }

  // Run quick checks for changed files
  async runQuickChecks(service, filePath) {
    try {
      // Run linting for the specific service
      if (this.workflowConfig.linting[service]?.enabled) {
        this.logInfo(`Running ${service} linting for changed file...`);
        try {
          execSync(this.workflowConfig.linting[service].command, { 
            stdio: 'pipe',
            cwd: this.projectRoot 
          });
          this.logSuccess(`${service} linting passed`);
        } catch (error) {
          this.logWarning(`${service} linting failed for ${path.basename(filePath)}`);
        }
      }

      // Run tests for the specific service
      if (this.workflowConfig.testing[service]?.enabled) {
        this.logInfo(`Running ${service} tests...`);
        try {
          execSync(this.workflowConfig.testing[service].command, { 
            stdio: 'pipe',
            cwd: this.projectRoot 
          });
          this.logSuccess(`${service} tests passed`);
        } catch (error) {
          this.logWarning(`${service} tests failed`);
        }
      }

    } catch (error) {
      this.logError(`Quick checks failed: ${error.message}`);
    }
  }

  // Start test watchers
  async startTestWatchers() {
    this.logSection('STARTING TEST WATCHERS');
    
    try {
      // Start backend test watcher
      if (this.workflowConfig.testing.backend.enabled) {
        this.logInfo('Starting backend test watcher...');
        const backendTestProcess = spawn('npm', ['run', 'test:watch'], {
          cwd: path.join(this.projectRoot, 'backend'),
          stdio: 'pipe',
          detached: false
        });

        backendTestProcess.stdout.on('data', (data) => {
          this.log(`[Backend Tests] ${data.toString().trim()}`, 'yellow');
        });

        this.processes.set('backend-tests', backendTestProcess);
        this.logSuccess('Backend test watcher started');
      }

      // Start frontend test watcher
      if (this.workflowConfig.testing.frontend.enabled) {
        this.logInfo('Starting frontend test watcher...');
        const frontendTestProcess = spawn('npm', ['run', 'test:watch'], {
          cwd: path.join(this.projectRoot, 'frontend'),
          stdio: 'pipe',
          detached: false
        });

        frontendTestProcess.stdout.on('data', (data) => {
          this.log(`[Frontend Tests] ${data.toString().trim()}`, 'yellow');
        });

        this.processes.set('frontend-tests', frontendTestProcess);
        this.logSuccess('Frontend test watcher started');
      }

    } catch (error) {
      this.logError(`Failed to start test watchers: ${error.message}`);
    }
  }

  // Generate development report
  generateDevReport() {
    const report = {
      timestamp: new Date().toISOString(),
      project: 'Audio Tài Lộc',
      workflow: {
        watching: this.isWatching,
        processes: Array.from(this.processes.keys()),
        config: this.workflowConfig
      },
      summary: {
        activeProcesses: this.processes.size,
        fileWatching: this.isWatching,
        services: ['backend', 'frontend', 'dashboard'].filter(service => 
          this.processes.has(service)
        )
      }
    };

    // Save report to file
    const reportPath = path.join(this.projectRoot, 'dev-workflow-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return report;
  }

  // Stop all processes
  async stopAll() {
    this.logSection('STOPPING DEVELOPMENT WORKFLOW');
    
    try {
      // Stop file watcher
      if (this.watcher) {
        this.watcher.close();
        this.isWatching = false;
        this.logSuccess('File watcher stopped');
      }

      // Stop all processes
      for (const [name, process] of this.processes) {
        this.logInfo(`Stopping ${name}...`);
        process.kill('SIGTERM');
        this.logSuccess(`${name} stopped`);
      }

      this.processes.clear();
      this.logSuccess('All development processes stopped');

      // Generate final report
      const report = this.generateDevReport();
      this.logInfo(`Development workflow report saved to: dev-workflow-report.json`);

    } catch (error) {
      this.logError(`Failed to stop development workflow: ${error.message}`);
    }
  }

  // Main development workflow
  async startWorkflow(options = {}) {
    this.log(`${colors.bright}${colors.magenta}🎵 Audio Tài Lộc - Development Workflow Manager${colors.reset}`);
    this.log(`${colors.cyan}Starting development workflow...${colors.reset}\n`);

    try {
      // Run initial code quality checks
      if (!options.skipChecks) {
        const checksPassed = await this.runCodeQualityChecks();
        if (!checksPassed && !options.force) {
          this.logError('Code quality checks failed. Use --force to continue.');
          return false;
        }
      }

      // Start development servers
      const serversStarted = await this.startDevServers();
      if (!serversStarted) {
        this.logError('Failed to start development servers');
        return false;
      }

      // Start file watching
      if (options.watch) {
        await this.startFileWatching();
      }

      // Start test watchers
      if (options.testWatch) {
        await this.startTestWatchers();
      }

      this.logSection('DEVELOPMENT WORKFLOW STARTED');
      this.logSuccess('Development workflow is now running!');
      this.logInfo('Press Ctrl+C to stop all processes');

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        await this.stopAll();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await this.stopAll();
        process.exit(0);
      });

      return true;

    } catch (error) {
      this.logError(`Development workflow failed: ${error.message}`);
      return false;
    }
  }

  // Quick development tasks
  async runQuickTask(task) {
    this.logSection(`QUICK TASK: ${task.toUpperCase()}`);
    
    try {
      switch (task) {
        case 'lint':
          return await this.runCodeQualityChecks();
        
        case 'format':
          this.logInfo('Formatting code...');
          const formatCommand = `${this.workflowConfig.formatting.command} ${this.workflowConfig.formatting.files.join(' ')}`;
          execSync(formatCommand, { stdio: 'inherit', cwd: this.projectRoot });
          this.logSuccess('Code formatting completed');
          return true;
        
        case 'test':
          this.logInfo('Running all tests...');
          const testPromises = [];
          
          if (this.workflowConfig.testing.backend.enabled) {
            testPromises.push(
              execSync(this.workflowConfig.testing.backend.command, { stdio: 'inherit', cwd: this.projectRoot })
            );
          }
          
          if (this.workflowConfig.testing.frontend.enabled) {
            testPromises.push(
              execSync(this.workflowConfig.testing.frontend.command, { stdio: 'inherit', cwd: this.projectRoot })
            );
          }
          
          await Promise.all(testPromises);
          this.logSuccess('All tests completed');
          return true;
        
        default:
          this.logError(`Unknown task: ${task}`);
          return false;
      }
    } catch (error) {
      this.logError(`Task ${task} failed: ${error.message}`);
      return false;
    }
  }
}

// CLI interface
if (require.main === module) {
  const workflow = new DevWorkflowManager();
  const args = process.argv.slice(2);
  const command = args[0];
  const options = {
    skipChecks: args.includes('--skip-checks'),
    force: args.includes('--force'),
    watch: args.includes('--watch'),
    testWatch: args.includes('--test-watch')
  };

  switch (command) {
    case 'start':
      workflow.startWorkflow(options);
      break;
    case 'lint':
      workflow.runQuickTask('lint');
      break;
    case 'format':
      workflow.runQuickTask('format');
      break;
    case 'test':
      workflow.runQuickTask('test');
      break;
    case 'stop':
      workflow.stopAll();
      break;
    default:
      console.log(`${colors.bright}${colors.magenta}🎵 Audio Tài Lộc - Development Workflow Manager${colors.reset}`);
      console.log(`${colors.cyan}Usage:${colors.reset}`);
      console.log('  node dev-workflow.js start [options]');
      console.log('  node dev-workflow.js lint');
      console.log('  node dev-workflow.js format');
      console.log('  node dev-workflow.js test');
      console.log('  node dev-workflow.js stop');
      console.log('');
      console.log(`${colors.cyan}Options:${colors.reset}`);
      console.log('  --skip-checks    Skip initial code quality checks');
      console.log('  --force          Continue even if checks fail');
      console.log('  --watch          Enable file watching');
      console.log('  --test-watch     Enable test watching');
  }
}

module.exports = DevWorkflowManager;