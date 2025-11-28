import type React from 'react'
import type { LayoutProps } from './types'
import { getBackgroundStyle, findElement } from './utils'

export function DomainAndTitleLayout({
  width,
  height,
  textElements,
  imageElements,
  background,
}: LayoutProps): React.JSX.Element {
  const domain = findElement(textElements, 'domain')
  const title = findElement(textElements, 'title')
  const icon = findElement(imageElements, 'icon')

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
        padding: width * 0.15,
        position: 'relative',
      }}
    >
      {/* Left-aligned text content using flexbox */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: width * 0.01,
          maxWidth: width * 0.70,
        }}
      >
        {/* Domain */}
        {domain && (
          <span
            style={{
              fontSize: width * 0.035,
              fontWeight: domain.fontWeight ?? 400,
              color: domain.color || '#000000',
              lineHeight: 1.2,
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
              fontSize: width * 0.08,
              fontWeight: title.fontWeight ?? 700,
              color: title.color || '#000000',
              lineHeight: 1.1,
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        )}
      </div>

      {/* Icon positioned bottom-right - needs absolute for corner placement */}
      {icon?.url && (
        <img
          src={icon.url}
          alt=""
          style={{
            position: 'absolute',
            bottom: height * 0.15,
            right: width * 0.08,
            height: width * 0.12 * ((icon.scale ?? 100) / 100),
            opacity: icon.opacity ?? 1,
          }}
        />
      )}
    </div>
  )
}
