/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect, type Page } from '@playwright/test'

/**
 * Type definitions for localStorage config
 * Note: We use SerializableThumbnailConfig structure since localStorage stores JSON
 */
interface SerializableThumbnailConfig {
  presetName: string
  layoutId: string
  background: {
    type: 'gradient' | 'solid' | 'none'
    gradientId?: string
    solidColor?: string
  }
  textElements: Array<{
    id: string
    content: string
    color?: string
    fontSize?: string
    fontFamily?: string
    fontWeight?: number
  }>
  imageElements: Array<{
    id: string
    url?: string
    opacity?: number
    scale?: number
  }>
}

// ============================================================================
// localStorage Helper Functions
// ============================================================================

/**
 * Clear all localStorage entries to ensure test isolation
 */
async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
  })
}

/**
 * Get the thumbnail config from localStorage
 * Returns null if not found or if localStorage is empty
 */
async function getLocalStorageConfig(
  page: Page
): Promise<SerializableThumbnailConfig | null> {
  const config = await page.evaluate(() => {
    const stored = localStorage.getItem('thumbnailGeneratorConfig')
    return stored ? JSON.parse(stored) : null
  })

  return config as SerializableThumbnailConfig | null
}

/**
 * Set the thumbnail config in localStorage
 * Merges with existing config if it exists
 */
async function setLocalStorageConfig(
  page: Page,
  config: Partial<SerializableThumbnailConfig>
): Promise<void> {
  await page.evaluate((newConfig) => {
    // Get existing config to merge with
    const existing = localStorage.getItem('thumbnailGeneratorConfig')
    const parsed = existing ? JSON.parse(existing) : {}

    // Merge new config with existing
    const merged = {
      ...parsed,
      ...newConfig,
    }

    // Save back to localStorage
    localStorage.setItem('thumbnailGeneratorConfig', JSON.stringify(merged))
  }, config)
}

// ============================================================================
// Canvas Helper Functions
// ============================================================================

/**
 * Wait for canvas to be rendered and ready
 * Checks that canvas element exists and has non-zero dimensions
 */
async function waitForCanvasRender(
  page: Page,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    () => {
      const canvas = document.querySelector('canvas')
      return canvas && canvas.width > 0 && canvas.height > 0
    },
    { timeout }
  )
}

/**
 * Get the canvas element dimensions
 * Returns null if canvas not found
 */
async function getCanvasDimensions(
  page: Page
): Promise<{ width: number; height: number } | null> {
  const dimensions = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return null
    return {
      width: canvas.width,
      height: canvas.height,
    }
  })

  return dimensions as { width: number; height: number } | null
}

/**
 * Get canvas context information
 * Returns dimensions and optionally image data
 * Note: ImageData retrieval may be limited in headless mode
 */
async function getCanvasContext(
  page: Page
): Promise<{ width: number; height: number; data?: number[] } | null> {
  const context = await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return null

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      return {
        width: canvas.width,
        height: canvas.height,
        data: Array.from(imageData.data), // Convert to array for serialization
      }
    } catch {
      // ImageData may not be accessible in headless mode or due to CORS
      return {
        width: canvas.width,
        height: canvas.height,
      }
    }
  })

  return context as { width: number; height: number; data?: number[] } | null
}

// ============================================================================
// UI Section Helpers
// ============================================================================

/**
 * Expand a config section by clicking on its heading if it's collapsed
 * @param page - The Playwright page object
 * @param sectionTitle - The title of the section to expand (e.g., "Layout", "Title", "Colors")
 */
async function expandSection(page: Page, sectionTitle: string): Promise<void> {
  // Find the button that toggles the section (it contains the section title in an h3)
  // Use exact text match with getByRole to avoid matching similar section names
  const sectionButton = page.getByRole('button', { name: sectionTitle, exact: true })

  // Check if section exists
  const count = await sectionButton.count()
  if (count === 0) {
    // Section doesn't exist - this might be expected for some layouts
    return
  }

  // If multiple sections match, use the first one
  const button = count > 1 ? sectionButton.first() : sectionButton

  // Scroll the section button into view
  await button.scrollIntoViewIfNeeded()

  // Check if the section is already expanded by looking for the chevron rotation
  const isExpanded = await button.evaluate((btn) => {
    const svg = btn.querySelector('svg')
    return svg?.classList.contains('rotate-180') || false
  })

  // If not expanded, click to expand it
  if (!isExpanded) {
    await button.click()
    // Wait a bit for the expansion animation and any scroll adjustments
    await page.waitForTimeout(500)
  }
}

// ============================================================================
// Element Interaction Helpers
// ============================================================================

/**
 * Select a platform preset by its name
 * Uses semantic selector (button containing preset name)
 */
