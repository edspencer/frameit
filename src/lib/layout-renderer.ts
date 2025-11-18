import type {
  LayoutDefinition,
  LayoutElement,
  TextLayoutElement,
  ImageLayoutElement,
  OverlayLayoutElement,
  ThumbnailConfig,
  BackgroundConfig,
} from './types.js'
import { GRADIENTS } from './constants.js'
import { wrapText, drawGradientBackground } from './canvas-utils.js'

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
    config: ThumbnailConfig,
    layout: LayoutDefinition,
    loadedImages: Map<string, HTMLImageElement>
  ): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.lastElementBounds.clear()

    // 1. Render background (implicit zIndex: 0)
    this.renderBackground(ctx, canvas, config.background)

    // 2. Sort elements by zIndex (ascending) and render in order
    const sortedElements = [...layout.elements].sort((a, b) => a.zIndex - b.zIndex)
    for (const element of sortedElements) {
      this.renderElement(ctx, canvas, config, element, loadedImages)
    }
  }

  /**
   * Renders the background (gradient or solid color only)
   */
  private renderBackground(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    background: BackgroundConfig
  ): void {
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
  }

  /**
   * Dispatches element rendering to text, image, or overlay renderer
   */
  private renderElement(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    config: ThumbnailConfig,
    element: LayoutElement,
    loadedImages: Map<string, HTMLImageElement>
  ): void {
    if (element.type === 'text') {
      this.renderText(ctx, canvas, config, element)
    } else if (element.type === 'image') {
      this.renderImage(ctx, canvas, config, element, loadedImages)
    } else if (element.type === 'overlay') {
      this.renderOverlay(ctx, canvas, element)
    }
  }

  /**
   * Renders a text element with word wrapping and positioning
   */
  private renderText(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    config: ThumbnailConfig,
    element: TextLayoutElement
  ): void {
    // Find the text element by ID
    const textEl = config.textElements.find(t => t.id === element.id)
    if (!textEl) return // Skip if not provided

    // Resolve font properties (user override > layout default > fallback)
    const fontSize = this.resolveFontSize(
      textEl.fontSize || element.sizing?.fontSize || '8%',
      canvas.width
    )
    const fontWeight = textEl.fontWeight ?? element.styling?.fontWeight ?? 400
    const fontFamily = textEl.fontFamily || element.styling?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
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

    // Parse padding (default: no padding)
    const padding = this.parsePadding(element.styling?.padding, canvas.width)

    // Calculate box dimensions (text + padding)
    const boxWidth = textWidth + padding.left + padding.right
    const boxHeight = textHeight + padding.top + padding.bottom

    // Apply anchor offset BEFORE drawing (using box dimensions)
    const anchorPoint = this.applyAnchorOffset(
      x,
      y,
      boxWidth,
      boxHeight,
      element.position.anchor || 'top-left'
    )

    // Draw background and border if specified
    if (element.styling?.backgroundColor || element.styling?.borderColor) {
      // Calculate border radius (default to pill shape if not specified)
      let borderRadius = 0
      if (element.styling?.borderRadius) {
        // If borderRadius is specified, resolve it relative to box height for better proportions
        borderRadius = this.resolveSize(element.styling.borderRadius, boxHeight)
      } else if (element.styling?.backgroundColor) {
        // Default to pill shape (semicircular ends)
        borderRadius = boxHeight / 2
      }

      // Draw background
      if (element.styling.backgroundColor) {
        ctx.fillStyle = element.styling.backgroundColor
        this.drawRoundedRect(ctx, anchorPoint.x, anchorPoint.y, boxWidth, boxHeight, borderRadius, true, false)
      }

      // Draw border
      if (element.styling.borderColor && element.styling.borderWidth) {
        const borderWidth = this.resolveSize(element.styling.borderWidth, canvas.width)
        ctx.strokeStyle = element.styling.borderColor
        ctx.lineWidth = borderWidth
        this.drawRoundedRect(ctx, anchorPoint.x, anchorPoint.y, boxWidth, boxHeight, borderRadius, false, true)
      }
    }

    // Reset fillStyle for text
    ctx.fillStyle = color
    ctx.textAlign = textAlign

    // Calculate vertical centering for text within box
    const textBlockHeight = lines.length * lineHeightPx
    const verticalOffset = (boxHeight - textBlockHeight) / 2

    // Draw each line (vertically centered with horizontal padding)
    let currentY = anchorPoint.y + verticalOffset
    for (const line of lines) {
      let drawX = anchorPoint.x + padding.left

      // Adjust X position based on text alignment
      if (textAlign === 'center') {
        drawX = anchorPoint.x + padding.left + textWidth / 2
      } else if (textAlign === 'right') {
        drawX = anchorPoint.x + padding.left + textWidth
      }

      ctx.fillText(line, drawX, currentY)
      currentY += lineHeightPx
    }

    // Store bounds for auto-positioning (using box dimensions)
    this.lastElementBounds.set(element.id, {
      x: anchorPoint.x,
      y: anchorPoint.y,
      width: boxWidth,
      height: boxHeight,
    })
  }

  /**
   * Renders an image element with opacity and scaling
   */
  private renderImage(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    config: ThumbnailConfig,
    element: ImageLayoutElement,
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

    // Apply opacity and draw (keep image smoothing enabled for proper alpha blending)
    ctx.globalAlpha = imageEl.opacity ?? 1.0
    ctx.drawImage(img, anchorPoint.x, anchorPoint.y, width, height)
    ctx.globalAlpha = 1.0

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
   * Renders an overlay element (solid color or gradient rectangle)
   */
  private renderOverlay(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    element: OverlayLayoutElement
  ): void {

    // Resolve dimensions
    const width = this.resolveSize(element.sizing.width, canvas.width)
    const height = this.resolveSize(element.sizing.height, canvas.height)

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

    // Draw fill or gradient
    if (element.styling.gradient) {
      const grad =
        element.styling.gradient.direction === 'horizontal'
          ? ctx.createLinearGradient(anchorPoint.x, anchorPoint.y, anchorPoint.x + width, anchorPoint.y)
          : ctx.createLinearGradient(anchorPoint.x, anchorPoint.y, anchorPoint.x, anchorPoint.y + height)

      grad.addColorStop(0, element.styling.gradient.colorStart)
      grad.addColorStop(1, element.styling.gradient.colorEnd)
      ctx.fillStyle = grad
      ctx.fillRect(anchorPoint.x, anchorPoint.y, width, height)
    } else {
      // Solid fill with opacity
      ctx.globalAlpha = element.styling.opacity
      ctx.fillStyle = element.styling.fill
      ctx.fillRect(anchorPoint.x, anchorPoint.y, width, height)
      ctx.globalAlpha = 1.0
    }
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

  /**
   * Parses padding string into individual values
   * Supports: "10px", "5% 10%", "2% 5% 3% 8%"
   */
  private parsePadding(
    padding: string | undefined,
    referenceDimension: number
  ): { top: number; right: number; bottom: number; left: number } {
    if (!padding) {
      return { top: 0, right: 0, bottom: 0, left: 0 }
    }

    const parts = padding.trim().split(/\s+/)
    const values = parts.map(p => this.resolveSize(p, referenceDimension))

    if (values.length === 1) {
      // All sides same
      return { top: values[0], right: values[0], bottom: values[0], left: values[0] }
    } else if (values.length === 2) {
      // Vertical horizontal
      return { top: values[0], right: values[1], bottom: values[0], left: values[1] }
    } else if (values.length === 4) {
      // Top right bottom left
      return { top: values[0], right: values[1], bottom: values[2], left: values[3] }
    }

    return { top: 0, right: 0, bottom: 0, left: 0 }
  }

  /**
   * Draws a rectangle with optional rounded corners
   */
  private drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: boolean,
    stroke: boolean
  ): void {
    if (radius === 0) {
      // Simple rectangle
      if (fill) ctx.fillRect(x, y, width, height)
      if (stroke) ctx.strokeRect(x, y, width, height)
      return
    }

    // Rounded rectangle using path
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()

    if (fill) ctx.fill()
    if (stroke) ctx.stroke()
  }
}
