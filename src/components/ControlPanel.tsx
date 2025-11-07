import { PlatformSelector } from './PlatformSelector'
import { HeadingContent } from './HeadingContent'
import { SubheadingContent } from './SubheadingContent'
import { GradientSelector } from './GradientSelector'
import { BackgroundImageUploader } from './BackgroundImageUploader'
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
  selectedGradientId: string
  onGradientChange: (id: string) => void
  backgroundImageUrl: string | undefined
  onBackgroundImageChange: (url: string | undefined) => void
  backgroundImageScale: number
  onBackgroundImageScaleChange: (scale: number) => void
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
  selectedGradientId,
  onGradientChange,
  backgroundImageUrl,
  onBackgroundImageChange,
  backgroundImageScale,
  onBackgroundImageScaleChange,
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
      <GradientSelector selectedGradientId={selectedGradientId} onGradientChange={onGradientChange} />
      <BackgroundImageUploader
        backgroundImageUrl={backgroundImageUrl}
        onImageChange={onBackgroundImageChange}
        backgroundImageScale={backgroundImageScale}
        onScaleChange={onBackgroundImageScaleChange}
      />
      <LogoUploader
        customLogo={customLogo}
        onLogoChange={onCustomLogoChange}
        logoOpacity={logoOpacity}
        onOpacityChange={onOpacityChange}
      />
    </div>
  )
}
