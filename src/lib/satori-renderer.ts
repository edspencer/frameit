import satori from 'satori'
import type { ThumbnailConfig } from './types'
import { getLayoutComponent } from './layouts'

interface FontData {
  regular: ArrayBuffer | null
  bold: ArrayBuffer | null
  semibold: ArrayBuffer | null
  light: ArrayBuffer | null
}

const fonts: FontData = {
  regular: null,
  bold: null,
  semibold: null,
  light: null,
}

let fontLoadPromise: Promise<void> | null = null

export async function loadFonts(): Promise<void> {
  if (fonts.regular) return
  if (fontLoadPromise) return fontLoadPromise

  fontLoadPromise = (async () => {
    const [regular, bold, semibold, light] = await Promise.all([
      fetch('/fonts/Inter-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Inter-Bold.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Inter-SemiBold.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Inter-Light.ttf').then(r => r.arrayBuffer()),
    ])
    fonts.regular = regular
    fonts.bold = bold
    fonts.semibold = semibold
    fonts.light = light
  })()

  return fontLoadPromise
}

export async function renderToSvg(
  layoutId: string,
  config: ThumbnailConfig
): Promise<string> {
  await loadFonts()

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
        data: fonts.light!,
        weight: 300,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: fonts.regular!,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: fonts.semibold!,
        weight: 600,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: fonts.bold!,
        weight: 700,
        style: 'normal',
      },
    ],
  })
}
