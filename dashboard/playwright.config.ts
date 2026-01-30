import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001'

export default defineConfig({
  testDir: './tests',
  // Next.js dev server can get overwhelmed when multiple workers compile routes in parallel.
  // Keep smoke runs stable by default; override via PLAYWRIGHT_WORKERS if needed.
  workers: process.env.PLAYWRIGHT_WORKERS ? Number(process.env.PLAYWRIGHT_WORKERS) : 1,
  fullyParallel: false,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: process.env.CI ? false : true,
    timeout: 120_000,
    env: {
      PORT: '3001',
    },
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    headless: true,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
})
