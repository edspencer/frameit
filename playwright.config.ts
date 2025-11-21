/* eslint-disable no-undef */
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for FrameIt E2E tests
 * Tests run against the Vite dev server at http://localhost:5173
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Global test timeout (30 seconds)
  timeout: 30 * 1000,

  // Expect timeout for assertions
  expect: {
    timeout: 5000,
  },

  // Global configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 8 : 24,

  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results' }],
    ['junit', { outputFile: 'test-results/test-results.xml' }],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:5173',

    // Screenshot and video on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Trace on failure (for debugging)
    trace: 'on-first-retry',

    // Accept downloads (required for download tests)
    acceptDownloads: true,
  },

  // Web Server configuration - always reuse existing server if available
  // CI workflow starts the server manually before tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },

  // Projects (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Commented out for faster local development
    // Uncomment for full cross-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
})
