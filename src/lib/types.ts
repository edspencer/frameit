export interface ThumbnailPreset {
  name: string
  width: number
  height: number
  aspectRatio: string
  description: string
}

export interface BackgroundImage {
  name: string
  url: string
  thumbnail?: string
}

export interface ThumbnailConfig {
  title: string
  subtitle: string
  textColor: string
  logoOpacity: number
  preset: ThumbnailPreset
  background: string
}
