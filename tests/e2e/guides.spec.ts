import { test, expect } from '@playwright/test'

test.describe('Guide Pages', () => {
  test('guide listing page loads', async ({ page }) => {
    await page.goto('/guides')
    await expect(page.locator('main h1').first()).toContainText('OG Image Guides')
  })

  test('guide listing shows all guides', async ({ page }) => {
    await page.goto('/guides')
    const guideLinks = page.locator('main a[href^="/guides/"]')
    await expect(guideLinks).toHaveCount(8)
  })

  test('individual guide page loads', async ({ page }) => {
    await page.goto('/guides/why-og-images-matter')
    await expect(page.locator('main h1').first()).toContainText('Why OG Images Matter')
  })

  test('guide page has correct meta tags', async ({ page }) => {
    await page.goto('/guides/why-og-images-matter')

    const title = await page.title()
    expect(title).toContain('Why OG Images Matter')

    const description = await page.getAttribute('meta[name="description"]', 'content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeLessThanOrEqual(160)

    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content')
    expect(ogTitle).toContain('Why OG Images Matter')

    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content')
    expect(ogImage).toBeTruthy()
  })

  test('guide navigation works', async ({ page }) => {
    await page.goto('/guides/why-og-images-matter')

    // Should have next link (first guide)
    const nextLink = page.locator('nav a:has-text("Next")')
    await expect(nextLink).toBeVisible()

    await nextLink.click()
    await expect(page).toHaveURL(/\/guides\/og-image-technical-specs/)
  })

  test('back to guides link works', async ({ page }) => {
    await page.goto('/guides/why-og-images-matter')

    await page.click('a:has-text("Back to Guides")')
    await expect(page).toHaveURL('/guides')
  })

  test('table of contents renders', async ({ page }) => {
    await page.goto('/guides/og-image-technical-specs')

    const toc = page.locator('nav:has-text("Table of Contents")')
    await expect(toc).toBeVisible()
  })

  test('call to action renders', async ({ page }) => {
    await page.goto('/guides/why-og-images-matter')

    const cta = page.locator('a:has-text("Try FrameIt Free")')
    await expect(cta).toBeVisible()
    expect(await cta.getAttribute('href')).toBe('/')
  })
})
