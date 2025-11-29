import type React from 'react'
import type { LayoutProps } from './types.js'
import { getBackgroundStyle, findElement } from './utils.js'

export function OGImageLayout({
  width,
  height,
  textElements,
  imageElements,
  background,
}: LayoutProps): React.JSX.Element {
  const title = findElement(textElements, 'title')
  const cta = findElement(textElements, 'cta')
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
          gap: height * 0.05,
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
              fontSize: width * 0.05,
              fontWeight: title.fontWeight ?? 700,
              color: title.color || '#ffffff',
              lineHeight: 1.2,
              textAlign: 'center',
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        )}

        {/* CTA Button */}
        {cta && (
          <div
            style={{
              backgroundColor: '#FBBF24',
              borderRadius: 40,
              padding: `${width * 0.015}px ${width * 0.025}px`,
              border: `${width * 0.004}px solid #FFFFFF`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: width * 0.035,
                fontWeight: cta.fontWeight ?? 800,
                color: cta.color || '#000000',
                textAlign: 'center',
                fontFamily: cta.fontFamily || 'Inter',
              }}
            >
              {cta.content}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
