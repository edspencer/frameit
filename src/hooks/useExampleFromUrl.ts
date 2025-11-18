import { useEffect, useRef } from 'react'
import { getExampleById } from '../lib/example-configs'
import { PLATFORMS_WITH_ICONS } from '../lib/ui-constants'
import type { ThumbnailConfig } from '../lib/types'

/**
 * Extract example ID from URL path
 * Matches patterns like /example/birthday-cake
 */
function getExampleIdFromUrl(): string | null {
  const match = window.location.pathname.match(/^\/example\/([^/]+)$/)
  return match ? match[1] : null
}

/**
 * Find example config by ID and transform it to ThumbnailConfig format
 */
function getExampleConfig(exampleId: string): Partial<ThumbnailConfig> | null {
  const example = getExampleById(exampleId)
  if (!example) return null

  const preset = PLATFORMS_WITH_ICONS.find(p => p.name === example.config.presetName) || PLATFORMS_WITH_ICONS[0]

  return {
    preset,
    layoutId: example.config.layoutId,
    background: example.config.background,
    textElements: example.config.textElements,
    imageElements: example.config.imageElements,
  }
}

/**
 * Hook to load example configuration from URL on mount
 *
 * @param onSelectExample - Callback to apply the example configuration
 */
export function useExampleFromUrl(
  onSelectExample: (config: Partial<ThumbnailConfig>) => void
): void {
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Only load once on mount
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const exampleId = getExampleIdFromUrl()
    if (!exampleId) return

    const config = getExampleConfig(exampleId)
    if (config) {
      onSelectExample(config)
    }
  }, [onSelectExample])
}

/**
 * Update URL when an example is selected
 * Uses history.pushState to avoid page reload
 */
export function updateUrlForExample(exampleId: string): void {
  const newUrl = `/example/${exampleId}`
  window.history.pushState({ exampleId }, '', newUrl)
}

/**
 * Clear example from URL (e.g., when user modifies config)
 * Resets to root path
 */
export function clearExampleFromUrl(): void {
  if (window.location.pathname.startsWith('/example/')) {
    window.history.pushState({}, '', '/')
  }
}
