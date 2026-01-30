import { test, expect, type Route } from '@playwright/test'

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

test.describe('Reports CSV export', () => {
  test('downloads CSV with filename from Content-Disposition', async ({ page }) => {
    test.setTimeout(90_000)

    // Capture download metadata from the client-side blob download flow.
    await page.addInitScript(() => {
      ;(window as any).__lastDownload = null
      ;(window as any).__blobUrls = []

      const origCreateObjectURL = URL.createObjectURL.bind(URL)
      URL.createObjectURL = (blob: Blob) => {
        ;(window as any).__blobUrls.push({ size: blob.size, type: blob.type })
        return origCreateObjectURL(blob)
      }

      const origCreateElement = document.createElement.bind(document)
      document.createElement = ((tagName: string, options?: any) => {
        const el = origCreateElement(tagName, options)
        if (String(tagName).toLowerCase() === 'a') {
          const a = el as HTMLAnchorElement
          const origClick = a.click.bind(a)
          a.click = () => {
            ;(window as any).__lastDownload = { href: a.href, download: a.download }
            return origClick()
          }
        }
        return el
      }) as any
    })

    // Auth token in localStorage (the app reads accessToken/token).
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'test-token-abc')
      localStorage.removeItem('refreshToken')
    })

    // Silence debug logging endpoint.
    await page.route('**/api/debug-log', async (route) => {
      await route.fulfill({ status: 204, body: '' })
    })

    // Mock backend APIs used by the Reports page.
    await page.route('**/api/v1/**', async (route) => {
      const req = route.request()
      const url = new URL(req.url())
      const pathname = url.pathname
      const method = req.method()
      const pathWithQuery = `${pathname}${url.search}`

      if (pathname.endsWith('/auth/me') && method === 'GET') {
        await fulfillJson(route, ok({ userId: 'user-123', email: 'admin@audiotailoc.com', role: 'ADMIN' }, pathWithQuery, method))
        return
      }

      // List reports (page load)
      if (pathname === '/api/v1/reports' && method === 'GET') {
        await fulfillJson(route, ok({ data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }, pathWithQuery, method))
        return
      }

      // Generate report (quick action)
      if (pathname === '/api/v1/reports' && method === 'POST') {
        await fulfillJson(route, ok({ id: 'report-1' }, pathWithQuery, method), 201)
        return
      }

      // Export sales CSV (download)
      if (pathname === '/api/v1/reports/export/sales/csv' && method === 'GET') {
        const expectedFilename = 'bao-cao-doanh-so-2025-12-22.csv'
        const csv = '\uFEFFMã đơn hàng,Tổng tiền (VNĐ)\nORD-0001,1,000\n'

        await route.fulfill({
          status: 200,
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'Content-Disposition',
            // Use RFC 5987 to exercise filename* parsing.
            'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(expectedFilename)}`,
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
          },
          body: csv,
        })
        return
      }

      // Default stub
      await fulfillJson(route, ok({}, pathWithQuery, method))
    })

    await page.goto('/dashboard/reports', { waitUntil: 'domcontentloaded' })

    // Ensure the page rendered (pick the unique h1 in main).
    await expect(page.getByRole('main').getByRole('heading', { name: 'Báo cáo', exact: true })).toBeVisible({ timeout: 60_000 })

    // Click the Sales quick action explicitly (anchor on the card heading).
    const salesHeading = page.getByRole('heading', { name: 'Báo cáo Doanh số', exact: true })
    const salesCard = salesHeading.locator('..').locator('..')
    await salesCard.getByRole('button', { name: 'Tạo báo cáo', exact: true }).click()

    // Success toast means the download flow completed.
    await expect(page.getByText('Đã bắt đầu tải xuống báo cáo')).toBeVisible({ timeout: 60_000 })

    // Assert the client created a blob URL and attempted a download with a CSV filename.
    await expect
      .poll(async () => page.evaluate(() => (window as any).__blobUrls.length), { timeout: 10_000 })
      .toBeGreaterThan(0)

    const download = await page.evaluate(() => (window as any).__lastDownload)
    expect(download).toBeTruthy()
    expect(download.download).toBe('bao-cao-doanh-so-2025-12-22.csv')
    expect(String(download.href)).toContain('blob:')

    const blobInfo = await page.evaluate(() => (window as any).__blobUrls[0])
    expect(blobInfo.size).toBeGreaterThan(0)
    // When server sends content-type, the Blob should inherit a type.
    expect(String(blobInfo.type)).toContain('text/csv')
  })
})
