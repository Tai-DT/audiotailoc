#!/usr/bin/env node

/**
 * ☁️ Cloudinary Configuration Checker
 * Kiểm tra cấu hình Cloudinary để lưu file hình ảnh
 */

const fs = require('fs');
const path = require('path');

// Các file cần kiểm tra
const filesToCheck = {
  service: 'backend/src/modules/files/cloudinary.service.ts',
  filesService: 'backend/src/modules/files/files.service.ts',
  filesController: 'backend/src/modules/files/files.controller.ts',
  filesModule: 'backend/src/modules/files/files.module.ts',
  envTemplate: 'backend/env-template.txt',
  envActual: 'backend/.env',
  packageJson: 'backend/package.json'
};

// Các biến môi trường Cloudinary cần thiết
const requiredCloudinaryVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET'
];

// Các tính năng Cloudinary cần kiểm tra
const cloudinaryFeatures = [
  'uploadImage',
  'deleteAsset',
  'isEnabled',
  'secure_url',
  'public_id',
  'folder',
  'resource_type'
];

/**
 * Kiểm tra file có tồn tại không
 */
function checkFileExists(filePath) {
  return {
    exists: fs.existsSync(filePath),
    path: filePath,
    size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0
  };
}

/**
 * Kiểm tra biến môi trường Cloudinary
 */
