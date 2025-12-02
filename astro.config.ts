import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import {EnumChangefreq} from 'sitemap'
import mdx from '@astrojs/mdx'
import vercel from '@astrojs/vercel'

export default defineConfig({
  site: 'https://frameit.dev',
  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
      serialize(item) {
        // Homepage gets highest priority
        if (item.url === 'https://frameit.dev/') {
          item.priority = 1.0
          item.changefreq = EnumChangefreq.DAILY
        }
        // Guides pages get high priority
        else if (item.url.includes('/guides/') && !item.url.endsWith('/guides/')) {
          item.priority = 0.8
          item.changefreq = EnumChangefreq.MONTHLY
        }
        // Guide index and examples get medium-high priority
        else if (item.url.endsWith('/guides/') || item.url.includes('/examples/')) {
          item.priority = 0.9
          item.changefreq = EnumChangefreq.WEEKLY
        }
        // Default for other pages
        else {
          item.priority = 0.7
          item.changefreq = EnumChangefreq.WEEKLY
        }

        return item
      }
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
    define: {
      // Required for Satori to work in browser - it checks process.env.NODE_ENV
      // eslint-disable-next-line no-undef
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  },
})
