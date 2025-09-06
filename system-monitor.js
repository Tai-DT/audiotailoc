#!/usr/bin/env node

/**
 * 🎵 Audio Tài Lộc - System Monitor
 * 
 * Hệ thống monitoring real-time cho dự án Audio Tài Lộc
 * Theo dõi: Performance, Health, Resources, và Alerts
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const os = require('os');

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

class SystemMonitor {
  constructor() {
    this.projectRoot = process.cwd();
    this.metrics = {
      system: {},
      backend: {},
      frontend: {},
      database: {},
      network: {},
      alerts: []
    };
    this.startTime = Date.now();
    this.isRunning = false;
    this.monitoringInterval = null;
  }

  log(message, color = 'reset') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${colors[color]}${message}${colors.reset}`);
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

  // System Metrics
  async collectSystemMetrics() {
    try {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memUsagePercent = (usedMem / totalMem) * 100;

      const cpuUsage = os.loadavg();
      const uptime = os.uptime();

      this.metrics.system = {
        memory: {
          total: Math.round(totalMem / 1024 / 1024 / 1024 * 100) / 100,
          used: Math.round(usedMem / 1024 / 1024 / 1024 * 100) / 100,
          free: Math.round(freeMem / 1024 / 1024 / 1024 * 100) / 100,
          usagePercent: Math.round(memUsagePercent * 100) / 100
        },
        cpu: {
          load1: Math.round(cpuUsage[0] * 100) / 100,
          load5: Math.round(cpuUsage[1] * 100) / 100,
          load15: Math.round(cpuUsage[2] * 100) / 100
        },
        uptime: Math.round(uptime / 3600 * 100) / 100,
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version
      };

      // Check for memory alerts
      if (memUsagePercent > 80) {
        this.addAlert('HIGH_MEMORY_USAGE', `Memory usage is ${memUsagePercent.toFixed(1)}%`, 'warning');
      }

      // Check for CPU alerts
      if (cpuUsage[0] > 2.0) {
        this.addAlert('HIGH_CPU_LOAD', `CPU load is ${cpuUsage[0].toFixed(2)}`, 'warning');
      }

    } catch (error) {
      this.logError(`System metrics collection failed: ${error.message}`);
    }
  }

  // Backend Health Check
  async checkBackendHealth() {
    try {
      const backendUrl = 'http://localhost:8000/api/v1/health';
      
      const healthCheck = await this.makeHttpRequest(backendUrl);
      
      if (healthCheck.success) {
        this.metrics.backend = {
          status: 'healthy',
          responseTime: healthCheck.responseTime,
          uptime: healthCheck.data?.uptime || 0,
          timestamp: new Date().toISOString()
        };
        this.logSuccess(`Backend health check passed (${healthCheck.responseTime}ms)`);
      } else {
        this.metrics.backend = {
          status: 'unhealthy',
          error: healthCheck.error,
          timestamp: new Date().toISOString()
        };
        this.addAlert('BACKEND_DOWN', 'Backend service is not responding', 'error');
      }
    } catch (error) {
      this.metrics.backend = {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.addAlert('BACKEND_ERROR', `Backend health check failed: ${error.message}`, 'error');
    }
  }

  // Frontend Health Check
  async checkFrontendHealth() {
    try {
      const frontendUrl = 'http://localhost:3000';
      
      const healthCheck = await this.makeHttpRequest(frontendUrl);
      
      if (healthCheck.success) {
        this.metrics.frontend = {
          status: 'healthy',
          responseTime: healthCheck.responseTime,
          timestamp: new Date().toISOString()
        };
        this.logSuccess(`Frontend health check passed (${healthCheck.responseTime}ms)`);
      } else {
        this.metrics.frontend = {
          status: 'unhealthy',
          error: healthCheck.error,
          timestamp: new Date().toISOString()
        };
        this.addAlert('FRONTEND_DOWN', 'Frontend service is not responding', 'error');
      }
    } catch (error) {
      this.metrics.frontend = {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.addAlert('FRONTEND_ERROR', `Frontend health check failed: ${error.message}`, 'error');
    }
  }

  // Database Health Check
  async checkDatabaseHealth() {
    try {
      const backendPath = path.join(this.projectRoot, 'backend');
      const prismaPath = path.join(backendPath, 'prisma');
      
      if (fs.existsSync(prismaPath)) {
        // Check if database is accessible
        const dbCheck = await this.checkDatabaseConnection();
        
        if (dbCheck.success) {
          this.metrics.database = {
            status: 'healthy',
            connectionTime: dbCheck.connectionTime,
            timestamp: new Date().toISOString()
          };
          this.logSuccess(`Database health check passed (${dbCheck.connectionTime}ms)`);
        } else {
          this.metrics.database = {
            status: 'unhealthy',
            error: dbCheck.error,
            timestamp: new Date().toISOString()
          };
          this.addAlert('DATABASE_DOWN', 'Database connection failed', 'error');
        }
      } else {
        this.metrics.database = {
          status: 'not_configured',
          timestamp: new Date().toISOString()
        };
        this.logWarning('Database not configured (no Prisma schema found)');
      }
    } catch (error) {
      this.metrics.database = {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.addAlert('DATABASE_ERROR', `Database health check failed: ${error.message}`, 'error');
    }
  }

  // Network Connectivity Check
  async checkNetworkConnectivity() {
    try {
      const testUrls = [
        'http://www.google.com',
        'https://api.github.com',
        'http://httpbin.org/status/200'
      ];

      const results = await Promise.allSettled(
        testUrls.map(url => this.makeHttpRequest(url))
      );

      const successfulChecks = results.filter(result => 
        result.status === 'fulfilled' && result.value.success
      ).length;

      const connectivityPercent = (successfulChecks / testUrls.length) * 100;

      this.metrics.network = {
        connectivity: connectivityPercent,
        successfulChecks,
        totalChecks: testUrls.length,
        timestamp: new Date().toISOString()
      };

      if (connectivityPercent < 50) {
        this.addAlert('NETWORK_ISSUES', `Network connectivity is ${connectivityPercent.toFixed(1)}%`, 'warning');
      }

      this.logInfo(`Network connectivity: ${connectivityPercent.toFixed(1)}% (${successfulChecks}/${testUrls.length})`);
    } catch (error) {
      this.logError(`Network connectivity check failed: ${error.message}`);
    }
  }

  // Utility methods
  async makeHttpRequest(url) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const protocol = url.startsWith('https:') ? https : http;
      
      const req = protocol.get(url, (res) => {
        const responseTime = Date.now() - startTime;
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({
              success: res.statusCode >= 200 && res.statusCode < 300,
              responseTime,
              data: jsonData,
              statusCode: res.statusCode
            });
          } catch (error) {
            resolve({
              success: res.statusCode >= 200 && res.statusCode < 300,
              responseTime,
              data: data,
              statusCode: res.statusCode
            });
          }
        });
      });
      
      req.on('error', (error) => {
        resolve({
          success: false,
          error: error.message,
          responseTime: Date.now() - startTime
        });
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({
          success: false,
          error: 'Request timeout',
          responseTime: Date.now() - startTime
        });
      });
    });
  }

  async checkDatabaseConnection() {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      // Try to run a simple Prisma command to check connection
      exec('cd backend && npx prisma db execute --stdin <<< "SELECT 1"', (error, stdout, stderr) => {
        const connectionTime = Date.now() - startTime;
        
        if (error) {
          resolve({
            success: false,
            error: error.message,
            connectionTime
          });
        } else {
          resolve({
            success: true,
            connectionTime
          });
        }
      });
    });
  }

  addAlert(type, message, level = 'info') {
    const alert = {
      type,
      message,
      level,
      timestamp: new Date().toISOString()
    };
    
    this.metrics.alerts.unshift(alert);
    
    // Keep only last 50 alerts
    if (this.metrics.alerts.length > 50) {
      this.metrics.alerts = this.metrics.alerts.slice(0, 50);
    }
    
    // Log alert
    switch (level) {
      case 'error':
        this.logError(`ALERT: ${message}`);
        break;
      case 'warning':
        this.logWarning(`ALERT: ${message}`);
        break;
      default:
        this.logInfo(`ALERT: ${message}`);
    }
  }

  // Generate monitoring report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      project: 'Audio Tài Lộc',
      uptime: Date.now() - this.startTime,
      metrics: this.metrics,
      summary: {
        systemHealth: this.calculateSystemHealth(),
        backendHealth: this.metrics.backend?.status === 'healthy',
        frontendHealth: this.metrics.frontend?.status === 'healthy',
        databaseHealth: this.metrics.database?.status === 'healthy',
        networkHealth: this.metrics.network?.connectivity > 80,
        activeAlerts: this.metrics.alerts.filter(alert => alert.level === 'error' || alert.level === 'warning').length
      }
    };

    // Save report to file
    const reportPath = path.join(this.projectRoot, 'system-monitor-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return report;
  }

  calculateSystemHealth() {
    const checks = [
      this.metrics.backend?.status === 'healthy',
      this.metrics.frontend?.status === 'healthy',
      this.metrics.database?.status === 'healthy',
      this.metrics.network?.connectivity > 80,
      this.metrics.system?.memory?.usagePercent < 80
    ];

    const healthyChecks = checks.filter(check => check === true).length;
    return Math.round((healthyChecks / checks.length) * 100);
  }

  // Display current status
  displayStatus() {
    console.clear();
    console.log(`${colors.bright}${colors.magenta}🎵 Audio Tài Lộc - System Monitor${colors.reset}`);
    console.log(`${colors.cyan}Monitoring active - Press Ctrl+C to stop${colors.reset}\n`);

    // System Status
    console.log(`${colors.bright}${colors.blue}SYSTEM STATUS:${colors.reset}`);
    console.log(`  Memory: ${this.metrics.system?.memory?.usagePercent || 0}% used`);
    console.log(`  CPU Load: ${this.metrics.system?.cpu?.load1 || 0}`);
    console.log(`  Uptime: ${this.metrics.system?.uptime || 0}h`);

    // Service Status
    console.log(`\n${colors.bright}${colors.blue}SERVICE STATUS:${colors.reset}`);
    console.log(`  Backend: ${this.getStatusIcon(this.metrics.backend?.status)} ${this.metrics.backend?.status || 'unknown'}`);
    console.log(`  Frontend: ${this.getStatusIcon(this.metrics.frontend?.status)} ${this.metrics.frontend?.status || 'unknown'}`);
    console.log(`  Database: ${this.getStatusIcon(this.metrics.database?.status)} ${this.metrics.database?.status || 'unknown'}`);
    console.log(`  Network: ${this.getStatusIcon(this.metrics.network?.connectivity > 80)} ${this.metrics.network?.connectivity || 0}%`);

    // Recent Alerts
    const recentAlerts = this.metrics.alerts.slice(0, 5);
    if (recentAlerts.length > 0) {
      console.log(`\n${colors.bright}${colors.blue}RECENT ALERTS:${colors.reset}`);
      recentAlerts.forEach(alert => {
        const icon = alert.level === 'error' ? '❌' : alert.level === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`  ${icon} ${alert.message}`);
      });
    }

    console.log(`\n${colors.yellow}Last updated: ${new Date().toLocaleTimeString()}${colors.reset}`);
  }

  getStatusIcon(status) {
    if (status === 'healthy' || status === true) return '🟢';
    if (status === 'unhealthy' || status === false) return '🔴';
    if (status === 'warning') return '🟡';
    return '⚪';
  }

  // Start monitoring
  async start() {
    this.isRunning = true;
    this.log(`${colors.bright}${colors.magenta}🎵 Audio Tài Lộc - System Monitor Started${colors.reset}`);
    this.log(`${colors.cyan}Monitoring interval: 30 seconds${colors.reset}\n`);

    // Initial collection
    await this.collectAllMetrics();

    // Start monitoring loop
    this.monitoringInterval = setInterval(async () => {
      if (this.isRunning) {
        await this.collectAllMetrics();
        this.displayStatus();
      }
    }, 30000); // 30 seconds

    // Display initial status
    this.displayStatus();
  }

  async collectAllMetrics() {
    await Promise.all([
      this.collectSystemMetrics(),
      this.checkBackendHealth(),
      this.checkFrontendHealth(),
      this.checkDatabaseHealth(),
      this.checkNetworkConnectivity()
    ]);
  }

  // Stop monitoring
  stop() {
    this.isRunning = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    const report = this.generateReport();
    this.log(`\n${colors.bright}${colors.green}Monitoring stopped${colors.reset}`);
    this.log(`${colors.cyan}Final report saved to: system-monitor-report.json${colors.reset}`);
    this.log(`${colors.cyan}System Health Score: ${report.summary.systemHealth}%${colors.reset}`);
    
    process.exit(0);
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new SystemMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    monitor.stop();
  });
  
  process.on('SIGTERM', () => {
    monitor.stop();
  });
  
  // Start monitoring
  monitor.start();
}

module.exports = SystemMonitor;