async function selectPlatformPreset(
  page: Page,
  presetName: string
): Promise<void> {
  // Find button containing the preset name
  const button = page.locator(`button:has-text("${presetName}")`)

  // Verify button exists
  await button.first().waitFor({ state: 'visible', timeout: 5000 })

  // Click the button
  await button.first().click()

  // Wait for canvas to update
  await waitForCanvasRender(page)
}

/**
 * Select a layout by its ID
 * Looks for button containing the exact layout name (ID is "classic", name is "Classic")
 */
async function selectLayout(page: Page, layoutId: string): Promise<void> {
  // Expand the Layout section first
  await expandSection(page, 'Layout')

  // The layout buttons display the layout name (e.g., "Classic", "Minimal")
  // which is the capitalized version of the layout ID
  // Convert hyphenated IDs to proper case: "photo-essay" → "Photo Essay"
  const layoutName = layoutId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Find the Layout section container to scope our search
  const layoutSection = page.getByRole('button', { name: 'Layout', exact: true }).locator('..').locator('..')

  // Look for a button within the layout grid that contains the exact layout name
  // The layout name appears in a div inside the button
  const button = layoutSection.locator(`button:has(div:text-is("${layoutName}"))`).first()

  // Wait for button to be visible (increased timeout for slower renders)
  await button.waitFor({ state: 'visible', timeout: 10000 })

  // Click the layout button
  await button.click()

  // Wait for canvas to update
  await waitForCanvasRender(page)
}

/**
 * Select a background gradient by its ID
 * The UI has tabs for "Gradients" and "Colors", must click Gradients tab first
 */
async function selectBackground(
  page: Page,
  gradientId: string
): Promise<void> {
  // Expand the Background section first
  await expandSection(page, 'Background')

  // The BackgroundSelector has tabs - make sure "Gradients" tab is active
  // Find the Gradients button and click it if not already active
  const gradientsTabButton = page.locator('button:has-text("Gradients")').first()
  await gradientsTabButton.waitFor({ state: 'visible', timeout: 5000 })

  // Check if it's already active (has bg-blue-600 class)
  const isActive = await gradientsTabButton.evaluate((btn) => {
    return btn.classList.contains('bg-blue-600')
  })

  if (!isActive) {
    await gradientsTabButton.click()
    // Wait a bit for the tab content to render
    await page.waitForTimeout(200)
  }

  // Now find the gradient button by its title attribute
  // Gradient buttons have title attribute with the gradient name
  // Convert gradient ID to proper name: "dark-blue" → "Dark Blue"
  const gradientName = gradientId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Find gradient button by title attribute
  const button = page.locator(`button[title="${gradientName}"]`).first()

  // Wait for button to be visible
  await button.waitFor({ state: 'visible', timeout: 5000 })

  // Click the gradient button
  await button.click()

  // Wait for canvas to update
  await waitForCanvasRender(page)
}

/**
 * Edit a text element by ID
 * Finds the input field and updates its content
 */
async function editTextElement(
  page: Page,
  elementId: string,
  text: string
): Promise<void> {
  // Expand the text element section (section title is capitalized element ID, e.g., "Title", "Subtitle")
  const sectionTitle = elementId.charAt(0).toUpperCase() + elementId.slice(1)
  await expandSection(page, sectionTitle)

  // Find input by ID (the actual attribute that exists: id="text-${elementId}")
  // The UI uses <input type="text" id="text-${elementId}"> for all text elements
  const input = page.locator(`input#text-${elementId}`)

  // Wait for input to be visible (after section expansion) and scroll it into view
  await input.waitFor({ state: 'visible', timeout: 5000 })
  await input.scrollIntoViewIfNeeded()

  // Clear existing text and type new text
  await input.fill(text)

  // Wait for canvas to update
  await waitForCanvasRender(page)
}

/**
 * Change color of a text element
 * Uses the hex input field to enter any color value
 */
async function changeColor(
  page: Page,
  elementId: string,
  color: string
): Promise<void> {
  // Expand the text element section (section title is capitalized element ID, e.g., "Title", "Subtitle")
  const sectionTitle = elementId.charAt(0).toUpperCase() + elementId.slice(1)
  await expandSection(page, sectionTitle)

  // Ensure color starts with # if not already
  const hexColor = color.startsWith('#') ? color : `#${color}`

  // Find the section by locating the text input first (which has unique ID)
  // Then traverse up to find the containing section
  const textInput = page.locator(`input#text-${elementId}`)
  await textInput.waitFor({ state: 'visible', timeout: 5000 })

  // The color input is a sibling control within the same ConfigSection
  // Find the hex color input that's near the text input (within same parent structure)
  // Use a more specific selector: find the ConfigSection div that contains our text input
  const section = textInput.locator('xpath=ancestor::div[contains(@class, "space-y-4") or contains(@class, "space-y-2")][1]')

  // Find the hex color input field within this section
  // ColorPicker has an input with id="hex-input" and placeholder="#ffffff"
  const hexInput = section.locator('input[placeholder="#ffffff"]').first()

  // Wait for input to be visible and scroll into view
  await hexInput.waitFor({ state: 'visible', timeout: 5000 })
  await hexInput.scrollIntoViewIfNeeded()

  // Clear the input and type the new color
  await hexInput.fill(hexColor)

  // Press Enter or Tab to trigger the onChange event
  await hexInput.press('Tab')

  // Wait for canvas to update
  await waitForCanvasRender(page)
}

