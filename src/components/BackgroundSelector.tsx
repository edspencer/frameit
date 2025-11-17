import { useState } from 'react'
import { GRADIENTS, SOLID_COLORS } from '../lib/constants'
import type { BackgroundConfig } from '../lib/types'
import { ConfigSection } from './ConfigSection'

type BackgroundTab = 'gradients' | 'colors'

interface BackgroundSelectorProps {
  background: BackgroundConfig
  onBackgroundChange: (config: BackgroundConfig) => void
}

export function BackgroundSelector({ background, onBackgroundChange }: BackgroundSelectorProps) {
  const [activeTab, setActiveTab] = useState<BackgroundTab>('gradients')

  // Determine the preview content based on current background type
  const preview = (() => {
    if (background.type === 'gradient' && background.gradientId) {
      const gradient = GRADIENTS.find(g => g.id === background.gradientId)
      if (gradient) {
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border border-slate-600"
              style={{
                background: `linear-gradient(to bottom, ${gradient.colorStart}, ${gradient.colorEnd})`,
              }}
            />
            <span className="truncate text-xs">
              {gradient.name}
            </span>
          </div>
        )
      }
    }

    if (background.type === 'solid' && background.solidColor) {
      const color = SOLID_COLORS.find(c => c.color === background.solidColor)
      if (color) {
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border border-slate-600"
              style={{ backgroundColor: color.color }}
            />
            <span className="truncate text-xs">
              {color.name}
            </span>
          </div>
        )
      }
    }

    return null
  })()

  return (
    <ConfigSection title="Background" storageKey="background" preview={preview}>
      {/* Tab/Segment Control */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('gradients')}
          className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'gradients'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Gradients
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'colors'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Colors
        </button>
      </div>

      {/* Gradients Grid */}
      {activeTab === 'gradients' && (
        <div className="grid grid-cols-4 gap-2">
          {GRADIENTS.map((gradient) => (
            <button
              type="button"
              key={gradient.id}
              onClick={() => onBackgroundChange({ type: 'gradient', gradientId: gradient.id })}
              className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
                background.type === 'gradient' && background.gradientId === gradient.id
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
      )}

      {/* Colors Grid - Tailwind style: 4 shades per row with family labels */}
      {activeTab === 'colors' && (
        <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
          {(() => {
            // Group colors by family
            const colorsByFamily = SOLID_COLORS.reduce((acc, color) => {
              const family = color.family || 'Other'
              if (!acc[family]) acc[family] = []
              acc[family].push(color)
              return acc
            }, {} as Record<string, typeof SOLID_COLORS>)

            return Object.entries(colorsByFamily).map(([family, colors]) => (
              <div key={family} className="flex items-center gap-3">
                <span className="text-slate-400 text-sm font-medium w-16 text-right flex-shrink-0">
                  {family}
                </span>
                <div className="flex gap-2 flex-1">
                  {colors.map((solidColor) => (
                    <button
                      type="button"
                      key={solidColor.id}
                      onClick={() => onBackgroundChange({ type: 'solid', solidColor: solidColor.color })}
                      className={`flex-1 h-8 rounded-md transition-all ${
                        background.type === 'solid' && background.solidColor === solidColor.color
                          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-800 scale-105'
                          : 'hover:scale-105'
                      }`}
                      title={solidColor.name}
                      style={{ backgroundColor: solidColor.color }}
                      aria-label={solidColor.name}
                    />
                  ))}
                </div>
              </div>
            ))
          })()}
        </div>
      )}
    </ConfigSection>
  )
}
