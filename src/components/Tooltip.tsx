import { useState, type ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <span className="absolute right-0 top-full mt-2 px-3 py-2 text-xs text-left text-white bg-slate-900 rounded-lg shadow-lg border border-slate-700 w-56 z-10 pointer-events-none">
          {content}
          <span className="absolute right-2 bottom-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-slate-900" />
        </span>
      )}
    </span>
  )
}
