import { ColorControl } from './ColorControl'
import { ConfigSection } from './ConfigSection'
import { FontSizeControl } from './FontSizeControl'
import { FontWeightControl } from './FontWeightControl'
import { FontFamilyControl } from './FontFamilyControl'

interface TextElementControlProps {
  id: string // Element ID (e.g., "title", "tagline", "author")
  label: string // Display label (e.g., "Title", "Tagline", "Author")
  content: string // Current text content
  color: string | undefined // User's color override
  fontSize: string | undefined // User's font size override
  fontWeight: number | undefined // User's font weight override
  fontFamily: string | undefined // User's font family override
  defaultColor: string // Layout's default color
  defaultFontSize: string // Layout's default font size
  defaultFontWeight: number // Layout's default font weight
  defaultFontFamily: string // Layout's default font family
  onContentChange: (content: string) => void
  onColorChange: (color: string | undefined) => void
  onFontSizeChange: (fontSize: string | undefined) => void
  onFontWeightChange: (fontWeight: number | undefined) => void
  onFontFamilyChange: (fontFamily: string | undefined) => void
  onColorPreview?: (color: string) => void // For hover preview
  onFontWeightPreview?: (fontWeight: number) => void // For hover preview
  onFontFamilyPreview?: (fontFamily: string) => void // For hover preview
}

export function TextElementControl({
  id,
  label,
  content,
  color,
  fontSize,
  fontWeight,
  fontFamily,
  defaultColor,
  defaultFontSize,
  defaultFontWeight,
  defaultFontFamily,
  onContentChange,
  onColorChange,
  onFontSizeChange,
  onFontWeightChange,
  onFontFamilyChange,
  onColorPreview,
  onFontWeightPreview,
  onFontFamilyPreview,
}: TextElementControlProps) {
  return (
    <ConfigSection title={label} storageKey={`text-${id}`}>
      <div className="space-y-4">
        <div>
          <label htmlFor={`text-${id}`} className="block text-sm font-medium text-slate-300 mb-2">
            {label} Text
          </label>
          <input
            id={`text-${id}`}
            type="text"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()} text`}
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>

        {/* Top row: Color and Font Size */}
        <div className="grid grid-cols-2 gap-4">
          <ColorControl
            value={color}
            defaultValue={defaultColor}
            onChange={onColorChange}
            onPreview={onColorPreview}
          />
          <FontSizeControl
            value={fontSize}
            defaultValue={defaultFontSize}
            onChange={onFontSizeChange}
          />
        </div>

        {/* Bottom row: Font Weight and Font Family */}
        <div className="grid grid-cols-2 gap-4">
          <FontWeightControl
            value={fontWeight}
            defaultValue={defaultFontWeight}
            onChange={onFontWeightChange}
            onPreview={onFontWeightPreview}
          />
          <FontFamilyControl
            value={fontFamily}
            defaultValue={defaultFontFamily}
            onChange={onFontFamilyChange}
            onPreview={onFontFamilyPreview}
          />
        </div>
      </div>
    </ConfigSection>
  )
}
