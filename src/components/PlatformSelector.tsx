import { PRESETS_WITH_ICONS } from '../lib/ui-constants'
import type { ThumbnailPresetWithIcon } from '../lib/types'
import { ConfigSection } from './ConfigSection'

interface PlatformSelectorProps {
  selectedPreset: ThumbnailPresetWithIcon
  onPresetChange: (preset: ThumbnailPresetWithIcon) => void
}

export function PlatformSelector({ selectedPreset, onPresetChange }: PlatformSelectorProps) {
  const videoPresets = PRESETS_WITH_ICONS.filter(p => p.category === 'video')
  const socialPresets = PRESETS_WITH_ICONS.filter(p => p.category === 'social')

  const SelectedIcon = selectedPreset.icon
  const preview = (
    <>
      <SelectedIcon size={16} className="flex-shrink-0" />
      <span className="truncate">{selectedPreset.name}</span>
    </>
  )

  return (
    <ConfigSection title="Platform" storageKey="platform" preview={preview}>
      {/* Video Thumbnails Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-400 mb-2">Video Thumbnails</h4>
        <div className="grid grid-cols-2 gap-2">
          {videoPresets.map((preset) => {
            const Icon = preset.icon
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onPresetChange(preset)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedPreset.name === preset.name
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={36} className="flex-shrink-0" />
                  <div className="flex flex-col">
                    <div className="font-medium text-white text-sm">{preset.name}</div>
                    <div className="text-xs text-slate-300">{preset.width} × {preset.height}px</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Social Titles Section */}
      <div>
        <h4 className="text-sm font-medium text-slate-400 mb-2">Social Titles</h4>
        <div className="grid grid-cols-2 gap-2">
          {socialPresets.map((preset) => {
            const Icon = preset.icon
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onPresetChange(preset)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedPreset.name === preset.name
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={36} className="flex-shrink-0" />
                  <div className="flex flex-col">
                    <div className="font-medium text-white text-sm">{preset.name}</div>
                    <div className="text-xs text-slate-300">{preset.width} × {preset.height}px</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </ConfigSection>
  )
}
