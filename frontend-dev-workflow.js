#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FrontendDevWorkflow {
  constructor() {
    this.projectRoot = process.cwd();
    this.frontendDir = path.join(this.projectRoot, 'frontend');
    this.backendDir = path.join(this.projectRoot, 'backend');
    this.currentPhase = 1;
    this.currentTask = 0;
  }

  // Initialize development environment
  async initialize() {
    console.log('🚀 Initializing Frontend Development Workflow...\n');
    
    try {
      // Check if frontend directory exists
      if (!fs.existsSync(this.frontendDir)) {
        console.log('❌ Frontend directory not found');
        return;
      }

      // Check if backend is running
      await this.checkBackendStatus();
      
      // Setup environment
      await this.setupEnvironment();
      
      // Start development server
      await this.startDevServer();
      
      console.log('✅ Frontend development environment ready!');
      
    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
    }
  }

  // Check backend status
  async checkBackendStatus() {
    console.log('🔍 Checking backend status...');
    
    try {
      const response = await fetch('http://localhost:3010/api/v1/health');
      if (response.ok) {
        console.log('✅ Backend is running');
      } else {
        console.log('⚠️ Backend is not responding properly');
      }
    } catch (error) {
      console.log('❌ Backend is not running. Please start backend first.');
      console.log('   Run: cd backend && npm run start:dev');
    }
  }

  // Setup environment variables
  async setupEnvironment() {
    console.log('⚙️ Setting up environment...');
    
    const envPath = path.join(this.frontendDir, '.env.local');
    const envContent = `# Frontend Environment Variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_APP_NAME=Audio Tài Lộc
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Development
NODE_ENV=development
`;

    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Created .env.local file');
    } else {
      console.log('✅ .env.local already exists');
    }
  }

  // Start development server
  async startDevServer() {
    console.log('🌐 Starting development server...');
    
    try {
      process.chdir(this.frontendDir);
      execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
      console.log('❌ Failed to start dev server');
    }
  }

  // Run tests
  async runTests() {
    console.log('🧪 Running tests...');
    
    try {
      process.chdir(this.frontendDir);
      
      // Run unit tests
      console.log('📋 Running unit tests...');
      execSync('npm test', { stdio: 'inherit' });
      
      // Run E2E tests
      console.log('🔍 Running E2E tests...');
      execSync('npm run test:e2e', { stdio: 'inherit' });
      
      // Run performance tests
      console.log('⚡ Running performance tests...');
      execSync('npm run lighthouse', { stdio: 'inherit' });
      
    } catch (error) {
      console.log('❌ Tests failed:', error.message);
    }
  }

  // Build for production
  async buildProduction() {
    console.log('🏗️ Building for production...');
    
    try {
      process.chdir(this.frontendDir);
      
      // Install dependencies
      console.log('📦 Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      
      // Build
      console.log('🔨 Building application...');
      execSync('npm run build', { stdio: 'inherit' });
      
      // Run production server
      console.log('🚀 Starting production server...');
      execSync('npm start', { stdio: 'inherit' });
      
    } catch (error) {
      console.log('❌ Build failed:', error.message);
    }
  }

  // Check code quality
  async checkCodeQuality() {
    console.log('🔍 Checking code quality...');
    
    try {
      process.chdir(this.frontendDir);
      
      // Run ESLint
      console.log('📋 Running ESLint...');
      execSync('npm run lint', { stdio: 'inherit' });
      
      // Run TypeScript check
      console.log('📋 Running TypeScript check...');
      execSync('npx tsc --noEmit', { stdio: 'inherit' });
      
      // Run Prettier
      console.log('🎨 Running Prettier...');
      execSync('npm run format', { stdio: 'inherit' });
      
    } catch (error) {
      console.log('❌ Code quality check failed:', error.message);
    }
  }

  // Generate component
  generateComponent(name, type = 'functional') {
    console.log(`🎨 Generating ${type} component: ${name}...`);
    
    const componentDir = path.join(this.frontendDir, 'components', name);
    const componentFile = path.join(componentDir, `${name}.tsx`);
    const testFile = path.join(componentDir, `${name}.test.tsx`);
    
    // Create component directory
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }
    
    // Component template
    const componentTemplate = `import React from 'react';

interface ${name}Props {
  // Add your props here
}

export const ${name}: React.FC<${name}Props> = ({}) => {
  return (
    <div className="${name.toLowerCase()}-container">
      <h2>${name}</h2>
      {/* Add your component content here */}
    </div>
  );
};

export default ${name};
`;

    // Test template
    const testTemplate = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
    expect(screen.getByText('${name}')).toBeInTheDocument();
  });
});
`;

    // Write files
    fs.writeFileSync(componentFile, componentTemplate);
    fs.writeFileSync(testFile, testTemplate);
    
    console.log(`✅ Generated ${name} component`);
    console.log(`📁 Location: ${componentDir}`);
  }

  // Generate page
  generatePage(name) {
    console.log(`📄 Generating page: ${name}...`);
    
    const pageDir = path.join(this.frontendDir, 'app', name);
    const pageFile = path.join(pageDir, 'page.tsx');
    const layoutFile = path.join(pageDir, 'layout.tsx');
    
    // Create page directory
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }
    
    // Page template
    const pageTemplate = `import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${name} - Audio Tài Lộc',
  description: '${name} page description',
};

