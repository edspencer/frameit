import type React from 'react'
import type { LayoutProps } from './types.js'
import { getBackgroundStyle, findElement } from './utils.js'

export function AccentSplitLayout({
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
        position: 'relative',
      }}
    >
      {/* Accent overlay on right 40% */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: width * 0.60,
          width: width * 0.40,
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0))',
        }}
      />

      {/* Text content positioned at 10% from left, 15% from top */}
      <div
        style={{
          position: 'absolute',
          top: height * 0.15,
          left: width * 0.10,
          width: width * 0.50,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {title && (
          <span
            style={{
              fontSize: width * 0.085,
              fontWeight: title.fontWeight ?? 700,
              color: title.color || '#ffffff',
              lineHeight: 1.2,
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        )}
        {subtitle && (
          <span
            style={{
              fontSize: width * 0.04,
              fontWeight: subtitle.fontWeight ?? 400,
              color: subtitle.color || '#ffffff',
              lineHeight: 1.3,
              marginTop: width * 0.015,
              fontFamily: subtitle.fontFamily || 'Inter',
            }}
          >
            {subtitle.content}
          </span>
        )}
      </div>

      {/* Logo positioned center of right accent area */}
      {logo?.url && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: width * 0.60,
            width: width * 0.40,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={logo.url}
            style={{
              height: width * 0.08 * ((logo.scale ?? 100) / 100),
              opacity: logo.opacity ?? 1,
            }}
          />
        </div>
      )}
    </div>
  )
}
