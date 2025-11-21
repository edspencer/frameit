import {
  test,
  expect,
  setupFreshApp,
  selectPlatformPreset,
  getCanvasDimensions,
  getLocalStorageConfig,
  waitForCanvasRender,
} from '../fixtures/app-fixtures'

/**
 * Platform Selection Tests
 * Tests for selecting different platform presets and verifying dimensions
 *
 * All 10 platform presets from src/lib/constants.ts:
 * 1. YouTube (1280x720)
 * 2. YouTube Shorts (1080x1920)
 * 3. LinkedIn Video (1200x627)
 * 4. Twitter/X (1200x675)
 * 5. TikTok (1080x1920)
 * 6. Instagram Reels (1080x1920)
 * 7. Open Graph (1200x630)
 * 8. Instagram Feed (1080x1080)
 * 9. X Header (1500x500)
 * 10. Pinterest Pin (1000x1500)
 */

test.describe('Platform Selection', () => {
  test('should display all 10 platform presets as visible buttons', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Check that all 10 presets are visible
    const youtubeButton = page.locator('button:has-text("YouTube")')
    const youtubeShorts = page.locator('button:has-text("YouTube Shorts")')
    const linkedinVideo = page.locator('button:has-text("LinkedIn Video")')
    const twitterX = page.locator('button:has-text("Twitter/X")')
    const tiktok = page.locator('button:has-text("TikTok")')
    const instagramReels = page.locator('button:has-text("Instagram Reels")')
    const openGraph = page.locator('button:has-text("Open Graph")')
    const instagramFeed = page.locator('button:has-text("Instagram Feed")')
    const xHeader = page.locator('button:has-text("X Header")')
    const pinterestPin = page.locator('button:has-text("Pinterest Pin")')

    // Verify all are visible
    await expect(youtubeButton.first()).toBeVisible()
    await expect(youtubeShorts.first()).toBeVisible()
    await expect(linkedinVideo.first()).toBeVisible()
    await expect(twitterX.first()).toBeVisible()
    await expect(tiktok.first()).toBeVisible()
    await expect(instagramReels.first()).toBeVisible()
    await expect(openGraph.first()).toBeVisible()
    await expect(instagramFeed.first()).toBeVisible()
    await expect(xHeader.first()).toBeVisible()
    await expect(pinterestPin.first()).toBeVisible()
  })

  test('should update canvas dimensions when YouTube preset is selected', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Select YouTube preset
    await selectPlatformPreset(page, 'YouTube')

    // Verify canvas dimensions match YouTube (1280x720)
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBe(1280)
    expect(dimensions?.height).toBe(720)
  })

  test('should update canvas dimensions when YouTube Shorts preset is selected', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Select YouTube Shorts preset
    await selectPlatformPreset(page, 'YouTube Shorts')

    // Verify canvas dimensions match YouTube Shorts (1080x1920)
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBe(1080)
    expect(dimensions?.height).toBe(1920)
  })

  test('should update canvas dimensions for all 10 presets correctly', async ({
    page,
  }) => {
    const presets = [
      { name: 'YouTube', width: 1280, height: 720 },
      { name: 'YouTube Shorts', width: 1080, height: 1920 },
      { name: 'LinkedIn Video', width: 1200, height: 627 },
      { name: 'Twitter/X', width: 1200, height: 675 },
      { name: 'TikTok', width: 1080, height: 1920 },
      { name: 'Instagram Reels', width: 1080, height: 1920 },
      { name: 'Open Graph', width: 1200, height: 630 },
      { name: 'Instagram Feed', width: 1080, height: 1080 },
      { name: 'X Header', width: 1500, height: 500 },
      { name: 'Pinterest Pin', width: 1000, height: 1500 },
    ]

    for (const preset of presets) {
      await setupFreshApp(page)
      await selectPlatformPreset(page, preset.name)

      const dimensions = await getCanvasDimensions(page)
      expect(dimensions?.width).toBe(preset.width)
      expect(dimensions?.height).toBe(preset.height)
    }
  })

  test('should change preset button visual state when selected', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Click YouTube to select it
    await selectPlatformPreset(page, 'YouTube')

    // The button should have a selected/active state (this could be a class, data attribute, or styling)
    // For now, we verify the preset persists in localStorage which indicates it was selected
    const config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('YouTube')
  })

  test('should persist preset selection to localStorage', async ({ page }) => {
    await setupFreshApp(page)

    // Select a specific preset
    await selectPlatformPreset(page, 'Instagram Feed')

    // Verify it's in localStorage
    const config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('Instagram Feed')
  })

  test('should restore preset from localStorage on page reload', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Select a preset
    await selectPlatformPreset(page, 'X Header')

    // Verify it's in localStorage
    let config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('X Header')

    // Reload the page
    await page.reload({ waitUntil: 'networkidle' })
    await waitForCanvasRender(page)

    // Verify preset is still selected
    config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('X Header')

    // Verify canvas dimensions are correct
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBe(1500)
    expect(dimensions?.height).toBe(500)
  })

  test('should update canvas dimensions in real-time when switching presets', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Start with YouTube (1280x720)
    await selectPlatformPreset(page, 'YouTube')
    let dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBe(1280)
    expect(dimensions?.height).toBe(720)

    // Switch to Instagram Feed (1080x1080)
    await selectPlatformPreset(page, 'Instagram Feed')
    dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBe(1080)
    expect(dimensions?.height).toBe(1080)

    // Switch to Pinterest Pin (1000x1500)
    await selectPlatformPreset(page, 'Pinterest Pin')
    dimensions = await getCanvasDimensions(page)
    expect(dimensions?.width).toBe(1000)
    expect(dimensions?.height).toBe(1500)
  })

  test('should only have one preset selected at a time', async ({ page }) => {
    await setupFreshApp(page)

    // Select YouTube
    await selectPlatformPreset(page, 'YouTube')
    let config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('YouTube')

    // Select TikTok
    await selectPlatformPreset(page, 'TikTok')
    config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('TikTok')

    // YouTube should no longer be selected
    expect(config?.presetName).not.toBe('YouTube')
  })

  test('should handle switching between video and social categories', async ({
    page,
  }) => {
    await setupFreshApp(page)

    // Select a video preset
    await selectPlatformPreset(page, 'YouTube')
    let config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('YouTube')

    // Switch to a social preset
    await selectPlatformPreset(page, 'Instagram Feed')
    config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('Instagram Feed')

    // Switch back to video
    await selectPlatformPreset(page, 'TikTok')
    config = await getLocalStorageConfig(page)
    expect(config?.presetName).toBe('TikTok')
  })
})
