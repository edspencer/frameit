/**
 * Shared types for API parameters and configuration.
 * Used by both the UI and the API endpoint.
 */

import { PRESETS } from './constants.js'

/**
 * Platform layout options
 */
export type PlatformLayout = 'youtube' | 'youtube-shorts' | 'twitter' | 'tiktok' | 'square'

/**
 * Image format options
 */
export type ImageFormat = 'png' | 'webp'

/**
 * API request parameters for image generation
 */
export interface ImageGenerationParams {
  /** Platform preset (determines dimensions) */
  layout: PlatformLayout

  /** Main heading text */
  title: string

  /** Optional subheading text */
  subtitle?: string

  /** Title color as hex without # (default: ffffff) */
  titleColor?: string

  /** Subtitle color as hex without # (default: cccccc) */
  subtitleColor?: string

  /** Background gradient name or image URL */
  background?: string

  /** Logo opacity 0-1 (default: 0.3) */
  logoOpacity?: number

  /** Output format (default: webp) */
  format?: ImageFormat
}

/**
 * Validated and normalized image generation config
 */
export interface ImageGenerationConfig {
  layout: PlatformLayout
  width: number
  height: number
  title: string
  subtitle: string
  titleColor: string
  subtitleColor: string
  background: string
  logoOpacity: number
  format: ImageFormat
}

/**
 * Validates and normalizes API parameters
 */
export function validateParams(params: Partial<ImageGenerationParams>): ImageGenerationConfig {
  // Validate layout
  const layout = params.layout || 'twitter'
  if (!['youtube', 'youtube-shorts', 'twitter', 'tiktok', 'square'].includes(layout)) {
    throw new Error(`Invalid layout: ${layout}`)
  }

  // Get dimensions from preset
  const preset = PRESETS.find((p) => p.name.toLowerCase().replace(/\s+/g, '-') === layout)
  if (!preset) {
    throw new Error(`Preset not found for layout: ${layout}`)
  }

  // Validate title
  const title = params.title?.trim() || 'Untitled'
  if (title.length > 200) {
    throw new Error('Title must be 200 characters or less')
  }

  // Validate subtitle
  const subtitle = params.subtitle?.trim() || ''
  if (subtitle.length > 300) {
    throw new Error('Subtitle must be 300 characters or less')
  }

  // Validate colors (hex without #)
  const titleColor = validateHexColor(params.titleColor || 'ffffff')
  const subtitleColor = validateHexColor(params.subtitleColor || 'cccccc')

  // Validate logo opacity
  let logoOpacity = params.logoOpacity ?? 0.3
  if (typeof logoOpacity === 'string') {
    logoOpacity = parseFloat(logoOpacity)
  }
  if (isNaN(logoOpacity) || logoOpacity < 0 || logoOpacity > 1) {
    throw new Error('Logo opacity must be between 0 and 1')
  }

  // Validate format
  const format = params.format || 'webp'
  if (!['png', 'webp'].includes(format)) {
    throw new Error(`Invalid format: ${format}`)
  }

  // Validate background
  const background = params.background || 'gradient-1'

  return {
    layout,
    width: preset.width,
    height: preset.height,
    title,
    subtitle,
    titleColor,
    subtitleColor,
    background,
    logoOpacity,
    format,
  }
}

/**
 * Validates a hex color code (without #)
 */
function validateHexColor(color: string): string {
  const cleaned = color.replace(/^#/, '')

  // Must be 3 or 6 hex digits
  if (!/^[0-9A-Fa-f]{3}$/.test(cleaned) && !/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    throw new Error(`Invalid hex color: ${color}`)
  }

  // Expand 3-digit hex to 6-digit
  if (cleaned.length === 3) {
    return cleaned
      .split('')
      .map((c) => c + c)
      .join('')
  }

  return cleaned
}

/**
 * Generates a cache key from normalized parameters
 */
export function generateCacheKey(config: ImageGenerationConfig): string {
  return `img-${config.layout}-${config.width}x${config.height}-${config.title}-${config.subtitle}-${config.titleColor}-${config.subtitleColor}-${config.background}-${config.logoOpacity}-${config.format}`
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_.]/g, '')
    .substring(0, 200) // Limit length
}
