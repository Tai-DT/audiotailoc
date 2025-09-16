import { test, expect, type Page } from '@playwright/test'

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@audiotailoc.com'
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'Admin123!'
const BASE = process.env.BASE_URL || 'http://localhost:3001'

test.setTimeout(120000)

async function loginIfNeeded(page: Page) {
  // Prefer explicit login page for reliability
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })

  const emailLocator = page.locator('input#email, input[name="email"], input[type="email"]')
  const passLocator = page.locator('input#password, input[name="password"], input[type="password"]')

  // If email input is present, perform login; otherwise assume already authenticated
  if ((await emailLocator.count()) > 0) {
    await emailLocator.fill(ADMIN_EMAIL)
    if ((await passLocator.count()) > 0) {
      await passLocator.fill(ADMIN_PASSWORD)
    }

    const submit = page.getByRole('button', { name: /Đăng nhập|Login|Sign in|Sign In/i }).first()
    if ((await submit.count()) > 0) {
      await submit.click()
    } else {
      await page.keyboard.press('Enter')
    }

    // Wait for dashboard route
    await page.waitForURL('**/dashboard/**', { timeout: 30000 }).catch(() => {})
  }
}

test('product create → view → edit → delete (UI)', async ({ page }: { page: Page }) => {
  await loginIfNeeded(page)

  await page.goto(`${BASE}/dashboard/products`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000) // Wait for auth and page to load
  
  // Debug: take screenshot
  await page.screenshot({ path: 'debug-products.png' })
  
  // Wait for loading to complete
  await page.waitForSelector('button:has-text("Thêm sản phẩm")', { timeout: 30000 }).catch(() => {})

  const name = `E2E Product ${Date.now()}`

  const createButton = page.getByRole('button', { name: /Thêm sản phẩm|Tạo sản phẩm|Add product|New product/i })
  let buttonFound = false
  if ((await createButton.count()) > 0) {
    await expect(createButton.first()).toBeVisible({ timeout: 30000 })
    await createButton.first().click()
    buttonFound = true
  } else {
    // Try alternative selectors
    const altButton = page.locator('button').filter({ hasText: 'Thêm sản phẩm' }).first()
    if ((await altButton.count()) > 0) {
      await expect(altButton).toBeVisible({ timeout: 30000 })
      await altButton.click()
      buttonFound = true
    }
  }
  
  if (!buttonFound) {
    throw new Error('Create product button not found')
  }

  await page.locator('#name').fill(name)
  await page.locator('#price').fill('100000')

  const selectTrigger = page.locator('button').filter({ hasText: /Chọn danh mục|Chọn|Select|Danh mục/i }).first()
  if ((await selectTrigger.count()) > 0) {
    await selectTrigger.click()
    const item = page.locator('text=/\\S+/').nth(0)
    await item.click().catch(() => {})
  } else {
    const nativeSelect = page.locator('select').first()
    if ((await nativeSelect.count()) > 0) {
      await nativeSelect.selectOption({ index: 1 }).catch(() => {})
    }
  }

  const fileInput = page.locator('input[type="file"]')
  if ((await fileInput.count()) > 0) {
    // skip actual upload
  }

  const submitCreate = page.getByRole('button', { name: /Tạo sản phẩm|Create product|Create/i }).first()
  if ((await submitCreate.count()) > 0) {
    await submitCreate.click()
  } else {
    await page.locator('button[type="submit"]').first().click()
  }

  await page.waitForTimeout(1500)
  const createdRow = page.locator(`text=${name}`).first()
  await expect(createdRow).toBeVisible()

  await createdRow.click()
  await page.waitForTimeout(800)

  await expect(page.locator(`text=${name}`).first()).toBeVisible()

  const editBtn = page.getByRole('button', { name: /Cập nhật|Chỉnh sửa|Edit|Update/i }).first()
  if ((await editBtn.count()) > 0) {
    await editBtn.click()
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
  }

  const deleteBtn = page.getByRole('button', { name: /Xóa|Delete|Remove/i }).first()
  if ((await deleteBtn.count()) > 0) {
    await deleteBtn.click()
    const confirm = page.getByRole('button', { name: /Xác nhận|Confirm|Yes|OK/i }).first()
    if ((await confirm.count()) > 0) await confirm.click()
  } else {
    const actionBtn = page.locator('button').filter({ hasText: /Hành động|Action|More/i }).first()
    if ((await actionBtn.count()) > 0) {
      await actionBtn.click()
      const menuDelete = page.getByRole('menuitem', { name: /Xóa|Delete/i }).first()
      if ((await menuDelete.count()) > 0) await menuDelete.click()
      const confirm = page.getByRole('button', { name: /Xác nhận|Confirm|Yes|OK/i }).first()
      if ((await confirm.count()) > 0) await confirm.click()
    }
  }

  await page.waitForTimeout(1000)
  await expect(page.locator(`text=${name}`).first()).toHaveCount(0)
})
