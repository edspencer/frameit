import { LAYOUTS } from '../lib/constants'

interface LayoutSelectorProps {
  selectedLayoutId: string
  onLayoutChange: (layoutId: string) => void
}

export function LayoutSelector({ selectedLayoutId, onLayoutChange }: LayoutSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-300">Layout</h3>
      <div className="grid grid-cols-2 gap-2">
        {LAYOUTS.map((layout) => {
          const isSelected = layout.id === selectedLayoutId
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => onLayoutChange(layout.id)}
              className={`
                p-3 rounded-lg border transition-all text-left
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                }
              `}
            >
              <div className="font-medium text-sm mb-1">{layout.name}</div>
              <div className="text-xs opacity-75">{layout.description}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
