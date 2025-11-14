import type React from 'react'
import { useState } from 'react'
import { getSectionExpandedState, setSectionExpandedState } from '../lib/ui-state'

interface ConfigSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  storageKey?: string // Optional key for localStorage persistence
  preview?: React.ReactNode // Optional preview to show when collapsed
  onExpanded?: (sectionName: string) => void // Optional callback when section expands
  onCollapsed?: (sectionName: string) => void // Optional callback when section collapses
}

export function ConfigSection({ title, children, defaultExpanded = true, storageKey, preview, onExpanded, onCollapsed }: ConfigSectionProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (storageKey) {
      return getSectionExpandedState(storageKey, defaultExpanded)
    }
    return defaultExpanded
  })

  const handleToggle = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    if (storageKey) {
      setSectionExpandedState(storageKey, newState)
    }

    // Call tracking callbacks
    if (newState && onExpanded) {
      onExpanded(title)
    }
    if (!newState && onCollapsed) {
      onCollapsed(title)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between text-left group ${isExpanded ? 'mb-4' : ''}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white flex-shrink-0">{title}</h3>
          {!isExpanded && preview && (
            <div className="flex items-center gap-2 text-sm text-slate-400 truncate">
              {preview}
            </div>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isExpanded && children}
    </div>
  )
}
