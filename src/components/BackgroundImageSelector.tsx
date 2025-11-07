import { BACKGROUND_IMAGES } from '../lib/constants'
import { ConfigSection } from './ConfigSection'

interface BackgroundImageSelectorProps {
  selectedImageUrl: string | undefined
  onImageChange: (url: string | undefined) => void
}

export function BackgroundImageSelector({ selectedImageUrl, onImageChange }: BackgroundImageSelectorProps) {
  return (
    <ConfigSection title="Background Image (Optional)">
      <div className="grid grid-cols-3 gap-2">
        {/* None button */}
        <button
          onClick={() => onImageChange(undefined)}
          className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
            selectedImageUrl === undefined
              ? 'border-blue-500 ring-2 ring-blue-400'
              : 'border-slate-600 hover:border-slate-500'
          }`}
          title="No background image"
        >
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <span className="text-xs text-slate-300 text-center px-1">None</span>
          </div>
        </button>

        {/* Image options */}
        {BACKGROUND_IMAGES.filter((bg) => bg.url).map((bg) => (
          <button
            key={bg.name}
            onClick={() => onImageChange(bg.url)}
            className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
              selectedImageUrl === bg.url
                ? 'border-blue-500 ring-2 ring-blue-400'
                : 'border-slate-600 hover:border-slate-500'
            }`}
            title={bg.name}
          >
            {bg.url ? (
              <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <span className="text-xs text-slate-300 text-center px-1">{bg.name}</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="text-xs text-slate-400 mt-3">
        {selectedImageUrl === undefined
          ? 'No background image'
          : BACKGROUND_IMAGES.find((bg) => bg.url === selectedImageUrl)?.name || 'Custom'}
      </div>
    </ConfigSection>
  )
}
