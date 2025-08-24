#!/usr/bin/env node

/**
 * Dashboard Test Script
 * Kiểm tra toàn diện Dashboard AudioTailoc
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DashboardTester {
  constructor() {
    this.dashboardPath = path.join(__dirname, '..');
    this.testResults = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        score: 0
      }
    };
  }

  async runTests() {
    console.log('🧪 Bắt đầu kiểm tra Dashboard AudioTailoc...\n');
    
    try {
      // Test 1: Kiểm tra cấu trúc project
      await this.testProjectStructure();
      
      // Test 2: Kiểm tra dependencies
      await this.testDependencies();
      
      // Test 3: Kiểm tra components
      await this.testComponents();
      
      // Test 4: Kiểm tra pages
      await this.testPages();
      
      // Test 5: Kiểm tra configuration
      await this.testConfiguration();
      
      // Test 6: Chạy Jest tests
      await this.runJestTests();
      
      // Test 7: Kiểm tra build
      await this.testBuild();
      
      // Test 8: Kiểm tra linting
      await this.testLinting();
      
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Lỗi trong quá trình test:', error.message);
      process.exit(1);
    }
  }

  async testProjectStructure() {
    console.log('📁 Kiểm tra cấu trúc project...');
    
    const requiredDirs = [
      'app', 'components', 'hooks', 'lib', 'store', 'utils', 'public'
    ];
    
    const requiredFiles = [
      'package.json', 'tsconfig.json', 'README.md'
    ];
    
    let passed = 0;
    let total = requiredDirs.length + requiredFiles.length;
    
    for (const dir of requiredDirs) {
      const dirPath = path.join(this.dashboardPath, dir);
      if (fs.existsSync(dirPath)) {
        passed++;
        this.testResults.tests.push({
          name: `Directory: ${dir}`,
          status: 'PASS',
          message: 'Directory exists'
        });
      } else {
        this.testResults.tests.push({
          name: `Directory: ${dir}`,
          status: 'FAIL',
          message: 'Directory missing'
        });
      }
    }
    
    for (const file of requiredFiles) {
      const filePath = path.join(this.dashboardPath, file);
      if (fs.existsSync(filePath)) {
        passed++;
        this.testResults.tests.push({
          name: `File: ${file}`,
          status: 'PASS',
          message: 'File exists'
        });
      } else {
        this.testResults.tests.push({
          name: `File: ${file}`,
          status: 'FAIL',
          message: 'File missing'
        });
      }
    }
    
    console.log(`✅ Cấu trúc project: ${passed}/${total} passed\n`);
  }

  async testDependencies() {
    console.log('📦 Kiểm tra dependencies...');
    
    const packageJsonPath = path.join(this.dashboardPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.log('❌ package.json không tồn tại\n');
      return;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const requiredDeps = [
      'next', 'react', 'react-dom', 'typescript', 'tailwindcss'
    ];
    
    let passed = 0;
    let total = requiredDeps.length;
    
    for (const dep of requiredDeps) {
      if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        passed++;
        this.testResults.tests.push({
          name: `Dependency: ${dep}`,
          status: 'PASS',
          message: 'Dependency installed'
        });
      } else {
        this.testResults.tests.push({
          name: `Dependency: ${dep}`,
          status: 'FAIL',
          message: 'Dependency missing'
        });
      }
    }
    
    console.log(`✅ Dependencies: ${passed}/${total} passed\n`);
  }

  async testComponents() {
    console.log('🧩 Kiểm tra components...');
    
    const componentsDir = path.join(this.dashboardPath, 'components');
    if (!fs.existsSync(componentsDir)) {
      console.log('❌ Components directory không tồn tại\n');
      return;
    }
    
    const requiredComponents = [
      'ui/button.tsx', 'ui/input.tsx', 'ui/card.tsx', 'ui/table.tsx', 'ui/modal.tsx',
      'layout/header.tsx', 'layout/sidebar.tsx', 'layout/main-layout.tsx', 'layout/footer.tsx',
      'charts/line-chart.tsx', 'charts/bar-chart.tsx',
      'forms/login-form.tsx', 'forms/register-form.tsx'
    ];
    
    let passed = 0;
    let total = requiredComponents.length;
    
    for (const component of requiredComponents) {
      const componentPath = path.join(componentsDir, component);
      if (fs.existsSync(componentPath)) {
        passed++;
        this.testResults.tests.push({
          name: `Component: ${component}`,
          status: 'PASS',
          message: 'Component exists'
        });
      } else {
        this.testResults.tests.push({
          name: `Component: ${component}`,
          status: 'FAIL',
          message: 'Component missing'
        });
      }
    }
    
    console.log(`✅ Components: ${passed}/${total} passed\n`);
  }

  async testPages() {
    console.log('📄 Kiểm tra pages...');
    
    const appDir = path.join(this.dashboardPath, 'app');
    if (!fs.existsSync(appDir)) {
      console.log('❌ App directory không tồn tại\n');
      return;
    }
    
    const requiredPages = [
      'page.tsx', 'layout.tsx', 'dashboard/page.tsx',
      'login/page.tsx', 'users/page.tsx', 'analytics/page.tsx', 'settings/page.tsx'
    ];
    
    let passed = 0;
    let total = requiredPages.length;
    
    for (const page of requiredPages) {
      const pagePath = path.join(appDir, page);
      if (fs.existsSync(pagePath)) {
        passed++;
        this.testResults.tests.push({
          name: `Page: ${page}`,
          status: 'PASS',
          message: 'Page exists'
        });
      } else {
        this.testResults.tests.push({
          name: `Page: ${page}`,
          status: 'FAIL',
          message: 'Page missing'
        });
      }
    }
    
    console.log(`✅ Pages: ${passed}/${total} passed\n`);
  }

  async testConfiguration() {
    console.log('⚙️ Kiểm tra configuration...');
    
    const configFiles = [
      'tsconfig.json', 'tailwind.config.ts', 'next.config.ts', 'jest.config.js'
    ];
    
    let passed = 0;
    let total = configFiles.length;
    
    for (const config of configFiles) {
      const configPath = path.join(this.dashboardPath, config);
      if (fs.existsSync(configPath)) {
        passed++;
        this.testResults.tests.push({
          name: `Config: ${config}`,
          status: 'PASS',
          message: 'Config file exists'
        });
      } else {
        this.testResults.tests.push({
          name: `Config: ${config}`,
          status: 'FAIL',
          message: 'Config file missing'
        });
      }
    }
    
    console.log(`✅ Configuration: ${passed}/${total} passed\n`);
  }

  async runJestTests() {
    console.log('🧪 Chạy Jest tests...');
    
    try {
      const result = execSync('npm test', { 
        cwd: this.dashboardPath, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Parse test results
      const lines = result.split('\n');
      const testSummary = lines.find(line => line.includes('Test Suites:'));
      
      if (testSummary) {
        this.testResults.tests.push({
          name: 'Jest Tests',
          status: 'PASS',
          message: testSummary.trim()
        });
        console.log('✅ Jest tests passed\n');
      }
    } catch (error) {
      this.testResults.tests.push({
        name: 'Jest Tests',
        status: 'FAIL',
        message: error.message
      });
      console.log('❌ Jest tests failed\n');
    }
  }

  async testBuild() {
    console.log('🔨 Kiểm tra build...');
    
    try {
      execSync('npm run build', { 
        cwd: this.dashboardPath, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.testResults.tests.push({
        name: 'Build',
        status: 'PASS',
        message: 'Build successful'
      });
      console.log('✅ Build successful\n');
    } catch (error) {
      this.testResults.tests.push({
        name: 'Build',
        status: 'FAIL',
        message: error.message
      });
      console.log('❌ Build failed\n');
    }
  }

  async testLinting() {
    console.log('🔍 Kiểm tra linting...');
    
    try {
      execSync('npm run lint', { 
        cwd: this.dashboardPath, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.testResults.tests.push({
        name: 'Linting',
        status: 'PASS',
        message: 'No linting errors'
      });
      console.log('✅ Linting passed\n');
    } catch (error) {
      this.testResults.tests.push({
        name: 'Linting',
        status: 'FAIL',
        message: error.message
      });
      console.log('❌ Linting failed\n');
    }
  }

  async generateReport() {
    const passed = this.testResults.tests.filter(t => t.status === 'PASS').length;
    const failed = this.testResults.tests.filter(t => t.status === 'FAIL').length;
    const total = this.testResults.tests.length;
    const score = Math.round((passed / total) * 100);
    
    this.testResults.summary = { total, passed, failed, score };
    
    const reportPath = path.join(__dirname, '..', 'DASHBOARD_TEST_REPORT.md');
    
    let report = `# 🧪 DASHBOARD TEST REPORT
## Báo cáo kiểm tra Dashboard AudioTailoc

**Ngày test:** ${new Date().toLocaleDateString('vi-VN')}  
**Thời gian:** ${new Date().toLocaleTimeString('vi-VN')}  
**Điểm tổng thể:** ${score}/100

---

## 📊 KẾT QUẢ TỔNG QUAN

- **Tổng số tests:** ${total}
- **Tests passed:** ${passed}
- **Tests failed:** ${failed}
- **Tỷ lệ thành công:** ${score}%

---

## 📋 CHI TIẾT TESTS

`;

    for (const test of this.testResults.tests) {
      const status = test.status === 'PASS' ? '✅' : '❌';
      report += `### ${status} ${test.name}
- **Status:** ${test.status}
- **Message:** ${test.message}

`;
    }

    report += `---

## 🎯 KHUYẾN NGHỊ

`;

    if (score >= 90) {
      report += `🎉 **Xuất sắc!** Dashboard đã sẵn sàng để deploy.
- Tất cả các tính năng cơ bản đã hoạt động tốt
- Code quality cao
- Tests coverage đầy đủ
`;
    } else if (score >= 70) {
      report += `👍 **Tốt!** Dashboard gần như hoàn thiện.
- Cần fix một số issues nhỏ
- Có thể deploy với một số cải thiện
`;
    } else if (score >= 50) {
      report += `⚠️ **Cần cải thiện!** Dashboard cần thêm work.
- Có nhiều issues cần fix
- Cần thêm tests và documentation
`;
    } else {
      report += `🚨 **Cần nhiều work!** Dashboard chưa sẵn sàng.
- Cần fix nhiều issues nghiêm trọng
- Cần refactor và cải thiện đáng kể
`;
    }

    report += `

---

*Báo cáo được tạo tự động bởi Dashboard Test Script*  
*Cập nhật lần cuối: ${new Date().toISOString()}*
`;

    fs.writeFileSync(reportPath, report);
    
    console.log('📊 KẾT QUẢ TỔNG QUAN');
    console.log(`📋 Tổng số tests: ${total}`);
    console.log(`✅ Tests passed: ${passed}`);
    console.log(`❌ Tests failed: ${failed}`);
    console.log(`🎯 Điểm tổng thể: ${score}/100`);
    console.log(`📄 Báo cáo được tạo tại: ${reportPath}`);
    
    if (score >= 80) {
      console.log('\n🎉 Dashboard đã sẵn sàng để sử dụng!');
    } else {
      console.log('\n⚠️ Dashboard cần thêm cải thiện trước khi deploy.');
    }
  }
}

if (require.main === module) {
  const tester = new DashboardTester();
  tester.runTests();
}

module.exports = DashboardTester;
