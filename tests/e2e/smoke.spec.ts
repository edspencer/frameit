import { test, expect } from '@playwright/test'

/**
 * Smoke test to verify Playwright infrastructure is working
 * This test will be replaced with actual feature tests in Phase 3+
 */
test.describe('Smoke Tests', () => {
  test('can load the app', async ({ page }) => {
    await page.goto('http://localhost:5173')
    // Just verify the page loaded - we'll add proper assertions in Phase 3
    expect(page).toBeDefined()
  })
})
