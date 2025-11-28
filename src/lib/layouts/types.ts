import type React from 'react'
import type { TextElement, ImageElement, BackgroundConfig } from '../types'

export interface LayoutProps {
  width: number
  height: number
  textElements: TextElement[]
  imageElements: ImageElement[]
  background: BackgroundConfig
}

export type LayoutComponent = (props: LayoutProps) => React.JSX.Element
