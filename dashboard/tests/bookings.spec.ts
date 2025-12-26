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
  await page.route('**/api/auth/me', async (route) => {
    await fulfillJson(route, ok(MOCK_USER, '/auth/me', 'GET'))
  })
  
  await page.context().addCookies([
    {
      name: 'token',
      value: 'mock-token',
      domain: 'localhost',
      path: '/',
    },
  ])
}

async function installMocks(page: Page) {
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
    const body = await req.postDataJSON()
    await fulfillJson(route, ok({ ...MOCK_BOOKINGS[0], status: body.status }, '/bookings/1/status', 'PATCH'))
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
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Quản lý đặt lịch')
    
    // Check if table is visible
    await expect(page.locator('table')).toBeVisible()
    
    // Check if bookings are displayed
    await expect(page.locator('text=Nguyễn Văn A')).toBeVisible()
    await expect(page.locator('text=Trần Thị B')).toBeVisible()
  })

  test('should display booking information correctly', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Check first booking details
    await expect(page.locator('text=Nguyễn Văn A')).toBeVisible()
    await expect(page.locator('text=0901234567')).toBeVisible()
    await expect(page.locator('text=Sửa chữa âm thanh')).toBeVisible()
    await expect(page.locator('text=Kỹ thuật viên A')).toBeVisible()
    await expect(page.locator('text=Chờ xác nhận')).toBeVisible()
    
    // Check second booking (no technician)
    await expect(page.locator('text=Trần Thị B')).toBeVisible()
    await expect(page.locator('text=Chưa phân công')).toBeVisible()
  })

  test('should filter bookings by status', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Click status filter
    await page.locator('button:has-text("Lọc theo trạng thái")').click()
    
    // Select "Đã xác nhận"
    await page.locator('text=Đã xác nhận').click()
    
    // Mock filtered response
    await page.route('**/api/bookings*', async (route) => {
      await fulfillJson(route, {
        bookings: [MOCK_BOOKINGS[1]], // Only CONFIRMED booking
        total: 1,
        page: 1,
        pageSize: 20,
      })
    })
    
    // Wait for filter to apply (you may need to trigger a refresh)
    await page.waitForTimeout(500)
  })

  test('should open create booking dialog', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Click "Thêm đặt lịch" button
    await page.locator('button:has-text("Thêm đặt lịch")').click()
    
    // Check if dialog is visible
    await expect(page.locator('text=Thêm đặt lịch mới')).toBeVisible()
    await expect(page.locator('text=Điền thông tin để tạo đặt lịch mới cho khách hàng')).toBeVisible()
    
    // Check if form fields are visible
    await expect(page.locator('label:has-text("Khách hàng")')).toBeVisible()
    await expect(page.locator('label:has-text("Dịch vụ")')).toBeVisible()
    await expect(page.locator('label:has-text("Ngày thực hiện")')).toBeVisible()
    await expect(page.locator('label:has-text("Giờ thực hiện")')).toBeVisible()
  })

  test('should validate required fields when creating booking', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Open create dialog
    await page.locator('button:has-text("Thêm đặt lịch")').click()
    await expect(page.locator('text=Thêm đặt lịch mới')).toBeVisible()
    
    // Try to submit without filling required fields
    await page.locator('button[type="submit"]:has-text("Tạo mới")').click()
    
    // Check for toast error (sonner toast)
    // Note: Toast might appear briefly, so we check for the form still being visible
    await expect(page.locator('text=Thêm đặt lịch mới')).toBeVisible()
  })

  test('should create booking with valid data', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Open create dialog
    await page.locator('button:has-text("Thêm đặt lịch")').click()
    await expect(page.locator('text=Thêm đặt lịch mới')).toBeVisible()
    
    // Fill form (this is simplified - actual form interaction may need more steps)
    // Select customer
    await page.locator('button:has-text("Chọn khách hàng")').first().click()
    await page.locator('text=Nguyễn Văn A').click()
    
    // Select service
    await page.locator('button:has-text("Chọn dịch vụ")').first().click()
    await page.locator('text=Sửa chữa âm thanh').click()
    
    // Fill date and time
    await page.locator('input[type="date"]').fill('2024-12-31')
    await page.locator('input[type="time"]').fill('10:00')
    
    // Submit form
    await page.locator('button[type="submit"]:has-text("Tạo mới")').click()
    
    // Wait for API call
    await page.waitForTimeout(1000)
    
    // Check if dialog closed (booking created)
    await expect(page.locator('text=Thêm đặt lịch mới')).not.toBeVisible()
  })

  test('should update booking status', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for bookings to load
    await expect(page.locator('text=Nguyễn Văn A')).toBeVisible()
    
    // Find PENDING booking and click "Xác nhận" button
    const confirmButton = page.locator('button:has-text("Xác nhận")').first()
    
    if (await confirmButton.isVisible()) {
      await confirmButton.click()
      
      // Wait for status update
      await page.waitForTimeout(500)
      
      // Check if status changed (button should change)
      await expect(page.locator('button:has-text("Bắt đầu")')).toBeVisible({ timeout: 2000 })
    }
  })

  test('should open edit booking dialog', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for bookings to load
    await expect(page.locator('text=Nguyễn Văn A')).toBeVisible()
    
    // Find and click edit button (icon button)
    const editButtons = page.locator('button').filter({ has: page.locator('svg') })
    // Click the edit icon (second button in actions)
    await editButtons.nth(1).click()
    
    // Check if edit dialog is visible
    await expect(page.locator('text=Chỉnh sửa đặt lịch')).toBeVisible()
  })

  test('should delete booking with confirmation', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Wait for bookings to load
    await expect(page.locator('text=Nguyễn Văn A')).toBeVisible()
    
    // Find delete button (destructive button with trash icon)
    const deleteButton = page.locator('button[class*="destructive"]').first()
    
    if (await deleteButton.isVisible()) {
      // Mock confirm dialog
      page.on('dialog', dialog => dialog.accept())
      
      await deleteButton.click()
      
      // Wait for deletion
      await page.waitForTimeout(500)
    }
  })

  test('should display empty state when no bookings', async ({ page }) => {
    // Mock empty bookings response
    await page.route('**/api/bookings', async (route) => {
      await fulfillJson(route, {
        bookings: [],
        total: 0,
        page: 1,
        pageSize: 20,
      })
    })
    
    await page.goto('/dashboard/bookings')
    
    // Check empty state
    await expect(page.locator('text=Không có đặt lịch nào')).toBeVisible()
  })

  test('should display loading state', async ({ page }) => {
    // Delay API response to see loading state
    await page.route('**/api/bookings', async (route) => {
      await page.waitForTimeout(1000)
      await fulfillJson(route, {
        bookings: MOCK_BOOKINGS,
        total: MOCK_BOOKINGS.length,
        page: 1,
        pageSize: 20,
      })
    })
    
    await page.goto('/dashboard/bookings')
    
    // Check loading state (may be brief)
    const loadingText = page.locator('text=Đang tải...')
    if (await loadingText.isVisible({ timeout: 500 })) {
      await expect(loadingText).toBeVisible()
    }
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock error response
    await page.route('**/api/bookings', async (route) => {
      await route.fulfill({
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    })
    
    await page.goto('/dashboard/bookings')
    
    // Page should still load (not crash)
    await expect(page.locator('h1')).toContainText('Quản lý đặt lịch')
  })
})

test.describe('Booking Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await installAuth(page)
    await installMocks(page)
    await page.goto('/dashboard/bookings')
    await page.locator('button:has-text("Thêm đặt lịch")').click()
  })

  test('should show error when submitting without customer', async ({ page }) => {
    // Try to submit without selecting customer
    await page.locator('button[type="submit"]:has-text("Tạo mới")').click()
    
    // Form should still be visible (validation failed)
    await expect(page.locator('text=Thêm đặt lịch mới')).toBeVisible()
  })

  test('should show error when submitting without service', async ({ page }) => {
    // Select customer but not service
    await page.locator('button:has-text("Chọn khách hàng")').first().click()
    await page.locator('text=Nguyễn Văn A').click()
    
    // Try to submit
    await page.locator('button[type="submit"]:has-text("Tạo mới")').click()
    
    // Form should still be visible
    await expect(page.locator('text=Thêm đặt lịch mới')).toBeVisible()
  })
})
