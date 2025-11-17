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
import { PLATFORMS, GRADIENTS, LAYOUTS } from '../src/lib/constants.js'
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
    const preset = PLATFORMS.find((p) => p.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-') === config.layout)
    if (!preset) {
      throw new Error(`Preset not found for layout: ${config.layout}`)
    }

    // Find the layout (already validated)
    const layout = LAYOUTS.find(l => l.id === config.layoutId)
    if (!layout) {
      throw new Error(`Layout not found: ${config.layoutId}. Valid options: ${LAYOUTS.map(l => l.id).join(', ')}`)
    }

    // Build background config from validated params
    let backgroundConfig: BackgroundConfig

    if (config.background.type === 'solid') {
      // Solid color background - use the hex color directly
      backgroundConfig = {
        type: 'solid',
        solidColor: config.background.color, // Already validated and normalized with #
      }
    } else if (config.background.type === 'gradient') {
      // Gradient background - validate gradient ID exists
      const gradient = GRADIENTS.find(g => g.id === config.background.gradientId)
      if (!gradient) {
        throw new Error(`Gradient not found: ${config.background.gradientId}. Valid options: ${GRADIENTS.map(g => g.id).join(', ')}`)
      }
      backgroundConfig = {
        type: 'gradient',
        gradientId: gradient.id
      }
    } else {
      // None
      backgroundConfig = { type: 'none' }
    }

    // Map text elements from config (already validated)
    const textElements: TextElement[] = config.textElements.map(el => ({
      id: el.id,
      content: el.content,
      color: el.color,
      fontSize: el.fontSize,
      fontFamily: el.fontFamily,
      fontWeight: el.fontWeight,
    }))

    // Map image elements from config (already validated)
    const imageElements: ImageElement[] = config.imageElements.map(el => ({
      id: el.id,
      url: el.url,
      opacity: el.opacity,
      scale: el.scale,
    }))

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