function checkCloudinaryEnvVars() {
  const envPath = filesToCheck.envActual;
  const templatePath = filesToCheck.envTemplate;
  
  const results = {
    actual: {},
    template: {},
    missing: [],
    configured: false
  };

  // Kiểm tra file .env thực tế
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    requiredCloudinaryVars.forEach(varName => {
      const match = envContent.match(new RegExp(`^${varName}=(.+)$`, 'm'));
      if (match) {
        results.actual[varName] = match[1].replace(/^["']|["']$/g, '');
      }
    });
  }

  // Kiểm tra file template
  if (fs.existsSync(templatePath)) {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    requiredCloudinaryVars.forEach(varName => {
      const match = templateContent.match(new RegExp(`^${varName}=(.+)$`, 'm'));
      if (match) {
        results.template[varName] = match[1].replace(/^["']|["']$/g, '');
      }
    });
  }

  // Kiểm tra biến còn thiếu
  requiredCloudinaryVars.forEach(varName => {
    if (!results.actual[varName] || results.actual[varName].includes('your-')) {
      results.missing.push(varName);
    }
  });

  results.configured = results.missing.length === 0;
  
  return results;
}

/**
 * Kiểm tra code Cloudinary
 */
function checkCloudinaryCode() {
  const results = {
    service: { exists: false, features: [] },
    filesService: { exists: false, integration: false },
    filesController: { exists: false, endpoints: [] },
    filesModule: { exists: false, imports: [] }
  };

  // Kiểm tra CloudinaryService
  if (fs.existsSync(filesToCheck.service)) {
    const content = fs.readFileSync(filesToCheck.service, 'utf8');
    results.service.exists = true;
    results.service.features = cloudinaryFeatures.filter(feature => 
      content.includes(feature)
    );
  }

  // Kiểm tra FilesService integration
  if (fs.existsSync(filesToCheck.filesService)) {
    const content = fs.readFileSync(filesToCheck.filesService, 'utf8');
    results.filesService.exists = true;
    results.filesService.integration = content.includes('cloudinary') && 
                                     content.includes('uploadImage');
  }

  // Kiểm tra FilesController
  if (fs.existsSync(filesToCheck.filesController)) {
    const content = fs.readFileSync(filesToCheck.filesController, 'utf8');
    results.filesController.exists = true;
    results.filesController.endpoints = [
      'uploadFile',
      'uploadMultipleFiles', 
      'uploadProductImage',
      'uploadAvatar'
    ].filter(endpoint => content.includes(endpoint));
  }

  // Kiểm tra FilesModule
  if (fs.existsSync(filesToCheck.filesModule)) {
    const content = fs.readFileSync(filesToCheck.filesModule, 'utf8');
    results.filesModule.exists = true;
    results.filesModule.imports = [
      'CloudinaryService',
      'FilesService',
      'FilesController'
    ].filter(importName => content.includes(importName));
  }

  return results;
}

/**
 * Kiểm tra package dependencies
 */
function checkDependencies() {
  const packagePath = filesToCheck.packageJson;
  const results = {
    cloudinary: false,
    sharp: false,
    multer: false
  };

  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    results.cloudinary = !!dependencies.cloudinary;
    results.sharp = !!dependencies.sharp;
    results.multer = !!dependencies['@types/multer'] || !!dependencies.multer;
  }

  return results;
}

/**
 * Tạo báo cáo chi tiết
 */
function generateReport() {
  console.log('☁️ Cloudinary Configuration Checker');
  console.log('====================================\n');

  // Kiểm tra files
  console.log('📁 Checking Files...');
  Object.entries(filesToCheck).forEach(([name, filePath]) => {
    const check = checkFileExists(filePath);
    console.log(`  ${check.exists ? '✅' : '❌'} ${name}: ${check.exists ? `${check.size} bytes` : 'Not found'}`);
  });

  // Kiểm tra biến môi trường
  console.log('\n🔧 Checking Environment Variables...');
  const envCheck = checkCloudinaryEnvVars();
  
  if (envCheck.configured) {
    console.log('  ✅ Cloudinary environment variables configured');
    Object.entries(envCheck.actual).forEach(([key, value]) => {
      const masked = value.length > 10 ? value.substring(0, 10) + '...' : value;
      console.log(`    ${key}: ${masked}`);
    });
  } else {
    console.log('  ❌ Cloudinary environment variables missing:');
    envCheck.missing.forEach(varName => {
      console.log(`    - ${varName}`);
    });
  }

  // Kiểm tra code
  console.log('\n💻 Checking Code Implementation...');
  const codeCheck = checkCloudinaryCode();
  
  if (codeCheck.service.exists) {
    console.log(`  ✅ CloudinaryService: ${codeCheck.service.features.length}/${cloudinaryFeatures.length} features`);
    codeCheck.service.features.forEach(feature => {
      console.log(`    - ${feature}`);
    });
  } else {
    console.log('  ❌ CloudinaryService not found');
  }

  if (codeCheck.filesService.integration) {
    console.log('  ✅ FilesService integrated with Cloudinary');
  } else {
    console.log('  ❌ FilesService not integrated with Cloudinary');
  }

  if (codeCheck.filesController.endpoints.length > 0) {
    console.log(`  ✅ FilesController: ${codeCheck.filesController.endpoints.length} endpoints`);
    codeCheck.filesController.endpoints.forEach(endpoint => {
      console.log(`    - ${endpoint}`);
    });
  }

  // Kiểm tra dependencies
  console.log('\n📦 Checking Dependencies...');
  const depsCheck = checkDependencies();
  
  Object.entries(depsCheck).forEach(([dep, installed]) => {
    console.log(`  ${installed ? '✅' : '❌'} ${dep}: ${installed ? 'Installed' : 'Missing'}`);
  });

  // Tóm tắt
  console.log('\n📋 SUMMARY');
  console.log('==========');
  
  const allFilesExist = Object.values(filesToCheck).every(filePath => fs.existsSync(filePath));
  const allDepsInstalled = Object.values(depsCheck).every(installed => installed);
  
  if (envCheck.configured && allFilesExist && allDepsInstalled) {
    console.log('✅ Cloudinary configuration is complete and ready to use!');
  } else {
    console.log('⚠️  Cloudinary configuration needs attention:');
    
    if (!envCheck.configured) {
      console.log('  - Environment variables need to be configured');
    }
    if (!allFilesExist) {
      console.log('  - Some required files are missing');
    }
    if (!allDepsInstalled) {
      console.log('  - Some dependencies are missing');
    }
  }

  // Tạo file báo cáo
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = `cloudinary-config-report-${timestamp}.json`;
  
  const report = {
    timestamp: new Date().toISOString(),
    files: Object.fromEntries(
      Object.entries(filesToCheck).map(([name, filePath]) => [name, checkFileExists(filePath)])
    ),
    environment: envCheck,
    code: codeCheck,
    dependencies: depsCheck,
    summary: {
      configured: envCheck.configured && allFilesExist && allDepsInstalled,
      issues: []
    }
  };

  if (!envCheck.configured) report.summary.issues.push('Environment variables not configured');
  if (!allFilesExist) report.summary.issues.push('Missing required files');
  if (!allDepsInstalled) report.summary.issues.push('Missing dependencies');

  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved: ${reportFile}`);

  return report;
}

// Chạy kiểm tra nếu được gọi trực tiếp
if (require.main === module) {
  generateReport();
}

module.exports = { 
  generateReport, 
  checkCloudinaryEnvVars, 
  checkCloudinaryCode, 
  checkDependencies 
};
