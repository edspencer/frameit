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
 * Draws the BragDoc logo (B icon + text) on the canvas
 */
export function drawBragDocLogo(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  logoOpacity: number
): void {
  const logoPadding = canvas.width * 0.02
  const iconSize = canvas.width * 0.06
  const fontSize = canvas.width * 0.04
  const gap = canvas.width * 0.01

  ctx.globalAlpha = logoOpacity

  // Measure text width to position the entire group
  ctx.font = `600 ${Math.round(fontSize * 0.9)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
  const textMetrics = ctx.measureText('BragDoc')
  const textWidth = textMetrics.width
  const totalWidth = iconSize + gap + textWidth

  // Position entire group at top-right
  const groupStartX = canvas.width - logoPadding - totalWidth
  const y = logoPadding

  // Draw rounded square background with brand blue
  const cornerRadius = iconSize * 0.2
  ctx.fillStyle = 'hsl(221.2 83.2% 53.3%)'
  ctx.beginPath()
  ctx.moveTo(groupStartX + cornerRadius, y)
  ctx.lineTo(groupStartX + iconSize - cornerRadius, y)
  ctx.quadraticCurveTo(
    groupStartX + iconSize,
    y,
    groupStartX + iconSize,
    y + cornerRadius
  )
  ctx.lineTo(groupStartX + iconSize, y + iconSize - cornerRadius)
  ctx.quadraticCurveTo(
    groupStartX + iconSize,
    y + iconSize,
    groupStartX + iconSize - cornerRadius,
    y + iconSize
  )
  ctx.lineTo(groupStartX + cornerRadius, y + iconSize)
  ctx.quadraticCurveTo(
    groupStartX,
    y + iconSize,
    groupStartX,
    y + iconSize - cornerRadius
  )
  ctx.lineTo(groupStartX, y + cornerRadius)
  ctx.quadraticCurveTo(groupStartX, y, groupStartX + cornerRadius, y)
  ctx.fill()

  // Draw the B letter in white
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${Math.round(fontSize)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('B', groupStartX + iconSize / 2, y + iconSize / 2)

  // Draw "BragDoc" text to the right of the icon
  ctx.fillStyle = '#ffffff'
  ctx.font = `600 ${Math.round(fontSize * 0.9)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('BragDoc', groupStartX + iconSize + gap, y + iconSize / 2)

  ctx.globalAlpha = 1
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
  drawBragDocLogo(ctx, canvas, config.logoOpacity)
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
  drawBragDocLogo(ctx, canvas, config.logoOpacity)
  drawTextContent(ctx, canvas.width, canvas.height, config)
}
