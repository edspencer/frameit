import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import type { ThumbnailConfigNew, LayoutDefinition } from '../lib/types'
import { LayoutRenderer } from '../lib/layout-renderer'

interface CanvasPreviewProps {
  config: ThumbnailConfigNew
  layout: LayoutDefinition
}

export const CanvasPreview = forwardRef<HTMLCanvasElement, CanvasPreviewProps>(
  ({ config, layout }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rendererRef = useRef<LayoutRenderer>(new LayoutRenderer())

    // Store loaded images in refs to avoid reloading
    const logoImgRef = useRef<HTMLImageElement | null>(null)
    const backgroundImgRef = useRef<HTMLImageElement | null>(null)
    const backgroundLoadedRef = useRef(false)
    const logoLoadedRef = useRef(false)
    const [renderTrigger, setRenderTrigger] = useState(0)

    // Expose canvas ref to parent
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement)

    // Effect to load logo image
    useEffect(() => {
      const logoEl = config.imageElements.find((i) => i.id === 'logo')
      if (!logoEl?.url) {
        logoImgRef.current = null
        logoLoadedRef.current = false
        // No need to trigger render - the main render effect will handle it
        return
      }

      const logoImg = new window.Image()
      logoImg.crossOrigin = 'anonymous'
      logoImgRef.current = logoImg

      let isMounted = true
      let loadTimeout: ReturnType<typeof setTimeout> | null = null

      // Reset loaded state while loading new image
      logoLoadedRef.current = false

      const handleLoadComplete = () => {
        if (isMounted) {
          logoLoadedRef.current = true
          if (loadTimeout) clearTimeout(loadTimeout)
          setRenderTrigger((prev) => prev + 1)
        }
      }

      logoImg.onload = handleLoadComplete

      logoImg.onerror = () => {
        if (isMounted) {
          console.error('Failed to load logo image')
          logoLoadedRef.current = false
          if (loadTimeout) clearTimeout(loadTimeout)
          setRenderTrigger((prev) => prev + 1)
        }
      }

      logoImg.src = logoEl.url

      // Fallback: if load event doesn't fire within reasonable time, force render anyway
      loadTimeout = setTimeout(() => {
        if (isMounted && logoImg.complete) {
          handleLoadComplete()
        }
      }, 100)

      return () => {
        isMounted = false
        if (loadTimeout) clearTimeout(loadTimeout)
      }
    }, [config.imageElements])

    // Effect to load background image
    useEffect(() => {
      if (!config.background.imageUrl) {
        backgroundImgRef.current = null
        backgroundLoadedRef.current = false
        // No need to trigger render - the main render effect will handle it
        return
      }

      const backgroundImg = new window.Image()
      backgroundImg.crossOrigin = 'anonymous'
      backgroundImgRef.current = backgroundImg

      let isMounted = true
      let loadTimeout: ReturnType<typeof setTimeout> | null = null

      const handleLoadComplete = () => {
        if (isMounted) {
          backgroundLoadedRef.current = true
          if (loadTimeout) clearTimeout(loadTimeout)
          setRenderTrigger((prev) => prev + 1)
        }
      }

      backgroundImg.onload = handleLoadComplete

      backgroundImg.onerror = () => {
        if (isMounted) {
          backgroundLoadedRef.current = false
          if (loadTimeout) clearTimeout(loadTimeout)
          setRenderTrigger((prev) => prev + 1)
        }
      }

      backgroundImg.src = config.background.imageUrl

      // Fallback: if load event doesn't fire within reasonable time, force render anyway
      loadTimeout = setTimeout(() => {
        if (isMounted && backgroundImg.complete) {
          handleLoadComplete()
        }
      }, 100)

      return () => {
        isMounted = false
        if (loadTimeout) clearTimeout(loadTimeout)
      }
    }, [config.background.imageUrl])

    // Effect to render canvas (when content/styling changes or images load)
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Only set canvas dimensions if the preset changed (this clears the canvas)
      if (canvas.width !== config.preset.width || canvas.height !== config.preset.height) {
        canvas.width = config.preset.width
        canvas.height = config.preset.height
      }

      const logoImg = logoImgRef.current
      const backgroundImg = backgroundImgRef.current

      // Build map of loaded images
      const loadedImages = new Map<string, HTMLImageElement>()
      if (logoLoadedRef.current && logoImg) loadedImages.set('logo', logoImg)
      if (backgroundLoadedRef.current && backgroundImg) loadedImages.set('background', backgroundImg)

      // Render using the new LayoutRenderer
      rendererRef.current.render(ctx, canvas, config, layout, loadedImages)
    }, [config, layout, renderTrigger])

    return (
      <canvas
        ref={canvasRef}
        width={config.preset.width}
        height={config.preset.height}
        style={{
          maxWidth: '100%',
          maxHeight: '80vh',
          width: 'auto',
          height: 'auto',
          display: 'block',
        }}
      />
    )
  }
)

CanvasPreview.displayName = 'CanvasPreview'
