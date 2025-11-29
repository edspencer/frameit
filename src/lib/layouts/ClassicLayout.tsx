import type React from 'react'
import type { LayoutProps } from './types.js'
import { getBackgroundStyle, findElement } from './utils.js'

export function ClassicLayout({
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
        background: getBackgroundStyle(background),
        fontFamily: 'Inter',
        padding: width * 0.10,
        paddingTop: height * 0.15,
        position: 'relative',
      }}
    >
      {/* Text content using flexbox */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: width * 0.01,
          maxWidth: width * 0.80,
        }}
      >
        {title && (
          <span
            style={{
              fontSize: width * 0.08,
              fontWeight: title.fontWeight ?? 700,
              color: title.color || '#ffffff',
              lineHeight: 1.1,
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        )}
        {subtitle && (
          <span
            style={{
              fontSize: width * 0.03,
              fontWeight: subtitle.fontWeight ?? 400,
              color: subtitle.color || '#ffffff',
              lineHeight: 1.4,
              fontFamily: subtitle.fontFamily || 'Inter',
              maxWidth: width * 0.70,
            }}
          >
            {subtitle.content}
          </span>
        )}
      </div>

      {/* Logo positioned bottom-left - needs absolute for corner placement */}
      {logo?.url && (
        <img
          src={logo.url}
          alt=""
          style={{
            position: 'absolute',
            bottom: height * 0.15,
            left: width * 0.10,
            height: width * 0.15 * ((logo.scale ?? 100) / 100),
            opacity: logo.opacity ?? 1,
          }}
        />
      )}
    </div>
  )
}
