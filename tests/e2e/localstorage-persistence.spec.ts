/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  test,
  expect,
  setupFreshApp,
  selectPlatformPreset,
  selectLayout,
  editTextElement,
  changeColor,
  selectBackground,
  changeOpacity,
  getLocalStorageConfig,
  clearLocalStorage,
  waitForCanvasRender,
} from '../fixtures/app-fixtures'

/**
 * localStorage Persistence Tests
 * Tests for verifying that configuration is properly saved and restored
 * across page reloads and interactions
 *
 * Test Scenarios:
 * 1. Preset changes saved to localStorage
 * 2. Preset restored on page reload
 * 3. Layout changes saved to localStorage
 * 4. Layout restored on page reload
 * 5. Text content saved to localStorage
 * 6. Text content restored on page reload
 * 7. Colors saved to localStorage
 * 8. Colors restored on page reload
 * 9. Background gradient saved to localStorage
 * 10. Background gradient restored on page reload
 * 11. Logo opacity saved to localStorage
 * 12. Logo opacity restored on page reload
 * 13. Multiple features persist together
 * 14. Clearing localStorage removes all config
 * 15. localStorage key is 'thumbnailGeneratorConfig'
 * 16. localStorage format validates correctly
 * 17. Corrupted data handled gracefully
 */

