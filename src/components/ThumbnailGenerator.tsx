import { useState, useRef, useEffect } from 'react'
import { PRESETS, GRADIENTS, LAYOUTS } from '../lib/constants'
import type { ThumbnailPreset, ThumbnailConfigNew } from '../lib/types'
import { CanvasPreview } from './CanvasPreview'
import { ControlPanel } from './ControlPanel'
import { Tooltip } from './Tooltip'
import { FeedbackWidget } from '@wishnova/react'
import '@wishnova/react/styles'

const STORAGE_KEY = 'thumbnailGeneratorConfig'

function loadConfigFromStorage(): ThumbnailConfigNew | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)

    // Check if this is the new format (has textElements and imageElements)
    if (parsed.textElements && parsed.imageElements) {
      // Restore preset object from name
      if (parsed.presetName) {
        const preset = PRESETS.find(p => p.name === parsed.presetName)
        if (preset) parsed.preset = preset
      }
      return parsed as ThumbnailConfigNew
    }

    // Old format detected - return null to use default config
    console.log('Old config format detected, using defaults')
    return null
  } catch (err) {
    console.error('Failed to load config:', err)
    return null
  }
}

function saveConfigToStorage(config: ThumbnailConfigNew): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      presetName: config.preset.name,
      layoutId: config.layoutId,
      background: config.background,
      textElements: config.textElements,
      imageElements: config.imageElements,
    }))
  } catch (err) {
    console.error('Failed to save config:', err)
  }
}

function getDefaultConfig(): ThumbnailConfigNew {
  return {
    preset: PRESETS[0],
    layoutId: LAYOUTS[0].id,
    background: { type: 'gradient', gradientId: GRADIENTS[0].id },
    textElements: [
      { id: 'title', content: 'This is a template', color: '#ffffff' },
      { id: 'subtitle', content: 'Change layout, upload images, and edit text with the controls on the right', color: '#ffffff' },
      { id: 'artist', content: 'Artist Name', color: '#ffffff' },
    ],
    imageElements: [
      { id: 'logo', url: '/frameit-logo.png', opacity: 1.0, scale: 100 },
      { id: 'main-image', url: '/default-photo.jpg', opacity: 1.0, scale: 100 },
    ],
  }
}

