import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3001/login');
  });

  test('should login to dashboard successfully', async ({ page }) => {
    // Fill login form
    await page.fill('input[name="email"]', 'admin@audiotailoc.com');
    await page.fill('input[name="password"]', 'Admin1234');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Should redirect to main dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Email hoặc mật khẩu không đúng')).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle session timeout', async ({ page }) => {
    // Login successfully first
    await page.fill('input[name="email"]', 'admin@audiotailoc.com');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Clear session (simulate timeout)
    await page.context().clearCookies();
    
    // Try to access protected page
    await page.goto('http://localhost:3001/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'admin@audiotailoc.com');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should navigate to products section', async ({ page }) => {
    // Navigate to products
    await page.click('text=Sản phẩm');
    
    // Should show products page
    await expect(page.locator('h1')).toContainText('Sản phẩm');
    await expect(page).toHaveURL(/.*products/);
  });

  test('should create new product', async ({ page }) => {
    // Navigate to products
    await page.click('text=Sản phẩm');
    
    // Click add product button
    await page.click('text=Thêm sản phẩm');
    
    // Wait for form to load
    await expect(page.locator('form')).toBeVisible();
    
    // Fill product form
    await page.fill('input[name="name"]', 'Test Product E2E');
    await page.fill('input[name="slug"]', 'test-product-e2e');
    await page.fill('textarea[name="description"]', 'Test product description for E2E testing');
    await page.fill('input[name="price"]', '199.99');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Sản phẩm đã được tạo')).toBeVisible();
    
    // Should redirect back to products list
    await expect(page.locator('h1')).toContainText('Sản phẩm');
  });

  test('should edit existing product', async ({ page }) => {
    // Navigate to products
    await page.click('text=Sản phẩm');
    
    // Find and click edit button for first product
    await page.click('button[aria-label*="edit"]:first-child');
    
    // Wait for edit form to load
    await expect(page.locator('form')).toBeVisible();
    
    // Update product name
    await page.fill('input[name="name"]', 'Updated Product E2E');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Sản phẩm đã được cập nhật')).toBeVisible();
  });

  test('should delete product', async ({ page }) => {
    // Navigate to products
    await page.click('text=Sản phẩm');
    
    // Find and click delete button for first product
    await page.click('button[aria-label*="delete"]:first-child');
    
    // Confirm deletion in dialog
    await page.click('button:has-text("Xóa")');
    
    // Should show success message
    await expect(page.locator('text=Sản phẩm đã được xóa')).toBeVisible();
    
    // Product should be removed from list
    await expect(page.locator('text=Updated Product E2E')).not.toBeVisible();
  });
});

test.describe('File Upload', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'admin@audiotailoc.com');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should upload product image', async ({ page }) => {
    // Navigate to products
    await page.click('text=Sản phẩm');
    
    // Click add product button
    await page.click('text=Thêm sản phẩm');
    
    // Wait for form to load
    await expect(page.locator('form')).toBeVisible();
    
    // Fill basic product info
    await page.fill('input[name="name"]', 'Product with Image');
    await page.fill('input[name="slug"]', 'product-with-image');
    
    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-files/test-image.png');
    
    // Wait for upload to complete
    await expect(page.locator('text=Upload completed')).toBeVisible({ timeout: 30000 });
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Sản phẩm đã được tạo')).toBeVisible();
  });

  test('should handle upload progress', async ({ page }) => {
    // Navigate to products
    await page.click('text=Sản phẩm');
    await page.click('text=Thêm sản phẩm');
    
    // Fill basic info
    await page.fill('input[name="name"]', 'Large File Product');
    await page.fill('input[name="slug"]', 'large-file-product');
    
    // Upload large file to test progress
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-files/large-image.png');
    
    // Should show progress bar
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
    
    // Should show percentage
    await expect(page.locator('text=Uploading')).toBeVisible();
    
    // Wait for progress to complete
    await expect(page.locator('text=100%')).toBeVisible({ timeout: 30000 });
  });

  test('should handle upload errors', async ({ page }) => {
    // Navigate to products
    await page.click('text=Sản phẩm');
    await page.click('text=Thêm sản phẩm');
    
    // Try to upload invalid file type
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-files/invalid-file.txt');
    
    // Should show error message
    await expect(page.locator('text=File type not allowed')).toBeVisible();
    
    // Should not allow form submission
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'admin@audiotailoc.com');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should view users list', async ({ page }) => {
    // Navigate to users
    await page.click('text=Người dùng');
    
    // Should show users table
    await expect(page.locator('h1')).toContainText('Người dùng');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount.greaterThan(0);
  });

  test('should create new user', async ({ page }) => {
    // Navigate to users
    await page.click('text=Người dùng');
    
    // Click add user button
    await page.click('text=Thêm người dùng');
    
    // Wait for form to load
    await expect(page.locator('form')).toBeVisible();
    
    // Fill user form
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="firstName"]', 'New');
    await page.fill('input[name="lastName"]', 'User');
    await page.selectOption('select[name="role"]', 'USER');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Người dùng đã được tạo')).toBeVisible();
  });

  test('should edit user role', async ({ page }) => {
    // Navigate to users
    await page.click('text=Người dùng');
    
    // Find and click edit button for first user
    await page.click('button[aria-label*="edit"]:first-child');
    
    // Wait for edit form to load
    await expect(page.locator('form')).toBeVisible();
    
    // Change user role
    await page.selectOption('select[name="role"]', 'ADMIN');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Người dùng đã được cập nhật')).toBeVisible();
  });
});

