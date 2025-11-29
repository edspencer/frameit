/**
 * Server-side Satori renderer for API endpoint
 * Uses Node.js fs for font loading and @resvg/resvg-js for SVG to PNG conversion
 */

import satori from 'satori'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Resvg } from '@resvg/resvg-js'
import type { ThumbnailConfig } from '../src/lib/types'
import { getLayoutComponent } from '../src/lib/layouts/index'

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

function loadFont(filename: string): ArrayBuffer {
  return bufferToArrayBuffer(readFileSync(join(fontsDir, filename)))
}

// Load all fonts
let fontsLoaded = false
const fontData: Record<string, ArrayBuffer> = {}

try {
  // Inter
  fontData.interLight = loadFont('Inter-Light.ttf')
  fontData.interRegular = loadFont('Inter-Regular.ttf')
  fontData.interSemiBold = loadFont('Inter-SemiBold.ttf')
  fontData.interBold = loadFont('Inter-Bold.ttf')
  // Arimo (Arial alternative)
  fontData.arimoRegular = loadFont('Arimo-Regular.ttf')
  fontData.arimoBold = loadFont('Arimo-Bold.ttf')
  // Comic Neue
  fontData.comicNeueRegular = loadFont('ComicNeue-Regular.ttf')
  fontData.comicNeueBold = loadFont('ComicNeue-Bold.ttf')
  // Cousine (Courier alternative)
  fontData.cousineRegular = loadFont('Cousine-Regular.ttf')
  fontData.cousineBold = loadFont('Cousine-Bold.ttf')
  // Merriweather (Georgia alternative)
  fontData.merriweatherRegular = loadFont('Merriweather-Regular.ttf')
  fontData.merriweatherBold = loadFont('Merriweather-Bold.ttf')
  // Oswald (Impact alternative)
  fontData.oswaldRegular = loadFont('Oswald-Regular.ttf')
  fontData.oswaldBold = loadFont('Oswald-Bold.ttf')
  // Source Code Pro (Monaco alternative)
  fontData.sourceCodeProRegular = loadFont('SourceCodePro-Regular.ttf')
  fontData.sourceCodeProBold = loadFont('SourceCodePro-Bold.ttf')
  // Open Sans (Verdana alternative)
  fontData.openSansRegular = loadFont('OpenSans-Regular.ttf')
  fontData.openSansBold = loadFont('OpenSans-Bold.ttf')
  // Source Sans 3 (Trebuchet alternative)
  fontData.sourceSans3Regular = loadFont('SourceSans3-Regular.ttf')
  fontData.sourceSans3Bold = loadFont('SourceSans3-Bold.ttf')
  // Tinos (Times New Roman alternative)
  fontData.tinosRegular = loadFont('Tinos-Regular.ttf')
  fontData.tinosBold = loadFont('Tinos-Bold.ttf')

  fontsLoaded = true
  console.log('Satori server fonts loaded successfully (10 font families)')
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
  if (!fontsLoaded) {
    throw new Error('Fonts not loaded')
  }

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
      // Inter (default)
      { name: 'Inter', data: fontData.interLight, weight: 300, style: 'normal' },
      { name: 'Inter', data: fontData.interRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: fontData.interSemiBold, weight: 600, style: 'normal' },
      { name: 'Inter', data: fontData.interBold, weight: 700, style: 'normal' },
      // Arimo (Arial alternative)
      { name: 'Arimo', data: fontData.arimoRegular, weight: 400, style: 'normal' },
      { name: 'Arimo', data: fontData.arimoBold, weight: 700, style: 'normal' },
      // Comic Neue
      { name: 'Comic Neue', data: fontData.comicNeueRegular, weight: 400, style: 'normal' },
      { name: 'Comic Neue', data: fontData.comicNeueBold, weight: 700, style: 'normal' },
      // Cousine (Courier alternative)
      { name: 'Cousine', data: fontData.cousineRegular, weight: 400, style: 'normal' },
      { name: 'Cousine', data: fontData.cousineBold, weight: 700, style: 'normal' },
      // Merriweather (Georgia alternative)
      { name: 'Merriweather', data: fontData.merriweatherRegular, weight: 400, style: 'normal' },
      { name: 'Merriweather', data: fontData.merriweatherBold, weight: 700, style: 'normal' },
      // Oswald (Impact alternative)
      { name: 'Oswald', data: fontData.oswaldRegular, weight: 400, style: 'normal' },
      { name: 'Oswald', data: fontData.oswaldBold, weight: 700, style: 'normal' },
      // Source Code Pro (Monaco alternative)
      { name: 'Source Code Pro', data: fontData.sourceCodeProRegular, weight: 400, style: 'normal' },
      { name: 'Source Code Pro', data: fontData.sourceCodeProBold, weight: 700, style: 'normal' },
      // Open Sans (Verdana alternative)
      { name: 'Open Sans', data: fontData.openSansRegular, weight: 400, style: 'normal' },
      { name: 'Open Sans', data: fontData.openSansBold, weight: 700, style: 'normal' },
      // Source Sans 3 (Trebuchet alternative)
      { name: 'Source Sans 3', data: fontData.sourceSans3Regular, weight: 400, style: 'normal' },
      { name: 'Source Sans 3', data: fontData.sourceSans3Bold, weight: 700, style: 'normal' },
      // Tinos (Times New Roman alternative)
      { name: 'Tinos', data: fontData.tinosRegular, weight: 400, style: 'normal' },
      { name: 'Tinos', data: fontData.tinosBold, weight: 700, style: 'normal' },
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
