import { useEffect, useRef, forwardRef, Ref } from 'react'
import type { ThumbnailPreset } from '../lib/types'
import { drawThumbnail, drawThumbnailWithoutBackground } from '../lib/canvas-utils'

interface CanvasPreviewProps {
  preset: ThumbnailPreset
  title: string
  subtitle: string
  textColor: string
  logoOpacity: number
  backgroundImage: string
}

export const CanvasPreview = forwardRef<HTMLCanvasElement, CanvasPreviewProps>(
  (
    {
      preset,
      title,
      subtitle,
      textColor,
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

      // Set canvas dimensions
      canvas.width = preset.width
      canvas.height = preset.height

      // Create a working image for background
      const backgroundImg = new window.Image()

      backgroundImg.crossOrigin = 'anonymous'

      let backgroundLoaded = false

      const handleBothLoaded = () => {
        if (backgroundLoaded) {
          drawThumbnail(ctx, canvas, backgroundImg, {
            title,
            subtitle,
            textColor,
            logoOpacity,
          })
        } else {
          drawThumbnailWithoutBackground(ctx, canvas, {
            title,
            subtitle,
            textColor,
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
    }, [preset, title, subtitle, textColor, logoOpacity, backgroundImage, canvasRef])

    return (
      <div className="bg-slate-900 p-8 flex items-center justify-center min-h-96 rounded-lg border border-slate-700">
        <canvas
          ref={ref}
          className="border border-slate-700 rounded-lg shadow-2xl"
        />
      </div>
    )
  }
)

CanvasPreview.displayName = 'CanvasPreview'
