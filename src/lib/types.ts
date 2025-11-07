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
  fontFamily?: string     // Optional override ("Inter", "Georgia", etc.)
  fontWeight?: number     // Optional override (400, 600, 700, 800)
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

export interface OverlaySizing {
  width: string           // '100%', '80%', '500px'
  height: string          // '40%', '200px', '300px'
}

export interface OverlayStyling {
  fill: string            // Solid color (e.g., '#000000')
  opacity: number         // 0-1 (e.g., 0.6)
  gradient?: {
    direction: 'horizontal' | 'vertical'
    colorStart: string    // e.g., 'rgba(0,0,0,0.8)' or '#000000'
    colorEnd: string      // e.g., 'rgba(0,0,0,0)' or '#ffffff'
  }
}

export interface TextLayoutElement {
  id: string              // Must match TextElement.id
  type: 'text'
  position: LayoutPosition
  sizing?: LayoutSizing
  styling?: LayoutStyling
  zIndex: number          // Rendering order (lower = drawn first/behind)
}

export interface ImageLayoutElement {
  id: string              // Must match ImageElement.id
  type: 'image'
  position: LayoutPosition
  sizing?: LayoutSizing
  zIndex: number          // Rendering order (lower = drawn first/behind)
}

export interface OverlayLayoutElement {
  id: string              // e.g., "top-scrim", "bottom-fade"
  type: 'overlay'
  position: LayoutPosition
  sizing: OverlaySizing
  styling: OverlayStyling
  zIndex: number          // Typically 10-50 (between background and text)
}

export type LayoutElement = TextLayoutElement | ImageLayoutElement | OverlayLayoutElement

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
