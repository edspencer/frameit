import { ColorPicker } from './ColorPicker'
import { ConfigSection } from './ConfigSection'

interface SubheadingContentProps {
  subtitle: string
  onSubtitleChange: (subtitle: string) => void
  subtitleColor: string
  onSubtitleColorChange: (color: string) => void
}

export function SubheadingContent({
  subtitle,
  onSubtitleChange,
  subtitleColor,
  onSubtitleColorChange,
}: SubheadingContentProps) {
  return (
    <ConfigSection title="Subheading">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Subheading Text
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="Enter subheading text"
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Color
          </label>
          <ColorPicker textColor={subtitleColor} onColorChange={onSubtitleColorChange} />
        </div>
      </div>
    </ConfigSection>
  )
}
