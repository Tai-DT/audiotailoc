#!/usr/bin/env node

/**
 * 📊 Monitoring Dashboard Script
 * Real-time system monitoring and metrics visualization
 */

const fetch = require('node-fetch');
const fs = require('fs');

const API_BASE = 'http://localhost:8000/api/v1';

// Metrics collection
const metrics = {
  timestamp: new Date().toISOString(),
  system: {},
  api: {},
  performance: {},
  errors: []
};

/**
 * Get system health metrics
 */
async function getSystemHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    
    metrics.system = {
      status: data.data?.status || 'unknown',
      uptime: data.data?.uptime || 0,
      memory: data.data?.memory || {},
      database: data.data?.database || {},
      redis: data.data?.redis || {}
    };
    
    return true;
  } catch (error) {
    metrics.errors.push(`System Health Error: ${error.message}`);
    return false;
  }
}

/**
 * Get API performance metrics
 */
async function getAPIMetrics() {
  const endpoints = [
    '/health',
    '/catalog/products',
    '/catalog/categories',
    '/search/products',
    '/ai/health',
    '/support/kb/articles'
  ];

  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const startTime = Date.now();
      const response = await fetch(`${API_BASE}${endpoint}`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      results.push({
        endpoint,
        status: response.status,
        responseTime,
        success: response.ok
      });
    } catch (error) {
      results.push({
        endpoint,
        status: 'ERROR',
        responseTime: 0,
        success: false,
        error: error.message
      });
    }
  }
  
  metrics.api = {
    totalEndpoints: endpoints.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    averageResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
    endpoints: results
  };
  
  return results;
}

/**
 * Get performance metrics
 */
async function getPerformanceMetrics() {
  const performance = {
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    uptime: process.uptime()
  };
  
  metrics.performance = performance;
  return performance;
}

/**
 * Generate dashboard HTML
 */
