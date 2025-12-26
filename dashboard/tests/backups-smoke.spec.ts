import { test, expect, type Route, type BrowserContext } from '@playwright/test'

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

async function installAuth(context: BrowserContext) {
  await context.addInitScript((token: string) => {
    localStorage.setItem('accessToken', token)
    localStorage.removeItem('refreshToken')
  }, 'test-token-abc')
}

test('Backups page loads and triggers full backup', async ({ browser }) => {
  test.setTimeout(120_000)
  const context = await browser.newContext()
  await installAuth(context)

  const page = await context.newPage()
  page.setDefaultTimeout(30_000)
  page.setDefaultNavigationTimeout(60_000)

  let fullBackupRequested = false
  let downloadTriggered: { filename: string | null; href: string | null } | null = null

  await page.route('**/api/debug-log', async (route) => {
    await route.fulfill({ status: 204, body: '' })
  })

  await page.route('**/api/v1/**', async (route) => {
    const req = route.request()
    const url = new URL(req.url())
    const method = req.method()
    const pathname = url.pathname
    const pathWithQuery = `${pathname}${url.search}`

    if (pathname.endsWith('/auth/me')) {
      await fulfillJson(route, ok({ userId: 'user-123', email: 'admin@audiotailoc.com', role: 'ADMIN' }, pathWithQuery, method))
      return
    }

    if (pathname.endsWith('/backup/status') && method === 'GET') {
      await fulfillJson(route, ok({
        totalBackups: 1,
        latestBackup: new Date().toISOString(),
        totalSize: 1024,
        failedBackups: 0,
        isBackupInProgress: false,
        nextScheduledBackup: null,
      }, pathWithQuery, method))
      return
    }

    if (pathname.endsWith('/backup/list') && method === 'GET') {
      await fulfillJson(route, ok({
        backups: [
          {
            id: 'b-1',
            type: 'full',
            timestamp: new Date().toISOString(),
            size: 1024,
            status: 'completed',
            path: '/tmp/b-1.backup',
            checksum: 'abc',
          },
        ],
        total: 1,
      }, pathWithQuery, method))
      return
    }

    if (pathname.endsWith('/backup/b-1/download') && method === 'GET') {
      await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': 'Content-Disposition',
          'Content-Disposition': 'attachment; filename="b-1.backup"',
        },
        body: 'backup-binary',
      })
      return
    }

    if (pathname.endsWith('/backup/full') && method === 'POST') {
      fullBackupRequested = true
      await fulfillJson(route, ok({
        success: true,
        backupId: 'b-new',
        path: '/tmp/b-new.backup',
        size: 1024,
        duration: 1,
      }, pathWithQuery, method))
      return
    }

    // Default stub (keeps the dashboard shell stable even if layout triggers extra calls).
    await fulfillJson(route, ok({}, pathWithQuery, method))
  })

  await page.goto('/dashboard/backups', { waitUntil: 'domcontentloaded', timeout: 60_000 })

  // Must not be redirected back to login.
  await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 60_000 })

  await expect(page.getByRole('heading', { name: 'Quản lý Sao lưu' })).toBeVisible({ timeout: 60_000 })
  await expect(page.getByText('Danh sách Backup')).toBeVisible()

  await page.getByRole('button', { name: 'Sao lưu toàn bộ' }).click()
  await expect.poll(() => fullBackupRequested).toBeTruthy()

  // Download should trigger a browser download with filename from Content-Disposition
  await page.evaluate(() => {
    ;(window as any).__download_capture__ = { filename: null as string | null, href: null as string | null }

    const originalAnchorClick = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      try {
        ;(window as any).__download_capture__.filename = this.download || null
        ;(window as any).__download_capture__.href = this.href || null
      } catch {
        // ignore
      }
      return originalAnchorClick.call(this)
    }

    const originalCreateObjectURL = URL.createObjectURL
    try {
      Object.defineProperty(URL, 'createObjectURL', {
        configurable: true,
        value: function (blob: Blob) {
          const url = originalCreateObjectURL.call(URL, blob)
          ;(window as any).__download_capture__.href = url
          return url
        },
      })
    } catch {
      // ignore
    }
  })

  await page.getByRole('button', { name: 'Tải xuống backup' }).click()
  downloadTriggered = await page.evaluate(() => (window as any).__download_capture__)
  expect(downloadTriggered?.filename).toBe('b-1.backup')

  await context.close()
})
