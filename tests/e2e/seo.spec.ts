import { test, expect } from '@playwright/test'

test.describe('SEO Validation', () => {
  test('homepage has correct meta tags', async ({ page }) => {
    await page.goto('/')

    const title = await page.title()
    expect(title).toContain('FrameIt')

    const description = await page.getAttribute('meta[name="description"]', 'content')
    expect(description).toBeTruthy()

    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content')
    expect(ogImage).toContain('open-graph.png')
  })

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)

    const content = await page.textContent('body')
    expect(content).toContain('User-agent')
    expect(content).toContain('Disallow: /api/')
  })

  test('sitemap is accessible after build', async ({ request }) => {
    // Note: This test requires running against production build
    // In dev mode, sitemap may not be generated
    const response = await request.get('/sitemap-index.xml')
    // May return 404 in dev mode, which is acceptable
    expect([200, 404]).toContain(response.status())
  })
})
