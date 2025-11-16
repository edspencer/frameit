#!/usr/bin/env tsx
/**
 * Test script to replicate Open Graph image examples
 * Downloads original OG images and generates our versions via API
 * Usage: tsx test-og-examples.ts
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { ALL_EXAMPLE_CONFIGS } from './src/lib/example-configs.js'

// Configuration
const HOST = 'http://localhost:3000'  // Main app server
const STATIC_SERVER_PORT = 3001        // Static file server for test assets
const STATIC_HOST = `http://localhost:${STATIC_SERVER_PORT}`
const API_OUTPUT_DIR = './layouts/api'
const ORIGINAL_OUTPUT_DIR = './layouts/original'

interface OGExample {
  name: string
  filename: string
  originalUrl: string
  pageUrl: string
  params: Record<string, any> | { usePost: true; body: any }
  notes?: string
}

/**
 * Convert pre-transformed config to API request format
 * Only transformation needed: convert relative image URLs to HTTP URLs for API
 */
function convertToAPIFormat(config: typeof EXAMPLE_THUMBNAIL_CONFIGS[number]): OGExample {
  // Convert relative image URLs (/frameit-logo.png) to HTTP URLs for API server
  const imageElements = config.imageElements.map(img => ({
    ...img,
    url: img.url.startsWith('/') ? `${STATIC_HOST}${img.url}` : img.url
  }))

  // Convert background format: API uses 'color' instead of 'solidColor'
  const background = config.background.type === 'solid'
    ? { type: 'solid' as const, color: config.background.solidColor }
    : config.background

  return {
    name: config.name,
    filename: config.id,
    originalUrl: config.originalImageUrl || '',
    pageUrl: config.pageUrl,
    notes: config.notes,
    params: {
      usePost: true,
      body: {
        layout: 'open-graph',
        layoutId: config.layoutId,
        background,
        textElements: config.textElements,
        imageElements: imageElements,
        format: 'png'
      }
    }
  }
}

// Convert all pre-transformed configs to API format (including disabled ones)
const ogExamples: OGExample[] = ALL_EXAMPLE_CONFIGS.map(convertToAPIFormat)

async function downloadOriginalImage(example: OGExample): Promise<void> {
  const outputPath = join(ORIGINAL_OUTPUT_DIR, `${example.filename}.jpg`)

  try {
    // If we have the direct URL, download it
    if (example.originalUrl) {
      const response = await fetch(example.originalUrl)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const buffer = await response.arrayBuffer()
      await writeFile(outputPath, Buffer.from(buffer))
      console.log(`   ✓ Downloaded original: ${example.filename}.jpg`)
    } else {
      console.log(`   ⚠ Skipped (no direct URL): ${example.filename}`)
    }
  } catch (error) {
    console.error(`   ✗ Failed to download original ${example.filename}: ${error}`)
  }
}

async function generateOurVersion(example: OGExample): Promise<void> {
  const outputPath = join(API_OUTPUT_DIR, `${example.filename}.png`)

  try {
    let response: Response

    // Check if this uses POST mode (advanced parameters)
    if ('usePost' in example.params && example.params.usePost) {
      // POST mode with JSON body
      console.log(`   Using POST mode with advanced parameters`)
      response = await fetch(`${HOST}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(example.params.body)
      })
    } else {
      // GET mode with query parameters
      const params = new URLSearchParams(example.params as Record<string, string>)
      const url = `${HOST}/api/generate?${params}`
      response = await fetch(url)
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const buffer = await response.arrayBuffer()
    await writeFile(outputPath, Buffer.from(buffer))

    console.log(`   ✓ Generated our version: ${example.filename}.png`)
  } catch (error) {
    console.error(`   ✗ Failed to generate ${example.filename}: ${error}`)
  }
}

async function processExample(example: OGExample): Promise<void> {
  console.log(`\n📸 ${example.name}`)

  // Extract layoutId from either GET or POST params
  const layoutId = 'usePost' in example.params && example.params.usePost
    ? example.params.body.layoutId
    : example.params.layoutId
  console.log(`   Layout: ${layoutId}`)

  if (example.notes) {
    console.log(`   Notes: ${example.notes}`)
  }

  // Download original
  await downloadOriginalImage(example)

  // Generate our version
  await generateOurVersion(example)
}

/**
 * Create a simple HTTP server to serve static assets from public/
 * This allows the API to fetch images via HTTP (works in both dev and production)
 */
function createStaticServer(): Promise<any> {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      if (!req.url) {
        res.writeHead(404)
        res.end()
        return
      }

      // Serve files from public/ directory
      const filePath = join(process.cwd(), 'public', req.url)

      try {
        const data = await readFile(filePath)

        // Set content type based on extension
        const ext = filePath.split('.').pop()
        const contentType = ext === 'png' ? 'image/png' :
                          ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                          'application/octet-stream'

        res.writeHead(200, { 'Content-Type': contentType })
        res.end(data)
      } catch (error) {
        res.writeHead(404)
        res.end('Not found')
      }
    })

    server.listen(STATIC_SERVER_PORT, () => {
      console.log(`📦 Static server running on ${STATIC_HOST}`)
      resolve(server)
    })

    server.on('error', reject)
  })
}

async function main() {
  console.log('🎨 FrameIt OG Examples Test Suite\n')
  console.log('Testing against:', HOST)
  console.log('API output:', API_OUTPUT_DIR)
  console.log('Originals:', ORIGINAL_OUTPUT_DIR)

  // Start static file server for test assets
  const staticServer = await createStaticServer()

  // Create output directories
  try {
    await mkdir(API_OUTPUT_DIR, { recursive: true })
    await mkdir(ORIGINAL_OUTPUT_DIR, { recursive: true })
  } catch (error) {
    console.error(`Failed to create output directories: ${error}`)
    staticServer.close()
    process.exit(1)
  }

  // Process all examples
  const startTime = Date.now()
  let successCount = 0

  for (const example of ogExamples) {
    try {
      await processExample(example)
      successCount++
    } catch (error) {
      console.error(`Failed to process ${example.name}:`, error)
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n✨ Complete!')
  console.log(`   Processed: ${successCount}/${ogExamples.length}`)
  console.log(`   Time: ${elapsed}s`)
  console.log(`   Average: ${(Number.parseFloat(elapsed) / ogExamples.length).toFixed(2)}s per example`)
  console.log(`\n📁 Compare images:`)
  console.log(`   Originals: ${ORIGINAL_OUTPUT_DIR}/`)
  console.log(`   Our versions: ${API_OUTPUT_DIR}/`)

  // Cleanup: close static server
  staticServer.close()
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
