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

  // Common web-safe and system fonts (alphabetically sorted)
  const fontOptions = [
    { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
    { value: 'Baskerville, "Baskerville Old Face", "Hoefler Text", serif', label: 'Baskerville' },
    { value: '"Comic Sans MS", "Comic Sans", cursive', label: 'Comic Sans MS' },
    { value: '"Courier New", Courier, monospace', label: 'Courier New' },
    { value: 'Garamond, "Apple Garamond", serif', label: 'Garamond' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: '"Helvetica Neue", Helvetica, Arial, sans-serif', label: 'Helvetica Neue' },
    { value: 'Impact, "Arial Black", sans-serif', label: 'Impact' },
    { value: 'Inter, -apple-system, sans-serif', label: 'Inter' },
    { value: 'Monaco, "Lucida Console", monospace', label: 'Monaco' },
    { value: 'Palatino, "Palatino Linotype", "Book Antiqua", serif', label: 'Palatino' },
    { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif', label: 'System Default' },
    { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
    { value: '"Trebuchet MS", "Lucida Grande", sans-serif', label: 'Trebuchet MS' },
    { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
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
