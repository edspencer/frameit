import type React from 'react'
import type { LayoutProps } from './types.js'
import { getBackgroundStyle, findElement } from './utils.js'

export function SimpleCenteredLayout({
  width,
  height,
  textElements,
  imageElements,
  background,
}: LayoutProps): React.JSX.Element {
  const title = findElement(textElements, 'title')
  const subtitle = findElement(textElements, 'subtitle')
  const icon = findElement(imageElements, 'icon')

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: getBackgroundStyle(background),
        fontFamily: 'Inter',
        padding: width * 0.08,
      }}
    >
      {/* Centered content group using flexbox */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: height * 0.03,
          maxWidth: width * 0.80,
        }}
      >
        {/* Icon */}
        {icon?.url && (
          <img
            src={icon.url}
            alt=""
            style={{
              height: width * 0.15 * ((icon.scale ?? 100) / 100),
              opacity: icon.opacity ?? 1,
            }}
          />
        )}

        {/* Title */}
        {title && (
          <span
            style={{
              fontSize: width * 0.075,
              fontWeight: title.fontWeight ?? 700,
              color: title.color || '#ffffff',
              lineHeight: 1.1,
              textAlign: 'center',
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        )}

        {/* Subtitle */}
        {subtitle && (
          <span
            style={{
              fontSize: width * 0.025,
              fontWeight: subtitle.fontWeight ?? 400,
              color: subtitle.color || '#d1d5db',
              lineHeight: 1.3,
              textAlign: 'center',
              fontFamily: subtitle.fontFamily || 'Inter',
              maxWidth: width * 0.70,
            }}
          >
            {subtitle.content}
          </span>
        )}
      </div>
    </div>
  )
}