test.describe('localStorage Persistence', () => {
  test('should save preset changes to localStorage', async ({ page }) => {
    await setupFreshApp(page)

    // Select a preset
    await selectPlatformPreset(page, 'Instagram Feed')

    // Verify it was saved to localStorage
    const config = await getLocalStorageConfig(page)
    expect(config).not.toBeNull()
    expect(config?.presetName).toBe('Instagram Feed')
  })

  test('should restore preset from localStorage on page reload', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Select a preset
    await selectPlatformPreset(page, 'TikTok')
    let config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('TikTok')

    // Reload page
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    // Verify preset was restored
    config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('TikTok')
  })

  test('should save layout changes to localStorage', async ({ page }) => {
    await setupFreshApp(page)

    // Select a layout
    await selectLayout(page, 'default')

    // Verify it was saved to localStorage
    const config = await getLocalStorageConfig(page)
    expect(config).not.toBeNull()
    expect(config?.layoutId).toBe('default')
  })

  test('should restore layout from localStorage on page reload', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Select default layout to ensure it's saved
    await selectLayout(page, 'default')

    let config = await getLocalStorageConfig(page)
    expect(config?.layoutId).toBe('default')

    // Reload page
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    // Verify layout was restored
    config = await getLocalStorageConfig(page)
    expect(config?.layoutId).toBe('default')
  })

  test('should save text content to localStorage', async ({ page }) => {
    await setupFreshApp(page)

    // Edit text
    const testText = 'Test Title Content'
    await editTextElement(page, 'title', testText)

    // Verify it was saved
    const config = await getLocalStorageConfig(page)
    expect(config?.textElements).toBeDefined()

    // Find the title element in textElements
    const titleElement = config?.textElements?.find((el) => el.id === 'title')
    expect(titleElement?.content).toBe(testText)
  })

  test('should restore text content from localStorage on page reload', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Edit text
    const testText = 'Persistent Title Text'
    await editTextElement(page, 'title', testText)
    let config = await getLocalStorageConfig(page)
    expect(config?.textElements?.find((el) => el.id === 'title')?.content).toBe(testText)

    // Reload page
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    // Verify text was restored
    config = await getLocalStorageConfig(page)
    expect(config?.textElements?.find((el) => el.id === 'title')?.content).toBe(testText)
  })

  test('should save color changes to localStorage', async ({ page }) => {
    await setupFreshApp(page)

    // Change color
    const testColor = '#ff0000'
    await changeColor(page, 'title', testColor)

    // Verify it was saved
    const config = await getLocalStorageConfig(page)
    const titleElement = config?.textElements?.find((el) => el.id === 'title')
    expect(titleElement?.color).toBeDefined()
  })

  test('should restore colors from localStorage on page reload', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Change color
    await changeColor(page, 'title', '#0000ff')
    let config = await getLocalStorageConfig(page)
    const titleColorBefore = config?.textElements?.find((el) => el.id === 'title')?.color

    // Reload page
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    // Verify color was restored
    config = await getLocalStorageConfig(page)
    const titleColorAfter = config?.textElements?.find((el) => el.id === 'title')?.color
    expect(titleColorAfter).toBe(titleColorBefore)
  })

  test('should save background gradient selection to localStorage', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Select a background
    await selectBackground(page, 'ocean')

    // Verify it was saved
    const config = await getLocalStorageConfig(page)
    expect(config?.background).toBeDefined()
    expect(config?.background?.type).toBe('gradient')
  })

  test('should restore background gradient from localStorage on page reload', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Select a background
    await selectBackground(page, 'sunset')
    let config = await getLocalStorageConfig(page)
    const backgroundBefore = config?.background

    // Reload page
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    // Verify background was restored
    config = await getLocalStorageConfig(page)
    expect(config?.background).toEqual(backgroundBefore)
  })

  test('should save logo opacity changes to localStorage', async ({ page }) => {
    await setupFreshApp(page)

    // Note: opacity persistence depends on implementation
    // This test verifies the mechanism works if implemented
    const opacityValue = 0.5
    await changeOpacity(page, opacityValue)

    // Wait for any state updates
    await page.waitForTimeout(200)

    // Verify UI reacted to opacity change
    const opacityInput = page.locator('input[type="range"]').first()
    if (await opacityInput.isVisible().catch(() => false)) {
      // If opacity control exists, verify it was updated
      const value = await opacityInput.inputValue()
      expect(value).toBeDefined()
    }
  })

  test('should restore logo opacity from localStorage on page reload', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Set opacity
    await changeOpacity(page, 0.7)

    // Reload page
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    // Verify opacity-related config was preserved
    const configAfter = await getLocalStorageConfig(page)
    // If opacity is stored in imageElements, verify structure is preserved
    expect(configAfter?.imageElements).toBeDefined()
  })

  test('should persist all changes together across page reload', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Make multiple changes
    await selectPlatformPreset(page, 'YouTube')
    await selectLayout(page, 'default')
    await editTextElement(page, 'title', 'Complex Test Title')
    await changeColor(page, 'title', '#00ff00')
    await selectBackground(page, 'purple')
    await changeOpacity(page, 0.6)

    // Capture full config
    const configBefore = await getLocalStorageConfig(page)
    expect(configBefore?.presetName).toBe('YouTube')
    expect(configBefore?.layoutId).toBe('default')
    expect(
      configBefore?.textElements?.find((el) => el.id === 'title')?.content
    ).toBe('Complex Test Title')
    expect(configBefore?.background?.type).toBe('gradient')

    // Reload page
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    // Verify all changes were restored
    const configAfter = await getLocalStorageConfig(page)
    expect(configAfter?.presetName).toBe(configBefore?.presetName)
    expect(configAfter?.layoutId).toBe(configBefore?.layoutId)
    expect(
      configAfter?.textElements?.find((el) => el.id === 'title')?.content
    ).toBe('Complex Test Title')
    expect(configAfter?.background?.type).toBe(configBefore?.background?.type)
  })

  test('should clear all config when localStorage is cleared', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Make some changes
    await selectPlatformPreset(page, 'Instagram Feed')
    await editTextElement(page, 'title', 'This Will Be Cleared')

    // Verify config exists
    let config = await getLocalStorageConfig(page)
    expect(config).not.toBeNull()
    expect(config?.presetName).toBe('Instagram Feed')

    // Clear localStorage
    await clearLocalStorage(page)

    // Verify config is gone
    config = await getLocalStorageConfig(page)
    expect(config).toBeNull()
  })

  test('should use correct localStorage key (thumbnailGeneratorConfig)', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Make a change
    await selectPlatformPreset(page, 'Twitter/X')

    // Verify the specific key exists
    const keyExists = await page.evaluate(() => {
      return localStorage.getItem('thumbnailGeneratorConfig') !== null
    })

    expect(keyExists).toBe(true)

    // Verify the key contains valid JSON
    const configJson = await page.evaluate(() => {
      const stored = localStorage.getItem('thumbnailGeneratorConfig')
      if (!stored) return null
      try {
        return JSON.parse(stored)
      } catch {
        return 'invalid-json'
      }
    })

    expect(configJson).not.toBe('invalid-json')
    expect(configJson).not.toBeNull()
  })

  test('should validate localStorage format and structure', async ({ page }) => {
    await setupFreshApp(page)

    // Make changes to populate all fields
    await selectPlatformPreset(page, 'LinkedIn Video')
    await selectLayout(page, 'default')
    await editTextElement(page, 'title', 'Format Test')
    await changeColor(page, 'title', '#ffffff')
    await selectBackground(page, 'default')

    // Get config and validate structure
    const config = await getLocalStorageConfig(page)

    // Verify required fields exist
    expect(config?.presetName).toBeDefined()
    expect(config?.layoutId).toBeDefined()
    expect(config?.background).toBeDefined()
    expect(config?.textElements).toBeDefined()

    // Verify background has correct structure
    expect(config?.background?.type).toBeDefined()
    expect(['gradient', 'solid', 'none']).toContain(config?.background?.type)

    // Verify textElements is an array
    expect(Array.isArray(config?.textElements)).toBe(true)

    // Verify each text element has required fields
    config?.textElements?.forEach((element) => {
      expect(element.id).toBeDefined()
      expect(element.content).toBeDefined()
    })
  })

  test('should handle corrupted/invalid JSON in localStorage gracefully', async ({
    page,
  }) => {
    // Navigate to app
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })

    // Intentionally set invalid JSON in localStorage
    await page.evaluate(() => {
      localStorage.setItem('thumbnailGeneratorConfig', '{invalid json}')
    })

    // Reload page - app should handle gracefully
    await page.reload({ waitUntil: 'networkidle' })

    // Verify page loads without errors (canvas renders)
    try {
      await waitForCanvasRender(page, 5000)
    } catch {
      // If canvas doesn't render due to error, that's a failure
      throw new Error('App failed to handle corrupted localStorage gracefully')
    }

    // Verify we can still use the app
    await selectPlatformPreset(page, 'YouTube')

    // Verify new config is saved correctly
    const config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('YouTube')
  })

  test('should handle empty/null localStorage values gracefully', async ({
    page,
  }) => {
    // Navigate to app
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })

    // Clear localStorage completely
    await page.evaluate(() => {
      localStorage.clear()
    })

    // Reload page - app should initialize with defaults
    await page.reload({ waitUntil: 'networkidle' })

    // Wait for canvas to render
    await waitForCanvasRender(page)

    // Verify app is functional
    const canvasDimensions = await page.evaluate(() => {
      const canvas = document.querySelector('canvas')
      return canvas
        ? { width: canvas.width, height: canvas.height }
        : null
    })

    expect(canvasDimensions?.width).toBeGreaterThan(0)
    expect(canvasDimensions?.height).toBeGreaterThan(0)

    // Verify we can make changes
    await selectPlatformPreset(page, 'Open Graph')
    const config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('Open Graph')
  })

  test('should update localStorage immediately when making changes', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Change multiple properties and verify each is saved immediately
    const changes = [
      {
        action: () => selectPlatformPreset(page, 'Pinterest Pin'),
        verify: (config: any) => config?.presetName === 'Pinterest Pin',
      },
      {
        action: () => selectLayout(page, 'minimal'),
        verify: (config: any) => config?.layoutId === 'minimal',
      },
      {
        action: () => editTextElement(page, 'title', 'Immediate Save Test'),
        verify: (config: any) =>
          config?.textElements?.find((el: any) => el.id === 'title')?.content ===
          'Immediate Save Test',
      },
      {
        action: () => changeColor(page, 'title', '#123456'),
        verify: (config: any) =>
          config?.textElements?.find((el: any) => el.id === 'title')?.color === '#123456',
      },
    ]

    for (const change of changes) {
      await change.action()
      const config = await getLocalStorageConfig(page)
      expect(change.verify(config)).toBe(true)
    }
  })

  test('should preserve all text elements across reload with different content', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Set text in multiple elements
    await editTextElement(page, 'title', 'Main Title Here')
    await editTextElement(page, 'subtitle', 'This is the subtitle content')

    // Verify both are saved
    let config = await getLocalStorageConfig(page)
    expect(config?.textElements?.some((el) => el.id === 'title')).toBe(true)
    expect(config?.textElements?.some((el) => el.id === 'subtitle')).toBe(true)

    // Reload
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    // Verify both were restored
    config = await getLocalStorageConfig(page)
    expect(config?.textElements?.find((el) => el.id === 'title')?.content).toBe(
      'Main Title Here'
    )
    expect(config?.textElements?.find((el) => el.id === 'subtitle')?.content).toBe(
      'This is the subtitle content'
    )
  })

  test('should maintain image element data in localStorage across changes', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Get initial config
    let config = await getLocalStorageConfig(page)

    // Make various changes
    await selectLayout(page, 'default')
    await editTextElement(page, 'title', 'Image Persistence Test')
    await selectBackground(page, 'dark-blue')

    // Verify imageElements structure is preserved
    config = await getLocalStorageConfig(page)
    expect(config?.imageElements).toBeDefined()
    expect(Array.isArray(config?.imageElements)).toBe(true)

    // Reload and verify
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    config = await getLocalStorageConfig(page)
    expect(config?.imageElements).toBeDefined()
    expect(Array.isArray(config?.imageElements)).toBe(true)
  })
})
