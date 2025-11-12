import { GRADIENTS } from '../lib/constants'
import { ConfigSection } from './ConfigSection'

interface GradientSelectorProps {
  selectedGradientId: string
  onGradientChange: (id: string) => void
}

export function GradientSelector({ selectedGradientId, onGradientChange }: GradientSelectorProps) {
  const selectedGradient = GRADIENTS.find(g => g.id === selectedGradientId)
  const preview = selectedGradient ? (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded border border-slate-600"
        style={{
          background: `linear-gradient(to bottom, ${selectedGradient.colorStart}, ${selectedGradient.colorEnd})`,
        }}
      />
      <span className="truncate">{selectedGradient.name}</span>
    </div>
  ) : null

  return (
    <ConfigSection title="Background Gradient" storageKey="gradient" preview={preview}>
      <div className="grid grid-cols-4 gap-2">
        {GRADIENTS.map((gradient) => (
          <button
            type="button"
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
    </ConfigSection>
  )
}
