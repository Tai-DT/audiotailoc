#!/usr/bin/env node

/**
 * Audio Tài Lộc - Development Server Script
 * Khởi chạy cả backend và frontend cùng lúc
 */

const { spawn } = require('child_process');
const path = require('path');

class DevServer {
  constructor() {
    this.backendDir = path.join(__dirname, '..');
    this.frontendDir = path.join(__dirname, '..', 'frontend');
    this.processes = [];
  }

  async startBackend() {
    console.log('🚀 Starting backend server...');

    return new Promise((resolve, reject) => {
      const backendProcess = spawn('npm', ['run', 'start:dev'], {
        cwd: this.backendDir,
        stdio: 'inherit'
      });

      backendProcess.on('error', (error) => {
        console.error('❌ Backend start failed:', error);
        reject(error);
      });

      // Wait for backend to be ready
      setTimeout(() => {
        console.log('✅ Backend server started on http://localhost:3010');
        resolve(backendProcess);
      }, 5000);

      this.processes.push(backendProcess);
    });
  }

  async startFrontend() {
    console.log('🚀 Starting frontend server...');

    return new Promise((resolve, reject) => {
      const frontendProcess = spawn('npm', ['run', 'dev'], {
        cwd: this.frontendDir,
        stdio: 'inherit'
      });

      frontendProcess.on('error', (error) => {
        console.error('❌ Frontend start failed:', error);
        reject(error);
      });

      // Wait for frontend to be ready
      setTimeout(() => {
        console.log('✅ Frontend server started on http://localhost:3000');
        resolve(frontendProcess);
      }, 3000);

      this.processes.push(frontendProcess);
    });
  }

  async startPrismaStudio() {
    console.log('🚀 Starting Prisma Studio...');

    return new Promise((resolve) => {
      const studioProcess = spawn('npx', ['prisma', 'studio'], {
        cwd: this.backendDir,
        stdio: 'inherit'
      });

      // Wait for Prisma Studio to be ready
      setTimeout(() => {
        console.log('✅ Prisma Studio started on http://localhost:5555');
        resolve(studioProcess);
      }, 2000);

      this.processes.push(studioProcess);
    });
  }

  cleanup() {
    console.log('\n🛑 Shutting down servers...');
    this.processes.forEach(process => {
      if (process && !process.killed) {
        process.kill();
      }
    });
    process.exit(0);
  }

  async start() {
    console.log('🎵 Audio Tài Lộc Development Environment\n');

    try {
      // Start backend first
      await this.startBackend();

      // Start Prisma Studio
      await this.startPrismaStudio();

      // Start frontend
      await this.startFrontend();

      console.log('\n🎉 All servers started successfully!');
      console.log('\n📱 Available services:');
      console.log('• Backend API: http://localhost:3010');
      console.log('• Frontend Dashboard: http://localhost:3000');
      console.log('• Prisma Studio: http://localhost:5555');
      console.log('• API Docs: http://localhost:3010/api/docs');
      console.log('\n⚡ Press Ctrl+C to stop all servers');

      // Handle graceful shutdown
      process.on('SIGINT', () => this.cleanup());
      process.on('SIGTERM', () => this.cleanup());

    } catch (error) {
      console.error('❌ Failed to start development environment:', error);
      this.cleanup();
    }
  }
}

// Run if called directly
if (require.main === module) {
  const devServer = new DevServer();
  devServer.start();
}

module.exports = DevServer;
