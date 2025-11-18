import { PlatformSelector } from './PlatformSelector'
import { LayoutSelector } from './LayoutSelector'
import { BackgroundSelector } from './BackgroundSelector'
import { TextElementControl } from './TextElementControl'
import { ImageElementControl } from './ImageElementControl'
import { LAYOUTS } from '../lib/constants'
import type { ThumbnailPlatformWithIcon, ThumbnailConfig, BackgroundConfig } from '../lib/types'

interface ControlPanelProps {
  selectedPreset: ThumbnailPlatformWithIcon
  onPresetChange: (preset: ThumbnailPlatformWithIcon) => void
  selectedLayoutId: string
  onLayoutChange: (layoutId: string) => void
  config: ThumbnailConfig // Full config instead of individual props
  onTextElementChange: (id: string, updates: Partial<{ content: string; color: string; fontSize: string; fontWeight: number; fontFamily: string }>) => void
  onTextElementPreview?: (id: string, updates: { fontFamily?: string; color?: string; fontWeight?: number }) => void // For hover preview
  onImageElementChange: (id: string, updates: Partial<{ url: string | undefined; opacity: number; scale: number }>) => void
  background: BackgroundConfig
  onBackgroundChange: (config: BackgroundConfig) => void
  onSectionExpanded?: (sectionName: string) => void // Optional callback for section expand tracking
  onSectionCollapsed?: (sectionName: string) => void // Optional callback for section collapse tracking
}

// Helper to get display label (uses element.name if present, otherwise capitalizes id)
function getElementLabel(element: { id: string; name?: string }): string {
  return element.name || element.id.charAt(0).toUpperCase() + element.id.slice(1)
}

export function ControlPanel({
  selectedPreset,
  onPresetChange,
  selectedLayoutId,
  onLayoutChange,
  config,
  onTextElementChange,
  onTextElementPreview,
  onImageElementChange,
  background,
  onBackgroundChange,
  onSectionExpanded,
  onSectionCollapsed,
}: ControlPanelProps) {
  // Look up the selected layout
  const selectedLayout = LAYOUTS.find(l => l.id === selectedLayoutId) || LAYOUTS[0]

  return (
    <div className="space-y-2 sm:space-y-6">
      {/* Global controls (always shown, layout-agnostic) */}
      <PlatformSelector selectedPreset={selectedPreset} onPresetChange={onPresetChange} onSectionExpanded={onSectionExpanded} onSectionCollapsed={onSectionCollapsed} />
      <LayoutSelector selectedLayoutId={selectedLayoutId} onLayoutChange={onLayoutChange} onSectionExpanded={onSectionExpanded} onSectionCollapsed={onSectionCollapsed} />
      <BackgroundSelector background={background} onBackgroundChange={onBackgroundChange} />

      {/* Dynamic controls from layout.elements (only text and image, not overlays) */}
      {selectedLayout.elements.map(layoutElement => {
        if (layoutElement.type === 'text') {
          const textEl = config.textElements.find(t => t.id === layoutElement.id)
          // Extract layout defaults for all properties
          const defaultColor = layoutElement.styling?.color || '#ffffff'
          const defaultFontSize = layoutElement.sizing?.fontSize || '8%'
          const defaultFontWeight = layoutElement.styling?.fontWeight || 400
          const defaultFontFamily = layoutElement.styling?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'

          return (
            <TextElementControl
              key={layoutElement.id}
              id={layoutElement.id}
              label={getElementLabel(layoutElement)}
              content={textEl?.content || ''}
              color={textEl?.color}
              fontSize={textEl?.fontSize}
              fontWeight={textEl?.fontWeight}
              fontFamily={textEl?.fontFamily}
              defaultColor={defaultColor}
              defaultFontSize={defaultFontSize}
              defaultFontWeight={defaultFontWeight}
              defaultFontFamily={defaultFontFamily}
              onContentChange={(content) => onTextElementChange(layoutElement.id, { content })}
              onColorChange={(color) => onTextElementChange(layoutElement.id, { color })}
              onFontSizeChange={(fontSize) => onTextElementChange(layoutElement.id, { fontSize })}
              onFontWeightChange={(fontWeight) => onTextElementChange(layoutElement.id, { fontWeight })}
              onFontFamilyChange={(fontFamily) => onTextElementChange(layoutElement.id, { fontFamily })}
              onFontFamilyPreview={onTextElementPreview ? (fontFamily) => onTextElementPreview(layoutElement.id, { fontFamily }) : undefined}
              onColorPreview={onTextElementPreview ? (color) => onTextElementPreview(layoutElement.id, { color }) : undefined}
              onFontWeightPreview={onTextElementPreview ? (fontWeight) => onTextElementPreview(layoutElement.id, { fontWeight }) : undefined}
              onSectionExpanded={onSectionExpanded}
              onSectionCollapsed={onSectionCollapsed}
            />
          )
        }

        if (layoutElement.type === 'image') {
          const imageEl = config.imageElements.find(i => i.id === layoutElement.id)
          return (
            <ImageElementControl
              key={layoutElement.id}
              id={layoutElement.id}
              label={getElementLabel(layoutElement)}
              url={imageEl?.url}
              opacity={imageEl?.opacity ?? 1.0}
              scale={imageEl?.scale ?? 100}
              onUrlChange={(url) => onImageElementChange(layoutElement.id, { url })}
              onOpacityChange={(opacity) => onImageElementChange(layoutElement.id, { opacity })}
              onScaleChange={(scale) => onImageElementChange(layoutElement.id, { scale })}
              onSectionExpanded={onSectionExpanded}
              onSectionCollapsed={onSectionCollapsed}
            />
          )
        }

        // Overlays don't have UI controls - they're purely layout-defined
        return null
      })}
    </div>
  )
}
