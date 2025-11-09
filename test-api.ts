#!/usr/bin/env tsx
/**
 * Test script to generate various thumbnails from the API
 * Usage: tsx test-api.ts
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

// Configuration
const HOST = 'http://localhost:3000'
const OUTPUT_DIR = './img'

interface TestCase {
  name: string
  params: Record<string, string>
}

const testCases: TestCase[] = [
  // Basic layouts
  {
    name: '01-open-graph-default',
    params: {
      layout: 'open-graph',
      title: 'Welcome to FrameIt',
      subtitle: 'Create stunning thumbnails with ease',
      format: 'png',
    },
  },
  {
    name: '02-youtube-gradient',
    params: {
      layout: 'youtube',
      title: 'Amazing Tutorial',
      subtitle: 'Learn something new today',
      background: 'default',
      format: 'png',
    },
  },
  {
    name: '03-youtube-shorts-vertical',
    params: {
      layout: 'youtube-shorts',
      title: 'Quick Tips',
      subtitle: 'In 60 seconds',
      titleColor: 'ffd700',
      subtitleColor: 'ffffff',
      format: 'png',
    },
  },
  {
    name: '04-linkedin-professional',
    params: {
      layout: 'linkedin-video',
      title: 'Industry Insights',
      subtitle: 'Expert Analysis',
      background: 'dark-blue',
      format: 'png',
    },
  },
  {
    name: '05-twitter-engaging',
    params: {
      layout: 'twitter-x',
      title: 'Breaking News',
      subtitle: 'Stay informed',
      titleColor: '1da1f2',
      format: 'png',
    },
  },
  {
    name: '06-tiktok-viral',
    params: {
      layout: 'tiktok',
      title: 'Trending Now',
      subtitle: 'Join the conversation',
      titleColor: 'fe2c55',
      subtitleColor: '25f4ee',
      format: 'png',
    },
  },
  {
    name: '07-instagram-reels',
    params: {
      layout: 'instagram-reels',
      title: 'Behind the Scenes',
      subtitle: 'Exclusive content',
      background: 'purple-pink',
      format: 'png',
    },
  },
  {
    name: '08-instagram-feed-square',
    params: {
      layout: 'instagram-feed',
      title: 'Daily Inspiration',
      subtitle: 'Motivational quotes',
      format: 'png',
    },
  },
  {
    name: '09-x-header-wide',
    params: {
      layout: 'x-header',
      title: 'My Profile',
      subtitle: 'Digital Creator & Developer',
      background: 'ocean-blue',
      format: 'png',
    },
  },
  {
    name: '10-pinterest-pin',
    params: {
      layout: 'pinterest-pin',
      title: 'DIY Project Ideas',
      subtitle: 'Creative crafts you can make',
      titleColor: 'e60023',
      format: 'png',
    },
  },
  // Different layouts
  {
    name: '11-classic-layout',
    params: {
      layout: 'open-graph',
      layoutId: 'classic',
      title: 'Classic Design',
      subtitle: 'Traditional top-left layout',
      format: 'png',
    },
  },
  {
    name: '12-minimal-layout',
    params: {
      layout: 'open-graph',
      layoutId: 'minimal',
      title: 'Clean and Simple',
      subtitle: 'Minimalist aesthetic',
      format: 'png',
    },
  },
  {
    name: '13-photo-essay-layout',
    params: {
      layout: 'open-graph',
      layoutId: 'photo-essay',
      title: 'Visual Storytelling',
      subtitle: 'Centered and prominent',
      format: 'png',
    },
  },
  // Different gradients
  {
    name: '14-gradient-sunset',
    params: {
      layout: 'open-graph',
      title: 'Sunset Vibes',
      subtitle: 'Warm and inviting',
      background: 'sunset',
      format: 'png',
    },
  },
  {
    name: '15-gradient-ocean',
    params: {
      layout: 'open-graph',
      title: 'Ocean Depths',
      subtitle: 'Cool and calming',
      background: 'ocean-blue',
      format: 'png',
    },
  },
  {
    name: '16-gradient-forest',
    params: {
      layout: 'open-graph',
      title: 'Forest Green',
      subtitle: 'Natural and fresh',
      background: 'forest-green',
      format: 'png',
    },
  },
  {
    name: '17-gradient-purple-pink',
    params: {
      layout: 'open-graph',
      title: 'Purple Dreams',
      subtitle: 'Vibrant and bold',
      background: 'purple-pink',
      format: 'png',
    },
  },
  // Custom colors
  {
    name: '18-custom-colors-bright',
    params: {
      layout: 'youtube',
      title: 'Bright and Bold',
      subtitle: 'Stand out from the crowd',
      titleColor: 'ff6b6b',
      subtitleColor: '4ecdc4',
      format: 'png',
    },
  },
  {
    name: '19-custom-colors-pastel',
    params: {
      layout: 'youtube',
      title: 'Soft and Gentle',
      subtitle: 'Pastel color scheme',
      titleColor: 'ffd3b6',
      subtitleColor: 'ffaaa5',
      format: 'png',
    },
  },
  {
    name: '20-custom-colors-neon',
    params: {
      layout: 'youtube-shorts',
      title: 'NEON LIGHTS',
      subtitle: 'Electric energy',
      titleColor: '00ff00',
      subtitleColor: 'ff00ff',
      background: 'dark-slate',
      format: 'png',
    },
  },
  // WebP format tests
  {
    name: '21-webp-format',
    params: {
      layout: 'open-graph',
      title: 'WebP Format',
      subtitle: 'Smaller file size, same quality',
      format: 'webp',
    },
  },
  // Logo opacity variations
  {
    name: '22-logo-full-opacity',
    params: {
      layout: 'open-graph',
      title: 'Logo Visible',
      subtitle: 'Full opacity',
      logoOpacity: '1.0',
      format: 'png',
    },
  },
  {
    name: '23-logo-half-opacity',
    params: {
      layout: 'open-graph',
      title: 'Logo Subtle',
      subtitle: 'Medium opacity',
      logoOpacity: '0.5',
      format: 'png',
    },
  },
  {
    name: '24-logo-minimal-opacity',
    params: {
      layout: 'open-graph',
      title: 'Logo Watermark',
      subtitle: 'Minimal opacity',
      logoOpacity: '0.1',
      format: 'png',
    },
  },
  // Long text wrapping
  {
    name: '25-long-title-wrapping',
    params: {
      layout: 'open-graph',
      title: 'This is a Very Long Title That Should Wrap Across Multiple Lines to Test the Text Wrapping Functionality',
      subtitle: 'Testing word wrap',
      format: 'png',
    },
  },
  {
    name: '26-long-subtitle-wrapping',
    params: {
      layout: 'open-graph',
      title: 'Short Title',
      subtitle: 'This is a much longer subtitle that contains quite a bit of text and should wrap nicely across multiple lines while maintaining good readability and proper spacing between each line',
      format: 'png',
    },
  },
  // Custom logo tests
  {
    name: '27-custom-logo-react',
    params: {
      layout: 'youtube',
      title: 'React Tutorial',
      subtitle: 'Building modern UIs',
      logoUrl: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png',
      logoOpacity: '0.9',
      format: 'png',
    },
  },
  {
    name: '28-custom-logo-typescript',
    params: {
      layout: 'open-graph',
      title: 'TypeScript Guide',
      subtitle: 'Type-safe development',
      logoUrl: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png',
      logoOpacity: '0.8',
      format: 'png',
    },
  },
]

async function generateThumbnail(testCase: TestCase): Promise<void> {
  const queryParams = new URLSearchParams(testCase.params).toString()
  const url = `${HOST}/api/generate?${queryParams}`
  const extension = testCase.params.format || 'png'
  const outputPath = join(OUTPUT_DIR, `${testCase.name}.${extension}`)

  console.log(`Generating: ${testCase.name}...`)

  try {
    const response = await fetch(url)

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`HTTP ${response.status}: ${text}`)
    }

    const buffer = await response.arrayBuffer()
    await writeFile(outputPath, Buffer.from(buffer))

    console.log(`  ✓ Saved to ${outputPath} (${(buffer.byteLength / 1024).toFixed(1)} KB)`)
  } catch (error) {
    console.error(`  ✗ Failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function main() {
  console.log(`🚀 Testing API at ${HOST}`)
  console.log(`📁 Output directory: ${OUTPUT_DIR}`)
  console.log(`📊 Test cases: ${testCases.length}`)
  console.log('🎨 Features: Layouts, gradients, colors, text wrapping, custom logos\n')

  // Create output directory
  try {
    await mkdir(OUTPUT_DIR, { recursive: true })
  } catch (error) {
    console.error(`Failed to create output directory: ${error}`)
    process.exit(1)
  }

  // Generate all thumbnails
  const startTime = Date.now()
  let successCount = 0

  for (const testCase of testCases) {
    try {
      await generateThumbnail(testCase)
      successCount++
    } catch (error) {
      // Error already logged in generateThumbnail
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log(`\n✨ Complete!`)
  console.log(`   Success: ${successCount}/${testCases.length}`)
  console.log(`   Time: ${elapsed}s`)
  console.log(`   Average: ${(Number.parseFloat(elapsed) / testCases.length).toFixed(2)}s per image`)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
