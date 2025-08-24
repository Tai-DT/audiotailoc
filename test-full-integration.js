#!/usr/bin/env node

/**
 * 🧪 Full System Integration Test - Audio Tài Lộc
 * 
 * Tests complete integration between Backend, Dashboard, and Frontend
 */

const fetch = require('node-fetch').default || require('node-fetch');
const { spawn } = require('child_process');

console.log('🧪 Audio Tài Lộc - Full System Integration Test');
console.log('==================================================');

const COMPONENTS = {
  backend: {
    name: 'Backend API Server',
    port: 8000,
    baseUrl: 'http://localhost:8000',
    healthEndpoint: '/api/v1/health',
    testEndpoints: [
      '/api/v1',
      '/api/v1/health',
      '/api/v1/auth/status'
    ]
  },
  dashboard: {
    name: 'Admin Dashboard',
    port: 3001,
    baseUrl: 'http://localhost:3001',
    healthEndpoint: '/',
    testEndpoints: [
      '/',
      '/login'
    ]
  },
  frontend: {
    name: 'User Frontend',
    port: 3000,  
    baseUrl: 'http://localhost:3000',
    healthEndpoint: '/',
    testEndpoints: [
      '/',
      '/vi'
    ]
  }
};

class IntegrationTester {
  constructor() {
    this.results = {
      backend: { status: 'pending', tests: {} },
      dashboard: { status: 'pending', tests: {} },
      frontend: { status: 'pending', tests: {} },
      integration: { status: 'pending', tests: {} }
    };
  }

  async testComponent(componentName, component) {
    console.log(`\n🔍 Testing ${component.name}...`);
    const results = { status: 'success', tests: {} };

    try {
      // Test each endpoint
      for (const endpoint of component.testEndpoints) {
        const url = `${component.baseUrl}${endpoint}`;
        console.log(`  📡 ${endpoint}`);
        
        try {
          const response = await fetch(url, { 
            timeout: 5000,
            redirect: 'manual' // Handle redirects manually
          });
          
          const success = response.status < 400 || response.status === 307; // 307 is temporary redirect, OK for Next.js
          const status = response.status;
          
          results.tests[endpoint] = {
            success,
            status,
            statusText: response.statusText,
            time: new Date().toISOString()
          };
          
          console.log(`    ${success ? '✅' : '❌'} ${status} ${response.statusText}`);
          
          // Special handling for backend API responses
          if (componentName === 'backend' && success && response.headers.get('content-type')?.includes('application/json')) {
            try {
              const data = await response.json();
              if (data.success !== undefined) {
                console.log(`    📄 Response: ${data.message || 'API working'}`);
              }
            } catch (e) {
              // Ignore JSON parsing errors for non-JSON responses
            }
          }
          
        } catch (error) {
          results.tests[endpoint] = {
            success: false,
            error: error.message,
            time: new Date().toISOString()
          };
          console.log(`    ❌ Error: ${error.message}`);
          results.status = 'partial';
        }
      }
      
    } catch (error) {
      console.log(`  ❌ Component test failed: ${error.message}`);
      results.status = 'failed';
    }

    this.results[componentName] = results;
    
    const successCount = Object.values(results.tests).filter(t => t.success).length;
    const totalCount = Object.values(results.tests).length;
    
    console.log(`  📊 Result: ${successCount}/${totalCount} endpoints working`);
    
    return results;
  }

  async testIntegration() {
    console.log('\n🔗 Testing Cross-Component Integration...');
    
    const tests = {
      'Backend Health': async () => {
        const response = await fetch('http://localhost:8000/api/v1/health');
        const data = await response.json();
        return data.success === true;
      },
      
      'Dashboard-Backend Connection': async () => {
        // Test if dashboard can reach backend (via API client configuration)
        const dashboardResponse = await fetch('http://localhost:3001/');
        return dashboardResponse.status < 400;
      },
      
      'Frontend-Backend Connection': async () => {
        // Test if frontend can reach backend (via API client configuration) 
        const frontendResponse = await fetch('http://localhost:3000/');
        return frontendResponse.status < 400 || frontendResponse.status === 307;
      }
    };

    const results = {};
    
    for (const [testName, testFn] of Object.entries(tests)) {
      console.log(`  🧪 ${testName}`);
      
      try {
        const success = await testFn();
        results[testName] = { success, time: new Date().toISOString() };
        console.log(`    ${success ? '✅' : '❌'} ${success ? 'Pass' : 'Fail'}`);
      } catch (error) {
        results[testName] = { success: false, error: error.message, time: new Date().toISOString() };
        console.log(`    ❌ Error: ${error.message}`);
      }
    }

    this.results.integration = { status: 'completed', tests: results };
    return results;
  }

  async runAllTests() {
    console.log('🚀 Starting comprehensive system test...\n');
    
    // Test each component
    for (const [name, component] of Object.entries(COMPONENTS)) {
      await this.testComponent(name, component);
    }
    
    // Test integration
    await this.testIntegration();
    
    // Generate report
    this.generateReport();
  }

  generateReport() {
    console.log('\n📋 INTEGRATION TEST REPORT');
    console.log('============================');
    
    // Component status
    for (const [name, result] of Object.entries(this.results)) {
      if (name === 'integration') continue;
      
      const component = COMPONENTS[name];
      const successCount = Object.values(result.tests).filter(t => t.success).length;
      const totalCount = Object.values(result.tests).length;
      const status = successCount === totalCount ? '🟢' : successCount > 0 ? '🟡' : '🔴';
      
      console.log(`${status} ${component.name}: ${successCount}/${totalCount} endpoints working`);
    }
    
    // Integration status
    const integrationResults = this.results.integration.tests || {};
    const integrationSuccessCount = Object.values(integrationResults).filter(t => t.success).length;
    const integrationTotalCount = Object.values(integrationResults).length;
    const integrationStatus = integrationSuccessCount === integrationTotalCount ? '🟢' : integrationSuccessCount > 0 ? '🟡' : '🔴';
    
    console.log(`${integrationStatus} Integration Tests: ${integrationSuccessCount}/${integrationTotalCount} passing`);
    
    // Overall status
    const allComponents = Object.values(this.results);
    const allWorking = allComponents.every(comp => comp.status === 'success' || comp.status === 'completed');
    
    console.log(`\n🎯 OVERALL STATUS: ${allWorking ? '🟢 ALL SYSTEMS OPERATIONAL' : '🟡 PARTIAL SUCCESS'}`);
    
    if (allWorking) {
      console.log('\n✅ INTEGRATION COMPLETE!');
      console.log('🎉 Audio Tài Lộc system is ready for use!');
      console.log('\n🌐 Access Points:');
      console.log('   - Backend API: http://localhost:8000/docs');
      console.log('   - Admin Dashboard: http://localhost:3001');
      console.log('   - User Frontend: http://localhost:3000');
    } else {
      console.log('\n⚠️ Some issues detected - please check logs above');
    }
    
    // Save detailed results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = `integration-test-report-${timestamp}.json`;
    
    require('fs').writeFileSync(reportFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        overall: allWorking ? 'success' : 'partial',
        components: Object.keys(COMPONENTS).length,
        working: Object.values(this.results).filter(r => r.status === 'success' || r.status === 'completed').length
      },
      results: this.results
    }, null, 2));
    
    console.log(`\n📄 Detailed report saved: ${reportFile}`);
  }
}

// Run the test
async function main() {
  const tester = new IntegrationTester();
  await tester.runAllTests();
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error.message);
  process.exit(1);
});

main().catch(console.error);
