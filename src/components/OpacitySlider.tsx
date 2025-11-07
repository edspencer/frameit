import { ConfigSection } from './ConfigSection'

interface OpacitySliderProps {
  logoOpacity: number
  onOpacityChange: (opacity: number) => void
}

export function OpacitySlider({ logoOpacity, onOpacityChange }: OpacitySliderProps) {
  return (
    <ConfigSection title="Logo Opacity">
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
    </ConfigSection>
  )
}
