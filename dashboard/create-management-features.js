#!/usr/bin/env node

/**
 * Management Features Creator
 * Creates missing management endpoints and features
 */

const fs = require('fs');
const path = require('path');

const BASE_BACKEND_PATH = 'backend/src';
const MODULES_PATH = path.join(BASE_BACKEND_PATH, 'modules');

// Management modules to create
function createManagementModules() {
  console.log('🏗️  Creating Management Modules...');

  const modules = [
    {
      name: 'admin',
      description: 'Admin dashboard and management features',
      endpoints: [
        'GET /admin/dashboard - Get admin dashboard data',
        'GET /admin/stats - Get system statistics',
        'POST /admin/settings - Update system settings',
        'GET /admin/logs - Get system logs'
      ]
    },
    {
      name: 'users',
      description: 'User management system',
      endpoints: [
        'GET /users - List all users',
        'GET /users/:id - Get user details',
        'POST /users - Create new user',
        'PUT /users/:id - Update user',
        'DELETE /users/:id - Delete user',
        'GET /users/stats - Get user statistics'
      ]
    },
    {
      name: 'orders',
      description: 'Order management system',
      endpoints: [
        'GET /orders - List all orders',
        'GET /orders/:id - Get order details',
        'POST /orders - Create new order',
        'PUT /orders/:id - Update order status',
        'DELETE /orders/:id - Cancel order',
        'GET /orders/stats - Get order statistics'
      ]
    },
    {
      name: 'inventory',
      description: 'Inventory management system',
      endpoints: [
        'GET /inventory - Get inventory levels',
        'POST /inventory/adjust - Adjust inventory',
        'GET /inventory/low-stock - Get low stock alerts',
        'POST /inventory/reorder - Create reorder request'
      ]
    }
  ];

  modules.forEach(module => {
    createModuleStructure(module);
  });

  console.log('✅ Management modules structure created!');
}

function createModuleStructure(module) {
  const modulePath = path.join(MODULES_PATH, module.name);

  // Create module directory
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
  }

  // Create DTOs
  const dtoPath = path.join(modulePath, 'dto');
  if (!fs.existsSync(dtoPath)) {
    fs.mkdirSync(dtoPath, { recursive: true });
  }

  // Create main module file
  const moduleFile = path.join(modulePath, `${module.name}.module.ts`);
  const moduleContent = generateModuleFile(module);
  fs.writeFileSync(moduleFile, moduleContent);

  // Create controller
  const controllerFile = path.join(modulePath, `${module.name}.controller.ts`);
  const controllerContent = generateControllerFile(module);
  fs.writeFileSync(controllerFile, controllerContent);

  // Create service
  const serviceFile = path.join(modulePath, `${module.name}.service.ts`);
  const serviceContent = generateServiceFile(module);
  fs.writeFileSync(serviceFile, serviceContent);

  console.log(`📁 Created ${module.name} module structure`);
}

function generateModuleFile(module) {
  return `import { Module } from '@nestjs/common';
import { ${module.name.charAt(0).toUpperCase() + module.name.slice(1)}Controller } from './${module.name}.controller';
import { ${module.name.charAt(0).toUpperCase() + module.name.slice(1)}Service } from './${module.name}.service';

@Module({
  controllers: [${module.name.charAt(0).toUpperCase() + module.name.slice(1)}Controller],
  providers: [${module.name.charAt(0).toUpperCase() + module.name.slice(1)}Service],
  exports: [${module.name.charAt(0).toUpperCase() + module.name.slice(1)}Service],
})
export class ${module.name.charAt(0).toUpperCase() + module.name.slice(1)}Module {}
`;
}

function generateControllerFile(module) {
  const className = module.name.charAt(0).toUpperCase() + module.name.slice(1);
  const endpoints = module.endpoints.map(endpoint => {
    const [method, path, description] = endpoint.split(' - ');
    const httpMethod = method.toLowerCase();
    const route = path.split(' ')[1];
    const methodName = route.split('/').pop().replace(':', '');

    return `  @${method}('${route}')
  async ${methodName}() {
    return this.${module.name}Service.${methodName}();
  }`;
  }).join('\n\n');

  return `import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { ${className}Service } from './${module.name}.service';

@Controller('${module.name}')
export class ${className}Controller {
  constructor(private readonly ${module.name}Service: ${className}Service) {}

${endpoints}
}
`;
}

function generateServiceFile(module) {
  const className = module.name.charAt(0).toUpperCase() + module.name.slice(1);
  const methods = module.endpoints.map(endpoint => {
    const [method, path] = endpoint.split(' - ');
    const route = path.split(' ')[1];
    const methodName = route.split('/').pop().replace(':', '');

    return `  async ${methodName}() {
    // TODO: Implement ${methodName} logic
    return { message: '${methodName} endpoint - ${module.description}' };
  }`;
  }).join('\n\n');

  return `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${className}Service {
${methods}
}
`;
}

// Main execution
function main() {
  console.log('🚀 Creating Management Features...');
  createManagementModules();
  console.log('\n✅ Management features created successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Import the new modules in app.module.ts');
  console.log('2. Run database migrations if needed');
  console.log('3. Test the new endpoints');
  console.log('4. Implement business logic in services');
}

// Export for use in other scripts
module.exports = { createManagementModules, createModuleStructure };

// Run if executed directly
if (require.main === module) {
  main();
}
