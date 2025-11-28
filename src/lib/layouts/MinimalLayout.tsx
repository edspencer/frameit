import type React from 'react'
import type { LayoutProps } from './types'
import { getBackgroundStyle, findElement } from './utils'

export function MinimalLayout({
  width,
  height,
  textElements,
  imageElements,
  background,
}: LayoutProps): React.JSX.Element {
  const title = findElement(textElements, 'title')
  const subtitle = findElement(textElements, 'subtitle')
  const logo = findElement(imageElements, 'logo')

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: getBackgroundStyle(background),
        fontFamily: 'Inter',
        padding: width * 0.10,
        position: 'relative',
      }}
    >
      {/* Text content using flexbox */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: width * 0.02,
          maxWidth: width * 0.85,
        }}
      >
        {title && (
          <span
            style={{
              fontSize: width * 0.10,
              fontWeight: title.fontWeight ?? 800,
              color: title.color || '#ffffff',
              lineHeight: 1.0,
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        )}
        {subtitle && (
          <span
            style={{
              fontSize: width * 0.025,
              fontWeight: subtitle.fontWeight ?? 300,
              color: subtitle.color || '#ffffff',
              lineHeight: 1.3,
              fontFamily: subtitle.fontFamily || 'Inter',
              maxWidth: width * 0.60,
            }}
          >
            {subtitle.content}
          </span>
        )}
      </div>

      {/* Logo positioned bottom-right - needs absolute for corner placement */}
      {logo?.url && (
        <img
          src={logo.url}
          alt=""
          style={{
            position: 'absolute',
            bottom: height * 0.05,
            right: width * 0.05,
            height: width * 0.06 * ((logo.scale ?? 100) / 100),
            opacity: logo.opacity ?? 1,
          }}
        />
      )}
    </div>
  )
}
