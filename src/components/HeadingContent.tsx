import { ColorPicker } from './ColorPicker'

interface HeadingContentProps {
  title: string
  onTitleChange: (title: string) => void
  titleColor: string
  onTitleColorChange: (color: string) => void
}

export function HeadingContent({
  title,
  onTitleChange,
  titleColor,
  onTitleColorChange,
}: HeadingContentProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Heading</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Heading Text
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter heading text"
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Color
          </label>
          <ColorPicker textColor={titleColor} onColorChange={onTitleColorChange} />
        </div>
      </div>
    </div>
  )
}
