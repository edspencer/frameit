import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ConfigSection } from './ConfigSection'

interface LogoUploaderProps {
  customLogo: string | undefined
  onLogoChange: (logoDataUrl: string | undefined) => void
  logoOpacity: number
  onOpacityChange: (opacity: number) => void
}

export function LogoUploader({ customLogo, onLogoChange, logoOpacity, onOpacityChange }: LogoUploaderProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Read file and convert to data URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onLogoChange(dataUrl)
      }
      reader.onerror = () => {
        alert('Failed to read image file')
      }
      reader.readAsDataURL(file)
    },
    [onLogoChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
    },
    multiple: false,
  })

  const handleDelete = () => {
    onLogoChange(undefined)
  }

  return (
    <ConfigSection title="Logo">
      <div className="space-y-3">
        {customLogo && (
          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded border border-slate-600">
            <img
              src={customLogo}
              alt="Custom logo preview"
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
              <p className="font-medium text-blue-400">Drop your logo here...</p>
            ) : (
              <>
                <p className="font-medium">Drag & drop your logo here</p>
                <p className="text-sm text-slate-400">or click to select a file</p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-slate-300">
            Opacity: {Math.round(logoOpacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(logoOpacity * 100)}
            onChange={(e) => onOpacityChange(parseInt(e.target.value) / 100)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </ConfigSection>
  )
}
