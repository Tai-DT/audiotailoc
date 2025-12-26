import { test, expect } from '@playwright/test'

const mockUser = {
  id: 'user-123',
  email: 'demo@audiotailoc.com',
  name: 'Demo User',
  role: 'admin',
}

const mockLoginResponse = {
  success: true,
  data: {
    token: 'test-token-abc',
    user: mockUser,
  },
  message: 'ok',
  timestamp: new Date().toISOString(),
  path: '/auth/login',
  method: 'POST',
}

const mockMeResponse = {
  success: true,
  data: {
    userId: mockUser.id,
    email: mockUser.email,
    role: mockUser.role,
    name: mockUser.name,
  },
  message: 'ok',
  timestamp: new Date().toISOString(),
  path: '/auth/me',
  method: 'GET',
}

test('unauthenticated users are redirected to login with redirect param', async ({ page }) => {
  test.setTimeout(90_000)

  // Ensure this test never depends on a live backend or a previous storage state.
  await page.addInitScript(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  })

  // If something tries to hit the backend, fail fast (no hanging).
  await page.route('**/api/v1/**', async (route) => {
    await route.fulfill({
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Unauthorized' }),
    })
  })
  await page.route('**/api/debug-log', (route) => route.fulfill({ status: 204, body: '' }))

  await page.goto('/dashboard/orders', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/login(\?|$)/, { timeout: 60_000 })

  const currentUrl = new URL(page.url())
  expect(currentUrl.pathname).toBe('/login')
  expect(currentUrl.searchParams.get('redirect')).toBe('/dashboard/orders')
})

test('successful login redirects to requested page and shows user info', async ({ page }) => {
  // Stub all API requests to avoid hitting a live backend
  await page.route('**/api/v1/**', async (route) => {
    const url = route.request().url()

    if (url.includes('/auth/login')) {
      return route.fulfill({
        status: 200,
        body: JSON.stringify(mockLoginResponse),
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (url.endsWith('/auth/me')) {
      return route.fulfill({
        status: 200,
        body: JSON.stringify(mockMeResponse),
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Default stub for other API calls
    return route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true, data: {}, message: 'stubbed' }),
      headers: { 'Content-Type': 'application/json' },
    })
  })

  // Silence debug log requests (best-effort logging in app/layout)
  await page.route('**/api/debug-log', (route) => route.fulfill({ status: 204, body: '' }))

  await page.goto('/login?redirect=/dashboard')

  await page.getByLabel('Email').fill(mockUser.email)
  await page.getByLabel('Mật khẩu').fill('password123')
  await page.getByRole('button', { name: 'Đăng nhập' }).click()

  await expect(page).toHaveURL(/\/dashboard(\?|$)/, { timeout: 60_000 })

  // Avoid strict-mode ambiguity: the user's name appears in multiple places on the page.
  await expect(page.locator('main')).toBeVisible({ timeout: 60_000 })
  await expect(page.getByText('Demo User', { exact: true })).toBeVisible({ timeout: 60_000 })
  await expect(page.getByText(mockUser.email, { exact: true })).toBeVisible({ timeout: 60_000 })
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({ timeout: 60_000 })
})
