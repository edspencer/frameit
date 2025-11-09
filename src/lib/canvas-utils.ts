/**
 * Canvas drawing utilities for thumbnail generation.
 * These functions are pure and reusable in both client and server contexts.
 * Works with both browser Canvas API and @napi-rs/canvas (Node.js).
 */

/**
 * Generic canvas interface that works with both browser and Node.js Canvas
 */
export interface CanvasLike {
  width: number
  height: number
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
 * Draws a gradient background that fills the entire canvas
 */
export function drawGradientBackground(
  ctx: CanvasRenderingContext2D,
  canvas: CanvasLike,
  colorStart: string,
  colorEnd: string
): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, colorStart)
  gradient.addColorStop(1, colorEnd)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}
