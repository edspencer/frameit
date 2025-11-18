/**
 * Shared types for API parameters and configuration.
 * Used by both the UI and the API endpoint.
 */

import { PLATFORMS } from './constants.js'

/**
 * Get valid layout names from PRESETS (kebab-cased)
 */
const VALID_LAYOUTS = PLATFORMS.map((p) => p.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-'))

/**
 * Platform layout options (derived from PRESETS)
 */
export type PlatformLayout = typeof VALID_LAYOUTS[number]

/**
 * Image format options
 */
export type ImageFormat = 'png' | 'webp'

/**
 * Background type options
 */
export type BackgroundType = 'gradient' | 'solid' | 'none'

/**
 * Text element parameter (for POST requests)
 */
export interface TextElementParam {
  /** Element ID (e.g., 'title', 'subtitle', 'brand', 'cta', 'artist', 'quotemark') */
  id: string
  /** Text content */
  content: string
  /** Optional hex color (with or without #) */
  color?: string
  /** Optional font size (e.g., '8%', '64px') */
  fontSize?: string
  /** Optional font family (e.g., 'Inter', 'Georgia') */
  fontFamily?: string
  /** Optional font weight (100-900) */
  fontWeight?: number
}

/**
 * Image element parameter (for POST requests)
 */
export interface ImageElementParam {
  /** Element ID (e.g., 'logo', 'main') */
  id: string
  /** Optional image URL */
  url?: string
  /** Optional opacity 0-1 */
  opacity?: number
  /** Optional scale 0-200 */
  scale?: number
}

/**
 * Background parameter (for POST requests)
 */
export interface BackgroundParam {
  /** Background type */
  type: BackgroundType
  /** Gradient ID (required if type is 'gradient') */
  gradientId?: string
  /** Solid color hex (required if type is 'solid') */
  color?: string
}

/**
 * API request parameters for image generation (Simple GET mode)
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

  /** Background gradient ID or solid color hex (default: 'default') */
  background?: string

  /** Background type: 'gradient' or 'solid' (default: 'gradient') */
  backgroundType?: BackgroundType

  /** Logo opacity 0-1 (default: 0.3) */
  logoOpacity?: number

  /** Logo image URL (optional custom logo) */
  logoUrl?: string

  /** Layout ID (default, classic, minimal, photo-essay, statement, sidebar, etc.) */
  layoutId?: string

  /** Output format (default: webp) */
  format?: ImageFormat
}

/**
 * API request parameters for image generation (Advanced POST mode)
 */
export interface AdvancedImageGenerationParams {
  /** Platform preset (determines dimensions) */
  layout: PlatformLayout

  /** Layout ID (default, classic, minimal, photo-essay, statement, sidebar, etc.) */
  layoutId?: string

  /** Background configuration */
  background: BackgroundParam

  /** Array of text elements with content and styling */
  textElements?: TextElementParam[]

  /** Array of image elements with URLs and properties */
  imageElements?: ImageElementParam[]

  /** Output format (default: webp) */
  format?: ImageFormat
}

/**
 * Validated and normalized image generation config
 * This is the internal format used by the rendering engine
 */
export interface ImageGenerationConfig {
  layout: PlatformLayout
  width: number
  height: number
  layoutId: string
  background: BackgroundParam
  textElements: TextElementParam[]
  imageElements: ImageElementParam[]
  format: ImageFormat
}

/**
 * Validates and normalizes API parameters
 * Handles both simple GET params and advanced POST params
 */
