import type { ThumbnailConfigNew } from '../lib/types'
import { PLATFORMS_WITH_ICONS } from '../lib/ui-constants'
import { EXAMPLE_THUMBNAIL_CONFIGS } from '../lib/example-configs'
import { ConfigSection } from './ConfigSection'

const EXAMPLES = EXAMPLE_THUMBNAIL_CONFIGS

interface ExamplesProps {
  onSelectExample: (config: Partial<ThumbnailConfigNew>) => void
  onSectionExpanded?: (sectionName: string) => void
  onSectionCollapsed?: (sectionName: string) => void
}

export function Examples({ onSelectExample, onSectionExpanded, onSectionCollapsed }: ExamplesProps) {
  const handleSelectExample = (example: typeof EXAMPLES[number]) => {
    const preset = PLATFORMS_WITH_ICONS.find(p => p.name === example.presetName) || PLATFORMS_WITH_ICONS[0]

    const config: Partial<ThumbnailConfigNew> = {
      preset,
      layoutId: example.layoutId,
      background: example.background,
      textElements: example.textElements,
      imageElements: example.imageElements,
    }

    onSelectExample(config)
  }

  const preview = <span className="text-xs">{EXAMPLES.length} examples available</span>

  return (
    <ConfigSection
      title="Example Configurations"
      storageKey="examples"
      preview={preview}
      defaultExpanded={true}
      onExpanded={onSectionExpanded}
      onCollapsed={onSectionCollapsed}
    >
      <p className="text-slate-400 text-sm mb-4">
        Pre-configured examples inspired by real Open Graph images from around the web.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 max-h-[32rem] overflow-y-auto pr-2">
        {EXAMPLES.map((example) => (
          <button
            type="button"
            key={example.id}
            onClick={() => handleSelectExample(example)}
            className="text-left rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 transition-all group overflow-hidden flex sm:flex-col"
          >
            {/* Thumbnail Image */}
            <div className="relative w-full aspect-video bg-slate-800 overflow-hidden flex-1 sm:flex-none">
              <img
                src={`/examples/${example.id}.png`}
                alt={example.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>

            {/* Description */}
            <div className="p-2 flex-1 sm:flex-none">
              <p className="text-slate-400 text-xs leading-relaxed">{example.description}</p>
            </div>
          </button>
        ))}
      </div>
    </ConfigSection>
  )
}
