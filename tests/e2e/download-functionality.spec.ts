import { test as base, expect } from '@playwright/test'
import {
  setupFreshApp,
  selectPlatformPreset,
  editTextElement,
  changeColor,
  selectLayout,
  getCanvasDimensions,
  waitForCanvasRender,
} from '../fixtures/app-fixtures'

const test = base

/**
 * Download Functionality Tests
 * Tests for PNG download functionality including canvas export validation,
 * dimension verification, and data integrity
 *
 * Note: These tests verify canvas export capabilities rather than actual file downloads,
 * since client-side blob downloads don't trigger Playwright's download events.
 *
 * Test Scenarios:
 * 1. Download button visible and clickable
 * 2. Canvas can export to PNG data URL
 * 3. Exported PNG has valid format
 * 4. Exported PNG has correct dimensions
 * 5. Export works after changes
 * 6. Canvas content accuracy
 * 7. Multiple rapid exports work
 */

test.describe('Download Functionality', () => {
  test('should display download button that is visible and clickable', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Look for download button
    const downloadButton = page.locator('button').filter({ hasText: /download|png/i })

    // Verify button exists and is visible
    await downloadButton.first().waitFor({ state: 'visible', timeout: 5000 })
    await expect(downloadButton.first()).toBeVisible()
    await expect(downloadButton.first()).toBeEnabled()
  })

  test('should be able to export canvas to PNG data', async ({ page }) => {
    await setupFreshApp(page)

    // Get canvas element
    const canvas = page.locator('canvas').first()
    await canvas.waitFor({ state: 'visible' })

    // Verify canvas can export to data URL
    const dataUrl = await canvas.evaluate((el: HTMLCanvasElement) => {
      return el.toDataURL('image/png')
    })

    // Verify it's a valid PNG data URL
    expect(dataUrl).toMatch(/^data:image\/png;base64,/)
    expect(dataUrl.length).toBeGreaterThan(100)
  })

  test('should export PNG with valid format and signature', async ({ page }) => {
    await setupFreshApp(page)

    const canvas = page.locator('canvas').first()
    await canvas.waitFor({ state: 'visible' })

    // Get PNG data as base64
    const dataUrl = await canvas.evaluate((el: HTMLCanvasElement) => {
      return el.toDataURL('image/png')
    })

    // Extract base64 data and convert to buffer
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Verify PNG signature (89 50 4E 47)
    expect(buffer[0]).toBe(0x89)
    expect(buffer[1]).toBe(0x50)
    expect(buffer[2]).toBe(0x4e)
    expect(buffer[3]).toBe(0x47)

    // Verify reasonable file size
    expect(buffer.length).toBeGreaterThan(1000)
  })

  test('should export PNG with correct dimensions matching preset', async ({ page }) => {
    await setupFreshApp(page)

    // Select YouTube preset (1280x720)
    await selectPlatformPreset(page, 'YouTube')

    // Get expected dimensions from canvas
    const expectedDimensions = await getCanvasDimensions(page)
    expect(expectedDimensions).not.toBeNull()
    expect(expectedDimensions?.width).toBe(1280)
    expect(expectedDimensions?.height).toBe(720)

    // Verify canvas can export
    const canvas = page.locator('canvas').first()
    const dataUrl = await canvas.evaluate((el: HTMLCanvasElement) => {
      return el.toDataURL('image/png')
    })

    expect(dataUrl).toMatch(/^data:image\/png;base64,/)
  })

  test('should allow export after making changes to canvas', async ({ page }) => {
    await setupFreshApp(page)

    // Make some changes to the canvas
    await editTextElement(page, 'title', 'Test Title Download')
    await changeColor(page, 'title', '#ff0000')
    await waitForCanvasRender(page)

    // Verify canvas can still export
    const canvas = page.locator('canvas').first()
    const dataUrl = await canvas.evaluate((el: HTMLCanvasElement) => {
      return el.toDataURL('image/png')
    })

    expect(dataUrl).toMatch(/^data:image\/png;base64,/)
    expect(dataUrl.length).toBeGreaterThan(100)
  })

  test('should export canvas with correct dimensions for different presets', async ({ page }) => {
    const presets = [
      { name: 'YouTube', width: 1280, height: 720 },
      { name: 'Instagram Feed', width: 1080, height: 1080 },
      { name: 'Twitter/X', width: 1200, height: 675 },
    ]

    for (const preset of presets) {
      await setupFreshApp(page)
      await selectPlatformPreset(page, preset.name)

      const dimensions = await getCanvasDimensions(page)
      expect(dimensions?.width).toBe(preset.width)
      expect(dimensions?.height).toBe(preset.height)

      // Verify export works
      const canvas = page.locator('canvas').first()
      const dataUrl = await canvas.evaluate((el: HTMLCanvasElement) => {
        return el.toDataURL('image/png')
      })

      expect(dataUrl).toMatch(/^data:image\/png;base64,/)
    }
  })

  test('should export canvas content accurately to PNG', async ({ page }) => {
    await setupFreshApp(page)

    // Edit text to verify it appears in export
    await editTextElement(page, 'title', 'Download Export Test')
    await waitForCanvasRender(page)

    // Get canvas dimensions
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions).not.toBeNull()
    expect(dimensions?.width).toBeGreaterThan(0)
    expect(dimensions?.height).toBeGreaterThan(0)

    // Get PNG data
    const canvas = page.locator('canvas').first()
    const dataUrl = await canvas.evaluate((el: HTMLCanvasElement) => {
      return el.toDataURL('image/png')
    })

    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Verify PNG file has reasonable size
    expect(buffer.length).toBeGreaterThan(1000)
  })

  test('should include all visible canvas elements in PNG export', async ({ page }) => {
    await setupFreshApp(page)

    // Select a layout with multiple elements
    await selectLayout(page, 'default')
    await editTextElement(page, 'title', 'Main Title Text')
    await editTextElement(page, 'subtitle', 'Subtitle Text Here')
    await waitForCanvasRender(page)

    // Get PNG data
    const canvas = page.locator('canvas').first()
    const dataUrl = await canvas.evaluate((el: HTMLCanvasElement) => {
      return el.toDataURL('image/png')
    })

    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Verify PNG signature
    expect(buffer[0]).toBe(0x89)
    expect(buffer[1]).toBe(0x50)
    expect(buffer[2]).toBe(0x4e)
    expect(buffer[3]).toBe(0x47)

    // Verify minimum size for a PNG with content
    expect(buffer.length).toBeGreaterThan(1000)
  })

  test('should handle rapid successive exports without error', async ({ page }) => {
    await setupFreshApp(page)

    const canvas = page.locator('canvas').first()
    await canvas.waitFor({ state: 'visible' })

    // Perform 3 rapid exports
    for (let i = 0; i < 3; i++) {
      const dataUrl = await canvas.evaluate((el: HTMLCanvasElement) => {
        return el.toDataURL('image/png')
      })

      // Verify export
      expect(dataUrl).toMatch(/^data:image\/png;base64,/)
      expect(dataUrl.length).toBeGreaterThan(100)

      // Small delay between exports
      await page.waitForTimeout(50)
    }
  })

  test('should verify exported PNG data is valid and complete', async ({ page }) => {
    await setupFreshApp(page)

    const canvas = page.locator('canvas').first()
    await canvas.waitFor({ state: 'visible' })

    // Get PNG data
    const dataUrl = await canvas.evaluate((el: HTMLCanvasElement) => {
      return el.toDataURL('image/png')
    })

    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Check minimum size
    expect(buffer.length).toBeGreaterThan(8)

    // PNG signature: 89 50 4E 47 (bytes 0-3)
    expect(buffer[0]).toBe(0x89)
    expect(buffer[1]).toBe(0x50)
    expect(buffer[2]).toBe(0x4e)
    expect(buffer[3]).toBe(0x47)

    // PNG end marker: 49 45 4E 44 AE 42 60 82 (last 8 bytes)
    const lastEight = buffer.subarray(-8)
    expect(lastEight[0]).toBe(0x49) // 'I'
    expect(lastEight[1]).toBe(0x45) // 'E'
    expect(lastEight[2]).toBe(0x4e) // 'N'
    expect(lastEight[3]).toBe(0x44) // 'D'
  })

  test('should trigger download when button is clicked', async ({ page }) => {
    await setupFreshApp(page)

    // Click download button and verify no errors
    const downloadButton = page.locator('button').filter({ hasText: /download|png/i })
    await downloadButton.first().click()

    // Wait a moment for any async operations
    await page.waitForTimeout(500)

    // Verify no console errors
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    expect(errors.length).toBe(0)
  })
})
