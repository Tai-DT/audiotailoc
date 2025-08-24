#!/usr/bin/env node

const { execSync } = require('child_process');

class DeployManager {
  async build() {
    console.log('🔨 Building Audio Tailoc...');

    try {
      // Build backend
      console.log('📦 Building Backend...');
      execSync('cd backend && npm run build', { stdio: 'inherit' });

      // Build frontend
      console.log('🌐 Building Frontend...');
      execSync('cd frontend && npm run build', { stdio: 'inherit' });

      console.log('✅ Build completed successfully!');
    } catch (error) {
      console.log('❌ Build failed:', error.message);
    }
  }

  async deploy() {
    console.log('🚀 Deploying Audio Tailoc...');
    // Add deployment logic here
  }
}

if (require.main === module) {
  const deploy = new DeployManager();
  const command = process.argv[2] || 'build';
  deploy[command]();
}

module.exports = DeployManager;
