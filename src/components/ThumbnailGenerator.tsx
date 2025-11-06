import { useState, useRef, useEffect } from 'react'
import { PRESETS, GRADIENTS } from '../lib/constants'
import type { ThumbnailPreset, ThumbnailConfig } from '../lib/types'
import { CanvasPreview } from './CanvasPreview'
import { ControlPanel } from './ControlPanel'

const STORAGE_KEY = 'thumbnailGeneratorConfig'

function loadConfigFromStorage(): Partial<ThumbnailConfig> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}

    const config = JSON.parse(stored)

    // Find the preset by name
    if (config.presetName) {
      const preset = PRESETS.find(p => p.name === config.presetName)
      if (preset) {
        config.preset = preset
      }
    }
    config.presetName = undefined

    return config
  } catch (err) {
    console.error('Failed to load config from storage:', err)
    return {}
  }
}

function saveConfigToStorage(config: ThumbnailConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      presetName: config.preset.name,
      title: config.title,
      subtitle: config.subtitle,
      titleColor: config.titleColor,
      subtitleColor: config.subtitleColor,
      logoOpacity: config.logoOpacity,
      gradientId: config.gradientId,
      backgroundImageUrl: config.backgroundImageUrl,
      backgroundImageScale: config.backgroundImageScale,
      customLogo: config.customLogo,
    }))
  } catch (err) {
    console.error('Failed to save config to storage:', err)
  }
}

export function ThumbnailGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const savedConfig = loadConfigFromStorage()

  const [selectedPreset, setSelectedPreset] = useState<ThumbnailPreset>(() =>
    (savedConfig.preset as ThumbnailPreset) || PRESETS[0]
  )
  const [selectedGradientId, setSelectedGradientId] = useState<string>(() =>
    (savedConfig.gradientId as string) || GRADIENTS[0].id
  )
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | undefined>(() =>
    (savedConfig.backgroundImageUrl as string | undefined) || undefined
  )
  const [backgroundImageScale, setBackgroundImageScale] = useState<number>(() =>
    (savedConfig.backgroundImageScale as number) || 100
  )
  const [title, setTitle] = useState<string>(() =>
    savedConfig.title || 'Welcome to FrameIt'
  )
  const [subtitle, setSubtitle] = useState<string>(() =>
    savedConfig.subtitle || 'Change this text to whatever, upload your own logo, whatever you want'
  )
  const [titleColor, setTitleColor] = useState<string>(() =>
    savedConfig.titleColor || '#ffffff'
  )
  const [subtitleColor, setSubtitleColor] = useState<string>(() =>
    savedConfig.subtitleColor || '#ffffff'
  )
  const [logoOpacity, setLogoOpacity] = useState<number>(() =>
    savedConfig.logoOpacity || 1
  )
  const [customLogo, setCustomLogo] = useState<string | undefined>(() =>
    savedConfig.customLogo
  )

  // Save config to localStorage whenever any setting changes
  useEffect(() => {
    const config: ThumbnailConfig = {
      preset: selectedPreset,
      title,
      subtitle,
      titleColor,
      subtitleColor,
      logoOpacity,
      gradientId: selectedGradientId,
      backgroundImageUrl,
      backgroundImageScale,
      customLogo,
    }
    saveConfigToStorage(config)
  }, [selectedPreset, title, subtitle, titleColor, subtitleColor, logoOpacity, selectedGradientId, backgroundImageUrl, backgroundImageScale, customLogo])

  const downloadThumbnail = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `thumbnail-${selectedPreset.name.toLowerCase().replace(/\s+/g, '-')}.png`
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

  // Get the selected gradient
  const selectedGradient = GRADIENTS.find((g) => g.id === selectedGradientId) || GRADIENTS[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
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
          <div className="lg:col-span-2 flex flex-col">
            {/* Canvas Preview */}
            <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl border border-slate-700 flex items-center justify-center p-4">
              <div
                style={{
                  aspectRatio: `${selectedPreset.width} / ${selectedPreset.height}`,
                  width: '100%',
                  maxWidth: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CanvasPreview
                  ref={canvasRef}
                  preset={selectedPreset}
                  title={title}
                  subtitle={subtitle}
                  titleColor={titleColor}
                  subtitleColor={subtitleColor}
                  logoOpacity={logoOpacity}
                  gradientColorStart={selectedGradient.colorStart}
                  gradientColorEnd={selectedGradient.colorEnd}
                  backgroundImageUrl={backgroundImageUrl}
                  backgroundImageScale={backgroundImageScale}
                  customLogo={customLogo}
                />
              </div>
            </div>

            {/* Info and Buttons Below Canvas */}
            <div className="mt-6 space-y-4">
              {/* Info Section */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300">
                    Dimensions: {selectedPreset.width} × {selectedPreset.height}px ({selectedPreset.aspectRatio})
                  </p>
                  <p className="text-slate-400">Ready for download and screenshot capture</p>
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
              selectedPreset={selectedPreset}
              onPresetChange={setSelectedPreset}
              title={title}
              onTitleChange={setTitle}
              titleColor={titleColor}
              onTitleColorChange={setTitleColor}
              subtitle={subtitle}
              onSubtitleChange={setSubtitle}
              subtitleColor={subtitleColor}
              onSubtitleColorChange={setSubtitleColor}
              selectedGradientId={selectedGradientId}
              onGradientChange={setSelectedGradientId}
              backgroundImageUrl={backgroundImageUrl}
              onBackgroundImageChange={setBackgroundImageUrl}
              backgroundImageScale={backgroundImageScale}
              onBackgroundImageScaleChange={setBackgroundImageScale}
              logoOpacity={logoOpacity}
              onOpacityChange={setLogoOpacity}
              customLogo={customLogo}
              onCustomLogoChange={setCustomLogo}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500">
          FrameIt • Create and download beautiful title images instantly
        </div>
      </div>
    </div>
  )
}
