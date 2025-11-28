/**
 * Server-side Satori renderer for API endpoint
 * Uses Node.js fs for font loading and @resvg/resvg-js for SVG to PNG conversion
 */

import satori from 'satori'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Resvg } from '@resvg/resvg-js'
import type { ThumbnailConfig } from '../src/lib/types.js'
import { getLayoutComponent } from '../src/lib/layouts/index.js'

// Load fonts synchronously at module load time for serverless cold start efficiency
// Using readFileSync ensures fonts are available immediately when the function runs
const fontsDir = join(process.cwd(), 'api', 'fonts')

/**
 * Converts a Node.js Buffer to ArrayBuffer
 * This is needed because Buffer.buffer may return a SharedArrayBuffer which
 * is not compatible with Satori's font data type requirement
 */
function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(arrayBuffer)
  for (let i = 0; i < buffer.length; i++) {
    view[i] = buffer[i]
  }
  return arrayBuffer
}

let interRegularData: ArrayBuffer
let interBoldData: ArrayBuffer
let interSemiBoldData: ArrayBuffer
let interLightData: ArrayBuffer

try {
  interRegularData = bufferToArrayBuffer(readFileSync(join(fontsDir, 'Inter-Regular.ttf')))
  interBoldData = bufferToArrayBuffer(readFileSync(join(fontsDir, 'Inter-Bold.ttf')))
  interSemiBoldData = bufferToArrayBuffer(readFileSync(join(fontsDir, 'Inter-SemiBold.ttf')))
  interLightData = bufferToArrayBuffer(readFileSync(join(fontsDir, 'Inter-Light.ttf')))
  console.log('Satori server fonts loaded successfully')
} catch (err) {
  console.error('Failed to load fonts for Satori server:', err)
  throw new Error('Font loading failed - cannot initialize Satori renderer')
}

/**
 * Renders a layout to SVG using Satori on the server
 */
export async function renderToSvgServer(
  layoutId: string,
  config: ThumbnailConfig
): Promise<string> {
  const LayoutComponent = getLayoutComponent(layoutId)

  const element = LayoutComponent({
    width: config.preset.width,
    height: config.preset.height,
    textElements: config.textElements,
    imageElements: config.imageElements,
    background: config.background,
  })

  return satori(element, {
    width: config.preset.width,
    height: config.preset.height,
    fonts: [
      {
        name: 'Inter',
        data: interLightData,
        weight: 300,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: interRegularData,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: interSemiBoldData,
        weight: 600,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: interBoldData,
        weight: 700,
        style: 'normal',
      },
    ],
  })
}

/**
 * Converts SVG to PNG using resvg-js
 */
export async function svgToPngServer(svg: string, width: number): Promise<Buffer> {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
  })
  const pngData = resvg.render()
  return Buffer.from(pngData.asPng())
}

/**
 * Converts SVG to WebP
 * Note: @resvg/resvg-js does not support WebP directly
 * For now, we return PNG. WebP support can be added later with sharp if needed.
 */
export async function svgToWebpServer(svg: string, width: number): Promise<Buffer> {
  // Return PNG for now - WebP support can be added with sharp later
  return svgToPngServer(svg, width)
}
