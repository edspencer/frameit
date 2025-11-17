/**
 * UI-specific constants that include React components (icons)
 * This file is only imported by UI components, NOT by the API
 */

import type { ThumbnailPlatformWithIcon } from './types'
import { PLATFORMS } from './constants'
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
export const PLATFORMS_WITH_ICONS: ThumbnailPlatformWithIcon[] = [
  { ...PLATFORMS[0], icon: YouTubeIcon }, // YouTube
  { ...PLATFORMS[1], icon: YouTubeIcon }, // YouTube Shorts
  { ...PLATFORMS[2], icon: LinkedInIcon }, // LinkedIn Video
  { ...PLATFORMS[3], icon: XIcon }, // Twitter/X
  { ...PLATFORMS[4], icon: TikTokIcon }, // TikTok
  { ...PLATFORMS[5], icon: InstagramIcon }, // Instagram Reels
  { ...PLATFORMS[6], icon: OpenGraphIcon }, // Open Graph
  { ...PLATFORMS[7], icon: InstagramIcon }, // Instagram Feed
  { ...PLATFORMS[8], icon: XIcon }, // X Header
  { ...PLATFORMS[9], icon: PinterestIcon }, // Pinterest Pin
]
