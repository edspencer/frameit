import type React from 'react'
import type { LayoutProps } from './types.js'
import { getBackgroundStyle, findElement } from './utils.js'

export function BottomTitleLayout({
  width,
  height,
  textElements,
  imageElements,
  background,
}: LayoutProps): React.JSX.Element {
  const brand = findElement(textElements, 'brand')
  const title = findElement(textElements, 'title')
  const logo = findElement(imageElements, 'logo')

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        background: getBackgroundStyle(background),
        fontFamily: 'Inter',
        position: 'relative',
      }}
    >
      {/* Brand text at top-left */}
      {brand && (
        <span
          style={{
            position: 'absolute',
            top: height * 0.08,
            left: width * 0.05,
            fontSize: width * 0.025,
            fontWeight: brand.fontWeight ?? 600,
            color: brand.color || '#ffffff',
            lineHeight: 1.2,
            fontFamily: brand.fontFamily || 'Inter',
            maxWidth: width * 0.30,
          }}
        >
          {brand.content}
        </span>
      )}

      {/* Title at bottom-left */}
      {title && (
        <span
          style={{
            position: 'absolute',
            bottom: height * 0.10,
            left: width * 0.05,
            fontSize: width * 0.045,
            fontWeight: title.fontWeight ?? 700,
            color: title.color || '#ffffff',
            lineHeight: 1.2,
            fontFamily: title.fontFamily || 'Inter',
            maxWidth: width * 0.50,
          }}
        >
          {title.content}
        </span>
      )}

      {/* Logo positioned bottom-right */}
      {logo?.url && (
        <img
          src={logo.url}
          style={{
            position: 'absolute',
            bottom: height * 0.12,
            right: width * 0.05,
            height: width * 0.05 * ((logo.scale ?? 100) / 100),
            opacity: logo.opacity ?? 1,
          }}
        />
      )}
    </div>
  )
}
