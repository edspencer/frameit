import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ConfigSection } from './ConfigSection'

interface ImageElementControlProps {
  id: string // Element ID (e.g., "logo", "avatar", "badge")
  label: string // Display label (e.g., "Logo", "Avatar", "Badge")
  url: string | undefined // Current image URL (data URL or regular URL)
  opacity: number // Current opacity (0-1)
  onUrlChange: (url: string | undefined) => void
  onOpacityChange: (opacity: number) => void
}

export function ImageElementControl({
  id,
  label,
  url,
  opacity,
  onUrlChange,
  onOpacityChange,
}: ImageElementControlProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Read file and convert to data URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onUrlChange(dataUrl)
      }
      reader.onerror = () => {
        alert(`Failed to read ${label.toLowerCase()} image file`)
      }
      reader.readAsDataURL(file)
    },
    [onUrlChange, label]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
    },
    multiple: false,
  })

  const handleDelete = () => {
    onUrlChange(undefined)
  }

  return (
    <ConfigSection title={label}>
      <div className="space-y-3">
        {url && (
          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded border border-slate-600">
            <img
              src={url}
              alt={`${label} preview`}
              className="h-12 object-contain"
            />
            <button
              type="button"
              onClick={handleDelete}
              className="ml-auto bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-2 rounded text-sm transition-colors"
            >
              🗑️ Remove
            </button>
          </div>
        )}

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-500/10'
              : 'border-slate-600 hover:border-slate-500 bg-slate-900/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-slate-300">
            <div className="text-2xl mb-2">📤</div>
            {isDragActive ? (
              <p className="font-medium text-blue-400">Drop your {label.toLowerCase()} here...</p>
            ) : (
              <>
                <p className="font-medium">Drag & drop your {label.toLowerCase()} here</p>
                <p className="text-sm text-slate-400">or click to select a file</p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor={`opacity-${id}`} className="block text-sm text-slate-300">
            Opacity: {Math.round(opacity * 100)}%
          </label>
          <input
            id={`opacity-${id}`}
            type="range"
            min="0"
            max="100"
            value={Math.round(opacity * 100)}
            onChange={(e) => onOpacityChange(Number.parseInt(e.target.value) / 100)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </ConfigSection>
  )
}
