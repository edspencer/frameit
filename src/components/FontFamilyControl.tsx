import { Listbox } from '@headlessui/react'
import { useState } from 'react'

interface FontFamilyControlProps {
  value: string | undefined // User's override value (undefined = use default)
  defaultValue: string // Layout's default font family
  onChange: (value: string | undefined) => void
  onPreview?: (value: string) => void // For live hover preview
}

export function FontFamilyControl({
  value,
  defaultValue,
  onChange,
  onPreview,
}: FontFamilyControlProps) {
  const isCustomized = value !== undefined
  const displayValue = value ?? defaultValue
  const [isOpen, setIsOpen] = useState(false)

  const handleReset = () => {
    onChange(undefined)
  }

  // Fonts available in Satori renderer (using Google Fonts alternatives)
  // The font name must exactly match what's registered in satori-renderer.ts
  const fontOptions = [
    { value: 'Arimo', label: 'Arial' },
    { value: 'Comic Neue', label: 'Comic Sans' },
    { value: 'Cousine', label: 'Courier' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Merriweather', label: 'Georgia' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Oswald', label: 'Impact' },
    { value: 'Source Code Pro', label: 'Source Code Pro' },
    { value: 'Source Sans 3', label: 'Trebuchet' },
    { value: 'Tinos', label: 'Times New Roman' },
  ]

  const selectedOption = fontOptions.find(opt => opt.value === displayValue) || fontOptions[0]

  const handleChange = (newValue: string) => {
    onChange(newValue === defaultValue ? undefined : newValue)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm text-slate-300">
          Font Family
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
        {({ open }) => {
          if (open !== isOpen) {
            setIsOpen(open)
          }
          return (
            <div className="relative">
              <Listbox.Button className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm text-left flex items-center justify-between">
                <span style={{ fontFamily: selectedOption.value }}>{selectedOption.label}</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Listbox.Button>

              <Listbox.Options className="absolute z-10 mt-1 w-full bg-slate-700 border border-slate-600 rounded shadow-lg max-h-60 overflow-auto focus:outline-none">
                {fontOptions.map((option) => (
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
                        <span style={{ fontFamily: option.value }}>
                          {option.label}
                        </span>
                        {selected && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          )
        }}
      </Listbox>
    </div>
  )
}
