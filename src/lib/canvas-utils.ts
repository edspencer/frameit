/**
 * Canvas drawing utilities for thumbnail generation.
 * These functions are pure and reusable in both client and server contexts.
 */

interface DrawConfig {
  title: string
  subtitle: string
  titleColor: string
  subtitleColor: string
  logoOpacity: number
  logoImage?: HTMLImageElement
}

/**
 * Wraps text to fit within a maximum width on the canvas
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    const metrics = ctx.measureText(testLine)

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  })

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

/**
 * Draws a logo image on the canvas (top-right corner)
 */
export function drawLogo(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  logoImage: HTMLImageElement,
  logoOpacity: number
): void {
  const logoPadding = canvas.width * 0.02
  const logoHeight = canvas.width * 0.08
  const logoAspectRatio = logoImage.width / logoImage.height
  const logoWidth = logoHeight * logoAspectRatio

  const x = canvas.width - logoPadding - logoWidth
  const y = logoPadding

  // Disable image smoothing for crisp rendering
  const imageSmoothingEnabled = ctx.imageSmoothingEnabled
  ctx.imageSmoothingEnabled = false

  ctx.globalAlpha = logoOpacity
  ctx.drawImage(logoImage, x, y, logoWidth, logoHeight)
  ctx.globalAlpha = 1

  // Restore image smoothing setting
  ctx.imageSmoothingEnabled = imageSmoothingEnabled
}

/**
 * Draws the title and subtitle text content on the canvas
 */
export function drawTextContent(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  config: DrawConfig
): void {
  const padding = canvasWidth * 0.08
  const maxTextWidth = canvasWidth - padding * 2 - canvasWidth * 0.08

  // Title
  ctx.fillStyle = config.titleColor
  ctx.font = `bold ${Math.round(canvasWidth * 0.08)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  // Word wrap for title
  const titleLines = wrapText(ctx, config.title, maxTextWidth)
  let yPosition = canvasHeight * 0.3
  const lineHeight = canvasWidth * 0.09

  titleLines.forEach((line) => {
    ctx.fillText(line, padding, yPosition)
    yPosition += lineHeight
  })

  // Subtitle
  ctx.font = `${Math.round(canvasWidth * 0.045)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
  ctx.fillStyle = config.subtitleColor
  yPosition += canvasWidth * 0.02

  const subtitleLines = wrapText(ctx, config.subtitle, maxTextWidth)
  subtitleLines.forEach((line) => {
    ctx.fillText(line, padding, yPosition)
    yPosition += canvasWidth * 0.055
  })
}

/**
 * Draws the thumbnail with a background image
 */
export function drawThumbnail(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  backgroundImg: HTMLImageElement,
  config: DrawConfig
): void {
  // Clear the canvas first
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw background image with cover effect
  const bgWidth = backgroundImg.width
  const bgHeight = backgroundImg.height
  const canvasAspect = canvas.width / canvas.height
  const bgAspect = bgWidth / bgHeight

  let sourceX = 0
  let sourceY = 0
  let sourceWidth = bgWidth
  let sourceHeight = bgHeight

  if (canvasAspect > bgAspect) {
    // Canvas is wider, fit height
    sourceWidth = bgHeight * canvasAspect
    sourceX = (bgWidth - sourceWidth) / 2
  } else {
    // Canvas is taller, fit width
    sourceHeight = bgWidth / canvasAspect
    sourceY = (bgHeight - sourceHeight) / 2
  }

  ctx.drawImage(
    backgroundImg,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height
  )

  // Draw dark overlay for better text contrast
  ctx.fillStyle = 'rgba(23, 48, 84, 0.5)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw logo and text
  if (config.logoImage) {
    drawLogo(ctx, canvas, config.logoImage, config.logoOpacity)
  }
  drawTextContent(ctx, canvas.width, canvas.height, config)
}

/**
 * Draws the thumbnail with a gradient background (no image)
 */
export function drawThumbnailWithoutBackground(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: DrawConfig
): void {
  // Clear the canvas first
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#0f1729')
  gradient.addColorStop(1, '#1a2744')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw logo and text
  if (config.logoImage) {
    drawLogo(ctx, canvas, config.logoImage, config.logoOpacity)
  }
  drawTextContent(ctx, canvas.width, canvas.height, config)
}
