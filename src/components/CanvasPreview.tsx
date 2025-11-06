import { useEffect, useRef, forwardRef } from 'react'
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
    },
    ref: Ref<HTMLCanvasElement>
  ) => {
    const internalRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = (ref as React.MutableRefObject<HTMLCanvasElement | null>) || internalRef

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

      // Create a working image for background
      const backgroundImg = new window.Image()

      backgroundImg.crossOrigin = 'anonymous'

      let backgroundLoaded = false

      const handleBothLoaded = () => {
        if (backgroundLoaded) {
          drawThumbnail(ctx, canvas, backgroundImg, {
            title,
            subtitle,
            titleColor,
            subtitleColor,
            logoOpacity,
          })
        } else {
          drawThumbnailWithoutBackground(ctx, canvas, {
            title,
            subtitle,
            titleColor,
            subtitleColor,
            logoOpacity,
          })
        }
      }

      backgroundImg.onload = () => {
        backgroundLoaded = true
        handleBothLoaded()
      }

      backgroundImg.onerror = () => {
        backgroundLoaded = false
        handleBothLoaded()
      }

      // Only set background image if it's not empty
      if (backgroundImage) {
        backgroundImg.src = backgroundImage
      } else {
        backgroundLoaded = true
        handleBothLoaded()
      }
    }, [preset, title, subtitle, titleColor, subtitleColor, logoOpacity, backgroundImage, canvasRef])

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
