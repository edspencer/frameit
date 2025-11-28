import type React from 'react'
import type { LayoutProps } from './types'
import { getBackgroundStyle, findElement } from './utils'

export function FeatureCardLayout({
  width,
  height,
  textElements,
  imageElements,
  background,
}: LayoutProps): React.JSX.Element {
  const title = findElement(textElements, 'title')
  const subtitle = findElement(textElements, 'subtitle')
  const mainImage = findElement(imageElements, 'main')
  const logo = findElement(imageElements, 'logo')

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'row',
        background: getBackgroundStyle(background),
        fontFamily: 'Inter',
        position: 'relative',
      }}
    >
      {/* Left column - Main image (40% width) */}
      <div
        style={{
          width: width * 0.40,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {mainImage?.url && (
          <img
            src={mainImage.url}
            alt=""
            style={{
              maxWidth: width * 0.30 * ((mainImage.scale ?? 100) / 100),
              maxHeight: height * 0.80,
              objectFit: 'contain',
              opacity: mainImage.opacity ?? 1,
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
              fontSize: width * 0.07,
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
              fontSize: width * 0.035,
              fontWeight: subtitle.fontWeight ?? 400,
              color: subtitle.color || '#ffffff',
              lineHeight: 1.4,
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
            top: height * 0.05,
            right: width * 0.08,
            height: width * 0.05 * ((logo.scale ?? 100) / 100),
            opacity: logo.opacity ?? 1,
          }}
        />
      )}
    </div>
  )
}
