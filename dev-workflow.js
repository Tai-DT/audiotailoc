#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

class DevWorkflow {
  async start() {
    console.log('🚀 Starting Audio Tailoc Development Environment');

    try {
      // Start backend
      console.log('📡 Starting Backend...');
      execSync('cd backend && npm run start:dev', { stdio: 'inherit' });

    } catch (error) {
      console.log('❌ Failed to start backend:', error.message);
    }
  }

  async test() {
    console.log('🧪 Running Tests...');
    // Add test commands here
  }

  async build() {
    console.log('🔨 Building Project...');
    // Add build commands here
  }
}

// Run if called directly
if (require.main === module) {
  const workflow = new DevWorkflow();
  const command = process.argv[2] || 'start';
  workflow[command]();
}

module.exports = DevWorkflow;
