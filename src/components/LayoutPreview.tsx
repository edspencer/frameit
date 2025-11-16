import type { LayoutDefinition, LayoutElement } from '../lib/types'

interface LayoutPreviewProps {
  layout: LayoutDefinition
  className?: string
}

/**
 * Renders a skeleton preview of a layout showing element positioning
 * Uses a 16:9 aspect ratio container with simplified rectangular boxes for each element
 */
export function LayoutPreview({ layout, className = '' }: LayoutPreviewProps) {
  // Track element bounds for auto-positioning (similar to layout-renderer.ts)
  const elementBounds = new Map<string, { y: number; height: number }>()

  const renderElement = (element: LayoutElement, index: number) => {

    // Parse position values (support %, px, or auto)
    const parsePosition = (value: string | number): string | number => {
      if (value === 'auto') return 'auto'
      if (typeof value === 'number') return value
      return value // Already a string like "10%" or "100px"
    }

    // Calculate auto Y position based on previous elements
    const getAutoYPosition = (): string => {
      if (elementBounds.size === 0) {
        return '0%' // No previous elements, start at top
      }

      // Get the last element's bounds
      const lastBounds = Array.from(elementBounds.values()).pop()
      if (!lastBounds) return '0%'

      // Position below the last element with 1% gap
      const gap = 1 // 1% gap
      return `${lastBounds.y + lastBounds.height + gap}%`
    }

    // Parse sizing values (maxWidth)
    const parseSize = (value?: string): string => {
      if (!value) return '20%' // Default width for elements without maxWidth
      return value
    }

    // Get element dimensions first (needed for auto positioning)
    const getElementSize = (element: LayoutElement) => {
      if (element.type === 'text') {
        const width = element.sizing?.maxWidth ? parseSize(element.sizing.maxWidth) : '20%'

        // Calculate height based on fontSize with lineHeight multiplier
        let height = 8 // Default (as percentage number)
        if (element.sizing?.fontSize) {
          const fontSize = element.sizing.fontSize
          const lineHeight = element.sizing?.lineHeight || 1.2

          // Parse fontSize (e.g., "8%", "64px", "4rem")
          if (fontSize.endsWith('%')) {
            const fontSizePercent = Number.parseFloat(fontSize)
            // Multiply by lineHeight and add a small buffer for multi-line text
            height = fontSizePercent * lineHeight * 1.5
          } else if (fontSize.endsWith('px')) {
            // For pixel values, convert to approximate percentage (assuming 630px height)
            const fontSizePx = Number.parseFloat(fontSize)
            height = (fontSizePx / 630) * 100 * lineHeight * 1.5
          }
        }

        return { width, height }
      }

      if (element.type === 'image' && element.sizing?.maxWidth) {
        const size = parseSize(element.sizing.maxWidth)
        // Extract percentage value for height calculation
        const sizeNum = Number.parseFloat(size)
        return {
          width: size,
          height: sizeNum, // Square for images by default (as number)
        }
      }

      if (element.type === 'overlay' && element.sizing) {
        return {
          width: element.sizing.width,
          height: Number.parseFloat(element.sizing.height), // Convert to number
        }
      }

      // Default size
      return {
        width: '20%',
        height: 8,
      }
    }

    // Get position based on anchor point
    const getPositionStyle = (element: LayoutElement) => {
      const sizeStyle = getElementSize(element)

      // Handle auto Y positioning
      let y = parsePosition(element.position.y)
      if (y === 'auto') {
        y = getAutoYPosition()
      }

      const x = parsePosition(element.position.x)
      const anchor = element.position.anchor || 'top-left'

      // Convert to strings for CSS
      const xStr = typeof x === 'number' ? `${x}px` : x
      const yStr = typeof y === 'number' ? `${y}px` : y

      // Map anchor to CSS transform origin and positioning
      const anchorMap: Record<string, { left?: string; right?: string; top?: string; bottom?: string; transform?: string }> = {
        'top-left': { left: xStr, top: yStr },
        'top-center': { left: xStr, top: yStr, transform: 'translateX(-50%)' },
        'top-right': { right: xStr === '0%' ? '0%' : `calc(100% - ${xStr})`, top: yStr },
        'center-left': { left: xStr, top: yStr, transform: 'translateY(-50%)' },
        'center': { left: xStr, top: yStr, transform: 'translate(-50%, -50%)' },
        'center-right': { right: xStr === '0%' ? '0%' : `calc(100% - ${xStr})`, top: yStr, transform: 'translateY(-50%)' },
        'bottom-left': { left: xStr, bottom: yStr === '0%' ? '0%' : `calc(100% - ${yStr})` },
        'bottom-center': { left: xStr, bottom: yStr === '0%' ? '0%' : `calc(100% - ${yStr})`, transform: 'translateX(-50%)' },
        'bottom-right': { right: xStr === '0%' ? '0%' : `calc(100% - ${xStr})`, bottom: yStr === '0%' ? '0%' : `calc(100% - ${yStr})` },
      }

      // Store element bounds for auto-positioning of next elements
      const yNum = typeof y === 'string' ? Number.parseFloat(y) : y
      elementBounds.set(element.id, {
        y: yNum,
        height: typeof sizeStyle.height === 'number' ? sizeStyle.height : Number.parseFloat(sizeStyle.height as string),
      })

      return anchorMap[anchor] || anchorMap['top-left']
    }

    const positionStyle = getPositionStyle(element)
    const sizeStyle = getElementSize(element)

    // Convert height to string with % if it's a number
    const heightStyle = typeof sizeStyle.height === 'number' ? `${sizeStyle.height}%` : sizeStyle.height

    // Different opacity/style based on element type
    const getElementStyle = () => {
      if (element.type === 'text') {
        return 'bg-slate-400/30 border border-slate-400/50'
      }
      if (element.type === 'image') {
        return 'bg-blue-400/30 border border-blue-400/50 rounded-sm'
      }
      if (element.type === 'overlay') {
        return 'bg-purple-400/20 border border-purple-400/40'
      }
      return 'bg-slate-400/30 border border-slate-400/50'
    }

    return (
      <div
        key={`${element.id}-${index}`}
        className={`absolute ${getElementStyle()}`}
        style={{
          ...positionStyle,
          width: sizeStyle.width,
          height: heightStyle,
          zIndex: element.zIndex,
        }}
        title={`${element.type}: ${element.id}`}
      />
    )
  }

  // Sort elements by zIndex before rendering
  const sortedElements = [...layout.elements].sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className={`relative w-full ${className}`} style={{ paddingBottom: '56.25%' /* 16:9 ratio */ }}>
      <div className="absolute inset-0 bg-slate-700/50 rounded border border-slate-600/50 overflow-hidden">
        {/* Render elements sorted by zIndex */}
        {sortedElements.map((element, index) => renderElement(element, index))}
      </div>
    </div>
  )
}
