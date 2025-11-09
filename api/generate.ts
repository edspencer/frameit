/**
 * Vercel Serverless Function for image generation
 * Accepts GET (query params) or POST (JSON body) requests
 * Returns PNG or WebP image
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import type { Image as CanvasImage } from '@napi-rs/canvas'
import { drawThumbnail } from '../src/lib/canvas-utils.js'
import { validateParams, generateCacheKey, type ImageGenerationParams } from '../src/lib/api-types.js'
import { BACKGROUND_IMAGES } from '../src/lib/constants.js'

/**
 * Main handler for both GET and POST requests
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Parse parameters from query (GET) or body (POST)
    const params: Partial<ImageGenerationParams> =
      req.method === 'POST' ? req.body : req.query

    // Validate and normalize parameters
    const config = validateParams(params)

    // Generate cache key for this image
    const cacheKey = generateCacheKey(config)

    // Create canvas with preset dimensions
    const canvas = createCanvas(config.width, config.height)
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D

    // Load background image if URL provided
    let backgroundImage: CanvasImage | undefined
    let gradientColors = { start: '#1a365d', end: '#2d3748' } // Default gradient

    if (config.background.startsWith('http://') || config.background.startsWith('https://')) {
      // Load external background image
      try {
        backgroundImage = await loadImage(config.background) as CanvasImage
      } catch (error) {
        console.warn('Failed to load background image:', error)
        // Fall back to gradient
      }
    } else {
      // Find matching gradient from constants
      const bgConfig = BACKGROUND_IMAGES.find((bg) => bg.name === config.background)
      if (bgConfig) {
        // Extract colors from gradient URL (SVG data URL)
        // For now, use default gradient - we can parse SVG later if needed
        gradientColors = extractGradientColors(bgConfig.url)
      }
    }

    // Note: Logo loading is skipped for now - @napi-rs/canvas doesn't support SVG
    // TODO: Convert logo to PNG or use a different approach for logo rendering

    // Draw the thumbnail using shared canvas utils
    drawThumbnail(ctx, canvas, {
      title: config.title,
      subtitle: config.subtitle,
      titleColor: `#${config.titleColor}`,
      subtitleColor: `#${config.subtitleColor}`,
      logoOpacity: config.logoOpacity,
      gradientColorStart: gradientColors.start,
      gradientColorEnd: gradientColors.end,
      logoImage: undefined, // Logo disabled for now (SVG not supported by @napi-rs/canvas)
      backgroundImage: backgroundImage,
      backgroundImageScale: backgroundImage ? 100 : 0,
    })

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

/**
 * Extract gradient colors from SVG data URL
 * This is a simple parser for our specific gradient format
 */
function extractGradientColors(svgDataUrl: string): { start: string; end: string } {
  try {
    // Default colors
    const defaults = { start: '#1a365d', end: '#2d3748' }

    // SVG gradients in our constants are data URLs like:
    // data:image/svg+xml,%3Csvg...stop-color='%23...'...
    const matches = svgDataUrl.match(/stop-color='%23([0-9A-Fa-f]{6})'/g)

    if (matches && matches.length >= 2) {
      const start = `#${matches[0].match(/%23([0-9A-Fa-f]{6})/)?.[1] || defaults.start.slice(1)}`
      const end = `#${matches[matches.length - 1].match(/%23([0-9A-Fa-f]{6})/)?.[1] || defaults.end.slice(1)}`
      return { start, end }
    }

    return defaults
  } catch {
    return { start: '#1a365d', end: '#2d3748' }
  }
}
