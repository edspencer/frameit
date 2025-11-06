interface ColorPickerProps {
  textColor: string
  onColorChange: (color: string) => void
}

export function ColorPicker({ textColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-4">
      <input
        type="color"
        value={textColor}
        onChange={(e) => onColorChange(e.target.value)}
        className="w-12 h-12 rounded cursor-pointer"
      />
      <div>
        <div className="text-sm font-mono text-white">{textColor}</div>
        <div className="text-xs text-slate-400">Current color</div>
      </div>
    </div>
  )
}
