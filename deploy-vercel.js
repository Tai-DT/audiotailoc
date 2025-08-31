#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

async function checkVercelCLI() {
  try {
    await execAsync('vercel --version');
    return true;
  } catch {
    return false;
  }
}

async function installVercelCLI() {
  console.log('📦 Installing Vercel CLI...');
  try {
    await execAsync('npm install -g vercel');
    console.log('✅ Vercel CLI installed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to install Vercel CLI:', error.message);
    return false;
  }
}

async function deployFrontend() {
  console.log('🚀 Deploying Frontend to Vercel...');
  
  try {
    // Build frontend
    console.log('📦 Building frontend...');
    await execAsync('cd frontend && npm run build');
    
    // Deploy to Vercel
    console.log('🌐 Deploying to Vercel...');
    const { stdout } = await execAsync('cd frontend && vercel --prod --yes');
    
    console.log('✅ Frontend deployed successfully!');
    console.log('Frontend URL:', stdout.match(/https:\/\/[^\s]+/)?.[0] || 'Check Vercel dashboard');
    
    return true;
  } catch (error) {
    console.error('❌ Frontend deployment failed:', error.message);
    return false;
  }
}

async function deployBackend() {
  console.log('🔧 Deploying Backend...');
  
  try {
    // Create vercel.json for backend
    const vercelConfig = {
      version: 2,
      builds: [
        {
          src: 'dist/main.js',
          use: '@vercel/node'
        }
      ],
      routes: [
        {
          src: '/(.*)',
          dest: '/dist/main.js'
        }
      ],
      env: {
        NODE_ENV: 'production'
      }
    };
    
    fs.writeFileSync('backend/vercel.json', JSON.stringify(vercelConfig, null, 2));
    
    // Build backend
    console.log('📦 Building backend...');
    await execAsync('cd backend && npm run build');
    
    // Deploy to Vercel
    console.log('🌐 Deploying backend to Vercel...');
    const { stdout } = await execAsync('cd backend && vercel --prod --yes');
    
    console.log('✅ Backend deployed successfully!');
    console.log('Backend URL:', stdout.match(/https:\/\/[^\s]+/)?.[0] || 'Check Vercel dashboard');
    
    return true;
  } catch (error) {
    console.error('❌ Backend deployment failed:', error.message);
    return false;
  }
}

async function setupEnvironment() {
  console.log('⚙️ Setting up environment variables...');
  
  try {
    // You can add environment variable setup here
    // For example, using Vercel CLI to set env vars
    console.log('✅ Environment setup completed');
    return true;
  } catch (error) {
    console.error('❌ Environment setup failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🎵 Audio Tài Lộc - Vercel Deployment\n');
  
  try {
    // Check if Vercel CLI is installed
    const hasVercelCLI = await checkVercelCLI();
    if (!hasVercelCLI) {
      const installed = await installVercelCLI();
      if (!installed) {
        console.log('❌ Please install Vercel CLI manually: npm install -g vercel');
        process.exit(1);
      }
    }
    
    // Setup environment
    await setupEnvironment();
    
    // Deploy backend first
    const backendDeployed = await deployBackend();
    if (!backendDeployed) {
      console.log('❌ Backend deployment failed. Stopping deployment.');
      process.exit(1);
    }
    
    // Deploy frontend
    const frontendDeployed = await deployFrontend();
    if (!frontendDeployed) {
      console.log('❌ Frontend deployment failed.');
      process.exit(1);
    }
    
    console.log('\n🎉 Deployment completed successfully!');
    console.log('\n📱 Your application is now live on Vercel!');
    console.log('Check your Vercel dashboard for the URLs.');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, deployFrontend, deployBackend, setupEnvironment };



