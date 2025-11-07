import { Listbox } from '@headlessui/react'

interface FontWeightControlProps {
  value: number | undefined // User's override value (undefined = use default)
  defaultValue: number // Layout's default font weight
  onChange: (value: number | undefined) => void
  onPreview?: (value: number) => void // For live hover preview
}

export function FontWeightControl({
  value,
  defaultValue,
  onChange,
  onPreview,
}: FontWeightControlProps) {
  const isCustomized = value !== undefined
  const displayValue = value ?? defaultValue

  const handleReset = () => {
    onChange(undefined)
  }

  const weightOptions = [
    { value: 400, label: 'Regular (400)' },
    { value: 700, label: 'Bold (700)' },
  ]

  const selectedOption = weightOptions.find(opt => opt.value === displayValue) || weightOptions[1]

  const handleChange = (newValue: number) => {
    onChange(newValue === defaultValue ? undefined : newValue)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm text-slate-300">
          Font Weight
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

      <Listbox value={displayValue} onChange={handleChange}>
        <div className="relative">
          <Listbox.Button className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm text-left flex items-center justify-between">
            <span style={{ fontWeight: selectedOption.value }}>{selectedOption.label}</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-1 w-full bg-slate-700 border border-slate-600 rounded shadow-lg max-h-60 overflow-auto focus:outline-none">
            {weightOptions.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `cursor-pointer select-none px-3 py-2 text-sm ${
                    active ? 'bg-blue-500 text-white' : 'text-white'
                  }`
                }
                onMouseEnter={() => {
                  if (onPreview) {
                    onPreview(option.value)
                  }
                }}
                onMouseLeave={() => {
                  if (onPreview) {
                    onPreview(displayValue)
                  }
                }}
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between">
                    <span style={{ fontWeight: option.value }}>
                      {option.label}
                    </span>
                    {selected && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  )
}
