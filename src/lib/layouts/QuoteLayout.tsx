import type React from 'react'
import type { LayoutProps } from './types'
import { getBackgroundStyle, findElement } from './utils'

export function QuoteLayout({
  width,
  height,
  textElements,
  imageElements,
  background,
}: LayoutProps): React.JSX.Element {
  const quotemark = findElement(textElements, 'quotemark')
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
        {/* Quote mark */}
        {quotemark && (
          <span
            style={{
              fontSize: width * 0.15,
              fontWeight: quotemark.fontWeight ?? 400,
              color: quotemark.color || '#ffffff',
              lineHeight: 0.8,
              fontFamily: quotemark.fontFamily || 'Inter',
            }}
          >
            {quotemark.content}
          </span>
        )}

        {/* Title (quote text) */}
        {title && (
          <span
            style={{
              fontSize: width * 0.07,
              fontWeight: title.fontWeight ?? 600,
              color: title.color || '#ffffff',
              lineHeight: 1.3,
              textAlign: 'center',
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        )}

        {/* Subtitle (attribution) */}
        {subtitle && (
          <span
            style={{
              fontSize: width * 0.03,
              fontWeight: subtitle.fontWeight ?? 400,
              color: subtitle.color || '#cccccc',
              lineHeight: 1.2,
              textAlign: 'center',
              fontFamily: subtitle.fontFamily || 'Inter',
            }}
          >
            {subtitle.content}
          </span>
        )}

        {/* Logo */}
        {logo?.url && (
          <img
            src={logo.url}
            alt=""
            style={{
              height: width * 0.05 * ((logo.scale ?? 100) / 100),
              opacity: logo.opacity ?? 1,
              marginTop: height * 0.02,
            }}
          />
        )}
      </div>
    </div>
  )
}
