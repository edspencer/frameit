import { PRESETS } from '../lib/constants'
import type { ThumbnailPreset } from '../lib/types'

interface PlatformSelectorProps {
  selectedPreset: ThumbnailPreset
  onPresetChange: (preset: ThumbnailPreset) => void
}

export function PlatformSelector({ selectedPreset, onPresetChange }: PlatformSelectorProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onPresetChange(preset)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedPreset.name === preset.name
                ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <div className="font-medium text-white text-sm">{preset.name}</div>
            <div className="text-xs text-slate-300 mt-1">
              {preset.width} × {preset.height}px • {preset.aspectRatio}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
