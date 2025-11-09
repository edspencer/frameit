/**
 * Vercel Serverless Function for image generation
 * Accepts GET (query params) or POST (JSON body) requests
 * Returns PNG or WebP image
 *
 * Uses LayoutRenderer for 1:1 parity with UI rendering
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import { join } from 'node:path'
import { LayoutRenderer } from '../src/lib/layout-renderer.js'
import { validateParams, generateCacheKey, type ImageGenerationParams } from '../src/lib/api-types.js'
import { PRESETS, GRADIENTS, LAYOUTS } from '../src/lib/constants.js'
import type { ThumbnailConfigNew, BackgroundConfig, TextElement, ImageElement } from '../src/lib/types.js'

// Register fonts for server-side rendering
// This runs once when the serverless function cold-starts
const fontsDir = join(process.cwd(), 'api', 'fonts')
try {
  GlobalFonts.registerFromPath(join(fontsDir, 'InterVariable.ttf'), 'Inter')
  console.log('✓ Inter font registered successfully')
  console.log('Available system fonts:', GlobalFonts.families.map(f => f.family).slice(0, 20).join(', '))
} catch (err) {
  console.error('⚠️  Failed to register Inter font:', err)
  console.error('Falling back to system fonts')
}

/**
 * Decodes query parameters, converting + to spaces
 */
function decodeQueryParams(params: Record<string, string | string[]>): Record<string, string | string[]> {
  const decoded: Record<string, string | string[]> = {}
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      // Replace + with space and decode URI component
      decoded[key] = decodeURIComponent(value.replace(/\+/g, ' '))
    } else {
      decoded[key] = value
    }
  }
  return decoded
}

/**
 * Main handler for both GET and POST requests
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Parse parameters from query (GET) or body (POST)
    let params: Partial<ImageGenerationParams> =
      req.method === 'POST' ? req.body : req.query

    // Decode query parameters for GET requests (convert + to spaces)
    if (req.method !== 'POST') {
      params = decodeQueryParams(params as Record<string, string | string[]>) as Partial<ImageGenerationParams>
    }

    // Validate and normalize parameters
    const config = validateParams(params)

    // Generate cache key for this image
    const cacheKey = generateCacheKey(config)

    // Find the preset (already validated)
    const preset = PRESETS.find((p) => p.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-') === config.layout)
    if (!preset) {
      throw new Error(`Preset not found for layout: ${config.layout}`)
    }

    // Determine layoutId from params or use 'default'
    const layoutId = (params as ImageGenerationParams).layoutId || 'default'
    const layout = LAYOUTS.find(l => l.id === layoutId)
    if (!layout) {
      throw new Error(`Layout not found: ${layoutId}. Valid options: ${LAYOUTS.map(l => l.id).join(', ')}`)
    }

    // Build background config
    let backgroundConfig: BackgroundConfig

    if (config.background.startsWith('http://') || config.background.startsWith('https://')) {
      // External image URL - not supported in background config, will be ignored
      // Use default gradient instead
      backgroundConfig = {
        type: 'gradient',
        gradientId: GRADIENTS[0].id
      }
    } else {
      // Try to match gradient by ID or name
      const gradient = GRADIENTS.find(g =>
        g.id === config.background ||
        g.name.toLowerCase() === config.background.toLowerCase()
      )

      if (gradient) {
        backgroundConfig = {
          type: 'gradient',
          gradientId: gradient.id
        }
      } else {
        // Default gradient
        backgroundConfig = {
          type: 'gradient',
          gradientId: GRADIENTS[0].id
        }
      }
    }

    // Build text elements from params
    const textElements: TextElement[] = []

    // Title is always required
    textElements.push({
      id: 'title',
      content: config.title,
      color: `#${config.titleColor}`,
    })

    // Subtitle is optional
    if (config.subtitle) {
      textElements.push({
        id: 'subtitle',
        content: config.subtitle,
        color: `#${config.subtitleColor}`,
      })
    }

    // Build image elements
    const imageElements: ImageElement[] = []

    // Logo element with opacity
    const typedParams = params as ImageGenerationParams
    if (typedParams.logoUrl) {
      imageElements.push({
        id: 'logo',
        url: typedParams.logoUrl,
        opacity: config.logoOpacity,
      })
    } else {
      // Default logo with opacity (will use default logo if layout has one)
      imageElements.push({
        id: 'logo',
        opacity: config.logoOpacity,
      })
    }

    // Build ThumbnailConfigNew
    const thumbnailConfig: ThumbnailConfigNew = {
      // @ts-expect-error - preset doesn't have icon field but UI requires it
      preset: preset,
      layoutId: layout.id,
      background: backgroundConfig,
      textElements,
      imageElements,
    }

    // Create canvas with preset dimensions
    const canvas = createCanvas(preset.width, preset.height)
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D

    // Load images referenced by imageElements
    const loadedImages = new Map<string, HTMLImageElement>()

    for (const imgEl of imageElements) {
      if (imgEl.url) {
        try {
          const img = await loadImage(imgEl.url)
          loadedImages.set(imgEl.id, img as unknown as HTMLImageElement)
          console.log(`✓ Loaded image: ${imgEl.id} from ${imgEl.url}`)
        } catch (error) {
          console.warn(`Failed to load image ${imgEl.id} from ${imgEl.url}:`, error)
          // Continue without this image
        }
      }
    }

    // Render using LayoutRenderer (same as UI)
    const renderer = new LayoutRenderer()
    // @ts-expect-error - Canvas from @napi-rs/canvas is compatible with HTMLCanvasElement interface
    renderer.render(ctx, canvas, thumbnailConfig, layout, loadedImages)

    // Encode to requested format
    let buffer: Buffer
    if (config.format === 'png') {
      buffer = await canvas.encode('png')
    } else {
      buffer = await canvas.encode('webp')
    }

    // Set response headers
    res.setHeader('Content-Type', `image/${config.format}`)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.setHeader('CDN-Cache-Control', 'public, max-age=31536000')
    res.setHeader('X-Cache-Key', cacheKey)

    // Return image buffer
    res.status(200).send(buffer)
  } catch (error) {
    console.error('Image generation error:', error)

    // Return error response
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(400).json({
      error: 'Image generation failed',
      message,
    })
  }
}
