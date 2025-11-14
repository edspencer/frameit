import { LAYOUTS } from '../lib/constants'
import { ConfigSection } from './ConfigSection'

interface LayoutSelectorProps {
  selectedLayoutId: string
  onLayoutChange: (layoutId: string) => void
  onSectionExpanded?: (sectionName: string) => void
  onSectionCollapsed?: (sectionName: string) => void
}

export function LayoutSelector({ selectedLayoutId, onLayoutChange, onSectionExpanded, onSectionCollapsed }: LayoutSelectorProps) {
  const selectedLayout = LAYOUTS.find(l => l.id === selectedLayoutId)
  const preview = selectedLayout ? <span className="truncate">{selectedLayout.name}</span> : null

  return (
    <ConfigSection title="Layout" storageKey="layout" preview={preview} onExpanded={onSectionExpanded} onCollapsed={onSectionCollapsed}>
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
    </ConfigSection>
  )
}