/**
 * Change logo/element opacity
 * Finds opacity slider and adjusts its value
 * Assumes the first image element (usually 'Logo' or 'Icon')
 */
async function changeOpacity(page: Page, value: number): Promise<void> {
  // Validate opacity value (0-1 range)
  if (value < 0 || value > 1) {
    throw new Error(`Invalid opacity value: ${value}. Must be between 0 and 1.`)
  }

  // Expand the Logo section (or first image element section)
  // Try common image element names
  const possibleSections = ['Logo', 'Icon', 'Main', 'Badge', 'Avatar', 'Brand']
  let foundElementId: string | null = null

  for (const sectionName of possibleSections) {
    try {
      const sectionButton = page.getByRole('button', { name: sectionName, exact: true })
      const count = await sectionButton.count()
      if (count > 0) {
        await expandSection(page, sectionName)
        foundElementId = sectionName.toLowerCase()
        break
      }
    } catch {
      // Section doesn't exist, try next
    }
  }

  if (!foundElementId) {
    throw new Error('Could not find image element section to expand for opacity control')
  }

  // Find the opacity slider by its specific ID
  // The slider has id="opacity-${elementId}" where elementId is lowercase (e.g., "icon", "logo")
  const slider = page.locator(`input#opacity-${foundElementId}`)

  // Wait for slider to be visible and scroll into view
  await slider.waitFor({ state: 'visible', timeout: 5000 })
  await slider.scrollIntoViewIfNeeded()

  // Set the slider value
  // Slider range is 0-100 (representing 0-100% opacity)
  const sliderValue = Math.round(value * 100)

  // For range inputs with React, we need to set value and trigger both input and change events
  // First click to focus
  await slider.click()

  // Use fill() to set the value atomically
  await slider.fill(sliderValue.toString())

  // Press Tab to trigger blur/change events
  await slider.press('Tab')

  // Add a wait for React state updates and localStorage sync
  await page.waitForTimeout(500)

  // Wait for canvas to update
  await waitForCanvasRender(page)
}

// ============================================================================
// App Setup Helper
// ============================================================================

interface SetupFreshAppOptions {
  preset?: string
  layout?: string
}

/**
 * Set up a fresh app instance for testing
 * - Navigates to the app
 * - Clears localStorage
 * - Waits for app to load
 * - Optionally selects preset/layout
 * - Waits for canvas to render
 */
async function setupFreshApp(
  page: Page,
  options: SetupFreshAppOptions = {}
): Promise<void> {
  // Navigate to the app
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })

  // Clear localStorage for clean state
  await clearLocalStorage(page)

  // Wait for app to be fully loaded by waiting for canvas
  await waitForCanvasRender(page, 10000)

  // Optionally select a preset
  if (options.preset) {
    await selectPlatformPreset(page, options.preset)
  }

  // Optionally select a layout
  if (options.layout) {
    await selectLayout(page, options.layout)
  }

  // Final wait to ensure everything is ready
  await waitForCanvasRender(page)
}

// ============================================================================
// Custom Test Fixture
// ============================================================================

/**
 * Extend Playwright's test with custom fixtures
 * Provides helpers for common testing operations
 */
const test = base.extend({
  /**
   * Page fixture with added convenience methods
   * Standard Playwright page object with fixtures attached
   */
  page: async ({ page: playwrightPage }, use) => {
    // Could add page setup/teardown here if needed
    await use(playwrightPage)
  },
})

// ============================================================================
// Exports
// ============================================================================

// Export test and expect
export { test, expect }

// Export all helper functions
export {
  clearLocalStorage,
  getLocalStorageConfig,
  setLocalStorageConfig,
  waitForCanvasRender,
  getCanvasDimensions,
  getCanvasContext,
  expandSection,
  selectPlatformPreset,
  selectLayout,
  selectBackground,
  editTextElement,
  changeColor,
  changeOpacity,
  setupFreshApp,
}

// Export types
export type { Page, SerializableThumbnailConfig, SetupFreshAppOptions }
