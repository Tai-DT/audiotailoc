#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FrontendTestWorkflow {
  constructor() {
    this.projectRoot = process.cwd();
    this.frontendDir = path.join(this.projectRoot, 'frontend');
    this.testResults = {
      unit: { passed: 0, failed: 0, total: 0 },
      integration: { passed: 0, failed: 0, total: 0 },
      e2e: { passed: 0, failed: 0, total: 0 },
      performance: { score: 0, issues: [] }
    };
  }

  // Run all tests
  async runAllTests() {
    console.log('🧪 Running All Frontend Tests...\n');
    
    try {
      process.chdir(this.frontendDir);
      
      // Run unit tests
      await this.runUnitTests();
      
      // Run integration tests
      await this.runIntegrationTests();
      
      // Run E2E tests
      await this.runE2ETests();
      
      // Run performance tests
      await this.runPerformanceTests();
      
      // Generate test report
      this.generateTestReport();
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
    }
  }

  // Run unit tests
  async runUnitTests() {
    console.log('📋 Running Unit Tests...');
    
    try {
      const result = execSync('npm test -- --coverage --watchAll=false', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Parse test results
      const coverageMatch = result.match(/All files\s+\|\s+(\d+\.\d+)/);
      const coverage = coverageMatch ? parseFloat(coverageMatch[1]) : 0;
      
      this.testResults.unit = {
        passed: this.countTestResults(result, 'PASS'),
        failed: this.countTestResults(result, 'FAIL'),
        total: this.countTestResults(result, 'PASS') + this.countTestResults(result, 'FAIL'),
        coverage: coverage
      };
      
      console.log(`✅ Unit tests completed: ${this.testResults.unit.passed}/${this.testResults.unit.total} passed`);
      console.log(`📊 Coverage: ${coverage}%`);
      
    } catch (error) {
      console.log('❌ Unit tests failed:', error.message);
      this.testResults.unit.failed = 1;
    }
  }

  // Run integration tests
  async runIntegrationTests() {
    console.log('🔗 Running Integration Tests...');
    
    try {
      const result = execSync('npm run test:integration', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.testResults.integration = {
        passed: this.countTestResults(result, 'PASS'),
        failed: this.countTestResults(result, 'FAIL'),
        total: this.countTestResults(result, 'PASS') + this.countTestResults(result, 'FAIL')
      };
      
      console.log(`✅ Integration tests completed: ${this.testResults.integration.passed}/${this.testResults.integration.total} passed`);
      
    } catch (error) {
      console.log('❌ Integration tests failed:', error.message);
      this.testResults.integration.failed = 1;
    }
  }

  // Run E2E tests
  async runE2ETests() {
    console.log('🔍 Running E2E Tests...');
    
    try {
      const result = execSync('npm run test:e2e', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.testResults.e2e = {
        passed: this.countTestResults(result, 'PASS'),
        failed: this.countTestResults(result, 'FAIL'),
        total: this.countTestResults(result, 'PASS') + this.countTestResults(result, 'FAIL')
      };
      
      console.log(`✅ E2E tests completed: ${this.testResults.e2e.passed}/${this.testResults.e2e.total} passed`);
      
    } catch (error) {
      console.log('❌ E2E tests failed:', error.message);
      this.testResults.e2e.failed = 1;
    }
  }

  // Run performance tests
  async runPerformanceTests() {
    console.log('⚡ Running Performance Tests...');
    
    try {
      // Start development server
      const devServer = execSync('npm run dev', { 
        stdio: 'pipe',
        detached: true 
      });
      
      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Run Lighthouse
      const result = execSync('npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Parse Lighthouse results
      const reportPath = path.join(this.frontendDir, 'lighthouse-report.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        this.testResults.performance = {
          score: Math.round(report.categories.performance.score * 100),
          accessibility: Math.round(report.categories.accessibility.score * 100),
          seo: Math.round(report.categories.seo.score * 100),
          bestPractices: Math.round(report.categories['best-practices'].score * 100),
          issues: report.audits
        };
        
        console.log(`✅ Performance test completed`);
        console.log(`📊 Performance Score: ${this.testResults.performance.score}/100`);
        console.log(`📊 Accessibility Score: ${this.testResults.performance.accessibility}/100`);
        console.log(`📊 SEO Score: ${this.testResults.performance.seo}/100`);
        console.log(`📊 Best Practices Score: ${this.testResults.performance.bestPractices}/100`);
      }
      
      // Kill dev server
      process.kill(devServer.pid);
      
    } catch (error) {
      console.log('❌ Performance tests failed:', error.message);
    }
  }

  // Count test results
  countTestResults(output, type) {
    const regex = new RegExp(`${type}\\s+\\d+`, 'g');
    const matches = output.match(regex);
    return matches ? matches.length : 0;
  }

  // Generate test report
  generateTestReport() {
    console.log('\n📊 Test Report Summary\n');
    console.log('=' .repeat(50));
    
    // Unit tests
    console.log('📋 Unit Tests:');
    console.log(`  ✅ Passed: ${this.testResults.unit.passed}`);
    console.log(`  ❌ Failed: ${this.testResults.unit.failed}`);
    console.log(`  📊 Coverage: ${this.testResults.unit.coverage}%`);
    
    // Integration tests
    console.log('\n🔗 Integration Tests:');
    console.log(`  ✅ Passed: ${this.testResults.integration.passed}`);
    console.log(`  ❌ Failed: ${this.testResults.integration.failed}`);
    
    // E2E tests
    console.log('\n🔍 E2E Tests:');
    console.log(`  ✅ Passed: ${this.testResults.e2e.passed}`);
    console.log(`  ❌ Failed: ${this.testResults.e2e.failed}`);
    
    // Performance tests
    console.log('\n⚡ Performance Tests:');
    console.log(`  📊 Performance: ${this.testResults.performance.score}/100`);
    console.log(`  📊 Accessibility: ${this.testResults.performance.accessibility}/100`);
    console.log(`  📊 SEO: ${this.testResults.performance.seo}/100`);
    console.log(`  📊 Best Practices: ${this.testResults.performance.bestPractices}/100`);
    
    // Overall status
    const totalPassed = this.testResults.unit.passed + this.testResults.integration.passed + this.testResults.e2e.passed;
    const totalFailed = this.testResults.unit.failed + this.testResults.integration.failed + this.testResults.e2e.failed;
    const totalTests = totalPassed + totalFailed;
    
    console.log('\n🎯 Overall Status:');
    console.log(`  ✅ Total Passed: ${totalPassed}`);
    console.log(`  ❌ Total Failed: ${totalFailed}`);
    console.log(`  📊 Success Rate: ${totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0}%`);
    
    // Performance status
    const avgPerformance = Math.round((
      this.testResults.performance.score + 
      this.testResults.performance.accessibility + 
      this.testResults.performance.seo + 
      this.testResults.performance.bestPractices
    ) / 4);
    
    console.log(`  ⚡ Average Performance: ${avgPerformance}/100`);
    
    // Recommendations
    this.generateRecommendations();
  }

  // Generate recommendations
  generateRecommendations() {
    console.log('\n💡 Recommendations:');
    
    if (this.testResults.unit.coverage < 80) {
      console.log('  📋 Increase unit test coverage to at least 80%');
    }
    
    if (this.testResults.unit.failed > 0) {
      console.log('  🔧 Fix failing unit tests');
    }
    
    if (this.testResults.integration.failed > 0) {
      console.log('  🔧 Fix failing integration tests');
    }
    
    if (this.testResults.e2e.failed > 0) {
      console.log('  🔧 Fix failing E2E tests');
    }
    
    if (this.testResults.performance.score < 90) {
      console.log('  ⚡ Optimize performance to reach 90+ score');
    }
    
    if (this.testResults.performance.accessibility < 95) {
      console.log('  ♿ Improve accessibility to reach 95+ score');
    }
    
    if (this.testResults.performance.seo < 95) {
      console.log('  🔍 Improve SEO to reach 95+ score');
    }
  }

  // Run specific test type
  async runTestType(type) {
    console.log(`🧪 Running ${type} tests...\n`);
    
    switch (type) {
      case 'unit':
        await this.runUnitTests();
        break;
      case 'integration':
        await this.runIntegrationTests();
        break;
      case 'e2e':
        await this.runE2ETests();
        break;
      case 'performance':
        await this.runPerformanceTests();
        break;
      default:
        console.log('❌ Unknown test type. Available types: unit, integration, e2e, performance');
    }
  }

  // Watch tests
  async watchTests() {
    console.log('👀 Starting test watcher...');
    
    try {
      process.chdir(this.frontendDir);
      execSync('npm test -- --watch', { stdio: 'inherit' });
    } catch (error) {
      console.log('❌ Failed to start test watcher:', error.message);
    }
  }

  // Generate test files
  generateTestFile(componentName) {
    console.log(`📝 Generating test file for ${componentName}...`);
    
    const testDir = path.join(this.frontendDir, 'components', '__tests__');
    const testFile = path.join(testDir, `${componentName}.test.tsx`);
    
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    const testTemplate = `import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ${componentName} } from '../${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName} />);
    expect(screen.getByTestId('${componentName.toLowerCase()}')).toBeInTheDocument();
  });

  it('displays correct content', () => {
    render(<${componentName} />);
    // Add your test assertions here
  });

  it('handles user interactions', () => {
    render(<${componentName} />);
    // Add your interaction tests here
  });
});
`;

    fs.writeFileSync(testFile, testTemplate);
    console.log(`✅ Generated test file: ${testFile}`);
  }

  // Show test status
  showTestStatus() {
    console.log('📊 Test Status Overview\n');
    
    const status = {
      'Unit Tests': this.testResults.unit.total > 0 ? '✅ Configured' : '❌ Not configured',
      'Integration Tests': this.testResults.integration.total > 0 ? '✅ Configured' : '❌ Not configured',
      'E2E Tests': this.testResults.e2e.total > 0 ? '✅ Configured' : '❌ Not configured',
      'Performance Tests': this.testResults.performance.score > 0 ? '✅ Configured' : '❌ Not configured',
    };
    
    Object.entries(status).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    
    console.log('\n📋 Test Coverage Targets:');
    console.log('  - Unit Tests: 80%+');
    console.log('  - Integration Tests: All critical flows');
    console.log('  - E2E Tests: User journeys');
    console.log('  - Performance: 90+ Lighthouse score');
  }
}

// Main execution
async function main() {
  const testWorkflow = new FrontendTestWorkflow();
  const command = process.argv[2];
  const testType = process.argv[3];
  
  switch (command) {
    case 'all':
      await testWorkflow.runAllTests();
      break;
    case 'unit':
      await testWorkflow.runTestType('unit');
      break;
    case 'integration':
      await testWorkflow.runTestType('integration');
      break;
    case 'e2e':
      await testWorkflow.runTestType('e2e');
      break;
    case 'performance':
      await testWorkflow.runTestType('performance');
      break;
    case 'watch':
      await testWorkflow.watchTests();
      break;
    case 'generate':
      const componentName = process.argv[3];
      if (componentName) {
        testWorkflow.generateTestFile(componentName);
      } else {
        console.log('❌ Please provide component name');
      }
      break;
    case 'status':
      testWorkflow.showTestStatus();
      break;
    case 'help':
    default:
      console.log('🧪 Frontend Test Workflow Commands\n');
      console.log('Available commands:');
      console.log('  all          - Run all tests');
      console.log('  unit         - Run unit tests only');
      console.log('  integration  - Run integration tests only');
      console.log('  e2e          - Run E2E tests only');
      console.log('  performance  - Run performance tests only');
      console.log('  watch        - Watch mode for tests');
      console.log('  generate     - Generate test file for component');
      console.log('  status       - Show test status');
      console.log('  help         - Show this help message');
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = FrontendTestWorkflow;
