import { useEffect, useRef, useState, forwardRef } from 'react'
import type { Ref } from 'react'
import type React from 'react'
import type { ThumbnailPreset } from '../lib/types'
import { drawThumbnail, drawThumbnailWithoutBackground } from '../lib/canvas-utils'

interface CanvasPreviewProps {
  preset: ThumbnailPreset
  title: string
  subtitle: string
  titleColor: string
  subtitleColor: string
  logoOpacity: number
  backgroundImage: string
  customLogo?: string
}

export const CanvasPreview = forwardRef<HTMLCanvasElement, CanvasPreviewProps>(
  (
    {
      preset,
      title,
      subtitle,
      titleColor,
      subtitleColor,
      logoOpacity,
      backgroundImage,
      customLogo,
    },
    ref: Ref<HTMLCanvasElement>
  ) => {
    const internalRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = (ref as React.MutableRefObject<HTMLCanvasElement | null>) || internalRef

    // Store loaded images in refs to avoid reloading
    const logoImgRef = useRef<HTMLImageElement>(new window.Image())
    const backgroundImgRef = useRef<HTMLImageElement>(new window.Image())
    const backgroundLoadedRef = useRef(false)
    const logoLoadedRef = useRef(false)
    const [renderTrigger, setRenderTrigger] = useState(false)

    // Effect to load logo image (only when customLogo changes)
    useEffect(() => {
      const logoImg = new window.Image()
      logoImg.crossOrigin = 'anonymous'
      logoImgRef.current = logoImg

      let isMounted = true

      logoImg.onload = () => {
        if (isMounted) {
          logoLoadedRef.current = true
          setRenderTrigger((prev) => !prev)
        }
      }

      logoImg.onerror = () => {
        if (isMounted) {
          console.error('Failed to load logo image')
          logoLoadedRef.current = false
          setRenderTrigger((prev) => !prev)
        }
      }

      // Load logo image - use custom logo if provided, otherwise use default
      logoImg.src = customLogo || '/frameit-logo.png'

      return () => {
        isMounted = false
      }
    }, [customLogo])

    // Effect to load background image (only when backgroundImage changes)
    useEffect(() => {
      const backgroundImg = new window.Image()
      backgroundImg.crossOrigin = 'anonymous'
      backgroundImgRef.current = backgroundImg

      let isMounted = true

      backgroundImg.onload = () => {
        if (isMounted) {
          backgroundLoadedRef.current = true
          setRenderTrigger((prev) => !prev)
        }
      }

      backgroundImg.onerror = () => {
        if (isMounted) {
          backgroundLoadedRef.current = false
          setRenderTrigger((prev) => !prev)
        }
      }

      // Only set background image if it's not empty
      if (backgroundImage) {
        backgroundImg.src = backgroundImage
      } else {
        backgroundLoadedRef.current = true
        // Trigger state update asynchronously to avoid cascading renders
        setTimeout(() => {
          setRenderTrigger((prev) => !prev)
        }, 0)
      }

      return () => {
        isMounted = false
      }
    }, [backgroundImage])

    // Effect to render canvas (when content/styling changes or images load)
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Only set canvas dimensions if the preset changed (this clears the canvas)
      if (canvas.width !== preset.width || canvas.height !== preset.height) {
        canvas.width = preset.width
        canvas.height = preset.height
      }

      const logoImg = logoImgRef.current
      const backgroundImg = backgroundImgRef.current

      if (backgroundLoadedRef.current && backgroundImg) {
        drawThumbnail(ctx, canvas, backgroundImg, {
          title,
          subtitle,
          titleColor,
          subtitleColor,
          logoOpacity,
          logoImage: logoLoadedRef.current ? logoImg || undefined : undefined,
        })
      } else {
        drawThumbnailWithoutBackground(ctx, canvas, {
          title,
          subtitle,
          titleColor,
          subtitleColor,
          logoOpacity,
          logoImage: logoLoadedRef.current ? logoImg || undefined : undefined,
        })
      }
      // renderTrigger is included to ensure this effect re-runs when images finish loading
    }, [preset, title, subtitle, titleColor, subtitleColor, logoOpacity, canvasRef, renderTrigger])

    return (
      <canvas
        ref={ref}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'block',
        }}
      />
    )
  }
)

CanvasPreview.displayName = 'CanvasPreview'
