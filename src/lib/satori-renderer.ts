import satori from 'satori'
import type { ThumbnailConfig } from './types'
import { getLayoutComponent } from './layouts'

interface FontWeight {
  regular: ArrayBuffer | null
  bold: ArrayBuffer | null
}

interface FontCollection {
  inter: FontWeight & { semibold: ArrayBuffer | null; light: ArrayBuffer | null }
  arimo: FontWeight
  comicNeue: FontWeight
  cousine: FontWeight
  merriweather: FontWeight
  oswald: FontWeight
  sourceCodePro: FontWeight
  openSans: FontWeight
  sourceSans3: FontWeight
  tinos: FontWeight
}

const fonts: FontCollection = {
  inter: { regular: null, bold: null, semibold: null, light: null },
  arimo: { regular: null, bold: null },
  comicNeue: { regular: null, bold: null },
  cousine: { regular: null, bold: null },
  merriweather: { regular: null, bold: null },
  oswald: { regular: null, bold: null },
  sourceCodePro: { regular: null, bold: null },
  openSans: { regular: null, bold: null },
  sourceSans3: { regular: null, bold: null },
  tinos: { regular: null, bold: null },
}

let fontLoadPromise: Promise<void> | null = null

export async function loadFonts(): Promise<void> {
  if (fonts.inter.regular) return
  if (fontLoadPromise) return fontLoadPromise

  fontLoadPromise = (async () => {
    const [
      // Inter
      interRegular, interBold, interSemibold, interLight,
      // Arimo (Arial alternative)
      arimoRegular, arimoBold,
      // Comic Neue
      comicNeueRegular, comicNeueBold,
      // Cousine (Courier alternative)
      cousineRegular, cousineBold,
      // Merriweather (Georgia alternative)
      merriweatherRegular, merriweatherBold,
      // Oswald (Impact alternative)
      oswaldRegular, oswaldBold,
      // Source Code Pro (Monaco alternative)
      sourceCodeProRegular, sourceCodeProBold,
      // Open Sans (Verdana alternative)
      openSansRegular, openSansBold,
      // Source Sans 3 (Trebuchet alternative)
      sourceSans3Regular, sourceSans3Bold,
      // Tinos (Times New Roman alternative)
      tinosRegular, tinosBold,
    ] = await Promise.all([
      // Inter
      fetch('/fonts/Inter-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Inter-Bold.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Inter-SemiBold.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Inter-Light.ttf').then(r => r.arrayBuffer()),
      // Arimo
      fetch('/fonts/Arimo-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Arimo-Bold.ttf').then(r => r.arrayBuffer()),
      // Comic Neue
      fetch('/fonts/ComicNeue-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/ComicNeue-Bold.ttf').then(r => r.arrayBuffer()),
      // Cousine
      fetch('/fonts/Cousine-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Cousine-Bold.ttf').then(r => r.arrayBuffer()),
      // Merriweather
      fetch('/fonts/Merriweather-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Merriweather-Bold.ttf').then(r => r.arrayBuffer()),
      // Oswald
      fetch('/fonts/Oswald-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Oswald-Bold.ttf').then(r => r.arrayBuffer()),
      // Source Code Pro
      fetch('/fonts/SourceCodePro-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/SourceCodePro-Bold.ttf').then(r => r.arrayBuffer()),
      // Open Sans
      fetch('/fonts/OpenSans-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/OpenSans-Bold.ttf').then(r => r.arrayBuffer()),
      // Source Sans 3
      fetch('/fonts/SourceSans3-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/SourceSans3-Bold.ttf').then(r => r.arrayBuffer()),
      // Tinos
      fetch('/fonts/Tinos-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Tinos-Bold.ttf').then(r => r.arrayBuffer()),
    ])

    fonts.inter = { regular: interRegular, bold: interBold, semibold: interSemibold, light: interLight }
    fonts.arimo = { regular: arimoRegular, bold: arimoBold }
    fonts.comicNeue = { regular: comicNeueRegular, bold: comicNeueBold }
    fonts.cousine = { regular: cousineRegular, bold: cousineBold }
    fonts.merriweather = { regular: merriweatherRegular, bold: merriweatherBold }
    fonts.oswald = { regular: oswaldRegular, bold: oswaldBold }
    fonts.sourceCodePro = { regular: sourceCodeProRegular, bold: sourceCodeProBold }
    fonts.openSans = { regular: openSansRegular, bold: openSansBold }
    fonts.sourceSans3 = { regular: sourceSans3Regular, bold: sourceSans3Bold }
    fonts.tinos = { regular: tinosRegular, bold: tinosBold }
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
      // Inter (default)
      { name: 'Inter', data: fonts.inter.light!, weight: 300, style: 'normal' },
      { name: 'Inter', data: fonts.inter.regular!, weight: 400, style: 'normal' },
      { name: 'Inter', data: fonts.inter.semibold!, weight: 600, style: 'normal' },
      { name: 'Inter', data: fonts.inter.bold!, weight: 700, style: 'normal' },
      // Arimo (Arial alternative)
      { name: 'Arimo', data: fonts.arimo.regular!, weight: 400, style: 'normal' },
      { name: 'Arimo', data: fonts.arimo.bold!, weight: 700, style: 'normal' },
      // Comic Neue
      { name: 'Comic Neue', data: fonts.comicNeue.regular!, weight: 400, style: 'normal' },
      { name: 'Comic Neue', data: fonts.comicNeue.bold!, weight: 700, style: 'normal' },
      // Cousine (Courier alternative)
      { name: 'Cousine', data: fonts.cousine.regular!, weight: 400, style: 'normal' },
      { name: 'Cousine', data: fonts.cousine.bold!, weight: 700, style: 'normal' },
      // Merriweather (Georgia alternative)
      { name: 'Merriweather', data: fonts.merriweather.regular!, weight: 400, style: 'normal' },
      { name: 'Merriweather', data: fonts.merriweather.bold!, weight: 700, style: 'normal' },
      // Oswald (Impact alternative)
      { name: 'Oswald', data: fonts.oswald.regular!, weight: 400, style: 'normal' },
      { name: 'Oswald', data: fonts.oswald.bold!, weight: 700, style: 'normal' },
      // Source Code Pro (Monaco alternative)
      { name: 'Source Code Pro', data: fonts.sourceCodePro.regular!, weight: 400, style: 'normal' },
      { name: 'Source Code Pro', data: fonts.sourceCodePro.bold!, weight: 700, style: 'normal' },
      // Open Sans (Verdana alternative)
      { name: 'Open Sans', data: fonts.openSans.regular!, weight: 400, style: 'normal' },
      { name: 'Open Sans', data: fonts.openSans.bold!, weight: 700, style: 'normal' },
      // Source Sans 3 (Trebuchet alternative)
      { name: 'Source Sans 3', data: fonts.sourceSans3.regular!, weight: 400, style: 'normal' },
      { name: 'Source Sans 3', data: fonts.sourceSans3.bold!, weight: 700, style: 'normal' },
      // Tinos (Times New Roman alternative)
      { name: 'Tinos', data: fonts.tinos.regular!, weight: 400, style: 'normal' },
      { name: 'Tinos', data: fonts.tinos.bold!, weight: 700, style: 'normal' },
    ],
  })
}
