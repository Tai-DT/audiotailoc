import { test, expect, Page } from '@playwright/test'

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'password'
const BASE = process.env.BASE_URL || 'http://127.0.0.1:3001'

test.setTimeout(120000)

async function loginIfNeeded(page: Page) {
  // Navigate to dashboard root (will redirect to login if not authenticated)
  await page.goto(`${BASE}/dashboard/products`, { waitUntil: 'networkidle' })

  // If login page appears, attempt UI login using common selectors / labels.
  const loginFormPresent =
    (await page.locator('text=Đăng nhập vào hệ thống quản lý').count()) ||
    (await page.locator('input[type="email"]').count()) ||
    (await page.locator('input[name="email"]').count())

  if (loginFormPresent) {
    // try a few common selectors
    const email = page.locator('input[type="email"], input[name="email"], input#email')
    const pass = page.locator('input[type="password"], input[name="password"], input#password')

    if ((await email.count()) > 0) await email.fill(ADMIN_EMAIL)
    else await page.fill('input', ADMIN_EMAIL).catch(() => {})

    if ((await pass.count()) > 0) await pass.fill(ADMIN_PASSWORD)

    // submit by button text variants
    const btn = page.getByRole('button', { name: /Đăng nhập|Login|Sign in|Sign In/i })
    if ((await btn.count()) > 0) {
      await btn.first().click()
    } else {
      await page.keyboard.press('Enter')
    }

    // wait for navigation to dashboard
    await page.waitForURL('**/dashboard/**', { timeout: 30000 }).catch(() => {})
  }
}

test('product create → view → edit → delete (UI)', async ({ page }) => {
  await loginIfNeeded(page)

  // Go to products list
  await page.goto(`${BASE}/dashboard/products`, { waitUntil: 'networkidle' })

  const name = `E2E Product ${Date.now()}`
  let nameEdited: string = name

  // Open create dialog (try button text variants)
  const createButton = page.getByRole('button', { name: /Thêm sản phẩm|Tạo sản phẩm|Add product|New product/i })
  if ((await createButton.count()) === 0) {
    // fallback: try button containing "Thêm" or "Tạo"
    await page.locator('button').filter({ hasText: /Thêm|Tạo|Add|New/i }).first().click()
  } else {
    await createButton.first().click()
  }

  // Fill form fields (IDs from product-form-dialog.tsx)
  await page.locator('#name').fill(name)
  await page.locator('#price').fill('100000') // 1000.00 VND shown as 100000 cents logic in UI
  // Category select: open and pick first item
  // The select component is a custom component; attempt common interactions
  const selectTrigger = page.locator('button').filter({ hasText: /Chọn danh mục|Chọn|Select|Danh mục/i }).first()
  if ((await selectTrigger.count()) > 0) {
    await selectTrigger.click()
    // pick the first item in the list
    const item = page.locator('text=/\\S+/').nth(0)
    await item.click().catch(() => {})
  } else {
    // try a native select fallback
    const nativeSelect = page.locator('select').first()
    if ((await nativeSelect.count()) > 0) {
      await nativeSelect.selectOption({ index: 1 }).catch(() => {})
    }
  }

  // optional: upload image via input[type=file] if present (skip if not)
  const fileInput = page.locator('input[type="file"]')
  if ((await fileInput.count()) > 0) {
    // skip actual upload to avoid dependencies
  }

  // Submit create
  const submitCreate = page.getByRole('button', { name: /Tạo sản phẩm|Create product|Create/i }).first()
  if ((await submitCreate.count()) > 0) {
    await submitCreate.click()
  } else {
    // find primary submit button
    await page.locator('button[type="submit"]').first().click()
  }

  // Wait for product to appear in list
  await page.waitForTimeout(1500)
  const createdRow = page.locator(`text=${name}`).first()
  await expect(createdRow).toBeVisible()

  // Open detail (click the product row)
  await createdRow.click()
  // wait for detail dialog or page
  await page.waitForTimeout(800)

  // Verify detail shows name
  await expect(page.locator(`text=${name}`).first()).toBeVisible()

  // Click edit (try to open form with existing selectors)
  const editBtn = page.getByRole('button', { name: /Cập nhật|Chỉnh sửa|Edit|Update/i }).first()
  if ((await editBtn.count()) > 0) {
    await editBtn.click()
    // change name
    const newName = `${name} (edited)`
    await page.locator('#name').fill(newName)
    const saveBtn = page.getByRole('button', { name: /Cập nhật|Update|Save/i }).first()
    if ((await saveBtn.count()) > 0) {
      await saveBtn.click()
    } else {
      await page.locator('button[type="submit"]').first().click()
    }
    await page.waitForTimeout(1000)
    await expect(page.locator(`text=${newName}`).first()).toBeVisible()
    // set name variable to newName for delete step
    nameEdited = newName
  }

  // Delete product: try to find Delete button in detail or actions
  const deleteBtn = page.getByRole('button', { name: /Xóa|Delete|Remove/i }).first()
  if ((await deleteBtn.count()) > 0) {
    await deleteBtn.click()
    // confirm dialog
    const confirm = page.getByRole('button', { name: /Xác nhận|Confirm|Yes|OK/i }).first()
    if ((await confirm.count()) > 0) await confirm.click()
  } else {
    // try action menu
    const actionBtn = page.locator('button').filter({ hasText: /Hành động|Action|More/i }).first()
    if ((await actionBtn.count()) > 0) {
      await actionBtn.click()
      const menuDelete = page.getByRole('menuitem', { name: /Xóa|Delete/i }).first()
      if ((await menuDelete.count()) > 0) await menuDelete.click()
      const confirm = page.getByRole('button', { name: /Xác nhận|Confirm|Yes|OK/i }).first()
      if ((await confirm.count()) > 0) await confirm.click()
    }
  }

  // Wait and assert product no longer visible in list
  await page.waitForTimeout(1000)
  const productNameToCheck = nameEdited || name
  await expect(page.locator(`text=${productNameToCheck}`).first()).toHaveCount(0)
})
