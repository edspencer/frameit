/**
 * UI-specific constants that include React components (icons)
 * This file is only imported by UI components, NOT by the API
 */

import type { ThumbnailPresetWithIcon } from './types'
import { PRESETS } from './constants'
import {
  YouTubeIcon,
  LinkedInIcon,
  XIcon,
  TikTokIcon,
  InstagramIcon,
  PinterestIcon,
  OpenGraphIcon,
} from '../components/icons/PlatformIcons'

/**
 * Presets with icon components for UI use
 * Extends the base PRESETS from constants.ts
 */
export const PRESETS_WITH_ICONS: ThumbnailPresetWithIcon[] = [
  { ...PRESETS[0], icon: YouTubeIcon }, // YouTube
  { ...PRESETS[1], icon: YouTubeIcon }, // YouTube Shorts
  { ...PRESETS[2], icon: LinkedInIcon }, // LinkedIn Video
  { ...PRESETS[3], icon: XIcon }, // Twitter/X
  { ...PRESETS[4], icon: TikTokIcon }, // TikTok
  { ...PRESETS[5], icon: InstagramIcon }, // Instagram Reels
  { ...PRESETS[6], icon: OpenGraphIcon }, // Open Graph
  { ...PRESETS[7], icon: InstagramIcon }, // Instagram Feed
  { ...PRESETS[8], icon: XIcon }, // X Header
  { ...PRESETS[9], icon: PinterestIcon }, // Pinterest Pin
]