function generateDashboardHTML() {
  const successRate = ((metrics.api.successful / metrics.api.totalEndpoints) * 100).toFixed(1);
  const avgResponseTime = metrics.api.averageResponseTime.toFixed(0);
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audio Tài Lộc - System Monitoring</title>
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
        .endpoints-table { background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .endpoints-table h3 { padding: 20px; background: #f8f9fa; border-bottom: 1px solid #e9ecef; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 20px; text-align: left; border-bottom: 1px solid #e9ecef; }
        th { background: #f8f9fa; font-weight: 600; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: 500; }
        .status-200 { background: #d1fae5; color: #065f46; }
        .status-error { background: #fee2e2; color: #991b1b; }
        .refresh-info { text-align: center; color: #666; margin-top: 20px; font-size: 0.9em; }
        .auto-refresh { background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 Audio Tài Lộc</h1>
            <p>System Monitoring Dashboard</p>
        </div>
        
        <button class="auto-refresh" onclick="location.reload()">🔄 Refresh Dashboard</button>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>System Status</h3>
                <div class="metric-value status-${metrics.system.status === 'ok' ? 'good' : 'error'}">
                    ${metrics.system.status === 'ok' ? '🟢' : '🔴'} ${metrics.system.status.toUpperCase()}
                </div>
                <div class="metric-label">Overall System Health</div>
            </div>
            
            <div class="metric-card">
                <h3>API Success Rate</h3>
                <div class="metric-value status-${successRate >= 90 ? 'good' : successRate >= 70 ? 'warning' : 'error'}">
                    ${successRate}%
                </div>
                <div class="metric-label">${metrics.api.successful}/${metrics.api.totalEndpoints} endpoints working</div>
            </div>
            
            <div class="metric-card">
                <h3>Average Response Time</h3>
                <div class="metric-value status-${avgResponseTime < 100 ? 'good' : avgResponseTime < 500 ? 'warning' : 'error'}">
                    ${avgResponseTime}ms
                </div>
                <div class="metric-label">API Response Performance</div>
            </div>
            
            <div class="metric-card">
                <h3>System Uptime</h3>
                <div class="metric-value status-good">
                    ${Math.floor(metrics.performance.uptime / 3600)}h ${Math.floor((metrics.performance.uptime % 3600) / 60)}m
                </div>
                <div class="metric-label">Process Uptime</div>
            </div>
            
            <div class="metric-card">
                <h3>Memory Usage</h3>
                <div class="metric-value status-${metrics.performance.memory.heapUsed / 1024 / 1024 < 100 ? 'good' : 'warning'}">
                    ${Math.round(metrics.performance.memory.heapUsed / 1024 / 1024)}MB
                </div>
                <div class="metric-label">Heap Memory Used</div>
            </div>
            
            <div class="metric-card">
                <h3>Last Updated</h3>
                <div class="metric-value status-good">
                    ${new Date(metrics.timestamp).toLocaleTimeString()}
                </div>
                <div class="metric-label">${new Date(metrics.timestamp).toLocaleDateString()}</div>
            </div>
        </div>
        
        <div class="endpoints-table">
            <h3>API Endpoints Status</h3>
            <table>
                <thead>
                    <tr>
                        <th>Endpoint</th>
                        <th>Status</th>
                        <th>Response Time</th>
                        <th>Last Check</th>
                    </tr>
                </thead>
                <tbody>
                    ${metrics.api.endpoints.map(endpoint => `
                        <tr>
                            <td><code>${endpoint.endpoint}</code></td>
                            <td>
                                <span class="status-badge status-${endpoint.success ? '200' : 'error'}">
                                    ${endpoint.success ? '✅ 200' : `❌ ${endpoint.status}`}
                                </span>
                            </td>
                            <td>${endpoint.responseTime}ms</td>
                            <td>${new Date().toLocaleTimeString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="refresh-info">
            <p>Dashboard auto-refreshes every 30 seconds | Last updated: ${new Date().toLocaleString()}</p>
        </div>
    </div>
    
    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
    </script>
</body>
</html>`;

  return html;
}

/**
 * Save metrics to file
 */
function saveMetrics() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const metricsFile = `metrics-${timestamp}.json`;
  
  fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));
  
  // Generate and save dashboard HTML
  const dashboardHTML = generateDashboardHTML();
  fs.writeFileSync('monitoring-dashboard.html', dashboardHTML);
  
  return { metricsFile, dashboardHTML: 'monitoring-dashboard.html' };
}

/**
 * Display console dashboard
 */
function displayConsoleDashboard() {
  console.clear();
  console.log('🎵 Audio Tài Lộc - System Monitoring Dashboard');
  console.log('='.repeat(60));
  console.log(`📊 Last Updated: ${new Date(metrics.timestamp).toLocaleString()}`);
  console.log('');
  
  // System Status
  console.log('🔧 System Status:');
  console.log(`   Status: ${metrics.system.status === 'ok' ? '🟢 OK' : '🔴 ERROR'}`);
  console.log(`   Uptime: ${Math.floor(metrics.performance.uptime / 3600)}h ${Math.floor((metrics.performance.uptime % 3600) / 60)}m`);
  console.log(`   Memory: ${Math.round(metrics.performance.memory.heapUsed / 1024 / 1024)}MB`);
  console.log('');
  
  // API Metrics
  const successRate = ((metrics.api.successful / metrics.api.totalEndpoints) * 100).toFixed(1);
  const avgResponseTime = metrics.api.averageResponseTime.toFixed(0);
  
  console.log('🌐 API Performance:');
  console.log(`   Success Rate: ${successRate}% (${metrics.api.successful}/${metrics.api.totalEndpoints})`);
  console.log(`   Avg Response: ${avgResponseTime}ms`);
  console.log(`   Failed: ${metrics.api.failed}`);
  console.log('');
  
  // Endpoint Status
  console.log('📡 Endpoint Status:');
  metrics.api.endpoints.forEach(endpoint => {
    const status = endpoint.success ? '✅' : '❌';
    console.log(`   ${status} ${endpoint.endpoint} - ${endpoint.responseTime}ms`);
  });
  
  if (metrics.errors.length > 0) {
    console.log('');
    console.log('❌ Errors:');
    metrics.errors.forEach(error => console.log(`   ${error}`));
  }
  
  console.log('');
  console.log('💡 Dashboard saved to: monitoring-dashboard.html');
  console.log('🔄 Auto-refresh in 30 seconds...');
}

/**
 * Main monitoring function
 */
async function runMonitoring() {
  console.log('🚀 Starting Audio Tài Lộc Monitoring Dashboard...\n');
  
  // Collect metrics
  await getSystemHealth();
  await getAPIMetrics();
  await getPerformanceMetrics();
  
  // Save and display
  const files = saveMetrics();
  displayConsoleDashboard();
  
  return metrics;
}

/**
 * Continuous monitoring
 */
async function startContinuousMonitoring() {
  while (true) {
    try {
      await runMonitoring();
      await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
    } catch (error) {
      console.error('Monitoring error:', error);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds on error
    }
  }
}

// Run if executed directly
if (require.main === module) {
  if (process.argv.includes('--continuous')) {
    startContinuousMonitoring();
  } else {
    runMonitoring();
  }
}

module.exports = { runMonitoring, getSystemHealth, getAPIMetrics, getPerformanceMetrics };
