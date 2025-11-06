import type { ThumbnailPreset, BackgroundImage } from './types'

export const PRESETS: ThumbnailPreset[] = [
  {
    name: 'LinkedIn Video',
    width: 1200,
    height: 627,
    aspectRatio: '16:9',
    description: 'Recommended for LinkedIn video thumbnails',
  },
  {
    name: 'YouTube',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    description: 'YouTube video thumbnail',
  },
  {
    name: 'Twitter/X',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    description: 'Twitter/X video thumbnail',
  },
  {
    name: 'Square',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'Square format for social media',
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
