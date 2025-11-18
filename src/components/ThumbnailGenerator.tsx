import { useState, useRef, useEffect, useCallback } from 'react'
import { PLATFORMS_WITH_ICONS } from '../lib/ui-constants'
import { GRADIENTS, LAYOUTS } from '../lib/constants'
import type { ThumbnailPlatformWithIcon, ThumbnailConfig } from '../lib/types'
import { CanvasPreview } from './CanvasPreview'
import { ControlPanel } from './ControlPanel'
import { Tooltip } from './Tooltip'
import { Examples } from './Examples'
import { FeedbackWidget } from '@wishnova/react'
import '@wishnova/react/styles'
import {
  trackPresetSelected,
  trackLayoutChanged,
  trackGradientChanged,
  trackTextEdited,
  trackTextColorChanged,
  trackTextFontChanged,
  trackTextWeightChanged,
  trackLogoOpacityChanged,
  trackImageScaleChanged,
  trackThumbnailDownloaded,
  trackThumbnailCopied,
  trackConfigSectionExpanded,
  trackConfigSectionCollapsed,
} from '../lib/posthog'
import { useExampleFromUrl } from '../hooks/useExampleFromUrl'

const STORAGE_KEY = 'thumbnailGeneratorConfig'

/**
 * Get default URL for an image element based on its ID
 * Uses frameit-logo.png for 'logo' elements, frameit-icon.png for others
 */
function getDefaultImageUrl(elementId: string): string | undefined {
  if (elementId === 'logo') {
    return '/frameit-logo.png'
  }

  // For other image elements (icons, etc), use the square icon
  // This works for layout elements that want a square icon/avatar
  if (elementId === 'icon' || elementId === 'brand-icon') {
    return '/frameit-icon.png'
  }

  // For `main` or other elements, return undefined (user must upload)
  return undefined
}

function loadConfigFromStorage(): ThumbnailConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)

    // Check if this is the new format (has textElements and imageElements)
    if (parsed.textElements && parsed.imageElements) {
      // Restore preset object from name
      if (parsed.presetName) {
        const preset = PLATFORMS_WITH_ICONS.find(p => p.name === parsed.presetName)
        if (preset) {
          parsed.preset = preset
          return parsed as ThumbnailConfig
        }
      }
      // If preset not found, return null to use defaults
      return null
    }

    // Old format detected - return null to use default config
    console.log('Old config format detected, using defaults')
    return null
  } catch (err) {
    console.error('Failed to load config:', err)
    return null
  }
}

