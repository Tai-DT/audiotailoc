#!/usr/bin/env node

/**
 * Dashboard Audit Script
 * Kiểm tra và đánh giá trạng thái hiện tại của Dashboard AudioTailoc
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DashboardAuditor {
  constructor() {
    this.dashboardPath = path.join(__dirname, '../dashboard');
    this.reportPath = path.join(__dirname, '../DASHBOARD_AUDIT_REPORT.md');
    this.auditResults = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      categories: {},
      recommendations: [],
      issues: [],
      completedTasks: [],
      pendingTasks: []
    };
  }

  async runAudit() {
    console.log('🔍 Bắt đầu audit Dashboard AudioTailoc...\n');
    
    try {
      await this.checkProjectStructure();
      await this.checkDependencies();
      await this.checkComponents();
      await this.checkPages();
      await this.checkConfiguration();
      await this.checkTesting();
      await this.checkDocumentation();
      await this.calculateScore();
      await this.generateReport();
      
      console.log('✅ Audit hoàn thành!');
      console.log(`📊 Điểm tổng thể: ${this.auditResults.overallScore}/100`);
      console.log(`📄 Báo cáo được tạo tại: ${this.reportPath}`);
      
    } catch (error) {
      console.error('❌ Lỗi trong quá trình audit:', error.message);
    }
  }

  async checkProjectStructure() {
    console.log('📁 Kiểm tra cấu trúc project...');
    
    const requiredDirs = [
      'app',
      'components',
      'lib',
      'hooks',
      'store',
      'public'
    ];

    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'tailwind.config.js',
      'README.md'
    ];

    this.auditResults.categories.structure = {
      score: 0,
      issues: [],
      completed: [],
      missing: []
    };

    // Kiểm tra thư mục
    for (const dir of requiredDirs) {
      const dirPath = path.join(this.dashboardPath, dir);
      if (fs.existsSync(dirPath)) {
        this.auditResults.categories.structure.completed.push(`✅ Thư mục ${dir} tồn tại`);
      } else {
        this.auditResults.categories.structure.missing.push(`❌ Thư mục ${dir} thiếu`);
        this.auditResults.categories.structure.issues.push(`Thiếu thư mục: ${dir}`);
      }
    }

    // Kiểm tra file
    for (const file of requiredFiles) {
      const filePath = path.join(this.dashboardPath, file);
      if (fs.existsSync(filePath)) {
        this.auditResults.categories.structure.completed.push(`✅ File ${file} tồn tại`);
      } else {
        this.auditResults.categories.structure.missing.push(`❌ File ${file} thiếu`);
        this.auditResults.categories.structure.issues.push(`Thiếu file: ${file}`);
      }
    }

    // Tính điểm
    const totalItems = requiredDirs.length + requiredFiles.length;
    const completedItems = this.auditResults.categories.structure.completed.length;
    this.auditResults.categories.structure.score = Math.round((completedItems / totalItems) * 100);
  }

  async checkDependencies() {
    console.log('📦 Kiểm tra dependencies...');
    
    const packageJsonPath = path.join(this.dashboardPath, 'package.json');
    
    this.auditResults.categories.dependencies = {
      score: 0,
      issues: [],
      completed: [],
      missing: []
    };

    if (!fs.existsSync(packageJsonPath)) {
      this.auditResults.categories.dependencies.issues.push('Không tìm thấy package.json');
      return;
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const requiredDeps = [
        'next',
        'react',
        'react-dom',
        'typescript',
        '@types/react',
        '@types/node'
      ];

      const recommendedDeps = [
        'tailwindcss',
        'autoprefixer',
        'postcss',
        '@headlessui/react',
        '@heroicons/react',
        'zustand',
        'axios',
        'react-query',
        'framer-motion',
        'recharts',
        'date-fns',
        'clsx',
        'class-variance-authority'
      ];

      // Kiểm tra dependencies bắt buộc
      for (const dep of requiredDeps) {
        if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
          this.auditResults.categories.dependencies.completed.push(`✅ ${dep} đã cài đặt`);
        } else {
          this.auditResults.categories.dependencies.missing.push(`❌ ${dep} chưa cài đặt`);
          this.auditResults.categories.dependencies.issues.push(`Thiếu dependency: ${dep}`);
        }
      }

      // Kiểm tra dependencies khuyến nghị
      let recommendedCount = 0;
      for (const dep of recommendedDeps) {
        if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
          this.auditResults.categories.dependencies.completed.push(`✅ ${dep} đã cài đặt`);
          recommendedCount++;
        }
      }

      // Tính điểm
      const requiredScore = (this.auditResults.categories.dependencies.completed.length - recommendedCount) / requiredDeps.length * 60;
      const recommendedScore = (recommendedCount / recommendedDeps.length) * 40;
      this.auditResults.categories.dependencies.score = Math.round(requiredScore + recommendedScore);

    } catch (error) {
      this.auditResults.categories.dependencies.issues.push(`Lỗi đọc package.json: ${error.message}`);
    }
  }

  async checkComponents() {
    console.log('🧩 Kiểm tra components...');
    
    const componentsPath = path.join(this.dashboardPath, 'components');
    
    this.auditResults.categories.components = {
      score: 0,
      issues: [],
      completed: [],
      missing: []
    };

    if (!fs.existsSync(componentsPath)) {
      this.auditResults.categories.components.issues.push('Thư mục components không tồn tại');
      return;
    }

    const requiredComponents = [
      'ui/button.tsx',
      'ui/input.tsx',
      'ui/card.tsx',
      'ui/table.tsx',
      'ui/modal.tsx',
      'layout/header.tsx',
      'layout/sidebar.tsx',
      'layout/footer.tsx',
      'charts/line-chart.tsx',
      'charts/bar-chart.tsx',
      'forms/login-form.tsx',
      'forms/register-form.tsx'
    ];

    let componentCount = 0;
    for (const component of requiredComponents) {
      const componentPath = path.join(componentsPath, component);
      if (fs.existsSync(componentPath)) {
        this.auditResults.categories.components.completed.push(`✅ ${component} tồn tại`);
        componentCount++;
      } else {
        this.auditResults.categories.components.missing.push(`❌ ${component} thiếu`);
        this.auditResults.categories.components.issues.push(`Thiếu component: ${component}`);
      }
    }

    // Tính điểm
    this.auditResults.categories.components.score = Math.round((componentCount / requiredComponents.length) * 100);
  }

  async checkPages() {
    console.log('📄 Kiểm tra pages...');
    
    const appPath = path.join(this.dashboardPath, 'app');
    
    this.auditResults.categories.pages = {
      score: 0,
      issues: [],
      completed: [],
      missing: []
    };

    if (!fs.existsSync(appPath)) {
      this.auditResults.categories.pages.issues.push('Thư mục app không tồn tại');
      return;
    }

    const requiredPages = [
      'page.tsx',
      'layout.tsx',
      'login/page.tsx',
      'dashboard/page.tsx',
      'users/page.tsx',
      'settings/page.tsx',
      'analytics/page.tsx'
    ];

    let pageCount = 0;
    for (const page of requiredPages) {
      const pagePath = path.join(appPath, page);
      if (fs.existsSync(pagePath)) {
        this.auditResults.categories.pages.completed.push(`✅ ${page} tồn tại`);
        pageCount++;
      } else {
        this.auditResults.categories.pages.missing.push(`❌ ${page} thiếu`);
        this.auditResults.categories.pages.issues.push(`Thiếu page: ${page}`);
      }
    }

    // Tính điểm
    this.auditResults.categories.pages.score = Math.round((pageCount / requiredPages.length) * 100);
  }

  async checkConfiguration() {
    console.log('⚙️ Kiểm tra configuration...');
    
    this.auditResults.categories.configuration = {
      score: 0,
      issues: [],
      completed: [],
      missing: []
    };

    const configFiles = [
      'tsconfig.json',
      'tailwind.config.js',
      'next.config.js',
      'postcss.config.js',
      'eslint.config.js'
    ];

    let configCount = 0;
    for (const config of configFiles) {
      const configPath = path.join(this.dashboardPath, config);
      if (fs.existsSync(configPath)) {
        this.auditResults.categories.configuration.completed.push(`✅ ${config} tồn tại`);
        configCount++;
      } else {
        this.auditResults.categories.configuration.missing.push(`❌ ${config} thiếu`);
        this.auditResults.categories.configuration.issues.push(`Thiếu config: ${config}`);
      }
    }

    // Tính điểm
    this.auditResults.categories.configuration.score = Math.round((configCount / configFiles.length) * 100);
  }

  async checkTesting() {
    console.log('🧪 Kiểm tra testing setup...');
    
    this.auditResults.categories.testing = {
      score: 0,
      issues: [],
      completed: [],
      missing: []
    };

    const testFiles = [
      'jest.config.js',
      'jest.setup.js',
      '__tests__/components/',
      '__tests__/pages/',
      '__tests__/utils/'
    ];

    let testCount = 0;
    for (const test of testFiles) {
      const testPath = path.join(this.dashboardPath, test);
      if (fs.existsSync(testPath)) {
        this.auditResults.categories.testing.completed.push(`✅ ${test} tồn tại`);
        testCount++;
      } else {
        this.auditResults.categories.testing.missing.push(`❌ ${test} thiếu`);
        this.auditResults.categories.testing.issues.push(`Thiếu test: ${test}`);
      }
    }

    // Tính điểm
    this.auditResults.categories.testing.score = Math.round((testCount / testFiles.length) * 100);
  }

  async checkDocumentation() {
    console.log('📚 Kiểm tra documentation...');
    
    this.auditResults.categories.documentation = {
      score: 0,
      issues: [],
      completed: [],
      missing: []
    };

    const docFiles = [
      'README.md',
      'CONTRIBUTING.md',
      'CHANGELOG.md',
      'docs/',
      'API.md'
    ];

    let docCount = 0;
    for (const doc of docFiles) {
      const docPath = path.join(this.dashboardPath, doc);
      if (fs.existsSync(docPath)) {
        this.auditResults.categories.documentation.completed.push(`✅ ${doc} tồn tại`);
        docCount++;
      } else {
        this.auditResults.categories.documentation.missing.push(`❌ ${doc} thiếu`);
        this.auditResults.categories.documentation.issues.push(`Thiếu documentation: ${doc}`);
      }
    }

    // Tính điểm
    this.auditResults.categories.documentation.score = Math.round((docCount / docFiles.length) * 100);
  }

  async calculateScore() {
    const categories = Object.values(this.auditResults.categories);
    const totalScore = categories.reduce((sum, category) => sum + category.score, 0);
    this.auditResults.overallScore = Math.round(totalScore / categories.length);

    // Tạo recommendations
    this.generateRecommendations();
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.auditResults.categories.structure.score < 80) {
      recommendations.push('🔧 Cần cải thiện cấu trúc project - tạo các thư mục và file còn thiếu');
    }

    if (this.auditResults.categories.dependencies.score < 70) {
      recommendations.push('📦 Cần cài đặt thêm dependencies quan trọng');
    }

    if (this.auditResults.categories.components.score < 60) {
      recommendations.push('🧩 Cần phát triển thêm các components cơ bản');
    }

    if (this.auditResults.categories.pages.score < 50) {
      recommendations.push('📄 Cần tạo các pages chính cho dashboard');
    }

    if (this.auditResults.categories.testing.score < 40) {
      recommendations.push('🧪 Cần setup testing framework và viết tests');
    }

    if (this.auditResults.categories.documentation.score < 30) {
      recommendations.push('📚 Cần cải thiện documentation');
    }

    this.auditResults.recommendations = recommendations;
  }

  async generateReport() {
    const report = `# 📊 DASHBOARD AUDIT REPORT
## Báo cáo kiểm tra Dashboard AudioTailoc

**Ngày audit:** ${new Date().toLocaleDateString('vi-VN')}  
**Thời gian:** ${new Date().toLocaleTimeString('vi-VN')}  
**Điểm tổng thể:** ${this.auditResults.overallScore}/100

---

## 📈 KẾT QUẢ CHI TIẾT

### 🏗️ Cấu trúc Project: ${this.auditResults.categories.structure.score}/100

**✅ Đã hoàn thành:**
${this.auditResults.categories.structure.completed.map(item => `- ${item}`).join('\n')}

**❌ Còn thiếu:**
${this.auditResults.categories.structure.missing.map(item => `- ${item}`).join('\n')}

### 📦 Dependencies: ${this.auditResults.categories.dependencies.score}/100

**✅ Đã hoàn thành:**
${this.auditResults.categories.dependencies.completed.map(item => `- ${item}`).join('\n')}

**❌ Còn thiếu:**
${this.auditResults.categories.dependencies.missing.map(item => `- ${item}`).join('\n')}

### 🧩 Components: ${this.auditResults.categories.components.score}/100

**✅ Đã hoàn thành:**
${this.auditResults.categories.components.completed.map(item => `- ${item}`).join('\n')}

**❌ Còn thiếu:**
${this.auditResults.categories.components.missing.map(item => `- ${item}`).join('\n')}

### 📄 Pages: ${this.auditResults.categories.pages.score}/100

**✅ Đã hoàn thành:**
${this.auditResults.categories.pages.completed.map(item => `- ${item}`).join('\n')}

**❌ Còn thiếu:**
${this.auditResults.categories.pages.missing.map(item => `- ${item}`).join('\n')}

### ⚙️ Configuration: ${this.auditResults.categories.configuration.score}/100

**✅ Đã hoàn thành:**
${this.auditResults.categories.configuration.completed.map(item => `- ${item}`).join('\n')}

**❌ Còn thiếu:**
${this.auditResults.categories.configuration.missing.map(item => `- ${item}`).join('\n')}

### 🧪 Testing: ${this.auditResults.categories.testing.score}/100

**✅ Đã hoàn thành:**
${this.auditResults.categories.testing.completed.map(item => `- ${item}`).join('\n')}

**❌ Còn thiếu:**
${this.auditResults.categories.testing.missing.map(item => `- ${item}`).join('\n')}

### 📚 Documentation: ${this.auditResults.categories.documentation.score}/100

**✅ Đã hoàn thành:**
${this.auditResults.categories.documentation.completed.map(item => `- ${item}`).join('\n')}

**❌ Còn thiếu:**
${this.auditResults.categories.documentation.missing.map(item => `- ${item}`).join('\n')}

---

## 🎯 KHUYẾN NGHỊ

${this.auditResults.recommendations.map(rec => `- ${rec}`).join('\n')}

---

## 📋 TODO LIST ƯU TIÊN

### 🔴 Ưu tiên cao (Tuần 1-2)
${this.getHighPriorityTasks()}

### 🟡 Ưu tiên trung bình (Tuần 3-4)
${this.getMediumPriorityTasks()}

### 🟢 Ưu tiên thấp (Tuần 5-6)
${this.getLowPriorityTasks()}

---

## 📊 THỐNG KÊ

- **Tổng số vấn đề:** ${this.getTotalIssues()}
- **Tổng số tasks hoàn thành:** ${this.getTotalCompleted()}
- **Tổng số tasks còn lại:** ${this.getTotalPending()}
- **Tỷ lệ hoàn thành:** ${Math.round((this.getTotalCompleted() / (this.getTotalCompleted() + this.getTotalPending())) * 100)}%

---

## 🚀 BƯỚC TIẾP THEO

1. **Tuần 1:** Tập trung vào cấu trúc project và dependencies
2. **Tuần 2:** Phát triển components và pages cơ bản
3. **Tuần 3:** Setup testing và configuration
4. **Tuần 4:** Cải thiện documentation và optimization
5. **Tuần 5-6:** Testing toàn diện và deployment

---

*Báo cáo được tạo tự động bởi Dashboard Auditor Script*  
*Cập nhật lần cuối: ${new Date().toISOString()}*
`;

    fs.writeFileSync(this.reportPath, report, 'utf8');
  }

  getHighPriorityTasks() {
    const tasks = [];
    
    if (this.auditResults.categories.structure.score < 80) {
      tasks.push('- Tạo cấu trúc thư mục còn thiếu');
    }
    
    if (this.auditResults.categories.dependencies.score < 70) {
      tasks.push('- Cài đặt dependencies cần thiết');
    }
    
    if (this.auditResults.categories.components.score < 60) {
      tasks.push('- Phát triển UI components cơ bản');
    }
    
    return tasks.length > 0 ? tasks.join('\n') : '- Không có tasks ưu tiên cao';
  }

  getMediumPriorityTasks() {
    const tasks = [];
    
    if (this.auditResults.categories.pages.score < 50) {
      tasks.push('- Tạo các pages chính');
    }
    
    if (this.auditResults.categories.configuration.score < 80) {
      tasks.push('- Cấu hình build tools');
    }
    
    return tasks.length > 0 ? tasks.join('\n') : '- Không có tasks ưu tiên trung bình';
  }

  getLowPriorityTasks() {
    const tasks = [];
    
    if (this.auditResults.categories.testing.score < 40) {
      tasks.push('- Setup testing framework');
    }
    
    if (this.auditResults.categories.documentation.score < 30) {
      tasks.push('- Cải thiện documentation');
    }
    
    return tasks.length > 0 ? tasks.join('\n') : '- Không có tasks ưu tiên thấp';
  }

  getTotalIssues() {
    return Object.values(this.auditResults.categories)
      .reduce((sum, category) => sum + category.issues.length, 0);
  }

  getTotalCompleted() {
    return Object.values(this.auditResults.categories)
      .reduce((sum, category) => sum + category.completed.length, 0);
  }

  getTotalPending() {
    return Object.values(this.auditResults.categories)
      .reduce((sum, category) => sum + category.missing.length, 0);
  }
}

// Chạy audit
if (require.main === module) {
  const auditor = new DashboardAuditor();
  auditor.runAudit();
}

module.exports = DashboardAuditor;
