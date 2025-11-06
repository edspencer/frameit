import { useState, useRef } from 'react'
import { PRESETS } from '../lib/constants'
import type { ThumbnailPreset } from '../lib/types'
import { CanvasPreview } from './CanvasPreview'
import { ControlPanel } from './ControlPanel'

export function ThumbnailGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedPreset, setSelectedPreset] = useState<ThumbnailPreset>(() => PRESETS[0]!)
  const [selectedBackground, setSelectedBackground] = useState<string>('')
  const [title, setTitle] = useState('Getting to Know Thumbnail Generator')
  const [subtitle, setSubtitle] = useState('Your thumbnails, beautifully crafted')
  const [textColor, setTextColor] = useState('#ffffff')
  const [logoOpacity, setLogoOpacity] = useState(1)

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
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl border border-slate-700">
              <CanvasPreview
                ref={canvasRef}
                preset={selectedPreset}
                title={title}
                subtitle={subtitle}
                textColor={textColor}
                logoOpacity={logoOpacity}
                backgroundImage={selectedBackground}
              />
            </div>
          </div>

          {/* Control Section */}
          <div className="lg:col-span-1">
            <ControlPanel
              selectedPreset={selectedPreset}
              onPresetChange={setSelectedPreset}
              title={title}
              onTitleChange={setTitle}
              subtitle={subtitle}
              onSubtitleChange={setSubtitle}
              selectedBackground={selectedBackground}
              onBackgroundChange={setSelectedBackground}
              textColor={textColor}
              onColorChange={setTextColor}
              logoOpacity={logoOpacity}
              onOpacityChange={setLogoOpacity}
              onDownload={downloadThumbnail}
              onCopyToClipboard={copyToClipboard}
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
