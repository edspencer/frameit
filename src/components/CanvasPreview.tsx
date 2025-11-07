import { useEffect, useRef, useState, forwardRef } from 'react'
import type { Ref } from 'react'
import type React from 'react'
import type { ThumbnailPreset } from '../lib/types'
import { drawThumbnail } from '../lib/canvas-utils'

interface CanvasPreviewProps {
  preset: ThumbnailPreset
  title: string
  subtitle: string
  titleColor: string
  subtitleColor: string
  logoOpacity: number
  gradientColorStart: string
  gradientColorEnd: string
  backgroundImageUrl?: string
  backgroundImageScale?: number
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
      gradientColorStart,
      gradientColorEnd,
      backgroundImageUrl,
      backgroundImageScale,
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
    const [renderTrigger, setRenderTrigger] = useState(0)

    // Effect to load logo image (only when customLogo changes)
    useEffect(() => {
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

      // Load logo image - use custom logo if provided, otherwise use default
      const logoSrc = customLogo || '/frameit-logo.png'
      logoImg.src = logoSrc

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
    }, [customLogo])

    // Effect to load background image (only when backgroundImageUrl changes)
    useEffect(() => {
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

      // Only set background image if it's provided
      if (backgroundImageUrl) {
        backgroundImg.src = backgroundImageUrl
        // Fallback: if load event doesn't fire within reasonable time, force render anyway
        loadTimeout = setTimeout(() => {
          if (isMounted && backgroundImg.complete) {
            handleLoadComplete()
          }
        }, 100)
      } else {
        backgroundLoadedRef.current = false
        // Trigger state update asynchronously to avoid cascading renders
        loadTimeout = setTimeout(() => {
          if (isMounted) {
            setRenderTrigger((prev) => prev + 1)
          }
        }, 0)
      }

      return () => {
        isMounted = false
        if (loadTimeout) clearTimeout(loadTimeout)
      }
    }, [backgroundImageUrl])

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

      drawThumbnail(ctx, canvas, {
        title,
        subtitle,
        titleColor,
        subtitleColor,
        logoOpacity,
        gradientColorStart,
        gradientColorEnd,
        logoImage: logoLoadedRef.current ? logoImg || undefined : undefined,
        backgroundImage: backgroundLoadedRef.current && backgroundImg ? backgroundImg : undefined,
        backgroundImageScale,
      })
      // renderTrigger is included to ensure this effect re-runs when images finish loading
    }, [preset, title, subtitle, titleColor, subtitleColor, logoOpacity, gradientColorStart, gradientColorEnd, backgroundImageScale, canvasRef, renderTrigger])

    return (
      <canvas
        ref={ref}
        width={preset.width}
        height={preset.height}
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
