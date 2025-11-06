import { PlatformSelector } from './PlatformSelector'
import { HeadingContent } from './HeadingContent'
import { SubheadingContent } from './SubheadingContent'
import { BackgroundSelector } from './BackgroundSelector'
import { LogoUploader } from './LogoUploader'
import type { ThumbnailPreset } from '../lib/types'

interface ControlPanelProps {
  selectedPreset: ThumbnailPreset
  onPresetChange: (preset: ThumbnailPreset) => void
  title: string
  onTitleChange: (title: string) => void
  titleColor: string
  onTitleColorChange: (color: string) => void
  subtitle: string
  onSubtitleChange: (subtitle: string) => void
  subtitleColor: string
  onSubtitleColorChange: (color: string) => void
  selectedBackground: string
  onBackgroundChange: (url: string) => void
  logoOpacity: number
  onOpacityChange: (opacity: number) => void
  customLogo: string | undefined
  onCustomLogoChange: (logo: string | undefined) => void
}

export function ControlPanel({
  selectedPreset,
  onPresetChange,
  title,
  onTitleChange,
  titleColor,
  onTitleColorChange,
  subtitle,
  onSubtitleChange,
  subtitleColor,
  onSubtitleColorChange,
  selectedBackground,
  onBackgroundChange,
  logoOpacity,
  onOpacityChange,
  customLogo,
  onCustomLogoChange,
}: ControlPanelProps) {
  return (
    <div className="space-y-6">
      <PlatformSelector selectedPreset={selectedPreset} onPresetChange={onPresetChange} />
      <HeadingContent
        title={title}
        onTitleChange={onTitleChange}
        titleColor={titleColor}
        onTitleColorChange={onTitleColorChange}
      />
      <SubheadingContent
        subtitle={subtitle}
        onSubtitleChange={onSubtitleChange}
        subtitleColor={subtitleColor}
        onSubtitleColorChange={onSubtitleColorChange}
      />
      <BackgroundSelector selectedBackground={selectedBackground} onBackgroundChange={onBackgroundChange} />
      <LogoUploader
        customLogo={customLogo}
        onLogoChange={onCustomLogoChange}
        logoOpacity={logoOpacity}
        onOpacityChange={onOpacityChange}
      />

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-white mb-3">💡 Tips</h4>
        <ul className="text-xs text-slate-400 space-y-2">
          <li>• Use screenshotter for final capture</li>
          <li>• Keep text legible on small displays</li>
          <li>• High contrast ensures visibility</li>
          <li>• Logo provides brand recognition</li>
        </ul>
      </div>
    </div>
  )
}
