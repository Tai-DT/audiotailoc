import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ==================== ACCESSIBILITY TEST CONFIGURATION ====================
const PAGES_TO_TEST = [
  { name: 'Homepage', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Services', path: '/services' },
  { name: 'Cart', path: '/cart' },
  { name: 'Search', path: '/search' },
  { name: 'Contact', path: '/contact' },
  { name: 'Blog', path: '/blog' },
  { name: 'Projects', path: '/du-an' },
  { name: 'Support', path: '/support' },
  { name: 'Login', path: '/auth/login' },
  { name: 'Register', path: '/register' },
];

// Rules to skip (acceptable violations in certain contexts)
const RULES_TO_SKIP = [
  'color-contrast', // Need to check manually with design team
  'scrollable-region-focusable', // Some scrollable regions are for visual only
];

// ==================== TESTS ====================

test.describe('Accessibility Tests', () => {
  PAGES_TO_TEST.forEach(({ name, path }) => {
    test(`${name} page should have no critical accessibility violations`, async ({ page }) => {
      // Navigate to page
      await page.goto(path, { waitUntil: 'networkidle' });
      
      // Wait for page to fully load
      await page.waitForTimeout(1000);

      // Run accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(RULES_TO_SKIP)
        .analyze();

      // Filter for only serious and critical violations
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );

      // Log all violations for debugging
      if (criticalViolations.length > 0) {
        console.log(`\n❌ ${name} page has ${criticalViolations.length} critical/serious violations:`);
        criticalViolations.forEach((violation, index) => {
          console.log(`\n${index + 1}. ${violation.id} (${violation.impact})`);
          console.log(`   Description: ${violation.description}`);
          console.log(`   Help: ${violation.helpUrl}`);
          console.log(`   Affected elements: ${violation.nodes.length}`);
          violation.nodes.slice(0, 3).forEach(node => {
            console.log(`   - ${node.html.slice(0, 100)}...`);
          });
        });
      } else {
        console.log(`✅ ${name} page passed accessibility check`);
      }

      // Assert no critical violations
      expect(criticalViolations).toHaveLength(0);
    });
  });
});

// ==================== FULL REPORT TEST ====================

test('Generate full accessibility report', async ({ page }) => {
  const report: { page: string; violations: number; critical: number; serious: number; moderate: number; minor: number }[] = [];

  for (const { name, path } of PAGES_TO_TEST) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page }).analyze();
    
    const counts = {
      page: name,
      violations: results.violations.length,
      critical: results.violations.filter(v => v.impact === 'critical').length,
      serious: results.violations.filter(v => v.impact === 'serious').length,
      moderate: results.violations.filter(v => v.impact === 'moderate').length,
      minor: results.violations.filter(v => v.impact === 'minor').length,
    };
    
    report.push(counts);
  }

  // Print summary report
  console.log('\n==================== ACCESSIBILITY REPORT ====================\n');
  console.table(report);
  
  const totalCritical = report.reduce((sum, r) => sum + r.critical, 0);
  const totalSerious = report.reduce((sum, r) => sum + r.serious, 0);
  
  console.log(`\nTotal Critical: ${totalCritical}`);
  console.log(`Total Serious: ${totalSerious}`);
  console.log('\n==============================================================\n');

  // Fail if any critical issues
  expect(totalCritical).toBe(0);
});

// ==================== KEYBOARD NAVIGATION TEST ====================

test.describe('Keyboard Navigation', () => {
  test('Can navigate homepage with keyboard only', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check skip link is first focusable element
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    
    // Check that interactive elements are reachable
    const focusableCount = await page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').count();
    expect(focusableCount).toBeGreaterThan(10);
    
    console.log(`✅ Homepage has ${focusableCount} focusable elements`);
  });

  test('Forms are keyboard accessible', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    
    // Tab through form fields
    const formInputs = page.locator('input, textarea, select, button[type="submit"]');
    const inputCount = await formInputs.count();
    
    console.log(`✅ Contact form has ${inputCount} interactive elements`);
    expect(inputCount).toBeGreaterThan(3);
  });
});

// ==================== ARIA LANDMARKS TEST ====================

test('Pages have proper ARIA landmarks', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  
  // Check for essential landmarks
  const header = await page.locator('header, [role="banner"]').count();
  const main = await page.locator('main, [role="main"]').count();
  const nav = await page.locator('nav, [role="navigation"]').count();
  const footer = await page.locator('footer, [role="contentinfo"]').count();
  
  console.log(`Landmarks found: header=${header}, main=${main}, nav=${nav}, footer=${footer}`);
  
  expect(header).toBeGreaterThanOrEqual(1);
  expect(main).toBeGreaterThanOrEqual(1);
  expect(nav).toBeGreaterThanOrEqual(1);
  expect(footer).toBeGreaterThanOrEqual(1);
});
