import { GRADIENTS } from '../lib/constants'

interface GradientSelectorProps {
  selectedGradientId: string
  onGradientChange: (id: string) => void
}

export function GradientSelector({ selectedGradientId, onGradientChange }: GradientSelectorProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Background Gradient</h3>
      <div className="grid grid-cols-2 gap-2">
        {GRADIENTS.map((gradient) => (
          <button
            key={gradient.id}
            onClick={() => onGradientChange(gradient.id)}
            className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
              selectedGradientId === gradient.id
                ? 'border-blue-500 ring-2 ring-blue-400'
                : 'border-slate-600 hover:border-slate-500'
            }`}
            title={gradient.name}
            style={{
              background: `linear-gradient(to bottom, ${gradient.colorStart}, ${gradient.colorEnd})`,
            }}
          >
            <span className="text-xs text-white font-medium px-2 py-1 bg-black/50 rounded">
              {gradient.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
