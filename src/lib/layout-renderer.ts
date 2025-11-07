import type {
  LayoutDefinition,
  LayoutElement,
  ThumbnailConfigNew,
  BackgroundConfig,
} from './types'
import { GRADIENTS } from './constants'
import { wrapText, drawGradientBackground } from './canvas-utils'

interface ElementBounds {
  x: number
  y: number
  width: number
  height: number
}

/**
 * LayoutRenderer - Renders thumbnails using layout definitions
 *
 * This class interprets JSON layout definitions and renders them to canvas,
 * supporting percentage-based positioning, auto-positioning, anchor points,
 * and user overrides.
 */
export class LayoutRenderer {
  private lastElementBounds: Map<string, ElementBounds>

  constructor() {
    this.lastElementBounds = new Map()
  }

  /**
   * Main render method - clears canvas and renders background + all layout elements
   */
  public render(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    config: ThumbnailConfigNew,
    layout: LayoutDefinition,
    loadedImages: Map<string, HTMLImageElement>
  ): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.lastElementBounds.clear()

    // 1. Render background (layout-agnostic)
    this.renderBackground(ctx, canvas, config.background, loadedImages)

    // 2. Render layout elements in order
    for (const element of layout.elements) {
      this.renderElement(ctx, canvas, config, element, loadedImages)
    }
  }

  /**
   * Renders the background (gradient, solid color, or image overlay)
   */
  private renderBackground(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    background: BackgroundConfig,
    loadedImages: Map<string, HTMLImageElement>
  ): void {
    // Draw base background
    switch (background.type) {
      case 'gradient': {
        const gradient = GRADIENTS.find(g => g.id === background.gradientId) || GRADIENTS[0]
        drawGradientBackground(ctx, canvas, gradient.colorStart, gradient.colorEnd)
        break
      }

      case 'solid':
        ctx.fillStyle = background.solidColor || '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        break

      case 'none':
        // Transparent / no background
        break
    }

    // Draw optional image overlay
    if (background.imageUrl) {
      const bgImage = loadedImages.get('background')
      if (bgImage) {
        // Default to 100% scale if not specified
        const scale = (background.imageScale ?? 100) / 100
        const bgAspect = bgImage.width / bgImage.height

        // Calculate display dimensions based on scale
        const displayWidth = canvas.width * scale
        const displayHeight = displayWidth / bgAspect

        // Center the image on the canvas
        const displayX = (canvas.width - displayWidth) / 2
        const displayY = (canvas.height - displayHeight) / 2

        // Draw the scaled and centered image
        ctx.drawImage(
          bgImage,
          0,
          0,
          bgImage.width,
          bgImage.height,
          displayX,
          displayY,
          displayWidth,
          displayHeight
        )
      }
    }
  }

  /**
   * Dispatches element rendering to text or image renderer
   */
  private renderElement(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    config: ThumbnailConfigNew,
    element: LayoutElement,
    loadedImages: Map<string, HTMLImageElement>
  ): void {
    if (element.type === 'text') {
      this.renderText(ctx, canvas, config, element)
    } else {
      this.renderImage(ctx, canvas, config, element, loadedImages)
    }
  }

  /**
   * Renders a text element with word wrapping and positioning
   */
  private renderText(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    config: ThumbnailConfigNew,
    element: LayoutElement
  ): void {
    // Find the text element by ID
    const textEl = config.textElements.find(t => t.id === element.id)
    if (!textEl) return // Skip if not provided

    // Resolve font properties (user override > layout default > fallback)
    const fontSize = this.resolveFontSize(
      textEl.fontSize || element.sizing?.fontSize || '8%',
      canvas.width
    )
    const fontWeight = element.styling?.fontWeight || 400
    const fontFamily = element.styling?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    const textAlign = element.styling?.textAlign || 'left'
    const color = textEl.color || element.styling?.color || '#ffffff'
    const lineHeight = element.sizing?.lineHeight || 1.2
    const maxWidth = this.resolveSize(
      element.sizing?.maxWidth || '80%',
      canvas.width
    )

    // Set font
    ctx.font = `${fontWeight} ${Math.round(fontSize)}px ${fontFamily}`
    ctx.fillStyle = color
    ctx.textAlign = textAlign
    ctx.textBaseline = 'top'

    // Word wrap the text
    const lines = wrapText(ctx, textEl.content, maxWidth)

    // Resolve position
    const { x, y } = this.resolvePosition(element, canvas)

    // Calculate text dimensions
    const lineHeightPx = fontSize * lineHeight
    const textHeight = lines.length * lineHeightPx
    const textWidth = maxWidth

    // Apply anchor offset BEFORE drawing
    const anchorPoint = this.applyAnchorOffset(
      x,
      y,
      textWidth,
      textHeight,
      element.position.anchor || 'top-left'
    )

    // Draw each line
    let currentY = anchorPoint.y
    for (const line of lines) {
      let drawX = anchorPoint.x

      // Adjust X position based on text alignment
      if (textAlign === 'center') {
        drawX = anchorPoint.x + textWidth / 2
      } else if (textAlign === 'right') {
        drawX = anchorPoint.x + textWidth
      }

      ctx.fillText(line, drawX, currentY)
      currentY += lineHeightPx
    }

    // Store bounds for auto-positioning
    this.lastElementBounds.set(element.id, {
      x: anchorPoint.x,
      y: anchorPoint.y,
      width: textWidth,
      height: textHeight,
    })
  }

  /**
   * Renders an image element with opacity and scaling
   */
  private renderImage(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    config: ThumbnailConfigNew,
    element: LayoutElement,
    loadedImages: Map<string, HTMLImageElement>
  ): void {
    // Find the image element by ID
    const imageEl = config.imageElements.find(i => i.id === element.id)
    if (!imageEl) return // Skip if not provided

    const img = loadedImages.get(element.id)
    if (!img) return // Skip if not loaded

    // Resolve size (height-based with aspect ratio)
    const baseHeight = this.resolveSize(
      element.sizing?.maxWidth || '10%',
      canvas.width
    )
    const height = imageEl.scale ? baseHeight * (imageEl.scale / 100) : baseHeight
    const width = height * (img.width / img.height)

    // Resolve position
    const { x, y } = this.resolvePosition(element, canvas)

    // Apply anchor offset
    const anchorPoint = this.applyAnchorOffset(
      x,
      y,
      width,
      height,
      element.position.anchor || 'top-left'
    )

    // Disable image smoothing for crisp rendering
    const imageSmoothingEnabled = ctx.imageSmoothingEnabled
    ctx.imageSmoothingEnabled = false

    // Apply opacity and draw
    ctx.globalAlpha = imageEl.opacity ?? 1.0
    ctx.drawImage(img, anchorPoint.x, anchorPoint.y, width, height)
    ctx.globalAlpha = 1.0

    // Restore image smoothing setting
    ctx.imageSmoothingEnabled = imageSmoothingEnabled

    // Store bounds for auto-positioning
    this.lastElementBounds.set(element.id, {
      x: anchorPoint.x,
      y: anchorPoint.y,
      width,
      height,
    })
  }

  /**
   * Resolves position to pixels, handling 'auto' for Y-axis
   */
  private resolvePosition(
    element: LayoutElement,
    canvas: HTMLCanvasElement
  ): { x: number; y: number } {
    const x = this.resolvePositionValue(element.position.x, canvas.width)
    const y = element.position.y === 'auto'
      ? this.getAutoYPosition(canvas)
      : this.resolvePositionValue(element.position.y, canvas.height)

    return { x, y }
  }

  /**
   * Converts position value (%, px, or number) to pixels
   */
  private resolvePositionValue(value: string | number, dimension: number): number {
    if (typeof value === 'number') return value

    if (value === 'auto') return 0 // Will be handled separately

    if (value.endsWith('%')) {
      return dimension * (Number.parseFloat(value) / 100)
    }

    if (value.endsWith('px')) {
      return Number.parseFloat(value)
    }

    return Number.parseFloat(value) || 0
  }

  /**
   * Calculates auto Y position based on the last element's bounds
   */
  private getAutoYPosition(canvas: HTMLCanvasElement): number {
    if (this.lastElementBounds.size === 0) {
      return 0 // No previous elements, start at top
    }

    // Get the last element's bounds
    const lastBounds = Array.from(this.lastElementBounds.values()).pop()
    if (!lastBounds) return 0

    // Position below the last element with some spacing
    const gap = canvas.width * 0.01 // 1% gap
    return lastBounds.y + lastBounds.height + gap
  }

  /**
   * Converts size value (%, px, or number) to pixels
   */
  private resolveSize(value: string | number, referenceDimension: number): number {
    if (typeof value === 'number') return value

    if (value.endsWith('%')) {
      return referenceDimension * (Number.parseFloat(value) / 100)
    }

    if (value.endsWith('px')) {
      return Number.parseFloat(value)
    }

    return Number.parseFloat(value) || 0
  }

  /**
   * Converts font size to pixels (always relative to canvas width)
   */
  private resolveFontSize(value: string | number, canvasWidth: number): number {
    if (typeof value === 'number') return value

    if (value.endsWith('%')) {
      return canvasWidth * (Number.parseFloat(value) / 100)
    }

    if (value.endsWith('px')) {
      return Number.parseFloat(value)
    }

    if (value.endsWith('rem')) {
      return Number.parseFloat(value) * 16
    }

    return Number.parseFloat(value) || 64
  }

  /**
   * Applies anchor offset to position based on element dimensions
   */
  private applyAnchorOffset(
    x: number,
    y: number,
    width: number,
    height: number,
    anchor: string
  ): { x: number; y: number } {
    let offsetX = x
    let offsetY = y

    // Horizontal adjustment
    if (anchor.includes('center')) {
      offsetX = x - width / 2
    } else if (anchor.includes('right')) {
      offsetX = x - width
    }

    // Vertical adjustment
    if (anchor.includes('center') && !anchor.includes('top') && !anchor.includes('bottom')) {
      offsetY = y - height / 2
    } else if (anchor.includes('bottom')) {
      offsetY = y - height
    }

    return { x: offsetX, y: offsetY }
  }
}
