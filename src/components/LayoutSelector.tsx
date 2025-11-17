import { LAYOUTS } from '../lib/constants'
import { ConfigSection } from './ConfigSection'
import { LayoutPreview } from './LayoutPreview'

interface LayoutSelectorProps {
  selectedLayoutId: string
  onLayoutChange: (layoutId: string) => void
  onSectionExpanded?: (sectionName: string) => void
  onSectionCollapsed?: (sectionName: string) => void
}

export function LayoutSelector({ selectedLayoutId, onLayoutChange, onSectionExpanded, onSectionCollapsed }: LayoutSelectorProps) {
  const selectedLayout = LAYOUTS.find(l => l.id === selectedLayoutId)
  const preview = selectedLayout ? <span className="truncate">{selectedLayout.name}</span> : null

  // Filter out disabled layouts (API ignores this, only affects UI)
  const enabledLayouts = LAYOUTS.filter(layout => layout.enabled !== false)

  return (
    <ConfigSection title="Layout" storageKey="layout" preview={preview} onExpanded={onSectionExpanded} onCollapsed={onSectionCollapsed}>
      <div className="grid grid-cols-2 gap-2">
        {enabledLayouts.map((layout) => {
          const isSelected = layout.id === selectedLayoutId
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => onLayoutChange(layout.id)}
              title={layout.description}
              className={`
                p-3 rounded-lg border transition-all text-left group relative
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                }
              `}
            >
              <div className="relative">
                <LayoutPreview layout={layout} className="mb-0" />
                <div className="absolute bottom-0.5 left-0.5 font-medium text-xs px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded border border-slate-700">
                  {layout.name}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </ConfigSection>
  )
}
