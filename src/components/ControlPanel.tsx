import { PlatformSelector } from './PlatformSelector'
import { TextContent } from './TextContent'
import { BackgroundSelector } from './BackgroundSelector'
import { ColorPicker } from './ColorPicker'
import { OpacitySlider } from './OpacitySlider'
import type { ThumbnailPreset } from '../lib/types'

interface ControlPanelProps {
  selectedPreset: ThumbnailPreset
  onPresetChange: (preset: ThumbnailPreset) => void
  title: string
  onTitleChange: (title: string) => void
  subtitle: string
  onSubtitleChange: (subtitle: string) => void
  selectedBackground: string
  onBackgroundChange: (url: string) => void
  textColor: string
  onColorChange: (color: string) => void
  logoOpacity: number
  onOpacityChange: (opacity: number) => void
  onDownload: () => void
  onCopyToClipboard: () => void
}

export function ControlPanel({
  selectedPreset,
  onPresetChange,
  title,
  onTitleChange,
  subtitle,
  onSubtitleChange,
  selectedBackground,
  onBackgroundChange,
  textColor,
  onColorChange,
  logoOpacity,
  onOpacityChange,
  onDownload,
  onCopyToClipboard,
}: ControlPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Preview Info</h3>
        <div className="space-y-2 text-sm">
          <p className="text-slate-300">
            Dimensions: {selectedPreset.width} × {selectedPreset.height}px ({selectedPreset.aspectRatio})
          </p>
          <p className="text-slate-400">Ready for download and screenshot capture</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDownload}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          ⬇️ Download PNG
        </button>
        <button
          onClick={onCopyToClipboard}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          📋 Copy to Clipboard
        </button>
      </div>

      <PlatformSelector selectedPreset={selectedPreset} onPresetChange={onPresetChange} />
      <TextContent
        title={title}
        subtitle={subtitle}
        onTitleChange={onTitleChange}
        onSubtitleChange={onSubtitleChange}
      />
      <BackgroundSelector selectedBackground={selectedBackground} onBackgroundChange={onBackgroundChange} />
      <ColorPicker textColor={textColor} onColorChange={onColorChange} />
      <OpacitySlider logoOpacity={logoOpacity} onOpacityChange={onOpacityChange} />

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-white mb-3">💡 Tips</h4>
        <ul className="text-xs text-slate-400 space-y-2">
          <li>• Use screenshotter for final capture</li>
          <li>• Keep text legible on small displays</li>
          <li>• High contrast ensures visibility</li>
          <li>• Logo provides brand recognition</li>
        </ul>
      </div>
    </div>
  )
}
