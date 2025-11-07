import { ColorPicker } from './ColorPicker'
import { ConfigSection } from './ConfigSection'

interface TextElementControlProps {
  id: string // Element ID (e.g., "title", "tagline", "author")
  label: string // Display label (e.g., "Title", "Tagline", "Author")
  content: string // Current text content
  color: string // Current text color
  onContentChange: (content: string) => void
  onColorChange: (color: string) => void
}

export function TextElementControl({
  id,
  label,
  content,
  color,
  onContentChange,
  onColorChange,
}: TextElementControlProps) {
  return (
    <ConfigSection title={label}>
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
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Color
          </label>
          <ColorPicker textColor={color} onColorChange={onColorChange} />
        </div>
      </div>
    </ConfigSection>
  )
}
