import type React from 'react'
import type { LayoutProps } from './types'
import { getBackgroundStyle, findElement } from './utils'

export function StackedTextRightLayout({
  width,
  height,
  textElements,
  imageElements,
  background,
}: LayoutProps): React.JSX.Element {
  const title = findElement(textElements, 'title')
  const subtitle = findElement(textElements, 'subtitle')
  const description = findElement(textElements, 'description')
  const icon = findElement(imageElements, 'icon')

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'row',
        background: getBackgroundStyle(background),
        fontFamily: 'Inter',
      }}
    >
      {/* Left column - Icon (50% width) */}
      <div
        style={{
          width: width * 0.50,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon?.url && (
          <img
            src={icon.url}
            alt=""
            style={{
              height: width * 0.22 * ((icon.scale ?? 100) / 100),
              opacity: icon.opacity ?? 1,
            }}
          />
        )}
      </div>

      {/* Right column - Text content (50% width) */}
      <div
        style={{
          width: width * 0.45,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: width * 0.015,
          paddingRight: width * 0.05,
        }}
      >
        {title && (
          <span
            style={{
              fontSize: width * 0.088,
              fontWeight: title.fontWeight ?? 700,
              color: title.color || '#4a5568',
              lineHeight: 1.15,
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        )}
        {subtitle && (
          <span
            style={{
              fontSize: width * 0.035,
              fontWeight: subtitle.fontWeight ?? 400,
              color: subtitle.color || '#718096',
              lineHeight: 1.3,
              fontFamily: subtitle.fontFamily || 'Inter',
            }}
          >
            {subtitle.content}
          </span>
        )}
        {description && (
          <span
            style={{
              fontSize: width * 0.03,
              fontWeight: description.fontWeight ?? 400,
              color: description.color || '#718096',
              lineHeight: 1.5,
              fontFamily: description.fontFamily || 'Inter',
            }}
          >
            {description.content}
          </span>
        )}
      </div>
    </div>
  )
}
