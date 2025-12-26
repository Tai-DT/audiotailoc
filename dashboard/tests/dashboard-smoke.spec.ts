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

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Loa', slug: 'loa' },
  { id: 'cat-2', name: 'Tai nghe', slug: 'tai-nghe' },
]

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    slug: 'loa-tai-loc-classic',
    name: 'Loa Tài Lộc Classic',
    description: 'Mock product',
    priceCents: 15_000_000_00,
    originalPriceCents: 18_000_000_00,
    images: [],
    categoryId: 'cat-1',
    brand: 'Audio Tài Lộc',
    model: 'Classic',
    sku: 'ATL-CLASSIC-001',
    stockQuantity: 12,
    featured: true,
    isActive: true,
    isDeleted: false,
    viewCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const MOCK_ORDERS = [
  {
    id: 'order-1',
    orderNumber: 'ORD-0001',
    customerName: 'Nguyễn Văn A',
    customerEmail: 'customer@example.com',
    customerPhone: '0900000000',
    totalAmount: 15_000_000_00,
    status: 'PENDING',
    shippingAddress: '123 Đường ABC, TP.HCM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item-1',
        productName: 'Loa Tài Lộc Classic',
        productSlug: 'loa-tai-loc-classic',
        productId: 'prod-1',
        quantity: 1,
        price: 15_000_000_00,
        total: 15_000_000_00,
      },
    ],
  },
]

const MOCK_USERS_LIST = [
  {
    id: 'u-1',
    email: 'user1@example.com',
    name: 'User One',
    role: 'USER',
    createdAt: new Date().toISOString(),
    _count: { orders: 0 },
  },
]

