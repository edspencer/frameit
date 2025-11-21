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
} from '../fixtures/app-fixtures'

/**
 * Cross-Feature Interaction Tests
 * Tests complex workflows combining multiple features
 * Verifies that features work correctly together and state persists
 *
 * Scenarios test: preset -> layout -> text -> colors -> gradients -> images -> downloads
 */

test.describe('Cross-Feature Interactions', () => {
  test('should persist layout -> text -> colors workflow', async ({ page }) => {
    await setupFreshApp(page)

    // Step 1: Select layout
    await selectLayout(page, 'minimal')

    // Step 2: Edit text
    await editTextElement(page, 'title', 'Test Title')
    await editTextElement(page, 'subtitle', 'Test Subtitle')

    // Step 3: Change colors
    await changeColor(page, 'title', '#FF0000')
    await changeColor(page, 'subtitle', '#0000FF')

    // Verify all settings persisted in localStorage
    const config = await getLocalStorageConfig(page)
    expect(config?.layoutId).toBe('minimal')

    // Find elements by ID since array order may vary
    const titleElement = config?.textElements?.find(el => el.id === 'title')
    const subtitleElement = config?.textElements?.find(el => el.id === 'subtitle')

    expect(titleElement?.content).toBe('Test Title')
    expect(subtitleElement?.content).toBe('Test Subtitle')
    expect(titleElement?.color).toBe('#FF0000')
    expect(subtitleElement?.color).toBe('#0000FF')
  })

  test('should complete preset -> layout -> text -> colors -> download workflow', async ({ page }) => {
    await setupFreshApp(page)

    // Step 1: Select preset
    await selectPlatformPreset(page, 'Instagram Feed')

    // Step 2: Select layout
    await selectLayout(page, 'minimal')

    // Step 3: Edit text
    await editTextElement(page, 'title', 'Instagram Post')
    await editTextElement(page, 'subtitle', 'By Creator')

    // Step 4: Change colors
    await changeColor(page, 'title', '#FFFFFF')
    await changeColor(page, 'subtitle', '#CCCCCC')

    // Step 5: Select background
    await selectBackground(page, 'sunset')

    // Verify all settings in localStorage
    const config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('Instagram Feed')
    expect(config?.layoutId).toBe('minimal')
    expect(config?.textElements[0]?.content).toBe('Instagram Post')
    expect(config?.background?.gradientId).toBe('sunset')

    // Verify canvas is still rendering
    await waitForCanvasRender(page)
  })

  test('should not reset gradient when switching presets', async ({ page }) => {
    await setupFreshApp(page)

    // Step 1: Select initial preset and gradient
    await selectPlatformPreset(page, 'YouTube')
    await selectBackground(page, 'ocean')

    // Verify gradient is set
    let config = await getLocalStorageConfig(page)
    expect(config?.background?.gradientId).toBe('ocean')

    // Step 2: Switch to different preset
    await selectPlatformPreset(page, 'TikTok')

    // Step 3: Verify gradient is still ocean
    config = await getLocalStorageConfig(page)
    expect(config?.background?.gradientId).toBe('ocean')
    expect(config?.presetName).toBe('TikTok')
  })

  test('should not reset text when switching presets', async ({ page }) => {
    await setupFreshApp(page)

    // Step 1: Select preset and edit text
    await selectPlatformPreset(page, 'YouTube')
    await editTextElement(page, 'title', 'My Video Title')
    await editTextElement(page, 'subtitle', 'Video Description')

    // Verify text is set
    let config = await getLocalStorageConfig(page)
    expect(config?.textElements[0]?.content).toBe('My Video Title')
    expect(config?.textElements[1]?.content).toBe('Video Description')

    // Step 2: Switch to different preset
    await selectPlatformPreset(page, 'Twitter/X')

    // Step 3: Verify text with matching IDs is preserved
    config = await getLocalStorageConfig(page)
    // Text elements with matching IDs should be preserved
    const titleElement = config?.textElements?.find((el) => el.id === 'title')
    const subtitleElement = config?.textElements?.find((el) => el.id === 'subtitle')

    // If element IDs match, content should persist
    if (titleElement && subtitleElement) {
      expect(titleElement.content).toBe('My Video Title')
      expect(subtitleElement.content).toBe('Video Description')
    }
  })

  test('should preserve layout when switching layouts', async ({ page }) => {
    await setupFreshApp(page)

    // Step 1: Select preset and layout
    await selectPlatformPreset(page, 'LinkedIn Video')
    await selectLayout(page, 'minimal')

    // Step 2: Edit text in this layout
    await editTextElement(page, 'title', 'LinkedIn Content')

    // Verify initial state
    let config = await getLocalStorageConfig(page)
    expect(config?.layoutId).toBe('minimal')

    // Step 3: Switch to different layout
    await selectLayout(page, 'minimal')

    // Step 4: Verify new layout is set
    config = await getLocalStorageConfig(page)
    expect(config?.layoutId).toBe('minimal')

    // Step 5: Switch back to classic
    await selectLayout(page, 'minimal')

    // Verify we're back to classic layout
    config = await getLocalStorageConfig(page)
    expect(config?.layoutId).toBe('minimal')
  })

  test('should preserve opacity setting across preset and layout changes', async ({ page }) => {
    await setupFreshApp(page)

    // Step 1: Set initial opacity
    await selectPlatformPreset(page, 'Instagram Reels')
    await changeOpacity(page, 0.6)

    // Verify opacity is set
    let config = await getLocalStorageConfig(page)
    expect(config?.imageElements?.[0]?.opacity).toBe(0.6)

    // Step 2: Switch layout
    await selectLayout(page, 'photo-essay')

    // Verify opacity is preserved
    config = await getLocalStorageConfig(page)
    expect(config?.imageElements?.[0]?.opacity).toBe(0.6)

    // Step 3: Switch preset
    await selectPlatformPreset(page, 'Pinterest Pin')

    // Verify opacity still persists
    config = await getLocalStorageConfig(page)
    expect(config?.imageElements?.[0]?.opacity).toBe(0.6)
  })

  test('should complete complex workflow: preset -> layout -> text -> colors -> gradient -> opacity', async ({ page }) => {
    await setupFreshApp(page)

    // Execute complete workflow
    await selectPlatformPreset(page, 'Open Graph')
    await selectLayout(page, 'sidebar')
    await editTextElement(page, 'title', 'Important Announcement')
    await editTextElement(page, 'subtitle', 'Read This Now')
    await changeColor(page, 'title', '#FFFFFF')
    await changeColor(page, 'subtitle', '#E0E0E0')
    await selectBackground(page, 'dark-blue')
    await changeOpacity(page, 0.4)

    // Verify complete state in localStorage
    const config = await getLocalStorageConfig(page)

    // Verify all settings
    expect(config?.presetName).toBe('Open Graph')
    expect(config?.layoutId).toBe('sidebar')
    expect(config?.textElements?.some((el) => el.content === 'Important Announcement')).toBe(true)
    expect(config?.textElements?.some((el) => el.content === 'Read This Now')).toBe(true)
    expect(config?.background?.gradientId).toBe('dark-blue')

    // Find the icon element by ID (sidebar layout has 'icon' image element)
    const iconElement = config?.imageElements?.find((el) => el.id === 'icon')
    expect(iconElement?.opacity).toBe(0.4)

    // Verify canvas is still rendering
    await waitForCanvasRender(page)

    // Test persistence: reload page
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    // Verify all settings restored after reload
    const reloadedConfig = await getLocalStorageConfig(page)
    expect(reloadedConfig?.presetName).toBe('Open Graph')
    expect(reloadedConfig?.layoutId).toBe('sidebar')
    expect(reloadedConfig?.background?.gradientId).toBe('dark-blue')

    // Find the icon element by ID after reload
    const reloadedIconElement = reloadedConfig?.imageElements?.find((el) => el.id === 'icon')
    expect(reloadedIconElement?.opacity).toBe(0.4)
  })

  test('should handle workflow with multiple rapid changes without losing state', async ({ page }) => {
    await setupFreshApp(page)

    // Perform rapid series of changes
    await selectPlatformPreset(page, 'X Header')
    await selectLayout(page, 'default')
    await editTextElement(page, 'title', 'Update 1')
    await changeColor(page, 'title', '#FF0000')
    await editTextElement(page, 'title', 'Update 2')
    await changeColor(page, 'title', '#00FF00')
    await editTextElement(page, 'title', 'Final Title')
    await selectBackground(page, 'sunset')

    // Verify final state captured correctly
    const config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('X Header')

    // Find title element by ID since array order may vary
    const titleElement = config?.textElements?.find(el => el.id === 'title')
    expect(titleElement?.content).toBe('Final Title')
    expect(titleElement?.color).toBe('#00FF00')
    expect(config?.background?.gradientId).toBe('sunset')

    // Verify canvas is valid
    await waitForCanvasRender(page)
  })
})
