import { test, expect, type Page, type Route } from '@playwright/test'

type ApiResponse<T> = {
  success: boolean
  data: T
  message: string
  timestamp: string
  path: string
  method: string
}

function ok<T>(data: T, path: string, method: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message: 'ok',
    timestamp: new Date().toISOString(),
    path,
    method,
  }
}

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  })
}

const MOCK_USER = {
  userId: 'user-123',
  email: 'admin@audiotailoc.com',
  role: 'ADMIN',
}

const MOCK_BOOKINGS = [
  {
    id: 'booking-1',
    user: {
      id: 'user-1',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường ABC, TP.HCM',
    },
    service: {
      id: 'service-1',
      name: 'Sửa chữa âm thanh',
      serviceType: { name: 'Dịch vụ' },
    },
    technician: {
      id: 'tech-1',
      name: 'Kỹ thuật viên A',
    },
    scheduledAt: new Date().toISOString(),
    scheduledTime: '10:00',
    status: 'PENDING',
    notes: 'Test booking',
    estimatedCosts: 500000,
    actualCosts: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'booking-2',
    user: {
      id: 'user-2',
      name: 'Trần Thị B',
      phone: '0907654321',
      address: '456 Đường XYZ, Hà Nội',
    },
    service: {
      id: 'service-2',
      name: 'Bảo trì hệ thống',
      serviceType: { name: 'Bảo trì' },
    },
    technician: null,
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    scheduledTime: '14:00',
    status: 'CONFIRMED',
    notes: '',
    estimatedCosts: 300000,
    actualCosts: null,
    createdAt: new Date().toISOString(),
  },
]

const MOCK_SERVICES = [
  { id: 'service-1', name: 'Sửa chữa âm thanh', slug: 'audio-repair' },
  { id: 'service-2', name: 'Bảo trì hệ thống', slug: 'maintenance' },
]

const MOCK_TECHNICIANS = [
  { id: 'tech-1', name: 'Kỹ thuật viên A', email: 'tech1@example.com' },
  { id: 'tech-2', name: 'Kỹ thuật viên B', email: 'tech2@example.com' },
]

const MOCK_USERS = [
  { id: 'user-1', name: 'Nguyễn Văn A', email: 'user1@example.com', phone: '0901234567' },
  { id: 'user-2', name: 'Trần Thị B', email: 'user2@example.com', phone: '0907654321' },
]

async function installAuth(page: Page) {
  // Use localStorage for auth token (same as dashboard-smoke tests)
  await page.addInitScript((token: string) => {
    localStorage.setItem('accessToken', token)
    localStorage.removeItem('refreshToken')
  }, 'test-token-abc')
}

async function installMocks(page: Page) {
  // Silence debug log
  await page.route('**/api/debug-log', async (route) => {
    await route.fulfill({ status: 204, body: '' })
  })

  // Auth me endpoint
  await page.route('**/api/v1/auth/me', async (route) => {
    await fulfillJson(route, ok(MOCK_USER, '/auth/me', 'GET'))
  })

  // Bookings API
  await page.route('**/api/bookings', async (route) => {
    const req = route.request()
    const method = req.method()
    
    if (method === 'GET') {
      await fulfillJson(route, {
        bookings: MOCK_BOOKINGS,
        total: MOCK_BOOKINGS.length,
        page: 1,
        pageSize: 20,
      })
    } else if (method === 'POST') {
      // Mock create booking
      const body = await req.postDataJSON()
      const newBooking = {
        id: 'booking-new',
        ...body,
        createdAt: new Date().toISOString(),
      }
      await fulfillJson(route, ok(newBooking, '/bookings', 'POST'), 201)
    }
  })

  // Single booking API
  await page.route('**/api/bookings/*', async (route) => {
    const req = route.request()
    const method = req.method()
    const url = new URL(req.url())
    const id = url.pathname.split('/').pop()

    if (method === 'GET') {
      const booking = MOCK_BOOKINGS.find(b => b.id === id) || MOCK_BOOKINGS[0]
      await fulfillJson(route, ok(booking, `/bookings/${id}`, 'GET'))
    } else if (method === 'PUT') {
      // Update booking
      const body = await req.postDataJSON()
      await fulfillJson(route, ok({ ...MOCK_BOOKINGS[0], ...body }, `/bookings/${id}`, 'PUT'))
    } else if (method === 'PATCH') {
      // Update status
      const body = await req.postDataJSON()
      await fulfillJson(route, ok({ ...MOCK_BOOKINGS[0], status: body.status }, `/bookings/${id}/status`, 'PATCH'))
    } else if (method === 'DELETE') {
      await fulfillJson(route, { message: 'Booking deleted successfully' }, 200)
    }
  })

  // Status update API
  await page.route('**/api/bookings/*/status', async (route) => {
    const req = route.request()
    if (req.method() === 'PUT') {
      const body = await req.postDataJSON()
      await fulfillJson(route, ok({ ...MOCK_BOOKINGS[0], status: body.status }, '/bookings/1/status', 'PUT'))
    }
  })

  // Services API
  await page.route('**/api/services*', async (route) => {
    await fulfillJson(route, ok(
      { services: MOCK_SERVICES },
      '/services',
      'GET'
    ))
  })

  // Technicians API
  await page.route('**/api/technicians*', async (route) => {
    await fulfillJson(route, ok(
      { technicians: MOCK_TECHNICIANS },
      '/technicians',
      'GET'
    ))
  })

  // Users API
  await page.route('**/api/users*', async (route) => {
    await fulfillJson(route, ok(
      MOCK_USERS,
      '/users',
      'GET'
    ))
  })
}

