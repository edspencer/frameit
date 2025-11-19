import posthog from 'posthog-js'

/**
 * Conversion event interfaces
 * Events that represent goal completions (downloads, copies)
 */
export interface ThumbnailDownloadedProps {
  preset_used: string
  image_format?: string
}

export interface ThumbnailCopiedProps {
  preset_used: string
}

/**
 * Configuration event interfaces
 * Events that represent user customization actions
 */
export interface PresetSelectedProps {
  preset_name: string
}

export interface LayoutChangedProps {
  layout_id: string
  layout_name: string
}

export interface GradientChangedProps {
  gradient_id: string
  gradient_name: string
}

export interface TextEditedProps {
  element_id: string
  content_length: number
}

export interface TextColorChangedProps {
  element_id: string
  new_color: string
}

export interface TextFontChangedProps {
  element_id: string
  font_name: string
}

export interface TextWeightChangedProps {
  element_id: string
  new_weight: number
}

export interface LogoOpacityChangedProps {
  new_opacity: number
}

export interface ImageScaleChangedProps {
  element_id: string
  new_scale: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BackgroundImageUploadedProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LogoUploadedProps {}

export interface ExampleSelectedProps {
  example_id: string
  example_name: string
  layout_id: string
}

/**
 * Engagement event interfaces
 * Events that represent user interaction patterns
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PageViewedProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SessionStartedProps {}

export interface ConfigSectionExpandedProps {
  section_name: string
}

export interface ConfigSectionCollapsedProps {
  section_name: string
}

/**
 * Union type of all event properties (internal use only)
 */
type EventProperties =
  | ThumbnailDownloadedProps
  | ThumbnailCopiedProps
  | PresetSelectedProps
  | LayoutChangedProps
  | GradientChangedProps
  | TextEditedProps
  | TextColorChangedProps
  | TextFontChangedProps
  | TextWeightChangedProps
  | LogoOpacityChangedProps
  | ImageScaleChangedProps
  | BackgroundImageUploadedProps
  | LogoUploadedProps
  | ExampleSelectedProps
  | PageViewedProps
  | SessionStartedProps
  | ConfigSectionExpandedProps
  | ConfigSectionCollapsedProps

// Track initialization state
let isInitialized = false

/**
 * Initialize PostHog with privacy-first configuration
 * - Skips initialization in development mode
 * - Skips initialization if API key is not provided
 * - Prevents double initialization (idempotent)
 * - Uses memory-only persistence (no cookies/localStorage)
 * - Respects browser Do Not Track headers
 * - Disables session recording and surveys
 */
export function initializePostHog(): void {
  console.log('Initializing PostHog...')
  // Guard: Skip if already initialized
  if (isInitialized) {
    console.log('PostHog already initialized. Skipping initialization.')
    return
  }

  // Skip in development mode to avoid polluting analytics
  if (import.meta.env.MODE === 'development') {
    console.log('PostHog disabled in development mode. Skipping initialization.')
    return
  }

  // Read environment variables
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY
  const apiHost = import.meta.env.VITE_POSTHOG_HOST

  // Skip if API key is not provided
  if (!apiKey) {
    console.warn('PostHog API key not provided. Analytics will not be initialized.')
    return
  }

  // Initialize PostHog with privacy-focused configuration
  posthog.init(apiKey, {
    api_host: apiHost || 'https://us.posthog.com',
    person_profiles: 'identified_only',
    autocapture: false,
    persistence: 'memory', // No cookies or localStorage - memory only
    capture_pageview: false, // We handle this manually
    capture_pageleave: true,
    loaded: (ph) => {
      // Disable session recording
      ph.set_config({ disable_session_recording: true })
      // Disable surveys
      ph.set_config({ disable_surveys: true })
    },
  })

  isInitialized = true
}

/**
 * Capture a PostHog event
 * Silently fails if PostHog is not initialized
 * Uses send_instantly to ensure events are sent immediately since we use memory persistence
 */
function captureEvent(eventName: string, properties: EventProperties): void {
  if (!isInitialized) {
    console.warn('PostHog not initialized. Event will not be captured.')
    return
  }
  posthog.capture(eventName, properties as Record<string, unknown>, {
    send_instantly: true,
  })
}

/**
 * Track conversion events
 */
export function trackThumbnailDownloaded(
  props: ThumbnailDownloadedProps
): void {
  captureEvent('thumbnail_downloaded', props)
}

export function trackThumbnailCopied(props: ThumbnailCopiedProps): void {
  captureEvent('thumbnail_copied', props)
}

/**
 * Track configuration events
 */
export function trackPresetSelected(props: PresetSelectedProps): void {
  captureEvent('preset_selected', props)
}

export function trackLayoutChanged(props: LayoutChangedProps): void {
  captureEvent('layout_changed', props)
}

export function trackGradientChanged(props: GradientChangedProps): void {
  captureEvent('gradient_changed', props)
}

export function trackTextEdited(props: TextEditedProps): void {
  captureEvent('text_edited', props)
}

export function trackTextColorChanged(props: TextColorChangedProps): void {
  captureEvent('text_color_changed', props)
}

export function trackTextFontChanged(props: TextFontChangedProps): void {
  captureEvent('text_font_changed', props)
}

export function trackTextWeightChanged(props: TextWeightChangedProps): void {
  captureEvent('text_weight_changed', props)
}

export function trackLogoOpacityChanged(props: LogoOpacityChangedProps): void {
  captureEvent('logo_opacity_changed', props)
}

export function trackImageScaleChanged(props: ImageScaleChangedProps): void {
  captureEvent('image_scale_changed', props)
}

export function trackBackgroundImageUploaded(
  props: BackgroundImageUploadedProps
): void {
  captureEvent('background_image_uploaded', props)
}

export function trackLogoUploaded(props: LogoUploadedProps): void {
  captureEvent('logo_uploaded', props)
}

export function trackExampleSelected(props: ExampleSelectedProps): void {
  captureEvent('example_selected', props)
}

/**
 * Track engagement events
 */
export function trackPageViewed(props?: PageViewedProps): void {
  captureEvent('page_viewed', props || {})
}

export function trackSessionStarted(props?: SessionStartedProps): void {
  captureEvent('session_started', props || {})
}

export function trackConfigSectionExpanded(
  props: ConfigSectionExpandedProps
): void {
  captureEvent('config_section_expanded', props)
}

export function trackConfigSectionCollapsed(
  props: ConfigSectionCollapsedProps
): void {
  captureEvent('config_section_collapsed', props)
}
