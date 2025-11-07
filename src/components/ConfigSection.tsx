import type React from 'react'

interface ConfigSectionProps {
  title: string
  children: React.ReactNode
}

export function ConfigSection({ title, children }: ConfigSectionProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  )
}
