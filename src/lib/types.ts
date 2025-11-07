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

// ============================================================================
// Layout System Types
// ============================================================================

export type BackgroundType = 'gradient' | 'solid' | 'none'

export interface BackgroundConfig {
  type: BackgroundType
  gradientId?: string      // For gradient backgrounds (references BackgroundGradient.id)
  solidColor?: string      // For solid backgrounds
  imageUrl?: string        // Optional image overlay
  imageScale?: number      // 0-200, default 100
}

export interface TextElement {
  id: string              // "title", "subtitle", etc.
  content: string
  color?: string          // Optional override (hex color)
  fontSize?: string       // Optional override ("8%", "64px")
}

export interface ImageElement {
  id: string              // "logo", "avatar", etc.
  url?: string            // Optional custom image URL
  opacity?: number        // 0-1, default 1.0
  scale?: number          // 0-200, default 100
}

export interface LayoutPosition {
  x: string | number      // "10%", "50px", or auto
  y: string | number      // "20%", "100px", or auto
  anchor?: 'top-left' | 'top-center' | 'top-right' |
           'center-left' | 'center' | 'center-right' |
           'bottom-left' | 'bottom-center' | 'bottom-right'
}

export interface LayoutSizing {
  maxWidth?: string       // "80%", "500px"
  fontSize?: string       // "8%", "64px", "4rem"
  lineHeight?: number     // 1.2, 1.5, etc.
  letterSpacing?: string  // "-0.02em", "0.05em"
}

export interface LayoutStyling {
  fontWeight?: number     // 400, 700, etc.
  fontFamily?: string     // "Inter", "Arial", etc.
  textAlign?: 'left' | 'center' | 'right'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  color?: string          // Default color (hex)
}

export interface LayoutElement {
  id: string              // Must match TextElement.id or ImageElement.id
  type: 'text' | 'image'
  position: LayoutPosition
  sizing?: LayoutSizing   // Text only
  styling?: LayoutStyling // Text only
}

export interface LayoutDefinition {
  id: string
  name: string
  description: string
  elements: LayoutElement[]
}

export interface ThumbnailConfigNew {
  preset: ThumbnailPreset
  layoutId: string        // References LayoutDefinition.id
  background: BackgroundConfig
  textElements: TextElement[]
  imageElements: ImageElement[]
}
