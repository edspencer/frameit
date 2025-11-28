import type React from 'react'
import type { LayoutProps } from './types'
import { findElement } from './utils'

export function PhotoEssayLayout({
  width,
  height,
  textElements,
  imageElements,
}: LayoutProps): React.JSX.Element {
  const artist = findElement(textElements, 'artist')
  const title = findElement(textElements, 'title')
  const mainImage = findElement(imageElements, 'main')

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        position: 'relative',
        fontFamily: 'Inter',
      }}
    >
      {/* Main background image - rendered first (background) */}
      {mainImage?.url && (
        <img
          src={mainImage.url}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: mainImage.opacity ?? 1,
          }}
        />
      )}

      {/* Top scrim overlay (gradient for text legibility) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: height * 0.25,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0))',
        }}
      />

      {/* Text content at top */}
      <div
        style={{
          position: 'absolute',
          top: height * 0.05,
          left: width * 0.05,
          width: width * 0.90,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {artist && (
          <span
            style={{
              fontSize: width * 0.0175,
              fontWeight: artist.fontWeight ?? 400,
              color: artist.color || '#ffffff',
              lineHeight: 1.3,
              fontFamily: artist.fontFamily || 'Inter',
            }}
          >
            {artist.content}
          </span>
        )}
        {title && (
          <span
            style={{
              fontSize: width * 0.045,
              fontWeight: title.fontWeight ?? 600,
              color: title.color || '#ffffff',
              lineHeight: 1.2,
              marginTop: width * 0.005,
              fontFamily: title.fontFamily || 'Inter',
            }}
          >
            {title.content}
          </span>
        )}
      </div>
    </div>
  )
}
