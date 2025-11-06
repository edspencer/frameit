import { useState, useRef, useEffect } from 'react'
import { PRESETS } from '../lib/constants'
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
    delete config.presetName

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
      background: config.background,
    }))
  } catch (err) {
    console.error('Failed to save config to storage:', err)
  }
}

export function ThumbnailGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const savedConfig = loadConfigFromStorage()

  const [selectedPreset, setSelectedPreset] = useState<ThumbnailPreset>(() =>
    (savedConfig.preset as ThumbnailPreset) || PRESETS[0]!
  )
  const [selectedBackground, setSelectedBackground] = useState<string>(() =>
    savedConfig.background || ''
  )
  const [title, setTitle] = useState<string>(() =>
    savedConfig.title || 'Getting to Know Thumbnail Generator'
  )
  const [subtitle, setSubtitle] = useState<string>(() =>
    savedConfig.subtitle || 'Your thumbnails, beautifully crafted'
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

  // Save config to localStorage whenever any setting changes
  useEffect(() => {
    const config: ThumbnailConfig = {
      preset: selectedPreset,
      title,
      subtitle,
      titleColor,
      subtitleColor,
      logoOpacity,
      background: selectedBackground,
    }
    saveConfigToStorage(config)
  }, [selectedPreset, title, subtitle, titleColor, subtitleColor, logoOpacity, selectedBackground])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Thumbnail Generator</h1>
          <p className="text-slate-400">Create beautiful, branded thumbnails for your content</p>
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
                  backgroundImage={selectedBackground}
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  ⬇️ Download PNG
                </button>
                <button
                  onClick={copyToClipboard}
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
              selectedBackground={selectedBackground}
              onBackgroundChange={setSelectedBackground}
              logoOpacity={logoOpacity}
              onOpacityChange={setLogoOpacity}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500">
          Thumbnail Generator • Create and download beautiful thumbnails instantly
        </div>
      </div>
    </div>
  )
}
