import { GRADIENTS } from '../constants.js'
import type { BackgroundConfig } from '../types.js'

export function getBackgroundStyle(background: BackgroundConfig): string {
  switch (background.type) {
    case 'gradient': {
      const gradient = GRADIENTS.find(g => g.id === background.gradientId) || GRADIENTS[0]
      return `linear-gradient(to bottom, ${gradient.colorStart}, ${gradient.colorEnd})`
    }
    case 'solid':
      return background.solidColor || '#000000'
    case 'none':
      return 'transparent'
    default:
      return '#000000'
  }
}

export function findElement<T extends { id: string }>(
  elements: T[],
  id: string
): T | undefined {
  return elements.find(el => el.id === id)
}
