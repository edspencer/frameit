import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import type { ThumbnailConfig, LayoutDefinition } from '../lib/types'
import { LayoutRenderer } from '../lib/layout-renderer'

interface CanvasPreviewProps {
  config: ThumbnailConfig
  layout: LayoutDefinition
}

export const CanvasPreview = forwardRef<HTMLCanvasElement, CanvasPreviewProps>(
  ({ config, layout }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rendererRef = useRef<LayoutRenderer>(new LayoutRenderer())

    // Store loaded images Map in ref
    const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map())
    const [renderTrigger, setRenderTrigger] = useState(0)

    // Expose canvas ref to parent
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement)

    // Effect to load all image elements
    useEffect(() => {
      const imageElements = config.imageElements.filter((el) => el.url)
      if (imageElements.length === 0) {
        loadedImagesRef.current.clear()
        setRenderTrigger((prev) => prev + 1)
        return
      }

      let isMounted = true
      const newLoadedImages = new Map<string, HTMLImageElement>()
      let pendingLoads = imageElements.length

      const checkAllLoaded = () => {
        pendingLoads--
        if (pendingLoads === 0 && isMounted) {
          loadedImagesRef.current = newLoadedImages
          setRenderTrigger((prev) => prev + 1)
        }
      }

      // Load each image element
      for (const imageEl of imageElements) {
        const img = new window.Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
          if (isMounted) {
            newLoadedImages.set(imageEl.id, img)
            checkAllLoaded()
          }
        }

        img.onerror = () => {
          if (isMounted) {
            console.error(`Failed to load image: ${imageEl.id}`)
            checkAllLoaded()
          }
        }

        img.src = imageEl.url!
      }

      return () => {
        isMounted = false
      }
    }, [config.imageElements])

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

      // Render using the new LayoutRenderer
      rendererRef.current.render(ctx, canvas, config, layout, loadedImagesRef.current)
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
