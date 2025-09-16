const fs = require('fs');
const path = require('path');

const modules = [
  'graceful-shutdown',
  'api-versioning',
  'customer-insights',
  'data-collection'
];

function fixClassName(moduleName) {
  // Convert kebab-case to PascalCase
  const className = moduleName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const moduleDir = path.join(__dirname, '..', 'src', 'modules', moduleName);
  
  // Fix controller
  const controllerPath = path.join(moduleDir, `${moduleName}.controller.ts`);
  if (fs.existsSync(controllerPath)) {
    let content = fs.readFileSync(controllerPath, 'utf8');
    content = content.replace(
      new RegExp(`export class ${moduleName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Controller`, 'g'),
      `export class ${className}Controller`
    );
    content = content.replace(
      new RegExp(`@Controller\\('${moduleName}'\\)`, 'g'),
      `@Controller('${moduleName}')`
    );
    fs.writeFileSync(controllerPath, content);
  }

  // Fix service
  const servicePath = path.join(moduleDir, `${moduleName}.service.ts`);
  if (fs.existsSync(servicePath)) {
    let content = fs.readFileSync(servicePath, 'utf8');
    content = content.replace(
      new RegExp(`export class ${moduleName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Service`, 'g'),
      `export class ${className}Service`
    );
    fs.writeFileSync(servicePath, content);
  }

  // Fix module
  const modulePath = path.join(moduleDir, `${moduleName}.module.ts`);
  if (fs.existsSync(modulePath)) {
    let content = fs.readFileSync(modulePath, 'utf8');
    content = content.replace(
      new RegExp(`import \\{ ${moduleName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Controller \\}`, 'g'),
      `import { ${className}Controller }`
    );
    content = content.replace(
      new RegExp(`import \\{ ${moduleName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Service \\}`, 'g'),
      `import { ${className}Service }`
    );
    content = content.replace(
      new RegExp(`controllers: \\[${moduleName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Controller\\]`, 'g'),
      `controllers: [${className}Controller]`
    );
    content = content.replace(
      new RegExp(`providers: \\[${moduleName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Service\\]`, 'g'),
      `providers: [${className}Service]`
    );
    content = content.replace(
      new RegExp(`exports: \\[${moduleName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Service\\]`, 'g'),
      `exports: [${className}Service]`
    );
    content = content.replace(
      new RegExp(`export class ${moduleName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Module`, 'g'),
      `export class ${className}Module`
    );
    fs.writeFileSync(modulePath, content);
  }

  console.log(`✅ Fixed class names for ${moduleName} module`);
}

// Fix all modules
modules.forEach(fixClassName);

console.log('\n🎉 All class names fixed successfully!');
