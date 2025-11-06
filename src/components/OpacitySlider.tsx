interface OpacitySliderProps {
  logoOpacity: number
  onOpacityChange: (opacity: number) => void
}

export function OpacitySlider({ logoOpacity, onOpacityChange }: OpacitySliderProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Logo Opacity</h3>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={logoOpacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="text-sm font-medium text-white w-12 text-right">
          {Math.round(logoOpacity * 100)}%
        </div>
      </div>
    </div>
  )
}
