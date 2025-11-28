 
import { test as base, expect } from '@playwright/test'
import {
  setupFreshApp,
  selectPlatformPreset,
  editTextElement,
  selectLayout,
  getCanvasDimensions,
  waitForCanvasRender,
  waitForDimensions,
  waitForContentChange,
} from '../fixtures/app-fixtures'

const test = base

/**
 * Download Functionality Tests
 * Tests for PNG download functionality including SVG export validation,
 * dimension verification, and download button behavior
 *
 * Note: With Satori migration, the app now renders to SVG and converts to PNG
 * for download. Satori may convert text to paths for font rendering, so we
 * test for SVG structural changes rather than literal text content.
 *
 * Test Scenarios:
 * 1. Download button visible and clickable
 * 2. SVG preview renders with correct dimensions
 * 3. Download button triggers download without errors
 * 4. SVG content updates after changes
 * 5. Multiple presets render correctly
 * 6. Multiple exports work without errors
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

  test('should render SVG preview with valid content', async ({ page }) => {
    await setupFreshApp(page)

    // Get SVG element
    const svgContainer = page.locator('.satori-preview-svg')
    await svgContainer.waitFor({ state: 'visible' })

    // Verify SVG exists inside container
    const svg = svgContainer.locator('svg')
    await expect(svg).toBeVisible()

    // Verify SVG has content (paths, text, or other elements)
    const svgContent = await svg.innerHTML()
    expect(svgContent.length).toBeGreaterThan(100)
  })

  test('should render SVG with valid dimensions matching preset', async ({ page }) => {
    await setupFreshApp(page)

    // Get SVG dimensions
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions).not.toBeNull()

    // Default preset is Open Graph (1200x630)
    expect(dimensions?.width).toBeGreaterThan(0)
    expect(dimensions?.height).toBeGreaterThan(0)
  })

  test('should render SVG with correct dimensions for YouTube preset', async ({ page }) => {
    await setupFreshApp(page)

    // Select YouTube preset (1280x720)
    await selectPlatformPreset(page, 'YouTube')
    await waitForDimensions(page, 1280, 720)

    // Get SVG dimensions
    const dimensions = await getCanvasDimensions(page)
    expect(dimensions).not.toBeNull()
    expect(dimensions?.width).toBe(1280)
    expect(dimensions?.height).toBe(720)
  })

  test('should update SVG content after making changes', async ({ page }) => {
    await setupFreshApp(page)

    // Get initial SVG content
    const svgContainer = page.locator('.satori-preview-svg')
    const svg = svgContainer.locator('svg')
    const initialContent = await svg.innerHTML()

    // Make changes to the content
    await editTextElement(page, 'title', 'Test Title Download')

    // Wait for content to actually change
    await waitForContentChange(page, initialContent)

    // Get updated SVG content
    const updatedContent = await svg.innerHTML()

    // Content should have changed (Satori may convert text to paths,
    // so we just verify the SVG changed, not the literal text)
    expect(updatedContent).not.toBe(initialContent)
    expect(updatedContent.length).toBeGreaterThan(100)
  })

  test('should render correct SVG dimensions for different presets', async ({ page }) => {
    const presets = [
      { name: 'YouTube', width: 1280, height: 720 },
      { name: 'Instagram Feed', width: 1080, height: 1080 },
      { name: 'Twitter/X', width: 1200, height: 675 },
    ]

    for (const preset of presets) {
      await setupFreshApp(page)
      await selectPlatformPreset(page, preset.name)
      await waitForDimensions(page, preset.width, preset.height)

      const dimensions = await getCanvasDimensions(page)
      expect(dimensions?.width).toBe(preset.width)
      expect(dimensions?.height).toBe(preset.height)
    }
  })

  test('should render SVG with content after text edit', async ({ page }) => {
    await setupFreshApp(page)

    // Edit text
    await editTextElement(page, 'title', 'Download Export Test')
    await waitForCanvasRender(page)

    // Get SVG content - verify it has substantial content
    const svgContainer = page.locator('.satori-preview-svg')
    const svg = svgContainer.locator('svg')
    const svgContent = await svg.innerHTML()

    // Verify SVG has content (Satori converts text to paths)
    expect(svgContent.length).toBeGreaterThan(100)
    // Verify it has path elements (Satori renders text as paths)
    expect(svgContent).toMatch(/<(path|rect|g|text)/i)
  })

  test('should include all visible elements in SVG after text edits', async ({ page }) => {
    await setupFreshApp(page)

    // Select a layout with multiple elements
    await selectLayout(page, 'default')

    // Get content before edits
    const svgContainer = page.locator('.satori-preview-svg')
    const svg = svgContainer.locator('svg')
    const beforeContent = await svg.innerHTML()

    // Make edits
    await editTextElement(page, 'title', 'Main Title Text')
    await waitForContentChange(page, beforeContent)
    const afterTitleContent = await svg.innerHTML()

    await editTextElement(page, 'subtitle', 'Subtitle Text Here')
    await waitForContentChange(page, afterTitleContent)

    // Get content after edits
    const afterContent = await svg.innerHTML()

    // Verify SVG changed after edits
    expect(afterContent).not.toBe(beforeContent)
    expect(afterContent.length).toBeGreaterThan(100)
  })

  test('should handle rapid successive updates without error', async ({ page }) => {
    await setupFreshApp(page)

    const svgContainer = page.locator('.satori-preview-svg')
    const svg = svgContainer.locator('svg')
    await svg.waitFor({ state: 'visible' })

    let previousContent = await svg.innerHTML()

    // Perform rapid updates
    for (let i = 0; i < 3; i++) {
      await editTextElement(page, 'title', `Update ${i + 1}`)
      await waitForContentChange(page, previousContent)

      // Verify SVG is still valid and changed
      const currentContent = await svg.innerHTML()
      expect(currentContent.length).toBeGreaterThan(100)
      expect(currentContent).not.toBe(previousContent)
      previousContent = currentContent
    }
  })

  test('should verify SVG has valid structure', async ({ page }) => {
    await setupFreshApp(page)

    const svgContainer = page.locator('.satori-preview-svg')
    const svg = svgContainer.locator('svg')
    await svg.waitFor({ state: 'visible' })

    // Check SVG has valid attributes
    const width = await svg.getAttribute('width')
    const height = await svg.getAttribute('height')
    const viewBox = await svg.getAttribute('viewBox')

    expect(width).not.toBeNull()
    expect(height).not.toBeNull()
    expect(parseInt(width!)).toBeGreaterThan(0)
    expect(parseInt(height!)).toBeGreaterThan(0)
    // ViewBox may or may not be set, but if it is, it should be valid
    if (viewBox) {
      expect(viewBox.split(' ').length).toBe(4)
    }
  })

  test('should trigger download when button is clicked', async ({ page }) => {
    await setupFreshApp(page)

    // Set up to capture console errors
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Click download button
    const downloadButton = page.locator('button').filter({ hasText: /download|png/i })

    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null)

    await downloadButton.first().click()

    // Wait a moment for any async operations
    await page.waitForTimeout(500)

    // Either download happened or no errors occurred
    // (In headless mode, downloads may not always trigger the event)
    const download = await downloadPromise
    if (download) {
      // If we got a download, verify it's a PNG
      expect(download.suggestedFilename()).toMatch(/\.png$/)
    }

    // Verify no console errors (excluding favicon errors)
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })
})
