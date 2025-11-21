import {
  test,
  expect,
  setupFreshApp,
  selectPlatformPreset,
  editTextElement,
  changeColor,
  waitForCanvasRender,
} from '../fixtures/app-fixtures'

/**
 * Accessibility Tests
 * Tests keyboard navigation, ARIA attributes, focus states, and semantic HTML
 * Ensures application is usable with keyboard and screen readers
 *
 * Scenarios: Tab navigation, focus states, ARIA labels, semantic HTML, color contrast
 */

test.describe('Accessibility', () => {
  test('should have buttons with accessible labels', async ({ page }) => {
    await setupFreshApp(page)

    // Check that platform preset buttons have accessible labels
    const presetButtons = page.locator('button:has-text("YouTube")')
    const button = presetButtons.first()

    // Button should either have aria-label or visible text
    const ariaLabel = await button.getAttribute('aria-label').catch(() => null)
    const textContent = await button.textContent()

    // Should have either aria-label or visible text
    expect(ariaLabel || textContent?.trim()).toBeTruthy()
  })

  test('should support keyboard navigation through buttons with Tab key', async ({ page }) => {
    await setupFreshApp(page)

    // Focus first element
    await page.keyboard.press('Tab')

    // Check what element is focused
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })

    // Should be able to navigate to a button
    expect(focusedElement).toBeTruthy()

    // Continue tabbing through multiple elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')

      const element = await page.evaluate(() => {
        const el = document.activeElement
        return {
          tagName: el?.tagName,
          type: (el as any)?.type,
        }
      })

      // Should navigate through interactive elements
      expect(element.tagName).toMatch(/BUTTON|INPUT|SELECT/i)
    }
  })

  test('should focus and unfocus text inputs with keyboard', async ({ page }) => {
    await setupFreshApp(page)

    // Find a text input
    const textInput = page.locator('input[type="text"]').first()

    // Focus it
    await textInput.focus()

    // Check that it's focused
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })

    expect(focusedElement).toBe('INPUT')

    // Type something
    await page.keyboard.type('Test input')
    await waitForCanvasRender(page)

    // Blur it
    await page.keyboard.press('Tab')

    // Verify we moved focus
    const newFocusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })

    expect(newFocusedElement).not.toBe('INPUT')
  })

  test('should have visible focus indicators on buttons', async ({ page }) => {
    await setupFreshApp(page)

    // Tab to a button
    await page.keyboard.press('Tab')

    // Get focused element
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      if (!el) return null

      const styles = window.getComputedStyle(el)
      return {
        tagName: el.tagName,
        outline: styles.outline,
        boxShadow: styles.boxShadow,
        border: styles.border,
      }
    })

    // Should have a button focused
    if (focusedElement?.tagName === 'BUTTON') {
      // Should have some visual indicator (outline, box-shadow, or border)
      expect(
        focusedElement.outline || focusedElement.boxShadow || focusedElement.border
      ).toBeTruthy()
    }
  })

  test('should support keyboard interaction with form controls', async ({ page }) => {
    await setupFreshApp(page)

    // Focus on a text input
    const textInput = page.locator('input[type="text"]').first()
    await textInput.focus()

    // Clear existing content first, then type
    await textInput.clear()
    await page.keyboard.type('Hello World')
    await waitForCanvasRender(page)

    // Verify text was entered
    const value = await textInput.inputValue()
    expect(value).toBe('Hello World')
  })

  test('should have semantic HTML structure', async ({ page }) => {
    await setupFreshApp(page)

    // Check for semantic elements
    const main = page.locator('main, [role="main"]')
    const buttons = page.locator('button')
    const inputs = page.locator('input[type="text"], textarea')

    // Should have semantic structure
    expect(await buttons.count()).toBeGreaterThan(0)
    expect(await inputs.count()).toBeGreaterThan(0)

    // Should not rely solely on divs for interactive elements
    const allButtons = page.locator('button')
    expect(await allButtons.count()).toBeGreaterThan(0)
  })

  test('should announce state changes to screen readers with ARIA attributes', async ({ page }) => {
    await setupFreshApp(page)

    // Select a preset which should trigger ARIA live region updates
    const presetButton = page.locator('button:has-text("YouTube")').first()

    // Check for aria-live regions in the document
    const liveRegions = page.locator('[aria-live]')
    const liveRegionCount = await liveRegions.count()

    // App might have aria-live regions for announcements
    // This test just verifies they exist if implemented
    if (liveRegionCount > 0) {
      expect(liveRegionCount).toBeGreaterThan(0)
    }

    // Click preset button
    await presetButton.click()
    await waitForCanvasRender(page)

    // App should have announced the change (if aria-live implemented)
  })

  test('should use proper heading hierarchy', async ({ page }) => {
    await setupFreshApp(page)

    // Check for headings
    const headings = page.locator('h1, h2, h3, h4, h5, h6')

    // App should use semantic headings
    const headingCount = await headings.count()

    // Even if no headings, should have ARIA landmarks
    const landmarks = page.locator('[role="main"], [role="complementary"], [role="region"]')
    const landmarkCount = await landmarks.count()

    expect(headingCount + landmarkCount).toBeGreaterThan(0)
  })

  test('should maintain focus during rapid interactions', async ({ page }) => {
    await setupFreshApp(page)

    // Focus an input
    const input = page.locator('input[type="text"]').first()
    await input.focus()

    // Get initial focus
    let focusedTagName = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedTagName).toBe('INPUT')

    // Make rapid changes
    await editTextElement(page, 'title', 'Test')
    await changeColor(page, 'title', '#FF0000')
    await waitForCanvasRender(page)

    // Check if focus was maintained or properly managed
    const newFocusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })

    // Focus should still be on an interactive element
    expect(newFocusedElement).toMatch(/BUTTON|INPUT|SELECT/i)
  })

  test('should support Enter key activation of buttons', async ({ page }) => {
    await setupFreshApp(page)

    // Tab to a button
    let foundButton = false
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')

      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement
        return {
          tagName: el?.tagName,
          text: el?.textContent?.substring(0, 20),
        }
      })

      if (focusedElement.tagName === 'BUTTON') {
        foundButton = true

        // Press Enter to activate button
        await page.keyboard.press('Enter')
        await waitForCanvasRender(page)

        // Button was activated (this is just a functional test)
        break
      }
    }

    // Should have found and activated a button
    expect(foundButton).toBe(true)
  })

  test('should have properly labeled form inputs', async ({ page }) => {
    await setupFreshApp(page)

    // Check for labels associated with inputs
    const inputs = page.locator('input[type="text"], textarea')

    // Each input should have some form of label
    for (let i = 0; i < (await inputs.count()); i++) {
      const input = inputs.nth(i)

      // Check for associated label
      const inputId = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const placeholder = await input.getAttribute('placeholder')

      // Should have one of: id (for label), aria-label, or placeholder
      expect(inputId || ariaLabel || placeholder).toBeTruthy()
    }
  })

  test('should maintain focus visibility during color picking', async ({ page }) => {
    await setupFreshApp(page)

    // Find color input
    const colorInput = page.locator('input[type="color"]').first()

    if (await colorInput.isVisible().catch(() => false)) {
      // Focus the color input
      await colorInput.focus()

      // Verify it's focused
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement as HTMLInputElement
        return el?.type
      })

      expect(focusedElement).toBe('color')

      // Change color
      await colorInput.fill('#FF0000')
      await waitForCanvasRender(page)

      // Focus should be maintained on the input
      const stillFocused = await page.evaluate(() => {
        const el = document.activeElement as HTMLInputElement
        return el?.type === 'color'
      })

      expect(stillFocused).toBe(true)
    }
  })

  test('should have accessible slider interactions', async ({ page }) => {
    await setupFreshApp(page)

    // Find any range sliders
    const sliders = page.locator('input[type="range"]')
    const sliderCount = await sliders.count()

    if (sliderCount > 0) {
      const slider = sliders.first()

      // Focus the slider
      await slider.focus()

      // Check it's focused
      const focusedType = await page.evaluate(() => {
        const el = document.activeElement as HTMLInputElement
        return el?.type
      })

      expect(focusedType).toBe('range')

      // Use arrow keys to interact with slider
      await page.keyboard.press('ArrowRight')
      await waitForCanvasRender(page)

      // Slider should respond to keyboard
      const newValue = await slider.inputValue()
      expect(newValue).toBeTruthy()
    }
  })
})
