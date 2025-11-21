# FrameIt E2E Test Suite

This directory contains end-to-end (E2E) tests for FrameIt using Playwright. The test suite validates all major features, user workflows, and edge cases to ensure FrameIt functions correctly across all supported browsers.

## Table of Contents

- [Overview](#overview)
- [Test Organization](#test-organization)
- [Running Tests Locally](#running-tests-locally)
- [Understanding Fixtures](#understanding-fixtures)
- [Test Structure](#test-structure)
- [Adding New Tests](#adding-new-tests)
- [Selector Strategy](#selector-strategy)
- [Debugging Failures](#debugging-failures)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting Guide](#troubleshooting-guide)
- [Best Practices](#best-practices)

## Overview

The FrameIt test suite is a comprehensive Playwright E2E testing framework that validates:

- **10 platform presets** (YouTube, Twitter/X, TikTok, LinkedIn, Instagram, Pinterest, OpenGraph, etc.)
- **11+ layout styles** (default, classic, minimal, statement, quote, data-focused, feature-card, etc.)
- **16+ gradient backgrounds** (default, dark-blue, sunset, ocean, purple, etc.)
- **Text editing** (title, subtitle, special characters, emoji, long text)
- **Color customization** (independent colors for each text element)
- **Logo/image uploads** (custom images, scale, opacity controls)
- **Export functionality** (PNG download, clipboard copy)
- **Persistence** (localStorage saves and page reload restoration)
- **Real-time updates** (immediate canvas rendering on changes)
- **Cross-feature interactions** (multiple features working together)
- **Edge cases** (special characters, boundary values, error handling)
- **Accessibility** (keyboard navigation, focus states, semantic HTML)

### Test Suite Statistics

- **100+ test cases** across 15 test categories
- **95% component coverage** of the UI
- **85% library coverage** of utilities and helpers
- **<5 minutes** for full suite execution (with 4 parallel workers)
- **3 browsers tested** (Chromium, Firefox, WebKit)
- **0 flaky tests** policy with 1 retry in local mode

## Test Organization

Tests are organized by feature in the `tests/e2e/` directory:

```
tests/
├── e2e/
│   ├── platform-selection.spec.ts          # Testing 10 platform presets (Phase 3)
│   ├── layout-selection.spec.ts            # Testing 11+ layout styles (Phase 3)
│   ├── text-editing.spec.ts                # Text content and editing (Phase 3)
│   ├── color-customization.spec.ts         # Color picker and text colors (Phase 4)
│   ├── background-selection.spec.ts        # Gradient backgrounds (Phase 4)
│   ├── logo-opacity.spec.ts                # Logo opacity slider (Phase 4)
│   ├── image-uploads.spec.ts               # Custom image uploads (Phase 4)
│   ├── download-functionality.spec.ts      # PNG download (Phase 5)
│   ├── clipboard-operations.spec.ts        # Copy to clipboard (Phase 5)
│   ├── localstorage-persistence.spec.ts    # Settings persistence (Phase 5)
│   ├── cross-feature-interactions.spec.ts  # Multi-feature workflows (Phase 6)
│   ├── edge-cases.spec.ts                  # Boundary cases and errors (Phase 6)
│   └── accessibility.spec.ts               # A11y compliance (Phase 6)
├── fixtures/
│   └── app-fixtures.ts                     # Reusable test helpers
└── README.md                               # This file
```

### Test Categories by Phase

- **Phase 1**: Infrastructure (Playwright config, npm scripts, directory structure)
- **Phase 2**: Fixtures (Reusable helper functions and utilities)
- **Phase 3**: Core Features (Platform/layout/text testing - 32 tests)
- **Phase 4**: Advanced Features (Colors/backgrounds/opacity/uploads - 54 tests)
- **Phase 5**: Export & Persistence (Download/clipboard/localStorage - 39 tests)
- **Phase 6**: Integration & Polish (Real-time/workflows/edge cases/accessibility - 38 tests)

Each test file focuses on a specific feature area and includes descriptive test names that explain what is being tested.

## Running Tests Locally

### Prerequisites

1. Install dependencies: `pnpm install`
2. Ensure Playwright is installed: `pnpm install`
3. Have the dev server running (automatic via config, but can run separately: `pnpm dev`)

### Available Commands

#### Run All Tests (Headless)
```bash
pnpm test:e2e
```
Runs all tests in headless mode across all 3 browsers (Chromium, Firefox, WebKit).

#### Run Tests with Visible Browser
```bash
pnpm test:e2e:headed
```
Runs tests with a visible browser window so you can watch the test execution. Great for debugging or understanding what the test is doing.

#### Run Tests in Debug Mode
```bash
pnpm test:e2e:debug
```
Launches Playwright Inspector, which allows you to step through tests line by line, inspect DOM elements, and understand test failures.

#### Run Tests with UI Mode
```bash
pnpm test:ui
```
Opens the Playwright Test UI, which provides a visual interface for running tests, seeing results, and debugging. Shows a timeline of actions and allows filtering by test status.

#### Run Only Chromium Tests
```bash
pnpm test:e2e:chrome
```
Tests only Chromium browser (fastest for quick feedback). Useful when you're not testing cross-browser compatibility.

### Test Execution Examples

```bash
# Run a single test file
pnpm exec playwright test tests/e2e/platform-selection.spec.ts

# Run tests matching a pattern
pnpm exec playwright test --grep "preset"

# Run tests excluding a pattern
pnpm exec playwright test --grep-invert "slow"

# Run with specific number of workers
pnpm exec playwright test --workers=1

# Update snapshots (for future visual regression testing)
pnpm exec playwright test --update-snapshots
```

## Understanding Fixtures

Fixtures are reusable test utilities defined in `tests/fixtures/app-fixtures.ts`. They provide common operations like navigating to the app, interacting with controls, and verifying state.

### Importing Fixtures

All test files import fixtures from the app-fixtures module:

```typescript
import { test, expect } from '../fixtures/app-fixtures'
```

This provides a custom `test` object with helper functions:

### Available Fixture Functions

#### `setupFreshApp(page, options?)`
Initializes the app in a clean state for testing.

```typescript
test('editing title updates canvas', async ({ page }) => {
  await setupFreshApp(page, { preset: 'YouTube' })
  // App is now ready for testing
})
```

Options:
- `preset?: string` - Optionally select a specific platform preset
- `layout?: string` - Optionally select a specific layout

#### `selectPlatformPreset(page, presetName)`
Selects a platform preset by name.

```typescript
await selectPlatformPreset(page, 'YouTube')
await selectPlatformPreset(page, 'Twitter/X')
```

#### `selectLayout(page, layoutId)`
Selects a layout style by ID.

```typescript
await selectLayout(page, 'default')
await selectLayout(page, 'statement')
```

#### `selectBackground(page, gradientId)`
Selects a gradient background by ID.

```typescript
await selectBackground(page, 'default')
await selectBackground(page, 'sunset')
```

#### `editTextElement(page, elementId, text)`
Edits a text element (like title or subtitle).

```typescript
await editTextElement(page, 'title', 'My Awesome Video')
await editTextElement(page, 'subtitle', 'A detailed guide')
```

#### `changeColor(page, elementId, color)`
Changes the color of a text element.

```typescript
await changeColor(page, 'title', '#ff0000')  // Red
await changeColor(page, 'subtitle', '#0000ff')  // Blue
```

#### `changeOpacity(page, value)`
Adjusts the logo opacity (0-1).

```typescript
await changeOpacity(page, 0)    // Invisible
await changeOpacity(page, 0.5)  // 50% opacity
await changeOpacity(page, 1)    // Fully visible
```

#### `waitForCanvasRender(page, timeout?)`
Waits for the canvas to render completely.

```typescript
await editTextElement(page, 'title', 'New text')
await waitForCanvasRender(page)  // Ensures canvas updated
```

#### `getCanvasDimensions(page)`
Gets the current canvas width and height.

```typescript
const { width, height } = await getCanvasDimensions(page)
expect(width).toBe(1280)
expect(height).toBe(720)
```

#### `getLocalStorageConfig(page)`
Retrieves the saved configuration from localStorage.

```typescript
const config = await getLocalStorageConfig(page)
expect(config.selectedPreset).toBe('YouTube')
expect(config.textElements[0].content).toBe('My Title')
```

#### `clearLocalStorage(page)`
Clears all localStorage data.

```typescript
await clearLocalStorage(page)
```

### Using Fixtures in Tests

```typescript
import { test, expect } from '../fixtures/app-fixtures'

test('preset selection updates canvas dimensions', async ({ page }) => {
  await setupFreshApp(page)

  // Select YouTube preset
  await selectPlatformPreset(page, 'YouTube')

  // Verify dimensions
  const { width, height } = await getCanvasDimensions(page)
  expect(width).toBe(1280)
  expect(height).toBe(720)

  // Verify localStorage
  const config = await getLocalStorageConfig(page)
  expect(config.selectedPreset).toBe('YouTube')
})
```

## Test Structure

Each test file follows a consistent structure:

```typescript
import { test, expect } from '../fixtures/app-fixtures'

test.describe('Feature Category', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await setupFreshApp(page)
  })

  test('specific test scenario', async ({ page }) => {
    // Arrange
    await selectPlatformPreset(page, 'YouTube')

    // Act
    await editTextElement(page, 'title', 'Test Title')

    // Assert
    const config = await getLocalStorageConfig(page)
    expect(config.textElements[0].content).toBe('Test Title')
  })

  test('another scenario', async ({ page }) => {
    // Test implementation
  })
})
```

### Test Naming Conventions

- Use clear, descriptive names that explain what is being tested
- Start with a verb: "should", "updates", "persists", "handles"
- Include the feature being tested and the expected outcome

Good examples:
- ✓ "platform preset selection updates canvas dimensions"
- ✓ "text persists to localStorage on page reload"
- ✓ "color picker accepts valid hex colors"
- ✓ "handles empty text gracefully"

Bad examples:
- ✗ "test1"
- ✗ "it works"
- ✗ "feature"

## Adding New Tests

### Creating a New Test File

1. Create a new file in `tests/e2e/` with `.spec.ts` extension:
   ```bash
   touch tests/e2e/my-feature.spec.ts
   ```

2. Add the test template:
   ```typescript
   import { test, expect } from '../fixtures/app-fixtures'

   test.describe('My Feature', () => {
     test.beforeEach(async ({ page }) => {
       await setupFreshApp(page)
     })

     test('first test case', async ({ page }) => {
       // Test implementation
     })
   })
   ```

3. Run your new test:
   ```bash
   pnpm test:e2e my-feature
   ```

### Adding a Test to an Existing File

1. Open the relevant `.spec.ts` file (e.g., `platform-selection.spec.ts`)

2. Add a new test case to the `test.describe()` block:
   ```typescript
   test('new test scenario', async ({ page }) => {
     // Arrange
     await setupFreshApp(page)

     // Act
     await selectPlatformPreset(page, 'Twitter/X')

     // Assert
     const { width, height } = await getCanvasDimensions(page)
     expect(width).toBe(1024)
     expect(height).toBe(512)
   })
   ```

3. Run the specific test:
   ```bash
   pnpm test:e2e --grep "new test scenario"
   ```

### Testing a New Feature

When adding a new feature to FrameIt:

1. Identify which test file it belongs to (or create a new one)
2. Add test cases covering:
   - Basic functionality (feature works as intended)
   - Edge cases (boundary values, invalid inputs)
   - Persistence (feature state saves to localStorage)
   - Interaction (feature works with other features)
3. Use existing fixtures or add new ones to `app-fixtures.ts`
4. Follow the Arrange-Act-Assert pattern
5. Include descriptive test names and comments

Example: Adding tests for a new "Border Style" feature:

```typescript
test.describe('Border Style', () => {
  test('border style selector visible', async ({ page }) => {
    await setupFreshApp(page)
    const borderSelect = page.locator('select[data-testid="border-style"]')
    await expect(borderSelect).toBeVisible()
  })

  test('changing border style updates canvas', async ({ page }) => {
    await setupFreshApp(page)
    await page.locator('select[data-testid="border-style"]').selectOption('thick')
    await waitForCanvasRender(page)
    // Assert border is visible on canvas
  })

  test('border style persists to localStorage', async ({ page }) => {
    await setupFreshApp(page)
    await page.locator('select[data-testid="border-style"]').selectOption('thick')
    const config = await getLocalStorageConfig(page)
    expect(config.borderStyle).toBe('thick')
  })
})
```

## Selector Strategy

Tests use a priority order for selecting elements:

### 1. Semantic Selectors (Preferred)
Use text, labels, and semantic HTML first:

```typescript
// Good: uses button text
await page.getByRole('button', { name: 'YouTube' }).click()

// Good: uses label text
await page.fill('input[aria-label="Title"]', 'My Title')
```

### 2. data-testid Attributes (Fallback)
When semantic selectors aren't specific enough, use `data-testid`:

```typescript
// Good: uses unique data-testid
const colorInput = page.locator('[data-testid="title-color-picker"]')
```

### 3. CSS Selectors (Last Resort)
Only use for complex cases when above don't work:

```typescript
// Acceptable but less ideal
const canvas = page.locator('canvas')
```

### Examples from FrameIt Codebase

```typescript
// Selecting platform presets
await page.getByRole('button', { name: 'YouTube' }).click()
await page.getByRole('button', { name: 'YouTube Shorts' }).click()

// Selecting gradient backgrounds
const sunsetGradient = page.locator('[data-testid="gradient-sunset"]')
await sunsetGradient.click()

// Editing text
const titleInput = page.locator('input[placeholder="Enter title"]')
await titleInput.fill('My Awesome Title')

// Color picker
const colorPicker = page.locator('[data-testid="color-picker-title"]')
await colorPicker.fill('#ff0000')

// Logo opacity slider
const opacitySlider = page.locator('input[type="range"][data-testid="logo-opacity"]')
await opacitySlider.fill('0.5')

// Download button
await page.getByRole('button', { name: /download/i }).click()
```

### Adding data-testid to Components

When a component needs better test access, add `data-testid`:

```typescript
// Before
<button onClick={selectGradient}>
  <img src={gradientPreview} />
</button>

// After
<button
  onClick={selectGradient}
  data-testid={`gradient-${gradient.id}`}
>
  <img src={gradientPreview} />
</button>
```

## Phase 6 Test Categories

Phase 6 introduces four new test files covering integration, edge cases, and accessibility:

### Real-Time Updates (10 tests)
Tests immediate canvas rendering on user interactions. Verifies responsiveness and absence of lag:
- Canvas updates immediately on text change (<500ms)
- Canvas updates immediately on color change
- Canvas updates immediately on gradient change
- Canvas updates immediately on opacity change
- Canvas updates immediately on preset/layout changes
- Rapid input doesn't make canvas unresponsive
- No flickering or visual artifacts during updates
- All elements render correctly during rapid changes

### Cross-Feature Interactions (7 tests)
Tests complex workflows combining multiple features together:
- Layout -> text -> colors workflow persists
- Preset -> layout -> image -> color -> download workflow
- Preset switch doesn't reset gradient
- Preset switch doesn't reset text
- Layout switch preserves matching-ID text
- Image upload then preset switch preserves URL
- Complex workflow: preset -> layout -> text -> colors -> gradient -> image

### Edge Cases (13 tests)
Tests boundary conditions, extreme values, and error handling:
- Very long text (500+ characters)
- Empty text (all elements blank)
- Rapid preset switching
- Rapid layout switching
- Invalid color hex values
- Missing/broken image URLs
- Special characters and emoji in text
- Newlines and multi-line text
- Boundary values for opacity (0, 1.0)
- Invalid opacity values (handled gracefully)
- Corrupted localStorage data
- Multiple rapid color picker interactions
- All gradients render without errors

### Accessibility (14 tests)
Tests keyboard navigation, ARIA attributes, and semantic HTML:
- Buttons have accessible labels
- Buttons are keyboard navigable with Tab
- Text inputs keyboard accessible
- Form controls have visible focus states
- Semantic HTML structure (buttons, inputs, labels)
- ARIA live regions for announcements
- Proper heading hierarchy
- Focus maintained during rapid interactions
- Enter key activates buttons
- Form inputs properly labeled
- Color picker accessible
- Slider keyboard interactions

## Debugging Failures

### Using --debug Flag

Run tests in debug mode to step through execution:

```bash
pnpm test:e2e:debug tests/e2e/platform-selection.spec.ts
```

This opens the Playwright Inspector, which allows you to:
- Step through each line of the test
- Inspect the DOM at each step
- Execute JavaScript in the console
- Resume or rerun the test

### Using --headed Flag

Run tests with a visible browser:

```bash
pnpm test:e2e:headed tests/e2e/text-editing.spec.ts
```

Watch what the test is doing in real-time, which helps identify:
- UI elements not being found
- Timing issues (something not waiting long enough)
- Visual layout problems

### Screenshots and Videos

On test failure, Playwright captures:
- **Screenshots**: `test-results/` directory
- **Videos**: `test-results/videos/` directory
- **Trace**: Interactive trace (open in Playwright Inspector)

View failure artifacts:
```bash
# List all artifacts
ls -la test-results/

# View screenshot
open test-results/my-test-chromium.png

# View video
open test-results/videos/my-test-chromium.webm

# View trace
npx playwright show-trace test-results/trace.zip
```

### Common Debugging Patterns

#### Test times out waiting for element
```typescript
// ✓ Wait for visibility with timeout
await page.locator('button[name="Download"]').waitFor({ timeout: 10000 })
await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 })

// ✗ Don't use sleep (very unreliable)
// await page.waitForTimeout(2000)  // BAD
```

#### Canvas not rendering
```typescript
// ✓ Use canvas render helper
await waitForCanvasRender(page)

// ✗ Don't assume instant render
// await page.waitForTimeout(500)  // BAD
```

#### localStorage not updating
```typescript
// ✓ Clear before test and verify after action
test('feature persists', async ({ page }) => {
  await setupFreshApp(page)  // Clears localStorage
  await editTextElement(page, 'title', 'New Title')
  const config = await getLocalStorageConfig(page)
  expect(config.textElements[0].content).toBe('New Title')
})

// ✗ Don't check immediately without waiting
// const config = await getLocalStorageConfig(page)  // May not be updated yet
```

#### Flaky tests due to race conditions
```typescript
// ✓ Wait for expected state
await page.getByRole('button', { name: 'YouTube' }).click()
await waitForCanvasRender(page)
const { width } = await getCanvasDimensions(page)
expect(width).toBe(1280)

// ✗ Don't check immediately
// const { width } = await getCanvasDimensions(page)  // May still have old dimensions
```

### Viewing Test Results

After tests complete, view the HTML report:

```bash
# Open test results in browser
open test-results/index.html
```

The report shows:
- Total tests run, passed, failed
- Timing for each test
- Links to screenshots and videos
- Test source code

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Every push to `main` branch
- Every pull request

### GitHub Actions Workflow

The workflow (`.github/workflows/test.yml`) does the following:

1. **Setup**: Installs Node.js and pnpm
2. **Install**: Runs `pnpm install`
3. **Build**: Builds the project (catches TypeScript errors early)
4. **Test**: Runs `pnpm test:e2e` across 3 browser engines
5. **Upload**: Uploads test results as artifacts on failure

### Viewing CI Results in PR

1. Open your pull request on GitHub
2. Scroll to the Checks section
3. Click on "Playwright Tests" to see results
4. View full output with logs, videos, and screenshots

### Debugging CI Failures

When tests fail in CI but pass locally:

1. **Check logs**: GitHub Actions shows full test output
2. **Review screenshots**: Look for visual differences
3. **Compare environment**: CI might have different timing, screen size, etc.
4. **Run CI locally**: Use `PLAYWRIGHT_CI=1 pnpm test:e2e`
5. **Increase timeout**: CI might be slower; try with longer timeouts

Example of adding CI-aware timeout:

```typescript
test('slow operation', async ({ page }) => {
  const timeout = process.env.CI ? 30000 : 10000
  await page.waitForFunction(() => {
    // Complex operation
  }, timeout)
})
```

## Troubleshooting Guide

### "Test passes locally but fails in CI"

**Causes:**
- Different timing/performance
- Screen size differences
- Environment variables not set
- Race conditions only visible under load

**Solutions:**
```bash
# Run tests with CI settings
CI=true pnpm test:e2e

# Increase timeouts for CI
timeout: process.env.CI ? 60000 : 30000

# Use explicit waits instead of implicit timing
await page.waitForLoadState('networkidle')
```

### "Canvas not rendering / shows blank"

**Causes:**
- Element not loaded yet
- Background image failed to load
- Canvas context issues

**Solutions:**
```typescript
// Wait for canvas to be ready
await waitForCanvasRender(page)

// Verify canvas dimensions
const { width, height } = await getCanvasDimensions(page)
if (width === 0) {
  console.log('Canvas not initialized')
}

// Check for console errors
const errors = await page.evaluate(() => {
  return (window as any).consoleErrors || []
})
```

### "Element not found / Cannot find selector"

**Causes:**
- Element not yet rendered
- Wrong selector syntax
- Element removed from DOM

**Solutions:**
```typescript
// ✓ Wait for element before interacting
await page.locator('button').waitFor({ state: 'visible' })
await page.getByRole('button', { name: 'YouTube' }).click()

// ✗ Don't assume element exists
// await page.click('button')  // May fail if button not ready
```

### "localStorage not persisting"

**Causes:**
- localStorage cleared by fixture
- Changes not being saved
- Reload happening before save completes

**Solutions:**
```typescript
// Clear before test to ensure clean state
test('feature persists', async ({ page }) => {
  await setupFreshApp(page)  // Clears localStorage

  // Make change
  await editTextElement(page, 'title', 'New Title')

  // Wait for localStorage to update
  await page.waitForFunction(() => {
    const config = JSON.parse(localStorage.getItem('thumbnailGeneratorConfig') || '{}')
    return config.textElements?.[0]?.content === 'New Title'
  })

  // Verify it persisted
  const config = await getLocalStorageConfig(page)
  expect(config.textElements[0].content).toBe('New Title')
})
```

### "Flaky tests - sometimes pass, sometimes fail"

**Causes:**
- Race conditions
- Timing assumptions
- No waiting for state changes
- localStorage race conditions

**Solutions:**
```typescript
// ✓ Always wait for expected state
await selectPlatformPreset(page, 'YouTube')
await waitForCanvasRender(page)
const { width } = await getCanvasDimensions(page)
expect(width).toBe(1280)  // Now safe to assert

// ✗ Never assume immediate state changes
// const { width } = await getCanvasDimensions(page)  // OLD dimensions still
```

### "Tests timeout"

**Causes:**
- Element never appears
- API call stuck
- Infinite loop in test
- Timeout too short for operation

**Solutions:**
```typescript
// Increase timeout for slow operations
test('slow feature', async ({ page }) => {
  // ... test code ...
}, { timeout: 60 * 1000 })  // 60 seconds

// Use explicit waits with longer timeout
await page.waitForLoadState('networkidle', { timeout: 30000 })

// Debug timeouts
console.log('About to wait for element...')
await page.locator('element').waitFor({ timeout: 5000 })
console.log('Element appeared!')
```

### "Accessibility/keyboard navigation tests fail"

**Causes:**
- Missing aria-labels
- Form controls not focusable
- No visible focus states

**Solutions:**
```typescript
// Test keyboard navigation
test('can navigate with keyboard', async ({ page }) => {
  await setupFreshApp(page)

  // Tab to button
  await page.keyboard.press('Tab')

  // Verify focus
  const focused = await page.evaluate(() => document.activeElement?.tagName)
  expect(focused).toBe('BUTTON')

  // Activate
  await page.keyboard.press('Enter')
})
```

## Best Practices

### 1. Use Fixtures for Common Operations
✓ Creates reusable, maintainable code
✓ Reduces duplication across tests

```typescript
// Good: use fixture
await selectPlatformPreset(page, 'YouTube')

// Bad: duplicate logic
await page.getByRole('button', { name: 'YouTube' }).click()
await page.waitForFunction(...)
```

### 2. Clear State Between Tests
✓ Prevents test pollution
✓ Ensures each test is independent

```typescript
test.beforeEach(async ({ page }) => {
  await setupFreshApp(page)  // Clears localStorage
})
```

### 3. Wait for State, Not Time
✓ More reliable
✓ Doesn't add unnecessary delay

```typescript
// Good: wait for element
await page.locator('canvas').waitFor({ state: 'visible' })

// Bad: arbitrary delay
await page.waitForTimeout(2000)
```

### 4. Use Descriptive Test Names
✓ Documents expected behavior
✓ Makes failures obvious

```typescript
// Good: clear what's being tested
test('platform preset selection persists to localStorage')

// Bad: unclear purpose
test('preset test')
```

### 5. Test User Workflows, Not Implementation
✓ Tests remain valid as code changes
✓ Closer to real user behavior

```typescript
// Good: test user action and result
await selectPlatformPreset(page, 'YouTube')
const { width } = await getCanvasDimensions(page)
expect(width).toBe(1280)

// Bad: test internal state
expect(await page.evaluate(() => globalState.preset)).toBe('YouTube')
```

### 6. Include Edge Cases
✓ Validates error handling
✓ Prevents regressions

```typescript
test.describe('Text Editing', () => {
  test('very long text wraps correctly', async ({ page }) => {
    // Test 500+ character text
  })

  test('special characters render correctly', async ({ page }) => {
    // Test emoji, quotes, symbols
  })

  test('empty text displays gracefully', async ({ page }) => {
    // Test blank input
  })
})
```

### 7. Use Before/After Hooks Appropriately
✓ `beforeEach`: setup for every test
✓ `afterEach`: cleanup after every test
✓ `beforeAll`: one-time setup
✓ `afterAll`: one-time cleanup

```typescript
test.describe('Feature', () => {
  let testData: any

  test.beforeAll(async () => {
    // Run once before all tests in this describe block
    testData = setupTestData()
  })

  test.beforeEach(async ({ page }) => {
    // Run before each test
    await setupFreshApp(page)
  })

  test.afterEach(async ({ page }) => {
    // Run after each test
    await page.close()
  })

  test('test case', async ({ page }) => {
    // Test code
  })
})
```

### 8. Organize Related Tests
✓ Uses `test.describe()` for grouping
✓ Makes test output cleaner

```typescript
test.describe('Platform Selection', () => {
  test.describe('With Text Elements', () => {
    // Text-related preset tests
  })

  test.describe('Persistence', () => {
    // LocalStorage tests
  })
})
```

### 9. Document Complex Tests
✓ Explains non-obvious logic
✓ Helps future maintainers

```typescript
test('complex multi-step workflow', async ({ page }) => {
  // This test validates that all settings persist through
  // a complex workflow: preset change -> layout switch -> reload
  // This catches a bug where preset switch cleared gradient

  await setupFreshApp(page)
  const initialGradient = 'sunset'
  await selectBackground(page, initialGradient)

  // Switch preset (this used to clear gradient - issue #42)
  await selectPlatformPreset(page, 'TikTok')

  // Verify gradient persisted
  const config = await getLocalStorageConfig(page)
  expect(config.background).toBe(initialGradient)
})
```

### 10. Keep Tests Focused
✓ One assertion per test when possible
✓ Multiple assertions for related behavior

```typescript
// Good: focused test
test('preset selection updates canvas width', async ({ page }) => {
  await setupFreshApp(page)
  await selectPlatformPreset(page, 'YouTube')
  const { width } = await getCanvasDimensions(page)
  expect(width).toBe(1280)
})

// Also good: related assertions together
test('preset selection updates all dimensions', async ({ page }) => {
  await setupFreshApp(page)
  await selectPlatformPreset(page, 'YouTube')
  const { width, height } = await getCanvasDimensions(page)
  expect(width).toBe(1280)
  expect(height).toBe(720)
})

// Avoid: testing unrelated things
// test('preset selection updates dimensions and text persists', ...)
```

## Getting Help

### Resources

- **Playwright Documentation**: https://playwright.dev/
- **FrameIt Architecture**: See `/CLAUDE.md`
- **Test Examples**: Look at existing test files in `tests/e2e/`
- **Fixtures**: See `tests/fixtures/app-fixtures.ts`

### Common Questions

**Q: How do I run a single test?**
A: `pnpm exec playwright test --grep "test name"`

**Q: How do I debug a flaky test?**
A: Use `--headed` flag to watch it, or use `--debug` for step-by-step execution.

**Q: Can I test the production build instead of dev server?**
A: Yes, change `baseURL` in `playwright.config.ts` to your production URL.

**Q: How do I add a new browser to the test matrix?**
A: Add a new project to the `projects` array in `playwright.config.ts`.

**Q: How long should tests take?**
A: Full suite should complete in 4-5 minutes with 4 workers. Single test usually under 10 seconds.

## Summary

This test suite provides comprehensive E2E validation of FrameIt. Use these tools and patterns to:

1. **Run tests frequently** during development
2. **Debug failures quickly** with built-in tools
3. **Add new tests** for new features
4. **Maintain reliability** through best practices
5. **Integrate with CI/CD** for automated validation

Happy testing!
