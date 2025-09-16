const fs = require('fs');
const path = require('path');

function getProjectOverview() {
  console.log('🎵 AUDIO TÀI LỘC BACKEND - PROJECT OVERVIEW');
  console.log('=' .repeat(60));
  
  // Project Info
  console.log('\n📋 PROJECT INFORMATION:');
  console.log('  • Name: Audio Tài Lộc Backend');
  console.log('  • Version: 0.1.0');
  console.log('  • Framework: NestJS');
  console.log('  • Database: SQLite (Prisma ORM)');
  console.log('  • Language: TypeScript');
  console.log('  • API Version: v1');
  
  // Server Info
  console.log('\n🚀 SERVER INFORMATION:');
  console.log('  • URL: http://localhost:3010');
  console.log('  • API Base: http://localhost:3010/api/v1');
  console.log('  • Documentation: http://localhost:3010/docs');
  console.log('  • Health Check: http://localhost:3010/api/v1/health');
  
  // Modules Overview
  console.log('\n📦 MODULES OVERVIEW:');
  
  const modulesDir = path.join(__dirname, '..', 'src', 'modules');
  const modules = fs.readdirSync(modulesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();
  
  const moduleCategories = {
    'Core': ['app', 'prisma'],
    'Authentication & Security': ['auth', 'security', 'users'],
    'E-commerce': ['catalog', 'cart', 'orders', 'payments', 'checkout', 'inventory'],
    'Services & Support': ['services', 'support', 'technicians', 'booking'],
    'AI & Intelligence': ['ai', 'search', 'analytics', 'customer-insights'],
    'Content & Marketing': ['pages', 'promotions', 'marketing', 'seo'],
    'Communication': ['chat', 'notifications', 'webhooks'],
    'System & Infrastructure': ['health', 'monitoring', 'logging', 'cache', 'caching'],
    'Development & Testing': ['testing', 'documentation', 'api-versioning'],
    'Internationalization': ['i18n'],
    'Integrations': ['integrations', 'files', 'maps'],
    'Data & Analytics': ['data-collection', 'analytics'],
    'System Management': ['system', 'graceful-shutdown', 'admin']
  };
  
  Object.entries(moduleCategories).forEach(([category, moduleList]) => {
    console.log(`\n  ${category}:`);
    moduleList.forEach(moduleName => {
      if (modules.includes(moduleName)) {
        console.log(`    ✅ ${moduleName}`);
      }
    });
  });
  
  // API Endpoints Summary
  console.log('\n🔗 API ENDPOINTS SUMMARY:');
  
  const endpoints = [
    { path: '/', description: 'Root endpoint' },
    { path: '/health', description: 'Health check' },
    { path: '/health/uptime', description: 'Server uptime' },
    { path: '/health/version', description: 'Version info' },
    { path: '/catalog/products', description: 'Product catalog' },
    { path: '/catalog/categories', description: 'Product categories' },
    { path: '/orders', description: 'Order management' },
    { path: '/services', description: 'Service management' },
    { path: '/cart', description: 'Shopping cart' },
    { path: '/payments/methods', description: 'Payment methods' },
    { path: '/search', description: 'Search functionality' },
    { path: '/notifications', description: 'Notifications' },
    { path: '/support/tickets', description: 'Support tickets' },
    { path: '/analytics/overview', description: 'Analytics overview' },
    { path: '/monitoring/metrics', description: 'Monitoring metrics' },
    { path: '/testing/health', description: 'Testing health' },
    { path: '/ai/chat', description: 'AI chat' },
    { path: '/graceful-shutdown', description: 'Graceful shutdown' },
    { path: '/logger/status', description: 'Logger status' },
    { path: '/logging/status', description: 'Logging status' },
    { path: '/security/status', description: 'Security status' }
  ];
  
  endpoints.forEach(endpoint => {
    console.log(`    ${endpoint.path} - ${endpoint.description}`);
  });
  
  // Database Schema
  console.log('\n🗄️ DATABASE SCHEMA:');
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const models = schema.match(/model\s+(\w+)\s*\{/g) || [];
    console.log(`  • Total Models: ${models.length}`);
    models.forEach(model => {
      const modelName = model.match(/model\s+(\w+)/)[1];
      console.log(`    - ${modelName}`);
    });
  }
  
  // Features
  console.log('\n✨ KEY FEATURES:');
  console.log('  • RESTful API with versioning');
  console.log('  • JWT Authentication & Authorization');
  console.log('  • Role-based access control');
  console.log('  • Real-time notifications');
  console.log('  • Payment processing (VNPAY, PayOS)');
  console.log('  • File upload & management');
  console.log('  • Search functionality');
  console.log('  • Analytics & reporting');
  console.log('  • Multi-language support');
  console.log('  • Caching & performance optimization');
  console.log('  • Security & rate limiting');
  console.log('  • Monitoring & logging');
  console.log('  • AI-powered features');
  console.log('  • Webhook integrations');
  
  // Development Tools
  console.log('\n🛠️ DEVELOPMENT TOOLS:');
  console.log('  • Swagger API Documentation');
  console.log('  • Prisma Studio (Database GUI)');
  console.log('  • Jest Testing Framework');
  console.log('  • ESLint & Prettier');
  console.log('  • Hot reload development');
  console.log('  • Environment configuration');
  
  // Getting Started
  console.log('\n🚀 GETTING STARTED:');
  console.log('  1. Install dependencies: pnpm install');
  console.log('  2. Setup environment: cp env-template.txt .env');
  console.log('  3. Generate Prisma client: pnpm prisma:generate');
  console.log('  4. Run migrations: pnpm prisma:migrate:dev');
  console.log('  5. Start development: pnpm dev');
  console.log('  6. Build production: pnpm build && pnpm start');
  console.log('  7. View docs: http://localhost:3010/docs');
  
  // API Testing
  console.log('\n🧪 API TESTING:');
  console.log('  • Health check: curl http://localhost:3010/api/v1/health');
  console.log('  • Products: curl http://localhost:3010/api/v1/catalog/products');
  console.log('  • Search: curl http://localhost:3010/api/v1/search?q=test');
  console.log('  • Run all tests: node scripts/test-modules.js');
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Audio Tài Lộc Backend is ready to use!');
  console.log('📖 Full documentation available at: http://localhost:3010/docs');
}

getProjectOverview();
