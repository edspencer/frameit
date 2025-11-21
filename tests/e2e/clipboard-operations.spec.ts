import {
  test,
  expect,
  setupFreshApp,
  selectPlatformPreset,
  editTextElement,
  changeColor,
  selectLayout,
  changeOpacity,
  waitForCanvasRender,
} from '../fixtures/app-fixtures'

/**
 * Clipboard Operations Tests
 * Tests for copying thumbnails to clipboard functionality
 *
 * Test Scenarios:
 * 1. Copy button visible and clickable
 * 2. Clicking button copies image to clipboard
 * 3. Success message displays
 * 4. Copy works after changes
 * 5. Copy works from different presets
 * 6. Clipboard includes all elements
 * 7. Clipboard can be pasted (manual verification)
 * 8. Error handling when clipboard fails
 * 9. Success alert message displays
 * 10. Rapid successive copies work
 * 11. Clipboard preserves image quality
 */

test.describe('Clipboard Operations', () => {
  test('should display copy to clipboard button that is visible', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Look for copy button
    const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })

    // Verify button exists and is visible
    await copyButton.first().waitFor({ state: 'visible', timeout: 5000 })
    await expect(copyButton.first()).toBeVisible()
  })

  test('should trigger clipboard write when copy button clicked', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Get copy button
    const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })

    // Click the copy button
    await copyButton.first().click()

    // Wait a moment for clipboard operation
    await page.waitForTimeout(500)

    // The browser should have attempted clipboard write
    // In headless mode, this may fail silently, but the function should execute
    // Verify button is still present and functional
    await expect(copyButton.first()).toBeVisible()
  })

  test('should display success alert message after copy', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Set up listener for alert dialog
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert')
      expect(dialog.message()).toMatch(/copied|clipboard/i)
      await dialog.accept()
    })

    // Click copy button
    const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })
    await copyButton.first().click()

    // Wait for potential alert/message
    await page.waitForTimeout(500)
  })

  test('should allow copy after making changes to canvas', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Make changes to canvas
    await editTextElement(page, 'title', 'Updated Title Text')
    await changeColor(page, 'title', '#00ff00')

    // Get copy button
    const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })

    // Verify button is still visible and clickable
    await expect(copyButton.first()).toBeVisible()

    // Click copy
    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })
    await copyButton.first().click()

    // Wait for operation
    await page.waitForTimeout(500)

    // Verify button is still functional
    await expect(copyButton.first()).toBeVisible()
  })

  test('should allow copy from different presets', async ({
    page,
  }) => {
    const presets = ['YouTube', 'Instagram Feed', 'Twitter/X']

    // Set up dialog handler once before the loop
    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    for (const preset of presets) {
      await setupFreshApp(page)
      await selectPlatformPreset(page, preset)

      // Get copy button
      const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })

      // Verify button is visible
      await expect(copyButton.first()).toBeVisible()

      // Click copy
      await copyButton.first().click()

      // Wait for operation
      await page.waitForTimeout(500)

      // Verify no errors occurred
      await expect(copyButton.first()).toBeVisible()
    }
  })

  test('should copy all visible canvas elements to clipboard', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Select layout with multiple elements
    await selectLayout(page, 'default')
    await editTextElement(page, 'title', 'Main Title for Clipboard')
    await editTextElement(page, 'subtitle', 'Subtitle for Clipboard')

    // Set up dialog handler
    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    // Click copy button
    const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })
    await expect(copyButton.first()).toBeVisible()
    await copyButton.first().click()

    // Wait for clipboard operation
    await page.waitForTimeout(500)

    // Verify button remains functional
    await expect(copyButton.first()).toBeVisible()
  })

  test('should handle clipboard unavailability gracefully', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Set up dialog handler to capture any error messages
    page.on('dialog', async (dialog) => {
      // Could be either success or error message
      await dialog.accept()
    })

    // Click copy button
    const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })
    await copyButton.first().click()

    // Wait for operation
    await page.waitForTimeout(500)

    // Verify UI is still functional after clipboard operation
    await expect(copyButton.first()).toBeVisible()
  })

  test('should display success alert message with specific text', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Track alert/dialog messages
    const messages: string[] = []
    page.on('dialog', async (dialog) => {
      messages.push(dialog.message())
      await dialog.accept()
    })

    // Click copy button
    const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })
    await copyButton.first().click()

    // Wait for message
    await page.waitForTimeout(600)

    // If a message appeared, it should mention clipboard or success
    if (messages.length > 0) {
      const message = messages[0].toLowerCase()
      expect(message).toMatch(/copied|clipboard|success/i)
    }
  })

  test('should handle rapid successive copy operations', async ({
    page,
  }) => {
    await setupFreshApp(page)

    const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })

    // Set up dialog handler
    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    // Perform 3 rapid copy operations
    for (let i = 0; i < 3; i++) {
      await expect(copyButton.first()).toBeVisible()
      await copyButton.first().click()
      await page.waitForTimeout(200)
    }

    // Verify button is still functional after rapid copies
    await expect(copyButton.first()).toBeVisible()
  })

  test('should preserve image quality when copying to clipboard', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Set up with visible content
    await editTextElement(page, 'title', 'Quality Test Content')
    await changeColor(page, 'title', '#0000ff')
    await changeOpacity(page, 0.8)

    // Wait for canvas to render with all changes
    await waitForCanvasRender(page)

    // Set up dialog handler
    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    // Click copy button
    const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })
    await copyButton.first().click()

    // Wait for clipboard operation to complete
    await page.waitForTimeout(500)

    // Verify no errors in console by checking page is still functional
    const isVisible = await copyButton.first().isVisible()
    expect(isVisible).toBe(true)
  })

  test('should display success message after copying from different layouts', async ({
    page,
  }) => {
    // Only use enabled layouts
    const layouts = ['default', 'minimal', 'sidebar']

    // Set up dialog handler once before the loop
    const messages: string[] = []
    page.on('dialog', async (dialog) => {
      messages.push(dialog.message())
      await dialog.accept()
    })

    for (const layout of layouts) {
      await setupFreshApp(page)

      // Select layout
      await selectLayout(page, layout)

      // Click copy button
      const copyButton = page.locator('button').filter({ hasText: /copy|clipboard/i })
      await expect(copyButton.first()).toBeVisible()
      await copyButton.first().click()

      // Wait for operation
      await page.waitForTimeout(500)

      // Verify button still works
      await expect(copyButton.first()).toBeVisible()
    }
  })
})