export function ThumbnailGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(100)

  const savedConfig = loadConfigFromStorage()
  const [config, setConfig] = useState<ThumbnailConfigNew>(() => {
    const initialConfig = savedConfig || getDefaultConfig()
    const layout = LAYOUTS.find(l => l.id === initialConfig.layoutId) || LAYOUTS[0]

    // Ensure all layout elements exist in initial config
    const textElements = [...initialConfig.textElements]
    const imageElements = [...initialConfig.imageElements]

    for (const el of layout.elements) {
      if (el.type === 'text' && !textElements.find(t => t.id === el.id)) {
        textElements.push({ id: el.id, content: '', color: '#ffffff' })
      }
      if (el.type === 'image' && !imageElements.find(i => i.id === el.id)) {
        imageElements.push({ id: el.id, opacity: 1.0, scale: 100 })
      }
    }

    return { ...initialConfig, textElements, imageElements }
  })

  const selectedLayout = LAYOUTS.find(l => l.id === config.layoutId) || LAYOUTS[0]

  // Helper functions to update parts of config
  const updateTextElement = (id: string, updates: Partial<typeof config.textElements[0]>) => {
    setConfig(prev => ({
      ...prev,
      textElements: prev.textElements.map(el => el.id === id ? { ...el, ...updates } : el)
    }))
  }

  // Temporary preview for hover (doesn't save to state)
  const [previewState, setPreviewState] = useState<{
    id: string
    fontFamily?: string
    color?: string
    fontWeight?: number
  } | null>(null)

  const previewTextElement = (id: string, updates: { fontFamily?: string; color?: string; fontWeight?: number }) => {
    setPreviewState(prev => {
      // If same element, merge updates
      if (prev?.id === id) {
        return { ...prev, ...updates }
      }
      // New element, replace
      return { id, ...updates }
    })
  }

  const updateImageElement = (id: string, updates: Partial<typeof config.imageElements[0]>) => {
    setConfig(prev => ({
      ...prev,
      imageElements: prev.imageElements.map(el => el.id === id ? { ...el, ...updates } : el)
    }))
  }

  const updateBackground = (updates: Partial<typeof config.background>) => {
    setConfig(prev => ({ ...prev, background: { ...prev.background, ...updates } }))
  }

  const updatePreset = (preset: ThumbnailPreset) => {
    setConfig(prev => ({ ...prev, preset }))
  }

  const updateLayoutId = (layoutId: string) => {
    setConfig(prev => {
      const newLayout = LAYOUTS.find(l => l.id === layoutId) || LAYOUTS[0]

      // Copy existing elements
      const textElements = [...prev.textElements]
      const imageElements = [...prev.imageElements]

      // Ensure all layout elements exist in config (with defaults if missing)
      for (const el of newLayout.elements) {
        if (el.type === 'text' && !textElements.find(t => t.id === el.id)) {
          textElements.push({ id: el.id, content: '', color: '#ffffff' })
        }
        if (el.type === 'image' && !imageElements.find(i => i.id === el.id)) {
          imageElements.push({ id: el.id, opacity: 1.0, scale: 100 })
        }
      }

      return { ...prev, layoutId, textElements, imageElements }
    })
  }

  // No longer need to extract individual elements - ControlPanel does that internally

  // Save config to localStorage whenever any setting changes
  useEffect(() => {
    saveConfigToStorage(config)
  }, [config])

  // Track canvas display size to calculate zoom level
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateZoomLevel = () => {
      const displayWidth = canvas.offsetWidth
      const actualWidth = config.preset.width
      const zoom = Math.round((displayWidth / actualWidth) * 100)
      setZoomLevel(zoom)
    }

    // Initial calculation
    updateZoomLevel()

    // Watch for resize
    const resizeObserver = new ResizeObserver(updateZoomLevel)
    resizeObserver.observe(canvas)

    return () => {
      resizeObserver.disconnect()
    }
  }, [config.preset.width])

  const downloadThumbnail = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `thumbnail-${config.preset.name.toLowerCase().replace(/\s+/g, '-')}.png`
    link.click()
  }

  const copyToClipboard = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ])
          alert('Thumbnail copied to clipboard!')
        }
      })
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48" width="120" height="28.8" className="h-8" aria-label="FrameIt logo">
              <title>FrameIt logo</title>
              <rect x="0" y="0" width="48" height="48" rx="8" fill="hsl(221.2 83.2% 53.3%)"/>
              <text x="24" y="28" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">FI</text>
              <text x="60" y="27" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" fontSize="36" fontWeight="600" fill="white" dominantBaseline="middle">FrameIt</text>
            </svg>
          </div>
          <p className="text-slate-400">Create beautiful title images for thumbnails, OG images, and title cards</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Section */}
          <div className="lg:col-span-2 flex flex-col lg:sticky lg:top-6 lg:self-start">
            {/* Canvas Preview */}
            <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 p-4">
              <div className="flex items-center justify-center" style={{ maxHeight: '80vh' }}>
                <CanvasPreview
                  ref={canvasRef}
                  config={
                    previewState
                      ? {
                          ...config,
                          textElements: config.textElements.map(el =>
                            el.id === previewState.id
                              ? {
                                  ...el,
                                  ...(previewState.fontFamily && { fontFamily: previewState.fontFamily }),
                                  ...(previewState.color && { color: previewState.color }),
                                  ...(previewState.fontWeight !== undefined && { fontWeight: previewState.fontWeight })
                                }
                              : el
                          )
                        }
                      : config
                  }
                  layout={selectedLayout}
                />
              </div>
            </div>

            {/* Info and Buttons Below Canvas */}
            <div className="mt-6 space-y-4">
              {/* Info Section */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300">
                      Dimensions: {config.preset.width} × {config.preset.height}px ({config.preset.aspectRatio})
                    </p>
                    <p className="text-slate-400">Ready for download and screenshot capture</p>
                  </div>
                  <div className="text-sm text-slate-400 text-right">
                    <p className="flex items-center gap-1">
                      Preview zoom: {zoomLevel}%
                      <Tooltip
                        content={`Shows how the preview is scaled vs actual ${config.preset.width}×${config.preset.height}px. 100% = full size, lower = scaled to fit.`}
                      >
                        <span className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full bg-slate-700 text-slate-300 cursor-help hover:bg-slate-600 transition-colors">
                          ?
                        </span>
                      </Tooltip>
                    </p>
                  </div>
                </div>
              </div>

              {/* Download/Copy Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={downloadThumbnail}
                  type="button"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  ⬇️ Download PNG
                </button>
                <button
                  onClick={copyToClipboard}
                  type="button"
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            </div>
          </div>

          {/* Control Section */}
          <div className="lg:col-span-1">
            <ControlPanel
              selectedPreset={config.preset}
              onPresetChange={updatePreset}
              selectedLayoutId={config.layoutId}
              onLayoutChange={updateLayoutId}
              config={config}
              onTextElementChange={updateTextElement}
              onTextElementPreview={previewTextElement}
              onImageElementChange={updateImageElement}
              selectedGradientId={config.background.gradientId || GRADIENTS[0].id}
              onGradientChange={(gradientId) => updateBackground({ type: 'gradient', gradientId })}
            />
          </div>
        </div>


        <FeedbackWidget
          projectId="3b17800e-133e-405c-92fe-19523f499c13"
          position="bottom-right"
          collectSentiment={true}
          offerEmailFollowup={true}
        />

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500 space-y-2">
          <p>
            Created with love by{' '}
            <a
              href="https://edspencer.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ed Spencer
            </a>
          </p>
          <p>
            <a
              href="https://github.com/edspencer/frameit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View on GitHub
            </a>
            {' • '}
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
