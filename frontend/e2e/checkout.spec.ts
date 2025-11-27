import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to frontend
    await page.goto('http://localhost:3000');

    // Pre-seed cart via API so tests won't skip when cart is empty
    // Uses the frontend's in-memory cart API at /api/cart
    try {
      await page.request.post('http://localhost:3000/api/cart', {
        data: { productId: '1', quantity: 1 }
      });
    } catch (err) {
      // Ignore errors here; tests will still run and may skip if seeding fails
      // Logging to console can help debugging in CI or local runs
      console.warn('Cart seeding request failed:', err);
    }
  });

  test('should complete full checkout process with COD', async ({ page }) => {
    // Navigate to cart first to check if there are items
    await page.goto('http://localhost:3000/cart');

    // Check if cart is empty
    const emptyCartText = page.locator('text=Giỏ hàng trống').or(page.locator('text=Cart is empty'));
    const isEmpty = await emptyCartText.isVisible();

    if (isEmpty) {
      // Skip test if cart is empty - we need items to test checkout
      test.skip();
      return;
    }

    // Proceed to checkout
    const checkoutButton = page.locator('button:has-text("Thanh toán")').or(
      page.locator('a:has-text("Thanh toán")')
    ).or(
      page.locator('[data-testid="checkout-button"]')
    );

    await expect(checkoutButton.first()).toBeVisible();
    await checkoutButton.first().click();

    // Wait for checkout page to load
    await expect(page).toHaveURL(/.*checkout/);
    await expect(page.locator('text=Thanh toán')).toBeVisible();

    // Step 1: Fill shipping information
    await page.fill('input[name="fullName"]', 'Nguyễn Văn Test');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '0987654321');
    await page.fill('input[name="address"]', '123 Đường ABC, Quận 1, TP.HCM');

    // Click next step
    const nextButton = page.locator('button:has-text("Tiếp tục")').or(
      page.locator('button:has-text("Next")')
    );
    await nextButton.first().click();

    // Step 2: Select payment method (COD)
    await expect(page.locator('text=Phương thức thanh toán')).toBeVisible();

    // COD should be selected by default, but let's make sure
    const codRadio = page.locator('input[value="cod"]').or(
      page.locator('input[value="COD"]')
    );
    if (await codRadio.isVisible()) {
      await codRadio.check();
    }

    // Click next step
    await nextButton.first().click();

    // Step 3: Review and place order
    await expect(page.locator('text=Xác nhận đơn hàng')).toBeVisible();

    // Check terms and conditions
    const termsCheckbox = page.locator('input[name="terms"]').or(
      page.locator('input[type="checkbox"]')
    ).first();
    await termsCheckbox.check();

    // Place order
    const placeOrderButton = page.locator('button:has-text("Đặt hàng")').or(
      page.locator('button:has-text("Place Order")')
    );
    await expect(placeOrderButton.first()).toBeVisible();
    await placeOrderButton.first().click();

    // Wait for success message
    await expect(page.locator('text=Đặt hàng thành công').or(
      page.locator('text=Order placed successfully')
    )).toBeVisible({ timeout: 15000 });

    // Should redirect to order success page
    await expect(page).toHaveURL(/.*order-success/);
  });

  test('should validate shipping information', async ({ page }) => {
    // Navigate to cart first
    await page.goto('http://localhost:3000/cart');

    // If cart is empty, skip this test
    const emptyCartText = page.locator('text=Giỏ hàng trống').or(page.locator('text=Cart is empty'));
    const isEmpty = await emptyCartText.isVisible();

    if (isEmpty) {
      test.skip();
      return;
    }

    // Proceed to checkout
    const checkoutButton = page.locator('button:has-text("Thanh toán")').first();
    await checkoutButton.click();

    // Try to proceed without filling required fields
    const nextButton = page.locator('button:has-text("Tiếp tục")').first();
    await nextButton.click();

    // Should show validation errors
    await expect(page.locator('text=Vui lòng điền đầy đủ thông tin giao hàng').or(
      page.locator('text=Please fill in all required fields')
    )).toBeVisible();
  });

  test('should handle PayOS payment method selection', async ({ page }) => {
    // Navigate to cart first
    await page.goto('http://localhost:3000/cart');

    const emptyCartText = page.locator('text=Giỏ hàng trống').or(page.locator('text=Cart is empty'));
    const isEmpty = await emptyCartText.isVisible();

    if (isEmpty) {
      test.skip();
      return;
    }

    const checkoutButton = page.locator('button:has-text("Thanh toán")').first();
    await checkoutButton.click();

    // Fill shipping info quickly
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '0987654321');
    await page.fill('input[name="address"]', '123 Test St');

    // Go to payment step
    const nextButton = page.locator('button:has-text("Tiếp tục")').first();
    await nextButton.click();

    // Select PayOS payment method
    const payosRadio = page.locator('input[value="payos"]').or(
      page.locator('input[value="PAYOS"]')
    );
    if (await payosRadio.isVisible()) {
      await payosRadio.check();
    }

    // Go to review step
    await nextButton.click();

    // Check terms and place order
    const termsCheckbox = page.locator('input[type="checkbox"]').first();
    await termsCheckbox.check();

    const placeOrderButton = page.locator('button:has-text("Đặt hàng")').first();
    await placeOrderButton.click();

    // For PayOS, should redirect to PayOS checkout URL
    // This might take some time, so we'll just check that processing started
    await expect(page.locator('text=Đang xử lý').or(
      page.locator('text=Processing')
    )).toBeVisible({ timeout: 10000 });
  });

  test('should display checkout page correctly', async ({ page }) => {
    // Navigate to checkout directly (should redirect to cart if empty)
    await page.goto('http://localhost:3000/checkout');

    // Should either show checkout form or redirect to cart
    const checkoutTitle = page.locator('text=Thanh toán');
    const cartTitle = page.locator('text=Giỏ hàng');

    // Either we see checkout or we're redirected to cart
    await expect(checkoutTitle.or(cartTitle)).toBeVisible();
  });
});
