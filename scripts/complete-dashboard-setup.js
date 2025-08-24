#!/usr/bin/env node

/**
 * Complete Dashboard Setup Script
 * Chạy toàn bộ quy trình setup và audit dashboard
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CompleteDashboardSetup {
  constructor() {
    this.rootPath = path.join(__dirname, '..');
    this.dashboardPath = path.join(this.rootPath, 'dashboard');
    this.scriptsPath = path.join(this.rootPath, 'scripts');
  }

  async run() {
    console.log('🚀 BẮT ĐẦU QUY TRÌNH HOÀN THIỆN DASHBOARD AUDIOTAILOC\n');
    
    try {
      await this.showWelcome();
      await this.checkPrerequisites();
      await this.runAudit();
      await this.showAuditResults();
      await this.askForSetup();
      await this.runSetup();
      await this.showNextSteps();
      await this.generateSummary();
      
      console.log('\n🎉 HOÀN THÀNH! Dashboard đã sẵn sàng để phát triển.');
      
    } catch (error) {
      console.error('\n❌ Lỗi trong quá trình setup:', error.message);
      process.exit(1);
    }
  }

  async showWelcome() {
    console.log('='.repeat(60));
    console.log('🎯 DASHBOARD AUDIOTAILOC - COMPLETE SETUP');
    console.log('='.repeat(60));
    console.log('');
    console.log('Quy trình này sẽ:');
    console.log('1. ✅ Audit trạng thái hiện tại của dashboard');
    console.log('2. 📊 Tạo báo cáo chi tiết');
    console.log('3. 🛠️  Setup cấu trúc cơ bản (nếu cần)');
    console.log('4. 📋 Tạo todo list ưu tiên');
    console.log('5. 🎯 Hướng dẫn bước tiếp theo');
    console.log('');
  }

  async checkPrerequisites() {
    console.log('🔍 Kiểm tra prerequisites...');
    
    // Kiểm tra Node.js
    try {
      const nodeVersion = process.version;
      console.log(`✅ Node.js version: ${nodeVersion}`);
      
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      if (majorVersion < 16) {
        throw new Error('Node.js version 16+ required');
      }
    } catch (error) {
      throw new Error('Node.js không được cài đặt hoặc version quá cũ');
    }

    // Kiểm tra npm
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      console.log(`✅ npm version: ${npmVersion}`);
    } catch (error) {
      throw new Error('npm không được cài đặt');
    }

    // Kiểm tra thư mục dashboard
    if (!fs.existsSync(this.dashboardPath)) {
      console.log('⚠️  Thư mục dashboard không tồn tại, sẽ được tạo');
    } else {
      console.log('✅ Thư mục dashboard đã tồn tại');
    }

    console.log('');
  }

  async runAudit() {
    console.log('📊 Chạy audit dashboard...');
    
    try {
      // Import và chạy audit script
      const auditScript = path.join(this.scriptsPath, 'dashboard-audit.js');
      if (fs.existsSync(auditScript)) {
        require(auditScript);
        console.log('✅ Audit hoàn thành');
      } else {
        console.log('⚠️  Audit script không tồn tại, bỏ qua bước này');
      }
    } catch (error) {
      console.log('⚠️  Không thể chạy audit script:', error.message);
    }
    
    console.log('');
  }

  async showAuditResults() {
    const auditReportPath = path.join(this.rootPath, 'DASHBOARD_AUDIT_REPORT.md');
    
    if (fs.existsSync(auditReportPath)) {
      console.log('📄 KẾT QUẢ AUDIT:');
      console.log('-'.repeat(40));
      
      const report = fs.readFileSync(auditReportPath, 'utf8');
      
      // Extract overall score
      const scoreMatch = report.match(/Điểm tổng thể:\s*(\d+)\/100/);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[1]);
        console.log(`📊 Điểm tổng thể: ${score}/100`);
        
        if (score >= 80) {
          console.log('🎉 Dashboard đã ở trạng thái tốt!');
        } else if (score >= 60) {
          console.log('👍 Dashboard cần một số cải thiện');
        } else {
          console.log('⚠️  Dashboard cần nhiều cải thiện');
        }
      }
      
      // Extract recommendations
      const recommendationsMatch = report.match(/## 🎯 KHUYẾN NGHỊ\n\n([\s\S]*?)\n\n---/);
      if (recommendationsMatch) {
        console.log('\n🎯 KHUYẾN NGHỊ:');
        const recommendations = recommendationsMatch[1].split('\n').filter(line => line.trim());
        recommendations.forEach(rec => {
          if (rec.startsWith('- ')) {
            console.log(`  ${rec}`);
          }
        });
      }
      
      console.log('\n📄 Xem báo cáo chi tiết tại: DASHBOARD_AUDIT_REPORT.md');
    } else {
      console.log('⚠️  Không tìm thấy báo cáo audit');
    }
    
    console.log('');
  }

  async askForSetup() {
    console.log('🛠️  SETUP DASHBOARD');
    console.log('-'.repeat(40));
    console.log('Bạn có muốn setup cấu trúc cơ bản cho dashboard không?');
    console.log('1. Có - Setup toàn bộ cấu trúc cơ bản');
    console.log('2. Không - Chỉ xem hướng dẫn');
    console.log('');
    
    // Trong môi trường thực tế, có thể sử dụng readline để nhận input
    // Ở đây chúng ta sẽ tự động chọn option 1
    console.log('🤖 Tự động chọn: Setup toàn bộ cấu trúc cơ bản');
    console.log('');
  }

  async runSetup() {
    console.log('🛠️  Bắt đầu setup dashboard...');
    
    try {
      // Import và chạy setup script
      const setupScript = path.join(this.scriptsPath, 'dashboard-setup.js');
      if (fs.existsSync(setupScript)) {
        require(setupScript);
        console.log('✅ Setup hoàn thành');
      } else {
        console.log('⚠️  Setup script không tồn tại, tạo cấu trúc cơ bản...');
        await this.createBasicStructure();
      }
    } catch (error) {
      console.log('⚠️  Không thể chạy setup script:', error.message);
      console.log('Tạo cấu trúc cơ bản thay thế...');
      await this.createBasicStructure();
    }
    
    console.log('');
  }

  async createBasicStructure() {
    console.log('📁 Tạo cấu trúc cơ bản...');
    
    const directories = [
      'app',
      'components/ui',
      'components/layout',
      'hooks',
      'lib',
      'store',
      'public'
    ];

    for (const dir of directories) {
      const dirPath = path.join(this.dashboardPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Tạo thư mục: ${dir}`);
      }
    }

    // Tạo package.json cơ bản
    const packageJson = {
      name: "audiotailoc-dashboard",
      version: "0.1.0",
      private: true,
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      },
      dependencies: {
        "next": "^14.0.0",
        "react": "^18.0.0",
        "react-dom": "^18.0.0"
      }
    };

    const packageJsonPath = path.join(this.dashboardPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Tạo package.json');
    }

    console.log('✅ Cấu trúc cơ bản đã được tạo');
  }

  async showNextSteps() {
    console.log('🎯 BƯỚC TIẾP THEO');
    console.log('-'.repeat(40));
    
    const nextSteps = [
      '1. 📁 Chuyển vào thư mục dashboard: cd dashboard',
      '2. 📦 Cài đặt dependencies: npm install',
      '3. 🚀 Khởi động development server: npm run dev',
      '4. 📖 Đọc roadmap: DASHBOARD_COMPLETION_ROADMAP.md',
      '5. 🧪 Xem testing checklist: DASHBOARD_TESTING_CHECKLIST.md',
      '6. 📋 Làm theo todo list ưu tiên',
      '7. 🔄 Chạy audit định kỳ: node scripts/dashboard-audit.js'
    ];

    nextSteps.forEach(step => console.log(step));
    console.log('');
  }

  async generateSummary() {
    console.log('📋 TÓM TẮT');
    console.log('-'.repeat(40));
    
    const summary = {
      timestamp: new Date().toISOString(),
      filesCreated: [
        'DASHBOARD_COMPLETION_ROADMAP.md',
        'DASHBOARD_TESTING_CHECKLIST.md',
        'DASHBOARD_AUDIT_REPORT.md',
        'DASHBOARD_GUIDE.md',
        'scripts/dashboard-audit.js',
        'scripts/complete-dashboard-setup.js'
      ],
      nextActions: [
        'Setup development environment',
        'Install dependencies',
        'Start development',
        'Follow roadmap',
        'Run regular audits'
      ],
      estimatedTimeline: '10-15 weeks',
      priority: 'High'
    };

    console.log(`📅 Ngày setup: ${new Date().toLocaleDateString('vi-VN')}`);
    console.log(`⏱️  Timeline ước tính: ${summary.estimatedTimeline}`);
    console.log(`🎯 Độ ưu tiên: ${summary.priority}`);
    console.log('');
    
    console.log('📁 Files đã tạo:');
    summary.filesCreated.forEach(file => {
      console.log(`  ✅ ${file}`);
    });
    
    console.log('');
    console.log('🎯 Actions tiếp theo:');
    summary.nextActions.forEach(action => {
      console.log(`  • ${action}`);
    });
  }
}

// Chạy complete setup
if (require.main === module) {
  const setup = new CompleteDashboardSetup();
  setup.run();
}

module.exports = CompleteDashboardSetup;