export function validateParams(
  params: Partial<ImageGenerationParams> | Partial<AdvancedImageGenerationParams>
): ImageGenerationConfig {
  // Validate layout
  const layout = params.layout || 'open-graph'
  if (!VALID_LAYOUTS.includes(layout)) {
    throw new Error(`Invalid layout: ${layout}. Valid options: ${VALID_LAYOUTS.join(', ')}`)
  }

  // Get dimensions from preset
  const preset = PLATFORMS.find((p) => p.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-') === layout)
  if (!preset) {
    throw new Error(`Preset not found for layout: ${layout}`)
  }

  // Validate layoutId
  const layoutId = params.layoutId || 'default'

  // Validate format
  const format = params.format || 'webp'
  if (!['png', 'webp'].includes(format)) {
    throw new Error(`Invalid format: ${format}`)
  }

  // Check if this is an advanced POST request (has background object or textElements/imageElements arrays)
  const isAdvancedMode = 'background' in params && typeof params.background === 'object'

  let background: BackgroundParam
  let textElements: TextElementParam[]
  let imageElements: ImageElementParam[]

  if (isAdvancedMode) {
    // Advanced POST mode
    const advancedParams = params as Partial<AdvancedImageGenerationParams>

    // Validate background
    background = validateBackground(advancedParams.background!)

    // Validate text elements
    textElements = (advancedParams.textElements || []).map((el) => validateTextElement(el))

    // Validate image elements
    imageElements = (advancedParams.imageElements || []).map((el) => validateImageElement(el))
  } else {
    // Simple GET mode (backward compatible)
    const simpleParams = params as Partial<ImageGenerationParams>

    // Build background from simple params
    const backgroundType = simpleParams.backgroundType || 'gradient'
    const backgroundValue = simpleParams.background || 'default'

    if (backgroundType === 'solid') {
      background = {
        type: 'solid',
        color: normalizeHexColor(backgroundValue),
      }
    } else if (backgroundType === 'none') {
      background = { type: 'none' }
    } else {
      background = {
        type: 'gradient',
        gradientId: backgroundValue,
      }
    }

    // Build text elements from simple params
    textElements = []

    // Title is required
    const title = simpleParams.title?.trim() || 'Untitled'
    if (title.length > 500) {
      throw new Error('Title must be 500 characters or less')
    }
    const titleColor = normalizeHexColor(simpleParams.titleColor || 'ffffff')
    textElements.push({ id: 'title', content: title, color: titleColor })

    // Subtitle is optional
    if (simpleParams.subtitle) {
      const subtitle = simpleParams.subtitle.trim()
      if (subtitle.length > 500) {
        throw new Error('Subtitle must be 500 characters or less')
      }
      const subtitleColor = normalizeHexColor(simpleParams.subtitleColor || 'cccccc')
      textElements.push({ id: 'subtitle', content: subtitle, color: subtitleColor })
    }

    // Build image elements from simple params
    imageElements = []

    // Logo with opacity
    let logoOpacity = simpleParams.logoOpacity ?? 0.3
    if (typeof logoOpacity === 'string') {
      logoOpacity = parseFloat(logoOpacity)
    }
    if (isNaN(logoOpacity) || logoOpacity < 0 || logoOpacity > 1) {
      throw new Error('Logo opacity must be between 0 and 1')
    }

    const logoElement: ImageElementParam = { id: 'logo', opacity: logoOpacity }
    if (simpleParams.logoUrl) {
      logoElement.url = simpleParams.logoUrl
    }
    imageElements.push(logoElement)
  }

  return {
    layout,
    width: preset.width,
    height: preset.height,
    layoutId,
    background,
    textElements,
    imageElements,
    format,
  }
}

/**
 * Validates a background parameter
 */
function validateBackground(bg: BackgroundParam | undefined): BackgroundParam {
  if (!bg) {
    return { type: 'gradient', gradientId: 'default' }
  }

  if (!['gradient', 'solid', 'none'].includes(bg.type)) {
    throw new Error(`Invalid background type: ${bg.type}. Valid options: gradient, solid, none`)
  }

  if (bg.type === 'gradient') {
    if (!bg.gradientId) {
      throw new Error('gradientId is required for gradient background')
    }
    return { type: 'gradient', gradientId: bg.gradientId }
  }

  if (bg.type === 'solid') {
    if (!bg.color) {
      throw new Error('color is required for solid background')
    }
    return { type: 'solid', color: normalizeHexColor(bg.color) }
  }

  return { type: 'none' }
}

/**
 * Validates a text element parameter
 */
function validateTextElement(el: TextElementParam): TextElementParam {
  if (!el.id) {
    throw new Error('Text element must have an id')
  }

  if (!el.content && el.content !== '') {
    throw new Error(`Text element '${el.id}' must have content`)
  }

  if (el.content.length > 500) {
    throw new Error(`Text element '${el.id}' content must be 500 characters or less`)
  }

  const validated: TextElementParam = {
    id: el.id,
    content: el.content,
  }

  if (el.color) {
    validated.color = normalizeHexColor(el.color)
  }

  if (el.fontSize) {
    validated.fontSize = el.fontSize
  }

  if (el.fontFamily) {
    validated.fontFamily = el.fontFamily
  }

  if (el.fontWeight !== undefined) {
    if (el.fontWeight < 100 || el.fontWeight > 900) {
      throw new Error(`Text element '${el.id}' fontWeight must be between 100 and 900`)
    }
    validated.fontWeight = el.fontWeight
  }

  return validated
}

/**
 * Validates an image element parameter
 */
function validateImageElement(el: ImageElementParam): ImageElementParam {
  if (!el.id) {
    throw new Error('Image element must have an id')
  }

  const validated: ImageElementParam = { id: el.id }

  if (el.url) {
    validated.url = el.url
  }

  if (el.opacity !== undefined) {
    if (el.opacity < 0 || el.opacity > 1) {
      throw new Error(`Image element '${el.id}' opacity must be between 0 and 1`)
    }
    validated.opacity = el.opacity
  }

  if (el.scale !== undefined) {
    if (el.scale < 0 || el.scale > 200) {
      throw new Error(`Image element '${el.id}' scale must be between 0 and 200`)
    }
    validated.scale = el.scale
  }

  return validated
}

/**
 * Normalizes a hex color (adds # prefix if missing, validates format)
 */
function normalizeHexColor(color: string): string {
  const cleaned = color.replace(/^#/, '')

  // Must be 3 or 6 hex digits
  if (!/^[0-9A-Fa-f]{3}$/.test(cleaned) && !/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    throw new Error(`Invalid hex color: ${color}`)
  }

  // Expand 3-digit hex to 6-digit
  let normalized = cleaned
  if (cleaned.length === 3) {
    normalized = cleaned
      .split('')
      .map((c) => c + c)
      .join('')
  }

  return `#${normalized}`
}

/**
 * Generates a cache key from normalized parameters
 */
export function generateCacheKey(config: ImageGenerationConfig): string {
  // Create a deterministic string from the config
  const bgKey =
    config.background.type === 'gradient'
      ? `grad-${config.background.gradientId}`
      : config.background.type === 'solid'
        ? `solid-${config.background.color}`
        : 'none'

  const textKey = config.textElements.map((el) => `${el.id}-${el.content.substring(0, 20)}-${el.color || ''}`).join('_')
  const imageKey = config.imageElements.map((el) => `${el.id}-${el.opacity || 1}-${el.scale || 100}`).join('_')

  return `img-${config.layout}-${config.layoutId}-${config.width}x${config.height}-${bgKey}-${textKey}-${imageKey}-${config.format}`
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_.]/g, '')
    .substring(0, 200) // Limit length
}
