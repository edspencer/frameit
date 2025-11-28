import type React from 'react'
import type { LayoutProps } from './types'
import { getBackgroundStyle, findElement } from './utils'

export function FeaturedImageLeftLayout({
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
        fontFamily: 'Helvetica, sans-serif',
      }}
    >
      {/* Left column - Main image (55% width) */}
      <div
        style={{
          width: width * 0.55,
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
              maxWidth: width * 0.45 * ((mainImage.scale ?? 100) / 100),
              maxHeight: height * 0.90,
              objectFit: 'contain',
              opacity: mainImage.opacity ?? 1,
            }}
          />
        )}
      </div>

      {/* Right column - Text content + logo (45% width) */}
      <div
        style={{
          width: width * 0.43,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: height * 0.05,
          paddingTop: height * 0.10,
          paddingBottom: height * 0.10,
          paddingRight: width * 0.02,
        }}
      >
        {/* Text group */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: height * 0.03,
          }}
        >
          {title && (
            <span
              style={{
                fontSize: width * 0.042,
                fontWeight: title.fontWeight ?? 700,
                color: title.color || '#ffffff',
                lineHeight: 1.5,
                fontFamily: title.fontFamily || 'Helvetica, sans-serif',
              }}
            >
              {title.content}
            </span>
          )}
          {subtitle && (
            <span
              style={{
                fontSize: width * 0.022,
                fontWeight: subtitle.fontWeight ?? 400,
                color: subtitle.color || '#ffffff',
                lineHeight: 1.9,
                fontFamily: subtitle.fontFamily || 'Helvetica, sans-serif',
              }}
            >
              {subtitle.content}
            </span>
          )}
        </div>

        {/* Logo centered in column */}
        {logo?.url && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 'auto',
            }}
          >
            <img
              src={logo.url}
              alt=""
              style={{
                height: width * 0.06 * ((logo.scale ?? 100) / 100),
                opacity: logo.opacity ?? 1,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