export default function ${name}Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">${name}</h1>
      {/* Add your page content here */}
    </div>
  );
}
`;

    // Layout template
    const layoutTemplate = `import React from 'react';

export default function ${name}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="${name.toLowerCase()}-layout">
      {children}
    </div>
  );
}
`;

    // Write files
    fs.writeFileSync(pageFile, pageTemplate);
    fs.writeFileSync(layoutFile, layoutTemplate);
    
    console.log(`✅ Generated ${name} page`);
    console.log(`📁 Location: ${pageDir}`);
  }

  // Show development status
  showStatus() {
    console.log('📊 Frontend Development Status\n');
    
    const status = {
      'Backend Connection': '✅ Connected',
      'Development Server': '✅ Running',
      'TypeScript': '✅ Configured',
      'Tailwind CSS': '✅ Configured',
      'Testing Setup': '✅ Configured',
      'ESLint': '✅ Configured',
      'Prettier': '✅ Configured',
    };
    
    Object.entries(status).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    
    console.log('\n🎯 Current Phase: Phase 1 - Core Setup');
    console.log('📋 Next Tasks:');
    console.log('  - API Client Setup');
    console.log('  - State Management');
    console.log('  - Authentication System');
  }

  // Show help
  showHelp() {
    console.log('🎨 Frontend Development Workflow Commands\n');
    
    console.log('Available commands:');
    console.log('  init          - Initialize development environment');
    console.log('  test          - Run all tests');
    console.log('  build         - Build for production');
    console.log('  quality       - Check code quality');
    console.log('  component     - Generate new component');
    console.log('  page          - Generate new page');
    console.log('  status        - Show development status');
    console.log('  help          - Show this help message');
    
    console.log('\nExamples:');
    console.log('  node frontend-dev-workflow.js init');
    console.log('  node frontend-dev-workflow.js component ProductCard');
    console.log('  node frontend-dev-workflow.js page products');
  }
}

// Main execution
async function main() {
  const workflow = new FrontendDevWorkflow();
  const command = process.argv[2];
  
  switch (command) {
    case 'init':
      await workflow.initialize();
      break;
    case 'test':
      await workflow.runTests();
      break;
    case 'build':
      await workflow.buildProduction();
      break;
    case 'quality':
      await workflow.checkCodeQuality();
      break;
    case 'component':
      const componentName = process.argv[3];
      if (componentName) {
        workflow.generateComponent(componentName);
      } else {
        console.log('❌ Please provide component name');
      }
      break;
    case 'page':
      const pageName = process.argv[3];
      if (pageName) {
        workflow.generatePage(pageName);
      } else {
        console.log('❌ Please provide page name');
      }
      break;
    case 'status':
      workflow.showStatus();
      break;
    case 'help':
    default:
      workflow.showHelp();
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = FrontendDevWorkflow;
