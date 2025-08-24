#!/usr/bin/env node

const axios = require('axios');

class SystemMonitor {
  constructor() {
    this.backendUrl = 'http://localhost:3010/api/v1';
    this.alerts = [];
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.backendUrl}/health`, { timeout: 5000 });
      return { status: 'healthy', response: response.status };
    } catch (error) {
      this.alerts.push(`Backend health check failed: ${error.message}`);
      return { status: 'unhealthy', error: error.message };
    }
  }

  async checkFrontend() {
    try {
      const response = await axios.get('http://localhost:3000', { timeout: 10000 });
      return { status: 'healthy', response: response.status };
    } catch (error) {
      this.alerts.push(`Frontend health check failed: ${error.message}`);
      return { status: 'unhealthy', error: error.message };
    }
  }

  async runMonitoring() {
    console.log('🔍 System Monitoring Check');
    console.log('='.repeat(40));

    const backend = await this.checkHealth();
    const frontend = await this.checkFrontend();

    console.log(`Backend: ${backend.status.toUpperCase()}`);
    console.log(`Frontend: ${frontend.status.toUpperCase()}`);

    if (this.alerts.length > 0) {
      console.log('
⚠️ ALERTS:');
      this.alerts.forEach(alert => console.log(`  - ${alert}`));
    } else {
      console.log('
✅ All systems healthy!');
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
