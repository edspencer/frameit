import type React from 'react'
import type { LayoutProps } from './types.js'
import { getBackgroundStyle, findElement } from './utils.js'

export function SidebarLayout({
  width,
  height,
  textElements,
  imageElements,
  background,
}: LayoutProps): React.JSX.Element {
  const title = findElement(textElements, 'title')
  const subtitle = findElement(textElements, 'subtitle')
  const cta = findElement(textElements, 'cta')
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
      {/* Left column - Icon (40% width) */}
      <div
        style={{
          width: width * 0.40,
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
              height: width * 0.25 * ((icon.scale ?? 100) / 100),
              opacity: icon.opacity ?? 1,
            }}
          />
        )}
      </div>

      {/* Right column - Text content (60% width) */}
      <div
        style={{
          width: width * 0.55,
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
              fontSize: width * 0.08,
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
              fontFamily: subtitle.fontFamily || 'Inter',
            }}
          >
            {subtitle.content}
          </span>
        )}
        {cta && (
          <div
            style={{
              display: 'flex',
              marginTop: width * 0.01,
            }}
          >
            <div
              style={{
                backgroundColor: '#333333',
                borderRadius: 12,
                padding: `${width * 0.012}px ${width * 0.02}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: width * 0.035,
                  fontWeight: cta.fontWeight ?? 600,
                  color: cta.color || '#ffffff',
                  textAlign: 'center',
                  fontFamily: cta.fontFamily || 'Inter',
                }}
              >
                {cta.content}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