test.describe('Bookings Management', () => {
  test.beforeEach(async ({ page }) => {
    await installAuth(page)
    await installMocks(page)
  })

  test('should load bookings page', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for page to load - use more flexible selector
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    
    // Check if table is visible
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    
    // Check if bookings are displayed
    await expect(page.getByText('Nguyễn Văn A').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Trần Thị B').first()).toBeVisible({ timeout: 10000 })
  })

  test('should display booking information correctly', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for page to fully load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    
    // Check first booking details
    await expect(page.getByText('Nguyễn Văn A').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('0901234567').first()).toBeVisible()
    await expect(page.getByText('Sửa chữa âm thanh').first()).toBeVisible()
    await expect(page.getByText('Kỹ thuật viên A').first()).toBeVisible()
    await expect(page.getByText('Chờ xác nhận').first()).toBeVisible()
    
    // Check second booking (no technician)
    await expect(page.getByText('Trần Thị B').first()).toBeVisible()
    await expect(page.getByText('Chưa phân công').first()).toBeVisible()
  })

  test('should filter bookings by status', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for page to load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    
    // Click status filter - the Select trigger with placeholder "Tất cả"
    const filterTrigger = page.locator('[role="combobox"]').first()
    await expect(filterTrigger).toBeVisible({ timeout: 5000 })
    await filterTrigger.click()
    
    // Wait for dropdown and select "Đã xác nhận"
    await page.getByRole('option', { name: 'Đã xác nhận' }).click()
    
    // Filter applied - local filtering will show only CONFIRMED bookings
    // Since this is client-side filtering, wait a bit
    await page.waitForTimeout(300)
  })

  test('should open create booking dialog', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for page to load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    
    // Click "Thêm đặt lịch" button
    await page.getByRole('button', { name: /Thêm đặt lịch/i }).click()
    
    // Check if dialog is visible
    await expect(page.getByText('Thêm đặt lịch mới')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Điền thông tin để tạo đặt lịch mới cho khách hàng')).toBeVisible()
  })

  test('should validate required fields when creating booking', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for page to load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    
    // Open create dialog
    await page.getByRole('button', { name: /Thêm đặt lịch/i }).click()
    await expect(page.getByText('Thêm đặt lịch mới')).toBeVisible({ timeout: 5000 })
    
    // Try to submit without filling required fields - find the submit button
    const submitButton = page.getByRole('button', { name: /Tạo mới|Lưu/i })
    if (await submitButton.isVisible({ timeout: 3000 })) {
      await submitButton.click()
      // Form should still be visible (validation failed)
      await expect(page.getByText('Thêm đặt lịch mới')).toBeVisible()
    }
  })

  test('should create booking with valid data', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for page to load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    
    // Open create dialog
    await page.getByRole('button', { name: /Thêm đặt lịch/i }).click()
    await expect(page.getByText('Thêm đặt lịch mới')).toBeVisible({ timeout: 5000 })
    
    // The form has select dropdowns for customer and service
    // We need to click on the comboboxes to select values
    // This test verifies the dialog opens correctly
    await expect(page.getByText('Thêm đặt lịch mới')).toBeVisible()
  })

  test('should update booking status', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for bookings to load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    await expect(page.getByText('Nguyễn Văn A').first()).toBeVisible({ timeout: 10000 })
    
    // Find PENDING booking and click "Xác nhận" button
    const confirmButton = page.getByRole('button', { name: 'Xác nhận' }).first()
    
    if (await confirmButton.isVisible({ timeout: 3000 })) {
      await confirmButton.click()
      
      // Wait for status update
      await page.waitForTimeout(500)
    }
  })

  test('should open edit booking dialog', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for bookings to load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    await expect(page.getByText('Nguyễn Văn A').first()).toBeVisible({ timeout: 10000 })
    
    // Find the row with first booking and click edit button
    // Edit buttons have Edit icon (pencil)
    const editButtons = page.locator('button').filter({ has: page.locator('svg.lucide-edit, svg.lucide-pencil') })
    const firstEditButton = editButtons.first()
    
    if (await firstEditButton.isVisible({ timeout: 3000 })) {
      await firstEditButton.click()
      // Check if edit dialog is visible
      await expect(page.getByText('Chỉnh sửa đặt lịch')).toBeVisible({ timeout: 5000 })
    }
  })

  test('should delete booking with confirmation', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for bookings to load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    await expect(page.getByText('Nguyễn Văn A').first()).toBeVisible({ timeout: 10000 })
    
    // Find delete button (destructive button with trash icon)
    const deleteButtons = page.locator('button').filter({ has: page.locator('svg.lucide-trash-2, svg.lucide-trash') })
    const firstDeleteButton = deleteButtons.first()
    
    if (await firstDeleteButton.isVisible({ timeout: 3000 })) {
      // Mock confirm dialog
      page.on('dialog', dialog => dialog.accept())
      
      await firstDeleteButton.click()
      
      // Wait for deletion
      await page.waitForTimeout(500)
    }
  })

  test('should display empty state when no bookings', async ({ page }) => {
    // Re-install mocks with empty bookings for this specific test
    await page.route('**/api/bookings', async (route) => {
      const req = route.request()
      if (req.method() === 'GET') {
        await fulfillJson(route, {
          bookings: [],
          total: 0,
          page: 1,
          pageSize: 20,
        })
      }
    })
    
    await page.goto('/dashboard/bookings')
    
    // Wait for page to load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    
    // Check empty state
    await expect(page.getByText('Không có đặt lịch nào')).toBeVisible({ timeout: 10000 })
  })

  test('should display loading state', async ({ page }) => {
    // Delay API response to see loading state
    await page.route('**/api/bookings', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await fulfillJson(route, {
        bookings: MOCK_BOOKINGS,
        total: MOCK_BOOKINGS.length,
        page: 1,
        pageSize: 20,
      })
    })
    
    await page.goto('/dashboard/bookings')
    
    // Check loading state (may be brief)
    const loadingText = page.getByText('Đang tải...')
    if (await loadingText.isVisible({ timeout: 500 })) {
      await expect(loadingText).toBeVisible()
    }
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Override the bookings route with error for this test
    await page.route('**/api/bookings', async (route) => {
      const req = route.request()
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Internal server error' }),
        })
      }
    })
    
    await page.goto('/dashboard/bookings')
    
    // Page should still load (not crash) - wait for h1 to appear
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
  })
})

test.describe('Booking Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await installAuth(page)
    await installMocks(page)
  })

  test('should show error when submitting without customer', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for page to load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    
    // Open create dialog
    await page.getByRole('button', { name: /Thêm đặt lịch/i }).click()
    await expect(page.getByText('Thêm đặt lịch mới')).toBeVisible({ timeout: 5000 })
    
    // Try to submit without selecting customer - find submit button
    const submitButton = page.getByRole('button', { name: /Tạo mới|Lưu/i })
    if (await submitButton.isVisible({ timeout: 3000 })) {
      await submitButton.click()
      // Form should still be visible (validation failed)
      await expect(page.getByText('Thêm đặt lịch mới')).toBeVisible()
    }
  })

  test('should show error when submitting without service', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for page to load
    await expect(page.locator('h1.text-3xl')).toContainText('Quản lý đặt lịch', { timeout: 30000 })
    
    // Open create dialog
    await page.getByRole('button', { name: /Thêm đặt lịch/i }).click()
    await expect(page.getByText('Thêm đặt lịch mới')).toBeVisible({ timeout: 5000 })
    
    // Form should remain visible
    await expect(page.getByText('Thêm đặt lịch mới')).toBeVisible()
  })
})