const MOCK_TECHNICIANS = [
  {
    id: 't-1',
    name: 'KTV A',
    email: 'ktv@example.com',
    phone: '0901111111',
    skills: ['Karaoke', 'Amplifier'],
    regions: ['HCM'],
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const MOCK_BANNERS = [
  {
    id: 'b-1',
    title: 'Banner 1',
    subtitle: 'Subtitle',
    description: 'Desc',
    imageUrl: 'https://example.com/banner.jpg',
    mobileImageUrl: 'https://example.com/banner-m.jpg',
    linkUrl: '/products',
    buttonLabel: 'Xem ngay',
    page: 'home',
    position: 0,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

async function installAuth(page: Page) {
  await page.addInitScript((token: string) => {
    localStorage.setItem('accessToken', token)
    localStorage.removeItem('refreshToken')
  }, 'test-token-abc')
}

async function installMocks(page: Page) {
  // Silence internal debug logging to avoid filesystem side-effects in tests.
  await page.route('**/api/debug-log', async (route) => {
    await route.fulfill({ status: 204, body: '' })
  })

  // Internal Next.js API routes used by a few pages.
  await page.route('**/api/bookings', async (route) => {
    await fulfillJson(route, {
      bookings: [],
      total: 0,
      page: 1,
      pageSize: 20,
    })
  })

  await page.route('**/api/bookings/*', async (route) => {
    const req = route.request()
    const method = req.method()

    if (method === 'GET') {
      await fulfillJson(route, {
        id: 'booking-1',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0900000000',
        customerAddress: '123 Đường ABC, TP.HCM',
        service: { name: 'Sửa chữa âm thanh', serviceType: { name: 'Dịch vụ' } },
        technician: { name: 'KTV A' },
        scheduledDate: new Date().toISOString(),
        scheduledTime: '10:00',
        status: 'pending',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      return
    }

    // PUT/DELETE -> success
    await route.fulfill({ status: 204, body: '' })
  })

  await page.route('**/api/services', async (route) => {
    await fulfillJson(route, {
      success: true,
      data: {
        services: [
          { id: 'service-1', name: 'Sửa chữa âm thanh', slug: 'audio-repair' },
        ],
      },
    })
  })

  await page.route('**/api/technicians', async (route) => {
    await fulfillJson(route, {
      success: true,
      data: {
        technicians: MOCK_TECHNICIANS,
      },
    })
  })

  await page.route('**/api/users', async (route) => {
    await fulfillJson(route, {
      success: true,
      data: [
        { id: 'mock-1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567' },
      ],
    })
  })

  await page.route('**/api/upload', async (route) => {
    // Used by ImageUpload component; return a fake URL.
    await fulfillJson(route, { url: 'https://example.com/uploaded.png' })
  })

  // Backend API (used by most dashboard pages).
  await page.route('**/api/v1/**', async (route) => {
    const req = route.request()
    const url = new URL(req.url())
    const method = req.method()
    const pathname = url.pathname
    const pathWithQuery = `${pathname}${url.search}`

    // Auth
    if (pathname.endsWith('/auth/me')) {
      await fulfillJson(route, ok(MOCK_USER, pathWithQuery, method))
      return
    }

    // Orders
    if (pathname.endsWith('/orders') && method === 'GET') {
      await fulfillJson(route, ok({ items: MOCK_ORDERS, total: MOCK_ORDERS.length, page: 1, pageSize: 10 }, pathWithQuery, method))
      return
    }
    if (pathname.endsWith('/orders') && method === 'POST') {
      await fulfillJson(route, ok({ id: 'order-new' }, pathWithQuery, method))
      return
    }
    if (pathname.includes('/orders/') && method === 'PATCH') {
      await fulfillJson(route, ok({ updated: true }, pathWithQuery, method))
      return
    }

    // Catalog: categories
    if (pathname.includes('/catalog/categories') && method === 'GET') {
      await fulfillJson(route, ok(MOCK_CATEGORIES, pathWithQuery, method))
      return
    }

    // Catalog: products
    if (pathname.includes('/catalog/products/check-sku/') && method === 'GET') {
      await fulfillJson(route, ok(false, pathWithQuery, method))
      return
    }
    if (pathname.includes('/catalog/generate-sku') && method === 'GET') {
      await fulfillJson(route, ok('ATL-AUTO-001', pathWithQuery, method))
      return
    }
    if (pathname.includes('/catalog/products') && method === 'GET') {
      await fulfillJson(route, ok({ items: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length, page: 1, pageSize: 10000 }, pathWithQuery, method))
      return
    }
    if (pathname.endsWith('/catalog/products') && method === 'POST') {
      await fulfillJson(route, ok({ id: 'prod-new' }, pathWithQuery, method))
      return
    }
    if (pathname.includes('/catalog/products/') && method === 'PATCH') {
      await fulfillJson(route, ok({ updated: true }, pathWithQuery, method))
      return
    }

    // Users
    if (pathname.endsWith('/users') && method === 'GET') {
      await fulfillJson(route, ok({ users: MOCK_USERS_LIST, pagination: { total: MOCK_USERS_LIST.length } }, pathWithQuery, method))
      return
    }
    if (pathname.endsWith('/users') && method === 'POST') {
      await fulfillJson(route, ok({ id: 'u-new' }, pathWithQuery, method))
      return
    }

    // Technicians
    if (pathname.endsWith('/technicians') && method === 'GET') {
      await fulfillJson(route, ok({ items: MOCK_TECHNICIANS }, pathWithQuery, method))
      return
    }

    // Banners
    if (pathname.includes('/content/banners') && method === 'GET') {
      await fulfillJson(
        route,
        ok(
          {
            items: MOCK_BANNERS,
            total: MOCK_BANNERS.length,
            page: 1,
            pageSize: 20,
            totalPages: 1,
          },
          pathWithQuery,
          method
        )
      )
      return
    }
    if (pathname.includes('/admin/banners') && (method === 'POST' || method === 'PATCH' || method === 'DELETE')) {
      await fulfillJson(route, ok({ ok: true }, pathWithQuery, method))
      return
    }

    // Inventory
    if (pathname.includes('/inventory') && method === 'GET') {
      await fulfillJson(route, ok({ items: [] }, pathWithQuery, method))
      return
    }

    // Services & types
    if (pathname.endsWith('/services') && method === 'GET') {
      await fulfillJson(route, ok({ services: [] }, pathWithQuery, method))
      return
    }
    if (pathname.includes('/service-types') && method === 'GET') {
      await fulfillJson(route, ok([{ id: 'st-1', name: 'Dịch vụ', slug: 'dich-vu', isActive: true, sortOrder: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }], pathWithQuery, method))
      return
    }

    // Payments
    if (pathname.startsWith('/api/v1/payments') && method === 'GET') {
      if (pathname.endsWith('/payments/stats')) {
        await fulfillJson(route, ok({ totalPayments: 0, totalRevenue: 0, pendingPayments: 0, failedPayments: 0, refundedPayments: 0, refundedAmount: 0 }, pathWithQuery, method))
        return
      }
      await fulfillJson(route, ok({
        payments: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
      }, pathWithQuery, method))
      return
    }

    // Reports
    if (pathname.startsWith('/api/v1/reports') && method === 'GET') {
      // Export endpoints return binary in real app; in smoke we just return an empty buffer-like response.
      if (pathname.includes('/reports/export/')) {
        await route.fulfill({ status: 200, body: '' })
        return
      }
      await fulfillJson(route, ok({ data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }, pathWithQuery, method))
      return
    }

    // Analytics (used by dashboard home)
    if (pathname.includes('/analytics/revenue/chart')) {
      await fulfillJson(route, ok({ dates: [], values: [] }, pathWithQuery, method))
      return
    }
    if (pathname.includes('/analytics/growth-metrics')) {
      await fulfillJson(route, ok({ ordersGrowth: 0, customersGrowth: 0 }, pathWithQuery, method))
      return
    }
    if (pathname.includes('/analytics/products/top-selling-real')) {
      await fulfillJson(route, ok([], pathWithQuery, method))
      return
    }
    if (pathname.includes('/analytics/services/bookings-today-real')) {
      await fulfillJson(route, ok({ bookingsToday: 0 }, pathWithQuery, method))
      return
    }

    // Maps geocode for GoongMapAddressPicker
    if (pathname.includes('/maps/geocode') && method === 'GET') {
      await fulfillJson(route, ok({ predictions: [] }, pathWithQuery, method))
      return
    }

    // Default stub
    await fulfillJson(route, ok({}, pathWithQuery, method))
  })
}

const DASHBOARD_ROUTES: string[] = [
  '/dashboard',
  '/dashboard/analytics',
  '/dashboard/backups',
  '/dashboard/banners',
  '/dashboard/bookings',
  '/dashboard/bookings/booking-1',
  '/dashboard/campaigns',
  '/dashboard/categories',
  '/dashboard/customers',
  '/dashboard/email-templates',
  '/dashboard/inventory',
  '/dashboard/messages',
  '/dashboard/notifications',
  '/dashboard/orders',
  '/dashboard/orders/new',
  '/dashboard/payments',
  '/dashboard/products',
  '/dashboard/projects',
  '/dashboard/promotions',
  '/dashboard/reports',
  '/dashboard/reviews',
  '/dashboard/search',
  '/dashboard/services',
  '/dashboard/services/types',
  '/dashboard/settings',
  '/dashboard/support',
  '/dashboard/technicians',
  '/dashboard/users',
]

test.describe('Dashboard smoke: all pages load', () => {
  // Running in serial avoids overwhelming Next dev server compilation.
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    await installAuth(page)
    await installMocks(page)
  })

  for (const route of DASHBOARD_ROUTES) {
    test(`loads ${route}`, async ({ page }) => {
      test.setTimeout(120_000)
      page.setDefaultNavigationTimeout(60_000)
      page.setDefaultTimeout(30_000)

      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 60_000 })

      // Must not be redirected back to login.
      await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 60_000 })

      // Core shell should render.
      await expect(page.locator('main')).toBeVisible({ timeout: 60_000 })

      // Sanity: ensure we didn't hit a Next.js runtime error overlay.
      await expect(page.getByText('Unhandled Runtime Error')).toHaveCount(0)
    })
  }
})




