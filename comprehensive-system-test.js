#!/usr/bin/env node

const axios = require('axios');

class SystemTester {
  constructor() {
    this.backendUrl = 'http://localhost:3010/api/v1';
    this.frontendUrl = 'http://localhost:3000';
    this.results = {
      backend: { success: 0, total: 0, errors: [] },
      frontend: { success: 0, total: 0, errors: [] },
      integration: { success: 0, total: 0, errors: [] }
    };
  }

  async testBackend() {
    console.log('🔧 Testing Backend...\n');
    
    const endpoints = [
      { name: 'Health Check', path: '/health', method: 'GET' },
      { name: 'Auth Status', path: '/auth/status', method: 'GET' },
      { name: 'Products List', path: '/catalog/products', method: 'GET' },
      { name: 'Categories List', path: '/catalog/categories', method: 'GET' },
      { name: 'Payment Methods', path: '/payments/methods', method: 'GET' },
      { name: 'Payment Intents', path: '/payments/intents', method: 'GET' },
      { name: 'Search Services', path: '/search/services', method: 'GET' },
      { name: 'Notifications', path: '/notifications', method: 'GET' },
      { name: 'SEO Sitemap', path: '/seo/sitemap', method: 'GET' },
      { name: 'SEO Robots', path: '/seo/robots', method: 'GET' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios({
          method: endpoint.method,
          url: `${this.backendUrl}${endpoint.path}`,
          timeout: 5000
        });
        
        console.log(`✅ ${endpoint.name}: ${response.status}`);
        this.results.backend.success++;
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.response?.status || error.code}`);
        this.results.backend.errors.push({
          endpoint: endpoint.name,
          error: error.response?.status || error.code
        });
      }
      this.results.backend.total++;
    }
  }

  async testFrontend() {
    console.log('\n🌐 Testing Frontend...\n');
    
    const pages = [
      { name: 'Home Page', path: '/' },
      { name: 'Products Page', path: '/products' },
      { name: 'Cart Page', path: '/cart' },
      { name: 'Login Page', path: '/login' },
      { name: 'Register Page', path: '/register' }
    ];

    for (const page of pages) {
      try {
        const response = await axios({
          method: 'GET',
          url: `${this.frontendUrl}${page.path}`,
          timeout: 10000
        });
        
        if (response.status === 200) {
          console.log(`✅ ${page.name}: ${response.status}`);
          this.results.frontend.success++;
        } else {
          console.log(`⚠️ ${page.name}: ${response.status}`);
          this.results.frontend.errors.push({
            page: page.name,
            error: response.status
          });
        }
      } catch (error) {
        console.log(`❌ ${page.name}: ${error.code || 'Connection failed'}`);
        this.results.frontend.errors.push({
          page: page.name,
          error: error.code || 'Connection failed'
        });
      }
      this.results.frontend.total++;
    }
  }

  async testIntegration() {
    console.log('\n🔗 Testing Integration...\n');
    
    try {
      // Test API client can reach backend
      const healthResponse = await axios.get(`${this.backendUrl}/health`);
      if (healthResponse.data.success) {
        console.log('✅ Backend-Frontend Communication: OK');
        this.results.integration.success++;
      } else {
        console.log('❌ Backend-Frontend Communication: Failed');
        this.results.integration.errors.push({
          test: 'Backend-Frontend Communication',
          error: 'Health check failed'
        });
      }
    } catch (error) {
      console.log('❌ Backend-Frontend Communication: Failed');
      this.results.integration.errors.push({
        test: 'Backend-Frontend Communication',
        error: error.code || 'Connection failed'
      });
    }
    this.results.integration.total++;

    // Test environment variables
    try {
      const envResponse = await axios.get(`${this.frontendUrl}/api/env-test`);
      console.log('✅ Environment Variables: OK');
      this.results.integration.success++;
    } catch (error) {
      console.log('⚠️ Environment Variables: Not configured');
      this.results.integration.errors.push({
        test: 'Environment Variables',
        error: 'Not configured'
      });
    }
    this.results.integration.total++;
  }

  generateReport() {
    console.log('\n📊 SYSTEM TEST REPORT');
    console.log('='.repeat(50));
    
    const backendScore = Math.round((this.results.backend.success / this.results.backend.total) * 100);
    const frontendScore = Math.round((this.results.frontend.success / this.results.frontend.total) * 100);
    const integrationScore = Math.round((this.results.integration.success / this.results.integration.total) * 100);
    const overallScore = Math.round((backendScore + frontendScore + integrationScore) / 3);

    console.log(`\n🔧 Backend: ${this.results.backend.success}/${this.results.backend.total} (${backendScore}%)`);
    console.log(`🌐 Frontend: ${this.results.frontend.success}/${this.results.frontend.total} (${frontendScore}%)`);
    console.log(`🔗 Integration: ${this.results.integration.success}/${this.results.integration.total} (${integrationScore}%)`);
    console.log(`\n🎯 Overall Score: ${overallScore}%`);

    if (this.results.backend.errors.length > 0) {
      console.log('\n❌ Backend Errors:');
      this.results.backend.errors.forEach(error => {
        console.log(`  - ${error.endpoint}: ${error.error}`);
      });
    }

    if (this.results.frontend.errors.length > 0) {
      console.log('\n❌ Frontend Errors:');
      this.results.frontend.errors.forEach(error => {
        console.log(`  - ${error.page}: ${error.error}`);
      });
    }

    if (this.results.integration.errors.length > 0) {
      console.log('\n❌ Integration Errors:');
      this.results.integration.errors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error}`);
      });
    }

    console.log('\n' + '='.repeat(50));
    
    if (overallScore >= 90) {
      console.log('🎉 EXCELLENT! System is ready for production!');
    } else if (overallScore >= 75) {
      console.log('✅ GOOD! System is mostly ready, minor issues to fix.');
    } else if (overallScore >= 50) {
      console.log('⚠️ FAIR! System needs attention before production.');
    } else {
      console.log('❌ POOR! System needs significant work.');
    }

    return {
      backendScore,
      frontendScore,
      integrationScore,
      overallScore,
      errors: {
        backend: this.results.backend.errors,
        frontend: this.results.frontend.errors,
        integration: this.results.integration.errors
      }
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive System Test...\n');
    
    await this.testBackend();
    await this.testFrontend();
    await this.testIntegration();
    
    return this.generateReport();
  }
}

// Run tests
async function main() {
  const tester = new SystemTester();
  const report = await tester.runAllTests();
  
  // Save report to file
  const fs = require('fs');
  fs.writeFileSync('system-test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Report saved to system-test-report.json');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SystemTester;
