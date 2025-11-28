import type React from 'react'
import type { LayoutProps } from './types'
import { getBackgroundStyle, findElement } from './utils'

export function DefaultLayout({
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
        padding: width * 0.08,
        position: 'relative',
      }}
    >
      {/* Text content using flexbox */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: width * 0.01,
          maxWidth: width * 0.84,
        }}
      >
        {title && (
          <span
            style={{
              fontSize: width * 0.08,
              fontWeight: title.fontWeight ?? 700,
              color: title.color || '#ffffff',
              lineHeight: 1.125,
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        )}
        {subtitle && (
          <span
            style={{
              fontSize: width * 0.045,
              fontWeight: subtitle.fontWeight ?? 400,
              color: subtitle.color || '#ffffff',
              lineHeight: 1.22,
              fontFamily: subtitle.fontFamily || 'Inter',
            }}
          >
            {subtitle.content}
          </span>
        )}
      </div>

      {/* Logo positioned top-right - needs absolute for corner placement */}
      {logo?.url && (
        <img
          src={logo.url}
          alt=""
          style={{
            position: 'absolute',
            top: height * 0.02,
            right: width * 0.02,
            height: width * 0.08 * ((logo.scale ?? 100) / 100),
            opacity: logo.opacity ?? 1,
          }}
        />
      )}
    </div>
  )
}
