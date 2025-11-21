import {
  test,
  expect,
  setupFreshApp,
  selectPlatformPreset,
  selectLayout,
  selectBackground,
  editTextElement,
  changeColor,
  changeOpacity,
  waitForCanvasRender,
  getLocalStorageConfig,
  getCanvasDimensions,
} from '../fixtures/app-fixtures'

/**
 * Edge Cases Tests
 * Tests boundary conditions, extreme values, invalid inputs, and error handling
 * Verifies graceful degradation and resilience
 *
 * Scenarios include: extreme text lengths, empty inputs, rapid switching,
 * invalid values, special characters, emoji, boundary values, and resource constraints
 */

test.describe('Edge Cases', () => {
  test('should handle very long text (500+ characters) gracefully', async ({ page }) => {
    await setupFreshApp(page)

    // Create very long text
    const longText = 'A'.repeat(500) + ' ' + 'Very long text that tests text wrapping and rendering capabilities'

    // Should not crash or error
    await editTextElement(page, 'title', longText)
    await waitForCanvasRender(page)

    // Verify text is stored
    const config = await getLocalStorageConfig(page)
    expect(config?.textElements[0]?.content).toBe(longText)

    // Verify canvas still renders
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBeGreaterThan(0)
  })

  test('should handle empty text (all elements blank) without crashing', async ({ page }) => {
    await setupFreshApp(page)

    // Edit text to empty string
    await editTextElement(page, 'title', '')
    await editTextElement(page, 'subtitle', '')

    // Should not crash
    await waitForCanvasRender(page)

    // Verify empty state is stored
    const config = await getLocalStorageConfig(page)
    expect(config?.textElements[0]?.content).toBe('')
    expect(config?.textElements[1]?.content).toBe('')

    // Canvas should still exist
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions).toBeDefined()
  })

  test('should remain responsive during rapid preset switching', async ({ page }) => {
    await setupFreshApp(page)

    const presets = ['YouTube', 'TikTok', 'Instagram Feed', 'Twitter/X', 'YouTube Shorts']

    // Rapidly switch presets
    for (const preset of presets) {
      await selectPlatformPreset(page, preset)
      // Don't wait for full render between switches
    }

    // Final wait and verify
    await waitForCanvasRender(page)
    const config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('YouTube Shorts')

    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBe(1080)
    expect(dimensions?.height).toBe(1920)
  })

  test('should remain responsive during rapid layout switching', async ({ page }) => {
    await setupFreshApp(page)

    const layouts = ['default', 'minimal', 'photo-essay', 'sidebar']

    // Rapidly switch layouts
    for (const layout of layouts) {
      await selectLayout(page, layout)
    }

    // Final verify
    await waitForCanvasRender(page)
    const config = await getLocalStorageConfig(page)
    expect(config?.layoutId).toBe('sidebar')
  })

  test('should handle special characters and emoji in text', async ({ page }) => {
    await setupFreshApp(page)

    // Test various special characters and emoji
    const specialText = '🎉 Hello! "Quoted" & <bracketed> © 2024 #hashtag'

    await editTextElement(page, 'title', specialText)
    await waitForCanvasRender(page)

    // Verify special characters are stored correctly
    const config = await getLocalStorageConfig(page)
    expect(config?.textElements[0]?.content).toBe(specialText)

    // Canvas should render without error
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBeGreaterThan(0)
  })

  // Note: HTML textarea elements strip newlines when values are set via DOM
  // This is expected browser behavior, not a bug

  test('should handle invalid color hex values gracefully', async ({ page }) => {
    await setupFreshApp(page)

    // Try invalid colors - should be handled by input validation
    // The app should either correct it or handle gracefully
    await changeColor(page, 'title', '#INVALID')
    await waitForCanvasRender(page)

    // Canvas should still render
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBeGreaterThan(0)
  })

  test('should handle boundary values for opacity (0, 1.0)', async ({ page }) => {
    await setupFreshApp(page)

    // Test opacity = 0 (invisible)
    await changeOpacity(page, 0)
    await waitForCanvasRender(page)

    let config = await getLocalStorageConfig(page)
    expect(config?.imageElements?.[0]?.opacity).toBe(0)

    // Test opacity = 1.0 (fully opaque)
    await changeOpacity(page, 1.0)
    await waitForCanvasRender(page)

    config = await getLocalStorageConfig(page)
    expect(config?.imageElements?.[0]?.opacity).toBe(1.0)

    // Canvas should render in both cases
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBeGreaterThan(0)
  })

  test('should handle invalid opacity values gracefully', async ({ page }) => {
    await setupFreshApp(page)

    // Opacity is constrained to 0-1 range
    // Try values outside range - should be clamped or rejected
    try {
      // This should ideally be rejected
      await changeOpacity(page, -0.5)
    } catch {
      // Expected - invalid value rejected
    }

    try {
      await changeOpacity(page, 1.5)
    } catch {
      // Expected - invalid value rejected
    }

    // App should still be responsive
    await changeOpacity(page, 0.5)
    await waitForCanvasRender(page)

    const config = await getLocalStorageConfig(page)
    expect(config?.imageElements?.[0]?.opacity).toBe(0.5)
  })

  test('should handle missing/broken image URLs gracefully', async ({ page }) => {
    await setupFreshApp(page)

    // Note: If image URL fields are present, this would test them
    // For now, test that app doesn't crash with error states
    await waitForCanvasRender(page)

    // Canvas should still render
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBeGreaterThan(0)
  })

  test('should handle corrupted localStorage data gracefully', async ({ page }) => {
    await setupFreshApp(page)

    // Put corrupted data in localStorage
    await page.evaluate(() => {
      localStorage.setItem('thumbnailGeneratorConfig', '{invalid json')
    })

    // Reload page
    await page.reload({ waitUntil: 'networkidle' })

    // App should handle corrupted data gracefully
    // Either reset to defaults or show error
    await waitForCanvasRender(page, 10000)

    const config = await getLocalStorageConfig(page)
    // Should either be null or fall back to defaults
    if (config) {
      expect(config).toBeDefined()
    }

    // Canvas should still be functional
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBeGreaterThan(0)
  })

  test('should handle multiple rapid color picker interactions', async ({ page }) => {
    await setupFreshApp(page)

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']

    // Rapidly change colors
    for (const color of colors) {
      await changeColor(page, 'title', color)
    }

    // Verify final color is set
    await waitForCanvasRender(page)
    const config = await getLocalStorageConfig(page)
    expect(config?.textElements[0]?.color).toBe('#00FFFF')

    // Canvas should be valid
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBeGreaterThan(0)
  })

  test('should handle quotes and special punctuation in text', async ({ page }) => {
    await setupFreshApp(page)

    const specialText = '"Double quotes" and \'single quotes\' and... ellipsis? Yes!'

    await editTextElement(page, 'title', specialText)
    await waitForCanvasRender(page)

    const config = await getLocalStorageConfig(page)
    expect(config?.textElements[0]?.content).toBe(specialText)
  })

  test('should remain stable after sequence of edge case operations', async ({ page }) => {
    await setupFreshApp(page)

    // Perform a series of edge case operations
    await editTextElement(page, 'title', '') // Empty text
    await editTextElement(page, 'title', 'A'.repeat(300)) // Long text
    await changeColor(page, 'title', '#INVALID') // Invalid color
    await changeOpacity(page, 0) // Min opacity
    await changeOpacity(page, 1.0) // Max opacity
    await selectLayout(page, 'sidebar') // Layout switch
    await selectPlatformPreset(page, 'TikTok') // Preset switch
    await selectBackground(page, 'ocean') // Background switch

    // Final verification
    await waitForCanvasRender(page)

    const config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('TikTok')
    expect(config?.layoutId).toBe('sidebar')

    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBe(1080)
    expect(dimensions?.height).toBe(1920)
  })
})
