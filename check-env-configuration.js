#!/usr/bin/env node

/**
 * 🔍 Environment Configuration Checker
 * Kiểm tra và so sánh các file environment để tìm những gì còn thiếu
 */

const fs = require('fs');
const path = require('path');

// Các file environment cần kiểm tra
const envFiles = {
  backend: {
    template: 'backend/env-template.txt',
    example: 'backend/.env.example',
    actual: 'backend/.env'
  },
  frontend: {
    example: 'frontend/.env.local.example',
    actual: 'frontend/.env.local'
  },
  dashboard: {
    example: 'dashboard/.env.local.example',
    actual: 'dashboard/.env.local'
  }
};

// Các biến môi trường quan trọng cần có
const requiredVars = {
  backend: [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'PORT',
    'NODE_ENV',
    'REDIS_URL',
    'GOOGLE_AI_API_KEY',
    'PAYOS_CLIENT_ID',
    'PAYOS_API_KEY',
    'PAYOS_CHECKSUM_KEY',
    'PAYOS_PARTNER_CODE'
  ],
  frontend: [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_WS_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ],
  dashboard: [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_WS_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ]
};

/**
 * Đọc và parse file environment
 */
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const vars = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      vars[key.trim()] = value.trim();
    }
  });
  
  return vars;
}

/**
 * Kiểm tra biến môi trường bắt buộc
 */
function checkRequiredVars(envVars, requiredVars, component) {
  const missing = [];
  const present = [];
  
  requiredVars.forEach(varName => {
    if (envVars[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  });
  
  return { missing, present };
}

/**
 * So sánh hai file environment
 */
function compareEnvFiles(file1, file2, name1, name2) {
  const vars1 = parseEnvFile(file1);
  const vars2 = parseEnvFile(file2);
  
  const keys1 = Object.keys(vars1);
  const keys2 = Object.keys(vars2);
  
  const onlyIn1 = keys1.filter(key => !keys2.includes(key));
  const onlyIn2 = keys2.filter(key => !keys1.includes(key));
  const common = keys1.filter(key => keys2.includes(key));
  
  return {
    onlyIn1,
    onlyIn2,
    common,
    total1: keys1.length,
    total2: keys2.length
  };
}

/**
 * Kiểm tra giá trị mặc định
 */
function checkDefaultValues(envVars, component) {
  const issues = [];
  
  Object.entries(envVars).forEach(([key, value]) => {
    if (value.includes('your-') || value.includes('change-in-production')) {
      issues.push(`${key}: ${value}`);
    }
  });
  
  return issues;
}

/**
 * Tạo báo cáo chi tiết
 */
function generateReport() {
  console.log('🔍 Environment Configuration Checker');
  console.log('=====================================\n');
  
  const report = {
    components: {},
    issues: [],
    recommendations: []
  };
  
  // Kiểm tra từng component
  Object.entries(envFiles).forEach(([component, files]) => {
    console.log(`📁 Checking ${component.toUpperCase()}...`);
    
    const componentReport = {
      files: {},
      required: { missing: [], present: [] },
      issues: []
    };
    
    // Kiểm tra từng file
    Object.entries(files).forEach(([type, filePath]) => {
      if (fs.existsSync(filePath)) {
        const vars = parseEnvFile(filePath);
        componentReport.files[type] = {
          path: filePath,
          exists: true,
          varCount: Object.keys(vars).length,
          vars: vars
        };
        console.log(`  ✅ ${type}: ${Object.keys(vars).length} variables`);
      } else {
        componentReport.files[type] = {
          path: filePath,
          exists: false,
          varCount: 0,
          vars: {}
        };
        console.log(`  ❌ ${type}: File not found`);
        report.issues.push(`Missing file: ${filePath}`);
      }
    });
    
    // Kiểm tra biến bắt buộc
    if (requiredVars[component]) {
      const actualVars = componentReport.files.actual?.vars || componentReport.files.example?.vars || {};
      const requiredCheck = checkRequiredVars(actualVars, requiredVars[component], component);
      componentReport.required = requiredCheck;
      
      if (requiredCheck.missing.length > 0) {
        console.log(`  ⚠️  Missing required variables: ${requiredCheck.missing.join(', ')}`);
        report.issues.push(`${component}: Missing required variables - ${requiredCheck.missing.join(', ')}`);
      } else {
        console.log(`  ✅ All required variables present`);
      }
    }
    
    // Kiểm tra giá trị mặc định
    const actualVars = componentReport.files.actual?.vars || {};
    const defaultIssues = checkDefaultValues(actualVars, component);
    if (defaultIssues.length > 0) {
      console.log(`  ⚠️  Default values found: ${defaultIssues.length} variables`);
      componentReport.issues.push(...defaultIssues);
      report.issues.push(`${component}: Default values need updating`);
    }
    
    report.components[component] = componentReport;
    console.log('');
  });
  
  // So sánh template vs example
  console.log('📊 Comparing Template vs Example Files...');
  Object.entries(envFiles).forEach(([component, files]) => {
    if (files.template && files.example && fs.existsSync(files.template) && fs.existsSync(files.example)) {
      const comparison = compareEnvFiles(files.template, files.example, 'template', 'example');
      console.log(`  ${component}: Template has ${comparison.total1} vars, Example has ${comparison.total2} vars`);
      
      if (comparison.onlyIn1.length > 0) {
        console.log(`    Variables only in template: ${comparison.onlyIn1.length}`);
        report.recommendations.push(`${component}: Add missing variables from template to example`);
      }
      
      if (comparison.onlyIn2.length > 0) {
        console.log(`    Variables only in example: ${comparison.onlyIn2.length}`);
        report.recommendations.push(`${component}: Review variables only in example file`);
      }
    }
  });
  
  // Tóm tắt
  console.log('\n📋 SUMMARY');
  console.log('==========');
  
  const totalIssues = report.issues.length;
  const totalRecommendations = report.recommendations.length;
  
  if (totalIssues === 0) {
    console.log('✅ All environment configurations are properly set up!');
  } else {
    console.log(`⚠️  Found ${totalIssues} issues:`);
    report.issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  if (totalRecommendations > 0) {
    console.log(`\n💡 ${totalRecommendations} recommendations:`);
    report.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }
  
  // Tạo file báo cáo
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = `env-configuration-report-${timestamp}.json`;
  
  fs.writeFileSync(reportFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues,
      totalRecommendations,
      components: Object.keys(envFiles)
    },
    details: report
  }, null, 2));
  
  console.log(`\n📄 Detailed report saved: ${reportFile}`);
  
  return report;
}

// Chạy kiểm tra nếu được gọi trực tiếp
if (require.main === module) {
  generateReport();
}

module.exports = { generateReport, parseEnvFile, checkRequiredVars, compareEnvFiles };
