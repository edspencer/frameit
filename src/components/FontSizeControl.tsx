import { Tooltip } from './Tooltip'

interface FontSizeControlProps {
  value: string | undefined // User's override value (undefined = use default)
  defaultValue: string // Layout's default font size
  onChange: (value: string | undefined) => void
}

export function FontSizeControl({
  value,
  defaultValue,
  onChange,
}: FontSizeControlProps) {
  const isCustomized = value !== undefined

  const handleReset = () => {
    onChange(undefined)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm text-slate-300">
          Font Size
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

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value ?? defaultValue}
          onChange={(e) => onChange(e.target.value || undefined)}
          placeholder={defaultValue}
          className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
          style={{ width: 'calc(100% - 1.5rem)' }}
        />
        <Tooltip content="Use %, px, or rem (e.g., '8%', '64px', '4rem')">
          <span className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full bg-slate-700 text-slate-300 cursor-help hover:bg-slate-600 transition-colors flex-shrink-0">
            ?
          </span>
        </Tooltip>
      </div>
    </div>
  )
}
