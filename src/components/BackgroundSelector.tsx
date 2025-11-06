import { BACKGROUND_IMAGES } from '../lib/constants'

interface BackgroundSelectorProps {
  selectedBackground: string
  onBackgroundChange: (url: string) => void
}

export function BackgroundSelector({ selectedBackground, onBackgroundChange }: BackgroundSelectorProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Background</h3>
      <div className="grid grid-cols-3 gap-2">
        {BACKGROUND_IMAGES.map((bg) => (
          <button
            key={bg.name}
            onClick={() => onBackgroundChange(bg.url)}
            className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
              selectedBackground === bg.url
                ? 'border-blue-500 ring-2 ring-blue-400'
                : 'border-slate-600 hover:border-slate-500'
            }`}
            title={bg.name}
          >
            {bg.url ? (
              <img
                src={bg.url}
                alt={bg.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <span className="text-xs text-slate-300 text-center px-1">Gradient</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="text-xs text-slate-400 mt-3">
        {BACKGROUND_IMAGES.find((bg) => bg.url === selectedBackground)?.name || 'None'}
      </div>
    </div>
  )
}
