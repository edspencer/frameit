/**
 * Vercel Serverless Function for image generation
 * Accepts GET (query params) or POST (JSON body) requests
 * Returns PNG or WebP image
 *
 * Uses Satori for JSX to SVG conversion and @resvg/resvg-js for PNG generation
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { renderToSvgServer, svgToPngServer, svgToWebpServer } from './satori-server.js'
import { validateParams, generateCacheKey, type ImageGenerationParams } from '../src/lib/api-types.js'
import { PLATFORMS, GRADIENTS, LAYOUTS } from '../src/lib/constants.js'
import type { ThumbnailConfig, BackgroundConfig, TextElement, ImageElement } from '../src/lib/types.js'

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

    // Build ThumbnailConfig
    const thumbnailConfig: ThumbnailConfig = {
      // @ts-expect-error - preset doesn't have icon field but UI requires it
      preset: preset,
      layoutId: layout.id,
      background: backgroundConfig,
      textElements,
      imageElements,
    }

    // Render using Satori
    const svg = await renderToSvgServer(layout.id, thumbnailConfig)

    // Convert to requested format
    let buffer: Buffer
    let contentType: string

    if (config.format === 'png') {
      buffer = await svgToPngServer(svg, preset.width)
      contentType = 'image/png'
    } else {
      // WebP requested - currently returns PNG as resvg-js doesn't support WebP
      // TODO: Add sharp for WebP conversion if needed
      buffer = await svgToWebpServer(svg, preset.width)
      contentType = 'image/png' // Return PNG until WebP is implemented
    }

    // Set response headers
    res.setHeader('Content-Type', contentType)
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
