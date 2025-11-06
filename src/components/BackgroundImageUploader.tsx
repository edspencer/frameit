import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface BackgroundImageUploaderProps {
  backgroundImageUrl: string | undefined
  onImageChange: (url: string | undefined) => void
  backgroundImageScale: number
  onScaleChange: (scale: number) => void
}

export function BackgroundImageUploader({
  backgroundImageUrl,
  onImageChange,
  backgroundImageScale,
  onScaleChange,
}: BackgroundImageUploaderProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Read file and convert to data URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onImageChange(dataUrl)
      }
      reader.onerror = () => {
        alert('Failed to read image file')
      }
      reader.readAsDataURL(file)
    },
    [onImageChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: false,
  })

  const handleDelete = () => {
    onImageChange(undefined)
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Background Image (Optional)</h3>

      <div className="space-y-3">
        {backgroundImageUrl && (
          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded border border-slate-600">
            <img
              src={backgroundImageUrl}
              alt="Background preview"
              className="h-12 object-cover rounded"
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
            <div className="text-2xl mb-2">🖼️</div>
            {isDragActive ? (
              <p className="font-medium text-blue-400">Drop your background image here...</p>
            ) : (
              <>
                <p className="font-medium">Drag & drop a background image</p>
                <p className="text-sm text-slate-400">or click to select a file</p>
              </>
            )}
          </div>
        </div>

        {backgroundImageUrl && (
          <div className="space-y-2">
            <label className="block text-sm text-slate-300">
              Scale: {backgroundImageScale}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={backgroundImageScale}
              onChange={(e) => onScaleChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-slate-400">0% = hidden, 100% = fit canvas, 200% = 2x larger</p>
          </div>
        )}
      </div>
    </div>
  )
}
