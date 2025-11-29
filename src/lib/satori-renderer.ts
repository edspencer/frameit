import satori from 'satori'
import type { ThumbnailConfig } from './types'
import { getLayoutComponent } from './layouts'

interface FontWeight {
  regular: ArrayBuffer | null
  bold: ArrayBuffer | null
}

interface InterFontWeight extends FontWeight {
  semibold: ArrayBuffer | null
  light: ArrayBuffer | null
}

// Font family definitions with their file paths
const FONT_DEFINITIONS: Record<string, { regular: string; bold: string; semibold?: string; light?: string }> = {
  Inter: {
    regular: '/fonts/Inter-Regular.ttf',
    bold: '/fonts/Inter-Bold.ttf',
    semibold: '/fonts/Inter-SemiBold.ttf',
    light: '/fonts/Inter-Light.ttf',
  },
  Arimo: {
    regular: '/fonts/Arimo-Regular.ttf',
    bold: '/fonts/Arimo-Bold.ttf',
  },
  'Comic Neue': {
    regular: '/fonts/ComicNeue-Regular.ttf',
    bold: '/fonts/ComicNeue-Bold.ttf',
  },
  Cousine: {
    regular: '/fonts/Cousine-Regular.ttf',
    bold: '/fonts/Cousine-Bold.ttf',
  },
  Merriweather: {
    regular: '/fonts/Merriweather-Regular.ttf',
    bold: '/fonts/Merriweather-Bold.ttf',
  },
  Oswald: {
    regular: '/fonts/Oswald-Regular.ttf',
    bold: '/fonts/Oswald-Bold.ttf',
  },
  'Source Code Pro': {
    regular: '/fonts/SourceCodePro-Regular.ttf',
    bold: '/fonts/SourceCodePro-Bold.ttf',
  },
  'Open Sans': {
    regular: '/fonts/OpenSans-Regular.ttf',
    bold: '/fonts/OpenSans-Bold.ttf',
  },
  'Source Sans 3': {
    regular: '/fonts/SourceSans3-Regular.ttf',
    bold: '/fonts/SourceSans3-Bold.ttf',
  },
  Tinos: {
    regular: '/fonts/Tinos-Regular.ttf',
    bold: '/fonts/Tinos-Bold.ttf',
  },
}

// Loaded fonts cache
const loadedFonts: Record<string, FontWeight | InterFontWeight> = {}

// Track in-progress font loads to prevent duplicate fetches
const fontLoadPromises: Map<string, Promise<void>> = new Map()

/**
 * Load Inter font (the default) - called on initial page load
 */
export async function loadDefaultFont(): Promise<void> {
  await loadFont('Inter')
}

/**
 * Load a specific font family on-demand
 */
export async function loadFont(fontFamily: string): Promise<void> {
  // Already loaded
  if (loadedFonts[fontFamily]) return

  // Already loading
  const existingPromise = fontLoadPromises.get(fontFamily)
  if (existingPromise) {
    return existingPromise
  }

  const fontDef = FONT_DEFINITIONS[fontFamily]
  if (!fontDef) {
    console.warn(`Unknown font family: ${fontFamily}`)
    return
  }

  const loadPromise = (async () => {
    const fetches = [
      fetch(fontDef.regular).then(r => r.arrayBuffer()),
      fetch(fontDef.bold).then(r => r.arrayBuffer()),
    ]

    // Inter has extra weights
    if (fontDef.semibold) {
      fetches.push(fetch(fontDef.semibold).then(r => r.arrayBuffer()))
    }
    if (fontDef.light) {
      fetches.push(fetch(fontDef.light).then(r => r.arrayBuffer()))
    }

    const results = await Promise.all(fetches)

    if (fontFamily === 'Inter') {
      loadedFonts[fontFamily] = {
        regular: results[0],
        bold: results[1],
        semibold: results[2] || null,
        light: results[3] || null,
      }
    } else {
      loadedFonts[fontFamily] = {
        regular: results[0],
        bold: results[1],
      }
    }
  })()

  fontLoadPromises.set(fontFamily, loadPromise)
  return loadPromise
}

/**
 * Load multiple fonts at once (for batch loading)
 */
export async function loadFonts(fontFamilies: string[]): Promise<void> {
  await Promise.all(fontFamilies.map(f => loadFont(f)))
}

/**
 * Check if a font is already loaded
 */
export function isFontLoaded(fontFamily: string): boolean {
  return !!loadedFonts[fontFamily]
}

// Satori weight type
type SatoriWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

interface SatoriFont {
  name: string
  data: ArrayBuffer
  weight: SatoriWeight
  style: 'normal' | 'italic'
}

/**
 * Get all currently loaded fonts in Satori format
 */
function getSatoriFonts(): SatoriFont[] {
  const fonts: SatoriFont[] = []

  for (const [name, fontWeight] of Object.entries(loadedFonts)) {
    if (fontWeight.regular) {
      fonts.push({ name, data: fontWeight.regular, weight: 400, style: 'normal' })
    }
    if (fontWeight.bold) {
      fonts.push({ name, data: fontWeight.bold, weight: 700, style: 'normal' })
    }

    // Inter has extra weights
    if ('semibold' in fontWeight && fontWeight.semibold) {
      fonts.push({ name, data: fontWeight.semibold, weight: 600, style: 'normal' })
    }
    if ('light' in fontWeight && fontWeight.light) {
      fonts.push({ name, data: fontWeight.light, weight: 300, style: 'normal' })
    }
  }

  return fonts
}

/**
 * Extract all font families used in a config
 */
function getUsedFonts(config: ThumbnailConfig): string[] {
  const usedFonts = new Set<string>()

  // Always include Inter as the default/fallback
  usedFonts.add('Inter')

  // Check all text elements for custom font families
  for (const textEl of config.textElements) {
    if (textEl.fontFamily) {
      usedFonts.add(textEl.fontFamily)
    }
  }

  return Array.from(usedFonts)
}

export async function renderToSvg(
  layoutId: string,
  config: ThumbnailConfig
): Promise<string> {
  // Load only the fonts that are actually used in this config
  const usedFonts = getUsedFonts(config)
  await loadFonts(usedFonts)

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
    fonts: getSatoriFonts(),
  })
}
