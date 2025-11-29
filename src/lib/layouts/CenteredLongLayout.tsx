import type React from 'react'
import type { LayoutProps } from './types.js'
import { getBackgroundStyle, findElement } from './utils.js'

export function CenteredLongLayout({
  width,
  height,
  textElements,
  background,
}: LayoutProps): React.JSX.Element {
  const domain = findElement(textElements, 'domain')
  const title = findElement(textElements, 'title')
  const subtitle = findElement(textElements, 'subtitle')

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
        padding: width * 0.05,
      }}
    >
      {/* Centered content group using flexbox */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: height * 0.04,
          maxWidth: width * 0.90,
        }}
      >
        {/* Domain */}
        {domain && (
          <span
            style={{
              fontSize: width * 0.03,
              fontWeight: domain.fontWeight ?? 700,
              color: domain.color || '#ffffff',
              lineHeight: 1.2,
              textAlign: 'center',
              fontFamily: domain.fontFamily || 'Inter',
            }}
          >
            {domain.content}
          </span>
        )}

        {/* Title */}
        {title && (
          <span
            style={{
              fontSize: width * 0.055,
              fontWeight: title.fontWeight ?? 800,
              color: title.color || '#ffffff',
              lineHeight: 1.2,
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
              color: subtitle.color || '#ffffff',
              lineHeight: 1.3,
              textAlign: 'center',
              fontFamily: subtitle.fontFamily || 'Inter',
              maxWidth: width * 0.65,
            }}
          >
            {subtitle.content}
          </span>
        )}
      </div>
    </div>
  )
}
