#!/usr/bin/env node

/**
 * Responsive Design Test Script
 * Tests responsive design implementation across components
 */

const fs = require('fs');
const path = require('path');

function analyzeResponsiveDesign() {
  console.log('📱 Responsive Design Analysis');
  console.log('==============================\n');

  const frontendPath = path.join(__dirname, '..', 'frontend');

  // Common responsive patterns to check
  const responsivePatterns = {
    breakpoints: [
      'sm:', 'md:', 'lg:', 'xl:', '2xl:',
      '@media (min-width:', '@media (max-width:'
    ],
    layout: [
      'flex-col', 'flex-row', 'grid-cols-', 'col-span-',
      'w-full', 'w-1/2', 'w-1/3', 'w-1/4'
    ],
    spacing: [
      'px-4', 'px-6', 'px-8', 'py-8', 'py-12', 'py-16'
    ],
    typography: [
      'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'
    ]
  };

  function scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const results = {
        file: path.relative(frontendPath, filePath),
        breakpoints: [],
        layout: [],
        spacing: [],
        typography: []
      };

      // Check for responsive patterns
      responsivePatterns.breakpoints.forEach(pattern => {
        if (content.includes(pattern)) {
          results.breakpoints.push(pattern);
        }
      });

      responsivePatterns.layout.forEach(pattern => {
        if (content.includes(pattern)) {
          results.layout.push(pattern);
        }
      });

      responsivePatterns.spacing.forEach(pattern => {
        if (content.includes(pattern)) {
          results.spacing.push(pattern);
        }
      });

      responsivePatterns.typography.forEach(pattern => {
        if (content.includes(pattern)) {
          results.typography.push(pattern);
        }
      });

      return results;
    } catch (error) {
      return null;
    }
  }

  function scanDirectory(dirPath) {
    const results = [];
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        results.push(...scanDirectory(fullPath));
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        const result = scanFile(fullPath);
        if (result && (result.breakpoints.length > 0 || result.layout.length > 0)) {
          results.push(result);
        }
      }
    }

    return results;
  }

  console.log('🔍 Scanning frontend components...\n');

  const results = scanDirectory(path.join(frontendPath, 'components'));

  // Analyze results
  let totalResponsiveComponents = 0;
  let totalBreakpoints = 0;
  let componentCount = results.length;

  console.log(`📊 Found ${componentCount} responsive components:\n`);

  results.forEach(result => {
    const hasResponsive = result.breakpoints.length > 0 || result.layout.length > 0;
    if (hasResponsive) {
      totalResponsiveComponents++;
      totalBreakpoints += result.breakpoints.length;

      console.log(`✅ ${result.file}`);
      if (result.breakpoints.length > 0) {
        console.log(`   🔹 Breakpoints: ${result.breakpoints.join(', ')}`);
      }
      if (result.layout.length > 0) {
        console.log(`   📐 Layout: ${result.layout.slice(0, 3).join(', ')}${result.layout.length > 3 ? '...' : ''}`);
      }
      console.log('');
    }
  });

  // Summary
  console.log('📈 Responsive Design Summary:');
  console.log(`   • Total Components: ${componentCount}`);
  console.log(`   • Responsive Components: ${totalResponsiveComponents}`);
  console.log(`   • Total Breakpoints Used: ${totalBreakpoints}`);
  console.log(`   • Coverage: ${((totalResponsiveComponents / componentCount) * 100).toFixed(1)}%\n`);

  // Check key components
  const keyComponents = [
    'Navbar', 'ProductCard', 'SearchSuggestions', 'RealTimeChatWidget'
  ];

  console.log('🎯 Key Components Status:');
  keyComponents.forEach(component => {
    const found = results.some(r => r.file.includes(component));
    console.log(`   ${found ? '✅' : '❌'} ${component}`);
  });
  console.log('');

  // Recommendations
  console.log('💡 Recommendations:');
  if (totalResponsiveComponents / componentCount < 0.8) {
    console.log('   • Consider adding more responsive classes to components');
  }
  console.log('   • Test on different screen sizes (mobile, tablet, desktop)');
  console.log('   • Verify touch targets are at least 44px');
  console.log('   • Check text readability on small screens');
  console.log('   • Test navigation on mobile devices');
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Error during analysis:', error.message);
  process.exit(1);
});

// Run analysis
analyzeResponsiveDesign();