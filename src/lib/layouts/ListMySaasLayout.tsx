import type React from 'react'
import type { LayoutProps } from './types'
import { getBackgroundStyle, findElement } from './utils'

export function ListMySaasLayout({
  width,
  height,
  textElements,
  imageElements,
  background,
}: LayoutProps): React.JSX.Element {
  const badgeText = findElement(textElements, 'badge-text')
  const title = findElement(textElements, 'title')
  const category1 = findElement(textElements, 'category-1')
  const category2 = findElement(textElements, 'category-2')
  const category3 = findElement(textElements, 'category-3')
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
        background: getBackgroundStyle(background),
        fontFamily: 'Inter',
        position: 'relative',
      }}
    >
      {/* Brand badge (logo + text) at top center */}
      <div
        style={{
          position: 'absolute',
          top: height * 0.07,
          left: 0,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: width * 0.01,
        }}
      >
        {logo?.url && (
          <img
            src={logo.url}
            style={{
              height: width * 0.025 * ((logo.scale ?? 100) / 100),
              opacity: logo.opacity ?? 1,
            }}
          />
        )}
        {badgeText && (
          <span
            style={{
              fontSize: width * 0.018,
              fontWeight: badgeText.fontWeight ?? 600,
              color: badgeText.color || '#ffffff',
              lineHeight: 1.2,
              fontFamily: badgeText.fontFamily || 'Inter',
            }}
          >
            {badgeText.content}
          </span>
        )}
      </div>

      {/* Main headline centered */}
      {title && (
        <div
          style={{
            position: 'absolute',
            top: height * 0.20,
            left: width * 0.04,
            width: width * 0.92,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: width * 0.065,
              fontWeight: title.fontWeight ?? 900,
              color: title.color || '#ffffff',
              lineHeight: 1.15,
              textAlign: 'center',
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        </div>
      )}

      {/* Categories row - 3 columns at 65% from top */}
      <div
        style={{
          position: 'absolute',
          top: height * 0.65,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Category 1 at 25% */}
        {category1 && (
          <div
            style={{
              position: 'absolute',
              left: width * 0.15,
              width: width * 0.20,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: width * 0.028,
                fontWeight: category1.fontWeight ?? 500,
                color: category1.color || '#ffffff',
                lineHeight: 1.2,
                textAlign: 'center',
                fontFamily: category1.fontFamily || 'Inter',
              }}
            >
              {category1.content}
            </span>
          </div>
        )}

        {/* Category 2 at 50% */}
        {category2 && (
          <div
            style={{
              position: 'absolute',
              left: width * 0.38,
              width: width * 0.24,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: width * 0.028,
                fontWeight: category2.fontWeight ?? 500,
                color: category2.color || '#ffffff',
                lineHeight: 1.2,
                textAlign: 'center',
                fontFamily: category2.fontFamily || 'Inter',
              }}
            >
              {category2.content}
            </span>
          </div>
        )}

        {/* Category 3 at 75% */}
        {category3 && (
          <div
            style={{
              position: 'absolute',
              left: width * 0.65,
              width: width * 0.20,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: width * 0.028,
                fontWeight: category3.fontWeight ?? 500,
                color: category3.color || '#ffffff',
                lineHeight: 1.2,
                textAlign: 'center',
                fontFamily: category3.fontFamily || 'Inter',
              }}
            >
              {category3.content}
            </span>
          </div>
        )}
      </div>

      {/* Subtitle/note at bottom */}
      {subtitle && (
        <div
          style={{
            position: 'absolute',
            top: height * 0.86,
            left: width * 0.10,
            width: width * 0.80,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: width * 0.022,
              fontWeight: subtitle.fontWeight ?? 400,
              color: subtitle.color || '#e0e7ff',
              lineHeight: 1.3,
              textAlign: 'center',
              fontFamily: subtitle.fontFamily || 'Inter',
            }}
          >
            {subtitle.content}
          </span>
        </div>
      )}
    </div>
  )
}
