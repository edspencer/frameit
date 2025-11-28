import { Resvg, initWasm } from '@resvg/resvg-wasm'

let wasmInitialized = false
let wasmInitPromise: Promise<void> | null = null

export async function initResvg(): Promise<void> {
  if (wasmInitialized) return
  if (wasmInitPromise) return wasmInitPromise

  wasmInitPromise = (async () => {
    await initWasm(fetch('/resvg.wasm'))
    wasmInitialized = true
  })()

  return wasmInitPromise
}

export async function svgToPng(
  svg: string,
  width: number,
  _height: number
): Promise<Blob> {
  await initResvg()

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
  })

  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  // Create Blob from Uint8Array - copy to new ArrayBuffer to avoid SharedArrayBuffer issues
  return new Blob([new Uint8Array(pngBuffer)], { type: 'image/png' })
}
