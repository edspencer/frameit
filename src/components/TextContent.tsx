interface TextContentProps {
  title: string
  subtitle: string
  onTitleChange: (title: string) => void
  onSubtitleChange: (subtitle: string) => void
}

export function TextContent({ title, subtitle, onTitleChange, onSubtitleChange }: TextContentProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Text Content</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Heading
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
            Subheading
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="Enter subheading text"
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>
      </div>
    </div>
  )
}