function saveConfigToStorage(config: ThumbnailConfig): void {
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

function getDefaultConfig(): ThumbnailConfig {
  const layoutId = LAYOUTS[0].id
  return {
    preset: PLATFORMS_WITH_ICONS[0],
    layoutId,
    background: { type: 'gradient', gradientId: GRADIENTS[0].id },
    textElements: [
      { id: 'title', content: 'This is a template', color: '#ffffff' },
      { id: 'subtitle', content: 'Change layout, upload images, and edit text with the controls on the right', color: '#ffffff' },
      { id: 'artist', content: 'Artist Name', color: '#ffffff' },
      { id: 'cta', content: 'Get Started', color: '#ffffff' },
      { id: 'brand', content: 'frameit.dev', color: '#ffffff' },
      { id: 'domain', content: 'frameit.dev', color: '#ffffff' },
    ],
    imageElements: [
      { id: 'logo', url: getDefaultImageUrl('logo'), opacity: 1.0, scale: 100 },
      { id: 'main', url: '/default-photo.jpg', opacity: 1.0, scale: 100 },
    ],
  }
}

export function ThumbnailGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isInitialMount = useRef(true)
  const [zoomLevel, setZoomLevel] = useState<number>(100)

  // Set initial mount flag to false after first render
  useEffect(() => {
    isInitialMount.current = false
  }, [])

  const savedConfig = loadConfigFromStorage()
  const [config, setConfig] = useState<ThumbnailConfig>(() => {
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
        imageElements.push({ id: el.id, url: getDefaultImageUrl(el.id), opacity: 1.0, scale: 100 })
      }
    }

    return { ...initialConfig, textElements, imageElements }
  })

  const selectedLayout = LAYOUTS.find(l => l.id === config.layoutId) || LAYOUTS[0]

  // Helper functions to update parts of config
  const updateTextElement = (id: string, updates: Partial<typeof config.textElements[0]>) => {
    // Track text content edits
    if (!isInitialMount.current && updates.content !== undefined) {
      trackTextEdited({ element_id: id, content_length: updates.content.length })
    }

    // Track text color changes
    if (!isInitialMount.current && updates.color !== undefined) {
      trackTextColorChanged({ element_id: id, new_color: updates.color })
    }

    // Track font family changes
    if (!isInitialMount.current && updates.fontFamily !== undefined) {
      trackTextFontChanged({ element_id: id, font_name: updates.fontFamily })
    }

    // Track font weight changes
    if (!isInitialMount.current && updates.fontWeight !== undefined) {
      trackTextWeightChanged({ element_id: id, new_weight: updates.fontWeight })
    }

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
    // Track opacity changes
    if (!isInitialMount.current && updates.opacity !== undefined) {
      trackLogoOpacityChanged({ new_opacity: updates.opacity })
    }

    // Track scale changes
    if (!isInitialMount.current && updates.scale !== undefined) {
      trackImageScaleChanged({ element_id: id, new_scale: updates.scale })
    }

    setConfig(prev => ({
      ...prev,
      imageElements: prev.imageElements.map(el => el.id === id ? { ...el, ...updates } : el)
    }))
  }

  const updateBackground = (updates: Partial<typeof config.background>) => {
    // Track gradient changes
    if (!isInitialMount.current && updates.gradientId !== undefined) {
      const gradient = GRADIENTS.find(g => g.id === updates.gradientId)
      if (gradient) {
        trackGradientChanged({ gradient_id: gradient.id, gradient_name: gradient.name })
      }
    }

    setConfig(prev => ({ ...prev, background: { ...prev.background, ...updates } }))
  }

  const updatePreset = (preset: ThumbnailPlatformWithIcon) => {
    // Track preset selection
    if (!isInitialMount.current) {
      trackPresetSelected({ preset_name: preset.name })
    }

    setConfig(prev => ({ ...prev, preset }))
  }

  const updateLayoutId = (layoutId: string) => {
    // Track layout changes
    if (!isInitialMount.current) {
      const newLayout = LAYOUTS.find(l => l.id === layoutId) || LAYOUTS[0]
      trackLayoutChanged({ layout_id: newLayout.id, layout_name: newLayout.name })
    }

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
          imageElements.push({ id: el.id, url: getDefaultImageUrl(el.id), opacity: 1.0, scale: 100 })
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

    // Track thumbnail download
    trackThumbnailDownloaded({ preset_used: config.preset.name, image_format: 'png' })

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
          // Track thumbnail copy to clipboard
          trackThumbnailCopied({ preset_used: config.preset.name })
          alert('Thumbnail copied to clipboard!')
        }
      })
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard')
    }
  }

  // Handlers for section expand/collapse tracking
  const handleSectionExpanded = (sectionName: string): void => {
    trackConfigSectionExpanded({ section_name: sectionName })
  }

  const handleSectionCollapsed = (sectionName: string): void => {
    trackConfigSectionCollapsed({ section_name: sectionName })
  }

  // Handler for selecting an example configuration
  const handleSelectExample = useCallback((exampleConfig: Partial<ThumbnailConfig>): void => {
    setConfig(prev => {
      const newLayoutId = exampleConfig.layoutId || prev.layoutId
      const newLayout = LAYOUTS.find(l => l.id === newLayoutId) || LAYOUTS[0]

      // Initialize text elements based on the new layout
      const textElements = [...(exampleConfig.textElements || [])]
      for (const el of newLayout.elements) {
        if (el.type === 'text' && !textElements.find(t => t.id === el.id)) {
          textElements.push({ id: el.id, content: '', color: '#ffffff' })
        }
      }

      // Initialize image elements based on the new layout
      const imageElements = [...(exampleConfig.imageElements || [])]
      for (const el of newLayout.elements) {
        if (el.type === 'image' && !imageElements.find(i => i.id === el.id)) {
          imageElements.push({ id: el.id, opacity: 1.0, scale: 100 })
        }
      }

      return {
        ...prev,
        ...exampleConfig,
        textElements,
        imageElements,
      }
    })
  }, [])

  // Load example from URL if present (e.g., /example/birthday-cake)
  useExampleFromUrl(handleSelectExample)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 md:p-6 pb-24">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
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
            <div className="sm:mt-6 mt-4 flex flex-col gap-4">
              {/* Info Section */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hidden sm:block">
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium sm:py-3 py-1 sm:px-4 px-2 rounded-lg transition-colors"
                >
                  ⬇️ Download PNG
                </button>
                <button
                  onClick={copyToClipboard}
                  type="button"
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium sm:py-3 py-1 sm:px-4 px-2 rounded-lg transition-colors"
                >
                  📋 Copy to Clipboard
                </button>
              </div>

              {/* Example Configurations */}
              <Examples
                onSelectExample={handleSelectExample}
                onSectionExpanded={handleSectionExpanded}
                onSectionCollapsed={handleSectionCollapsed}
              />
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
              background={config.background}
              onBackgroundChange={updateBackground}
              onSectionExpanded={handleSectionExpanded}
              onSectionCollapsed={handleSectionCollapsed}
            />
          </div>
        </div>


        <FeedbackWidget
          projectId="3b17800e-133e-405c-92fe-19523f499c13"
          position="bottom-right"
          collectSentiment={true}
          offerEmailFollowup={true}
          triggerLabel="Bug? Feedback?"
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
