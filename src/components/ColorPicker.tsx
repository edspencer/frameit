interface ColorPickerProps {
  textColor: string
  onColorChange: (color: string) => void
  onPreview?: (color: string) => void // For hover preview
}

const PRESET_COLORS = [
  '#ffffff', // White
  '#000000', // Black
  '#3b82f6', // Sky Blue
  '#1e40af', // Navy Blue
  '#ef4444', // Bright Red
  '#f87171', // Coral Red
  '#34d399', // Mint Green
  '#059669', // Forest Green
  '#fbbf24', // Gold Yellow
  '#f97316', // Orange
  '#a78bfa', // Lavender Purple
  '#ec4899', // Hot Pink
  '#e5e7eb', // Light Gray
  '#374151', // Dark Gray
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
]

export function ColorPicker({ textColor, onColorChange, onPreview }: ColorPickerProps) {
  const normalizedColor = textColor.toLowerCase()

  return (
    <div className="space-y-2 w-full">
      {/* Color Palette Grid */}
      <div className="grid grid-cols-8 gap-1">
        {PRESET_COLORS.map((color) => {
          const isSelected = normalizedColor === color.toLowerCase()
          return (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              onMouseEnter={() => onPreview?.(color)}
              onMouseLeave={() => onPreview?.(textColor)}
              className={`aspect-square w-full rounded cursor-pointer transition-all ${
                isSelected
                  ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-800'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color }}
              title={color}
              aria-label={`Select color ${color}`}
            />
          )
        })}
      </div>

      {/* Hex Input */}
      <div className="flex items-center gap-2">
        <label htmlFor="hex-input" className="text-xs text-slate-400 flex-shrink-0">
          Hex:
        </label>
        <input
          id="hex-input"
          type="text"
          value={textColor}
          onChange={(e) => {
            const value = e.target.value
            // Allow typing # and hex characters
            if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
              onColorChange(value)
            }
          }}
          placeholder="#ffffff"
          className="flex-1 bg-slate-700 text-white px-2 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-xs font-mono min-w-0"
        />
      </div>
    </div>
  )
}
