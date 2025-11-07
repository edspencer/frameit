import type React from 'react'

export interface ThumbnailPreset {
  name: string
  width: number
  height: number
  aspectRatio: string
  description: string
  category: 'video' | 'social'
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export interface BackgroundGradient {
  name: string
  id: string
  colorStart: string
  colorEnd: string
}

export interface BackgroundImage {
  name: string
  url: string
  thumbnail?: string
}

export interface ThumbnailConfig {
  title: string
  subtitle: string
  titleColor: string
  subtitleColor: string
  logoOpacity: number
  preset: ThumbnailPreset
  gradientId: string
  backgroundImageUrl?: string
  backgroundImageScale?: number
  customLogo?: string
}
