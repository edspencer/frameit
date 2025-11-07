import { PlatformSelector } from './PlatformSelector'
import { LayoutSelector } from './LayoutSelector'
import { GradientSelector } from './GradientSelector'
import { BackgroundImageUploader } from './BackgroundImageUploader'
import { TextElementControl } from './TextElementControl'
import { ImageElementControl } from './ImageElementControl'
import { LAYOUTS } from '../lib/constants'
import type { ThumbnailPreset, ThumbnailConfigNew } from '../lib/types'

interface ControlPanelProps {
  selectedPreset: ThumbnailPreset
  onPresetChange: (preset: ThumbnailPreset) => void
  selectedLayoutId: string
  onLayoutChange: (layoutId: string) => void
  config: ThumbnailConfigNew // Full config instead of individual props
  onTextElementChange: (id: string, updates: Partial<{ content: string; color: string }>) => void
  onImageElementChange: (id: string, updates: Partial<{ url: string | undefined; opacity: number }>) => void
  selectedGradientId: string
  onGradientChange: (id: string) => void
  backgroundImageUrl: string | undefined
  onBackgroundImageChange: (url: string | undefined) => void
  backgroundImageScale: number
  onBackgroundImageScaleChange: (scale: number) => void
}

// Helper to format element ID as label ("title" -> "Title")
function formatLabel(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1)
}

export function ControlPanel({
  selectedPreset,
  onPresetChange,
  selectedLayoutId,
  onLayoutChange,
  config,
  onTextElementChange,
  onImageElementChange,
  selectedGradientId,
  onGradientChange,
  backgroundImageUrl,
  onBackgroundImageChange,
  backgroundImageScale,
  onBackgroundImageScaleChange,
}: ControlPanelProps) {
  // Look up the selected layout
  const selectedLayout = LAYOUTS.find(l => l.id === selectedLayoutId) || LAYOUTS[0]

  return (
    <div className="space-y-6">
      {/* Global controls (always shown, layout-agnostic) */}
      <PlatformSelector selectedPreset={selectedPreset} onPresetChange={onPresetChange} />
      <LayoutSelector selectedLayoutId={selectedLayoutId} onLayoutChange={onLayoutChange} />
      <GradientSelector selectedGradientId={selectedGradientId} onGradientChange={onGradientChange} />
      <BackgroundImageUploader
        backgroundImageUrl={backgroundImageUrl}
        onImageChange={onBackgroundImageChange}
        backgroundImageScale={backgroundImageScale}
        onScaleChange={onBackgroundImageScaleChange}
      />

      {/* Dynamic controls from layout.elements */}
      {selectedLayout.elements.map(layoutElement => {
        if (layoutElement.type === 'text') {
          const textEl = config.textElements.find(t => t.id === layoutElement.id)
          return (
            <TextElementControl
              key={layoutElement.id}
              id={layoutElement.id}
              label={formatLabel(layoutElement.id)}
              content={textEl?.content || ''}
              color={textEl?.color || '#ffffff'}
              onContentChange={(content) => onTextElementChange(layoutElement.id, { content })}
              onColorChange={(color) => onTextElementChange(layoutElement.id, { color })}
            />
          )
        } else {
          const imageEl = config.imageElements.find(i => i.id === layoutElement.id)
          return (
            <ImageElementControl
              key={layoutElement.id}
              id={layoutElement.id}
              label={formatLabel(layoutElement.id)}
              url={imageEl?.url}
              opacity={imageEl?.opacity ?? 1.0}
              onUrlChange={(url) => onImageElementChange(layoutElement.id, { url })}
              onOpacityChange={(opacity) => onImageElementChange(layoutElement.id, { opacity })}
            />
          )
        }
      })}
    </div>
  )
}
