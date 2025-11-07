import { ColorPicker } from './ColorPicker'

interface ColorControlProps {
  value: string | undefined // User's override value (undefined = use default)
  defaultValue: string // Layout's default color
  onChange: (color: string | undefined) => void
  onPreview?: (color: string) => void // For hover preview
}

export function ColorControl({
  value,
  defaultValue,
  onChange,
  onPreview,
}: ColorControlProps) {
  const isCustomized = value !== undefined
  const displayValue = value ?? defaultValue

  const handleReset = () => {
    onChange(undefined)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm text-slate-300">
          Color
        </label>
        {isCustomized && (
          <button
            type="button"
            onClick={handleReset}
            className="group text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <span className="group-hover:hidden">✨ Edited</span>
            <span className="hidden group-hover:inline">🔄 Reset</span>
          </button>
        )}
      </div>

      <ColorPicker textColor={displayValue} onColorChange={onChange} onPreview={onPreview} />
    </div>
  )
}
