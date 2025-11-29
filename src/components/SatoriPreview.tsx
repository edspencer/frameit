import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import type { ThumbnailConfig, LayoutDefinition } from '../lib/types'
import { renderToSvg, loadDefaultFont } from '../lib/satori-renderer'

interface SatoriPreviewProps {
  config: ThumbnailConfig
  layout: LayoutDefinition
}

export interface SatoriPreviewHandle {
  getSvg: () => string | null
  getConfig: () => ThumbnailConfig
}

export const SatoriPreview = forwardRef<SatoriPreviewHandle, SatoriPreviewProps>(
  ({ config, layout }, ref) => {
    const [svgContent, setSvgContent] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const svgRef = useRef<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      getSvg: () => svgRef.current,
      getConfig: () => config,
    }))

    // Load only the default font (Inter) on mount
    // Other fonts are loaded on-demand when selected
    useEffect(() => {
      loadDefaultFont().catch(err => {
        console.error('Failed to load fonts:', err)
        setError('Failed to load fonts')
      })
    }, [])

    // Render SVG when config changes
    useEffect(() => {
      let isMounted = true

      // Using async IIFE to handle the render
      const doRender = async () => {
        try {
          const svg = await renderToSvg(layout.id, config)
          if (isMounted) {
            svgRef.current = svg
            setSvgContent(svg)
            setIsLoading(false)
            setError(null)
          }
        } catch (err) {
          if (isMounted) {
            console.error('Failed to render:', err)
            setError(err instanceof Error ? err.message : 'Render failed')
            setIsLoading(false)
          }
        }
      }

      // Don't clear existing content - keep showing old SVG while new one renders
      // This prevents the flash/loading state from appearing on every update
      doRender()

      return () => {
        isMounted = false
      }
    }, [config, layout])

    if (error) {
      return (
        <div
          style={{
            width: '100%',
            aspectRatio: `${config.preset.width} / ${config.preset.height}`,
            maxWidth: '100%',
            maxHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e293b',
            color: '#ef4444',
          }}
        >
          Error: {error}
        </div>
      )
    }

    if (isLoading || !svgContent) {
      return (
        <div
          style={{
            width: '100%',
            aspectRatio: `${config.preset.width} / ${config.preset.height}`,
            maxWidth: '100%',
            maxHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e293b',
            color: '#64748b',
          }}
        >
          Loading...
        </div>
      )
    }

    // The SVG has fixed width/height attributes from Satori.
    // We need to make it scale to fit the container while maintaining aspect ratio.
    // CSS on the wrapper targets the child SVG element.
    return (
      <div
        ref={containerRef}
        style={{
          maxWidth: '100%',
          maxHeight: '80vh',
          width: 'fit-content',
          height: 'auto',
        }}
      >
        <style>{`
          .satori-preview-svg svg {
            max-width: 100%;
            max-height: 80vh;
            width: auto;
            height: auto;
            display: block;
          }
        `}</style>
        <div
          className="satori-preview-svg"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    )
  }
)

SatoriPreview.displayName = 'SatoriPreview'
