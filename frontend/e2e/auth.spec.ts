import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to frontend
    await page.goto('http://localhost:3000');
  });

  test('should register new user successfully', async ({ page }) => {
    // Navigate to register page (assuming there's a register route)
    await page.click('text=Đăng ký');
    
    // Fill registration form
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'StrongPass123!');
    await page.fill('input[name="confirmPassword"]', 'StrongPass123!');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success message or redirect
    await expect(page.locator('text=Đăng ký thành công')).toBeVisible({ timeout: 10000 });
    
    // Should redirect to login or dashboard
    await expect(page).toHaveURL(/.*login|dashboard/);
  });

  test('should show validation errors for weak password', async ({ page }) => {
    await page.click('text=Đăng ký');
    
    // Fill form with weak password
    await page.fill('input[name="email"]', 'weak@example.com');
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    await page.fill('input[name="firstName"]', 'Weak');
    await page.fill('input[name="lastName"]', 'User');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show password validation error
    await expect(page.locator('text=Mật khẩu không đủ mạnh')).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Đăng nhập');
    
    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for successful login
    await expect(page.locator('text=Đăng nhập thành công')).toBeVisible({ timeout: 10000 });
    
    // Should redirect to dashboard or home
    await expect(page).toHaveURL(/.*dashboard|home/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('text=Đăng nhập');
    
    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Email hoặc mật khẩu không đúng')).toBeVisible({ timeout: 5000 });
    
    // Should stay on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle forgot password flow', async ({ page }) => {
    await page.click('text=Đăng nhập');
    
    // Click forgot password link
    await page.click('text=Quên mật khẩu?');
    
    // Fill email for password reset
    await page.fill('input[name="email"]', 'reset@example.com');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Email đặt lại mật khẩu đã được gửi')).toBeVisible({ timeout: 10000 });
  });

  test('should handle remember me functionality', async ({ page, context }) => {
    await page.click('text=Đăng nhập');
    
    // Fill form and check remember me
    await page.fill('input[name="email"]', 'remember@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.check('input[name="rememberMe"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for successful login
    await expect(page.locator('text=Đăng nhập thành công')).toBeVisible({ timeout: 10000 });
    
    // Check if remember me token is stored (longer expiry)
    const cookies = await context.cookies();
    const refreshToken = cookies.find(cookie => cookie.name === 'refreshToken');
    expect(refreshToken).toBeTruthy();
    
    // Check expiry (should be longer for remember me)
    expect(refreshToken?.expires).toBeGreaterThan(Date.now() + 7 * 24 * 60 * 60 * 1000); // More than 7 days
  });
});

test.describe('Protected Routes', () => {
  test.use({ storageState: { cookies: [] } }); // Start with clean state

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access protected route directly
    await page.goto('http://localhost:3000/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should allow access to protected routes after login', async ({ page }) => {
    // First login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'protected@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Đăng nhập thành công')).toBeVisible({ timeout: 10000 });
    
    // Now try to access protected route
    await page.goto('http://localhost:3000/dashboard');
    
    // Should allow access
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});

test.describe('Session Management', () => {
  test('should handle session timeout', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'session@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Đăng nhập thành công')).toBeVisible({ timeout: 10000 });
    
    // Navigate to protected page
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Wait for session to expire (simulate by clearing cookies)
    await page.context().clearCookies();
    
    // Try to access protected page again
    await page.goto('http://localhost:3000/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle concurrent sessions', async ({ page, context }) => {
    // Login in first tab
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'concurrent@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Đăng nhập thành công')).toBeVisible({ timeout: 10000 });
    
    // Open new tab and try to login with same account
    const newPage = await context.newPage();
    await newPage.goto('http://localhost:3000/login');
    await newPage.fill('input[name="email"]', 'concurrent@example.com');
    await newPage.fill('input[name="password"]', 'TestPass123!');
    await newPage.click('button[type="submit"]');
    
    // Should handle concurrent login (either allow or show error)
    await expect(newPage.locator('text=Đăng nhập thành công').or(newPage.locator('text=Tài khoản đã đăng nhập ở nơi khác'))).toBeVisible({ timeout: 10000 });
    
    await newPage.close();
  });
});

test.describe('Responsive Design', () => {
  ['desktop', 'tablet', 'mobile'].forEach(device => {
    test(`should work correctly on ${device}`, async ({ page }) => {
      // Set viewport for device
      if (device === 'mobile') {
        await page.setViewportSize({ width: 375, height: 667 });
      } else if (device === 'tablet') {
        await page.setViewportSize({ width: 768, height: 1024 });
      } else {
        await page.setViewportSize({ width: 1920, height: 1080 });
      }
      
      // Navigate to login page
      await page.goto('http://localhost:3000/login');
      
      // Check if page is responsive
      await expect(page.locator('form')).toBeVisible();
      
      // Check if all form elements are accessible
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      
      // Check if layout adapts to screen size
      const formContainer = page.locator('form').first();
      const boundingBox = await formContainer.boundingBox();
      
      if (device === 'mobile') {
        expect(boundingBox.width).toBeLessThan(400);
      } else if (device === 'tablet') {
        expect(boundingBox.width).toBeGreaterThan(400);
        expect(boundingBox.width).toBeLessThan(900);
      } else {
        expect(boundingBox.width).toBeGreaterThan(800);
      }
    });
  });
});

test.describe('Accessibility', () => {
  test('should meet basic accessibility standards', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for proper form labels
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('aria-label');
    
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('aria-label');
    
    // Check for button accessibility
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveAttribute('type', 'submit');
    
    // Check for keyboard navigation
    await page.keyboard.press('Tab');
    await expect(emailInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(passwordInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(submitButton).toBeFocused();
  });

  test('should support screen readers', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label="Email"]')).toBeVisible();
    await expect(page.locator('[aria-label="Mật khẩu"]')).toBeVisible();
    
    // Check for proper semantic HTML
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('form')).toHaveAttribute('role', 'form');
    
    // Check for error announcements
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');
    
    // Should have error message that's accessible
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
  });
});