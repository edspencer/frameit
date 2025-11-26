import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

export default defineConfig({
  site: 'https://frameit.dev',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/api/')
    })
  ],
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  vite: {
    build: {
      target: 'ES2020',
    },
  },
})