test.describe('Dashboard Analytics', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'admin@audiotailoc.com');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should display analytics dashboard', async ({ page }) => {
    // Navigate to analytics
    await page.click('text=Thống kê');
    
    // Should show analytics sections
    await expect(page.locator('h1')).toContainText('Thống kê');
    
    // Should show key metrics
    await expect(page.locator('text=Tổng doanh thu')).toBeVisible();
    await expect(page.locator('text=Số lượng sản phẩm')).toBeVisible();
    await expect(page.locator('text=Người dùng mới')).toBeVisible();
  });

  test('should filter analytics by date range', async ({ page }) => {
    // Navigate to analytics
    await page.click('text=Thống kê');
    
    // Select date range
    await page.click('input[placeholder*="Từ ngày"]');
    await page.fill('input[placeholder*="Từ ngày"]', '2024-01-01');
    
    await page.click('input[placeholder*="Đến ngày"]');
    await page.fill('input[placeholder*="Đến ngày"]', '2024-12-31');
    
    // Apply filter
    await page.click('button:has-text("Lọc")');
    
    // Should update analytics
    await expect(page.locator('text=Đang tải dữ liệu')).toBeVisible();
    await expect(page.locator('text=Thống kê theo khoảng thời gian')).toBeVisible();
  });

  test('should export analytics data', async ({ page }) => {
    // Navigate to analytics
    await page.click('text=Thống kê');
    
    // Click export button
    await page.click('button:has-text("Xuất báo cáo")');
    
    // Should show export options
    await expect(page.locator('text=Chọn định dạng')).toBeVisible();
    
    // Select PDF export
    await page.click('button:has-text("PDF")');
    
    // Should trigger download
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Tải xuống")');
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});

test.describe('Responsive Design', () => {
  ['desktop', 'tablet', 'mobile'].forEach(device => {
    test(`should work correctly on ${device}`, async ({ page }) => {
      // Set viewport
      if (device === 'mobile') {
        await page.setViewportSize({ width: 375, height: 667 });
      } else if (device === 'tablet') {
        await page.setViewportSize({ width: 768, height: 1024 });
      } else {
        await page.setViewportSize({ width: 1920, height: 1080 });
      }
      
      // Login
      await page.goto('http://localhost:3001/login');
      await page.fill('input[name="email"]', 'admin@audiotailoc.com');
      await page.fill('input[name="password"]', 'Admin1234');
      await page.click('button[type="submit"]');
      await expect(page.locator('h1')).toContainText('Dashboard');
      
      // Check navigation
      await expect(page.locator('nav')).toBeVisible();
      
      // Check main content
      await expect(page.locator('main')).toBeVisible();
      
      if (device === 'mobile') {
        // Should have mobile menu
        await expect(page.locator('button[aria-label*="menu"]')).toBeVisible();
        
        // Navigation might be collapsed
        await expect(page.locator('nav')).toHaveClass(/mobile/);
      } else {
        // Should have full navigation
        await expect(page.locator('nav')).not.toHaveClass(/mobile/);
      }
    });
  });
});

test.describe('Performance', () => {
  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to dashboard
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'admin@audiotailoc.com');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large data sets efficiently', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'admin@audiotailoc.com');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Navigate to products with large dataset
    await page.click('text=Sản phẩm');
    
    const startTime = Date.now();
    
    // Wait for products to load
    await expect(page.locator('table')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Should handle large datasets within reasonable time
    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure by going to invalid URL
    await page.route('**/api/**', route => route.abort());
    
    // Try to login
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'admin@audiotailoc.com');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    
    // Should show network error message
    await expect(page.locator('text=Lỗi mạng')).toBeVisible();
  });

  test('should handle server errors gracefully', async ({ page }) => {
    // Simulate server error
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Try to login
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'admin@audiotailoc.com');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    
    // Should show server error message
    await expect(page.locator('text=Lỗi máy chủ')).toBeVisible();
  });

  test('should provide helpful error messages', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('http://localhost:3001/non-existent-page');
    
    // Should show 404 error
    await expect(page.locator('text=Trang không tồn tại')).toBeVisible();
    
    // Should provide navigation back to home
    await expect(page.locator('button:has-text("Về trang chủ")')).toBeVisible();
  });
});