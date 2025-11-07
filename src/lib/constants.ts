import type { ThumbnailPreset, BackgroundImage, BackgroundGradient } from './types'
import {
  YouTubeIcon,
  LinkedInIcon,
  XIcon,
  TikTokIcon,
  InstagramIcon,
  PinterestIcon,
  OpenGraphIcon,
} from '../components/icons/PlatformIcons'

export const PRESETS: ThumbnailPreset[] = [
  // Video Thumbnails
  {
    name: 'YouTube',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    description: 'YouTube video thumbnail',
    category: 'video',
    icon: YouTubeIcon,
  },
  {
    name: 'YouTube Shorts',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'YouTube Shorts vertical thumbnail',
    category: 'video',
    icon: YouTubeIcon,
  },
  {
    name: 'LinkedIn Video',
    width: 1200,
    height: 627,
    aspectRatio: '16:9',
    description: 'Recommended for LinkedIn video thumbnails',
    category: 'video',
    icon: LinkedInIcon,
  },
  {
    name: 'Twitter/X',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    description: 'Twitter/X video thumbnail',
    category: 'video',
    icon: XIcon,
  },
  {
    name: 'TikTok',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'TikTok vertical video thumbnail',
    category: 'video',
    icon: TikTokIcon,
  },
  {
    name: 'Instagram Reels',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Instagram Reels vertical video thumbnail',
    category: 'video',
    icon: InstagramIcon,
  },
  // Social Titles
  {
    name: 'Open Graph',
    width: 1200,
    height: 630,
    aspectRatio: '16:9',
    description: 'Standard for website social sharing',
    category: 'social',
    icon: OpenGraphIcon,
  },
  {
    name: 'Instagram Feed',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'Instagram feed post',
    category: 'social',
    icon: InstagramIcon,
  },
  {
    name: 'X Header',
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    description: 'X profile header image',
    category: 'social',
    icon: XIcon,
  },
  {
    name: 'Pinterest Pin',
    width: 1000,
    height: 1500,
    aspectRatio: '2:3',
    description: 'Pinterest pin image',
    category: 'social',
    icon: PinterestIcon,
  },
]

export const GRADIENTS: BackgroundGradient[] = [
  {
    name: 'Default',
    id: 'default',
    colorStart: '#0f1729',
    colorEnd: '#1a2744',
  },
  {
    name: 'Dark Blue',
    id: 'dark-blue',
    colorStart: '#172a45',
    colorEnd: '#0f1729',
  },
  {
    name: 'Purple',
    id: 'purple',
    colorStart: '#581c87',
    colorEnd: '#312e81',
  },
  {
    name: 'Teal',
    id: 'teal',
    colorStart: '#134e4a',
    colorEnd: '#1e293b',
  },
  {
    name: 'Sunset',
    id: 'sunset',
    colorStart: '#7c2d12',
    colorEnd: '#991b1b',
  },
  {
    name: 'Ocean',
    id: 'ocean',
    colorStart: '#075985',
    colorEnd: '#0c4a6e',
  },
  {
    name: 'Forest',
    id: 'forest',
    colorStart: '#14532d',
    colorEnd: '#064e3b',
  },
  {
    name: 'Midnight',
    id: 'midnight',
    colorStart: '#1e1b4b',
    colorEnd: '#0f172a',
  },
  {
    name: 'Rose',
    id: 'rose',
    colorStart: '#881337',
    colorEnd: '#4c0519',
  },
  {
    name: 'Emerald',
    id: 'emerald',
    colorStart: '#065f46',
    colorEnd: '#022c22',
  },
  {
    name: 'Amber',
    id: 'amber',
    colorStart: '#92400e',
    colorEnd: '#451a03',
  },
  {
    name: 'Slate',
    id: 'slate',
    colorStart: '#334155',
    colorEnd: '#0f172a',
  },
]

export const BACKGROUND_IMAGES: BackgroundImage[] = [
  {
    name: 'None (Gradient)',
    url: '',
  },
  {
    name: 'Solid Color',
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="627"%3E%3Crect fill="%231e293b" width="1200" height="627"/%3E%3C/svg%3E',
  },
  {
    name: 'Dark Blue',
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="627"%3E%3Cdefs%3E%3ClinearGradient id="grad"%3E%3Cstop offset="0%25" style="stop-color:%23172a45;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230f1729;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="1200" height="627"/%3E%3C/svg%3E',
  },
  {
    name: 'Purple Gradient',
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="627"%3E%3Cdefs%3E%3ClinearGradient id="grad"%3E%3Cstop offset="0%25" style="stop-color:%23581c87;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23312e81;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="1200" height="627"/%3E%3C/svg%3E',
  },
  {
    name: 'Teal Gradient',
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="627"%3E%3Cdefs%3E%3ClinearGradient id="grad"%3E%3Cstop offset="0%25" style="stop-color:%23134e4a;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%231e293b;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="1200" height="627"/%3E%3C/svg%3E',
  },
  {
    name: 'Minimalist',
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="627"%3E%3Crect fill="%23ffffff" width="1200" height="627"/%3E%3Crect fill="%230f172a" x="0" y="0" width="1200" height="627" opacity="0.95"/%3E%3C/svg%3E',
  },
]
