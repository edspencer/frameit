import type { ThumbnailPlatform, BackgroundImage, BackgroundGradient, BackgroundSolidColor } from './types'

// Note: Icons are provided separately in ui-constants.ts for UI components
// This file only exports data constants that can be safely used in both browser and Node.js

// Re-export LAYOUTS from separate file
export { LAYOUTS } from './constants/layouts.js'

export const PLATFORMS: ThumbnailPlatform[] = [
  // Video Thumbnails
  {
    name: 'YouTube',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    description: 'YouTube video thumbnail',
    category: 'video',
  },
  {
    name: 'YouTube Shorts',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'YouTube Shorts vertical thumbnail',
    category: 'video',
  },
  {
    name: 'LinkedIn Video',
    width: 1200,
    height: 627,
    aspectRatio: '16:9',
    description: 'Recommended for LinkedIn video thumbnails',
    category: 'video',
  },
  {
    name: 'Twitter/X',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    description: 'Twitter/X video thumbnail',
    category: 'video',
  },
  {
    name: 'TikTok',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'TikTok vertical video thumbnail',
    category: 'video',
  },
  {
    name: 'Instagram Reels',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Instagram Reels vertical video thumbnail',
    category: 'video',
  },
  // Social Titles
  {
    name: 'Open Graph',
    width: 1200,
    height: 630,
    aspectRatio: '16:9',
    description: 'Standard for website social sharing',
    category: 'social',
  },
  {
    name: 'Instagram Feed',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'Instagram feed post',
    category: 'social',
  },
  {
    name: 'X Header',
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    description: 'X profile header image',
    category: 'social',
  },
  {
    name: 'Pinterest Pin',
    width: 1000,
    height: 1500,
    aspectRatio: '2:3',
    description: 'Pinterest pin image',
    category: 'social',
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

/**
 * Tailwind CSS color palette
 * Using shades 100, 300, 500, 700 for each color family
 * Ordered to match https://tailwindcss.com/docs/colors
 */
export const SOLID_COLORS: BackgroundSolidColor[] = [
  // Red
  { name: 'Red 100', id: 'red-100', color: '#fee2e2', family: 'Red' },
  { name: 'Red 300', id: 'red-300', color: '#fca5a5', family: 'Red' },
  { name: 'Red 500', id: 'red-500', color: '#ef4444', family: 'Red' },
  { name: 'Red 700', id: 'red-700', color: '#b91c1c', family: 'Red' },

  // Orange
  { name: 'Orange 100', id: 'orange-100', color: '#ffedd5', family: 'Orange' },
  { name: 'Orange 300', id: 'orange-300', color: '#fdba74', family: 'Orange' },
  { name: 'Orange 500', id: 'orange-500', color: '#f97316', family: 'Orange' },
  { name: 'Orange 700', id: 'orange-700', color: '#c2410c', family: 'Orange' },

  // Amber
  { name: 'Amber 100', id: 'amber-100', color: '#fef3c7', family: 'Amber' },
  { name: 'Amber 300', id: 'amber-300', color: '#fcd34d', family: 'Amber' },
  { name: 'Amber 500', id: 'amber-500', color: '#f59e0b', family: 'Amber' },
  { name: 'Amber 700', id: 'amber-700', color: '#b45309', family: 'Amber' },

  // Yellow
  { name: 'Yellow 100', id: 'yellow-100', color: '#fef9c3', family: 'Yellow' },
  { name: 'Yellow 300', id: 'yellow-300', color: '#fde047', family: 'Yellow' },
  { name: 'Yellow 500', id: 'yellow-500', color: '#eab308', family: 'Yellow' },
  { name: 'Yellow 700', id: 'yellow-700', color: '#a16207', family: 'Yellow' },

  // Lime
  { name: 'Lime 100', id: 'lime-100', color: '#ecfccb', family: 'Lime' },
  { name: 'Lime 300', id: 'lime-300', color: '#bef264', family: 'Lime' },
  { name: 'Lime 500', id: 'lime-500', color: '#84cc16', family: 'Lime' },
  { name: 'Lime 700', id: 'lime-700', color: '#4d7c0f', family: 'Lime' },

  // Green
  { name: 'Green 100', id: 'green-100', color: '#dcfce7', family: 'Green' },
  { name: 'Green 300', id: 'green-300', color: '#86efac', family: 'Green' },
  { name: 'Green 500', id: 'green-500', color: '#22c55e', family: 'Green' },
  { name: 'Green 700', id: 'green-700', color: '#15803d', family: 'Green' },

  // Emerald
  { name: 'Emerald 100', id: 'emerald-100', color: '#d1fae5', family: 'Emerald' },
  { name: 'Emerald 300', id: 'emerald-300', color: '#6ee7b7', family: 'Emerald' },
  { name: 'Emerald 500', id: 'emerald-500', color: '#10b981', family: 'Emerald' },
  { name: 'Emerald 700', id: 'emerald-700', color: '#047857', family: 'Emerald' },

  // Teal
  { name: 'Teal 100', id: 'teal-100', color: '#ccfbf1', family: 'Teal' },
  { name: 'Teal 300', id: 'teal-300', color: '#5eead4', family: 'Teal' },
  { name: 'Teal 500', id: 'teal-500', color: '#14b8a6', family: 'Teal' },
  { name: 'Teal 700', id: 'teal-700', color: '#0f766e', family: 'Teal' },

  // Cyan
  { name: 'Cyan 100', id: 'cyan-100', color: '#cffafe', family: 'Cyan' },
  { name: 'Cyan 300', id: 'cyan-300', color: '#67e8f9', family: 'Cyan' },
  { name: 'Cyan 500', id: 'cyan-500', color: '#06b6d4', family: 'Cyan' },
  { name: 'Cyan 700', id: 'cyan-700', color: '#0e7490', family: 'Cyan' },

  // Sky
  { name: 'Sky 100', id: 'sky-100', color: '#e0f2fe', family: 'Sky' },
  { name: 'Sky 300', id: 'sky-300', color: '#7dd3fc', family: 'Sky' },
  { name: 'Sky 500', id: 'sky-500', color: '#0ea5e9', family: 'Sky' },
  { name: 'Sky 700', id: 'sky-700', color: '#0369a1', family: 'Sky' },

  // Blue
  { name: 'Blue 100', id: 'blue-100', color: '#dbeafe', family: 'Blue' },
  { name: 'Blue 300', id: 'blue-300', color: '#93c5fd', family: 'Blue' },
  { name: 'Blue 500', id: 'blue-500', color: '#3b82f6', family: 'Blue' },
  { name: 'Blue 700', id: 'blue-700', color: '#1d4ed8', family: 'Blue' },

  // Indigo
  { name: 'Indigo 100', id: 'indigo-100', color: '#e0e7ff', family: 'Indigo' },
  { name: 'Indigo 300', id: 'indigo-300', color: '#a5b4fc', family: 'Indigo' },
  { name: 'Indigo 500', id: 'indigo-500', color: '#6366f1', family: 'Indigo' },
  { name: 'Indigo 700', id: 'indigo-700', color: '#4338ca', family: 'Indigo' },

  // Violet
  { name: 'Violet 100', id: 'violet-100', color: '#ede9fe', family: 'Violet' },
  { name: 'Violet 300', id: 'violet-300', color: '#c4b5fd', family: 'Violet' },
  { name: 'Violet 500', id: 'violet-500', color: '#8b5cf6', family: 'Violet' },
  { name: 'Violet 700', id: 'violet-700', color: '#6d28d9', family: 'Violet' },

  // Purple
  { name: 'Purple 100', id: 'purple-100', color: '#f3e8ff', family: 'Purple' },
  { name: 'Purple 300', id: 'purple-300', color: '#d8b4fe', family: 'Purple' },
  { name: 'Purple 500', id: 'purple-500', color: '#a855f7', family: 'Purple' },
  { name: 'Purple 700', id: 'purple-700', color: '#7e22ce', family: 'Purple' },

  // Fuchsia
  { name: 'Fuchsia 100', id: 'fuchsia-100', color: '#fae8ff', family: 'Fuchsia' },
  { name: 'Fuchsia 300', id: 'fuchsia-300', color: '#f0abfc', family: 'Fuchsia' },
  { name: 'Fuchsia 500', id: 'fuchsia-500', color: '#d946ef', family: 'Fuchsia' },
  { name: 'Fuchsia 700', id: 'fuchsia-700', color: '#a21caf', family: 'Fuchsia' },

  // Pink
  { name: 'Pink 100', id: 'pink-100', color: '#fce7f3', family: 'Pink' },
  { name: 'Pink 300', id: 'pink-300', color: '#f9a8d4', family: 'Pink' },
  { name: 'Pink 500', id: 'pink-500', color: '#ec4899', family: 'Pink' },
  { name: 'Pink 700', id: 'pink-700', color: '#be185d', family: 'Pink' },

  // Rose
  { name: 'Rose 100', id: 'rose-100', color: '#ffe4e6', family: 'Rose' },
  { name: 'Rose 300', id: 'rose-300', color: '#fda4af', family: 'Rose' },
  { name: 'Rose 500', id: 'rose-500', color: '#f43f5e', family: 'Rose' },
  { name: 'Rose 700', id: 'rose-700', color: '#be123c', family: 'Rose' },

  // Slate
  { name: 'Slate 100', id: 'slate-100', color: '#f1f5f9', family: 'Slate' },
  { name: 'Slate 300', id: 'slate-300', color: '#cbd5e1', family: 'Slate' },
  { name: 'Slate 500', id: 'slate-500', color: '#64748b', family: 'Slate' },
  { name: 'Slate 700', id: 'slate-700', color: '#334155', family: 'Slate' },

  // Gray
  { name: 'Gray 100', id: 'gray-100', color: '#f3f4f6', family: 'Gray' },
  { name: 'Gray 300', id: 'gray-300', color: '#d1d5db', family: 'Gray' },
  { name: 'Gray 500', id: 'gray-500', color: '#6b7280', family: 'Gray' },
  { name: 'Gray 700', id: 'gray-700', color: '#374151', family: 'Gray' },

  // Zinc
  { name: 'Zinc 100', id: 'zinc-100', color: '#f4f4f5', family: 'Zinc' },
  { name: 'Zinc 300', id: 'zinc-300', color: '#d4d4d8', family: 'Zinc' },
  { name: 'Zinc 500', id: 'zinc-500', color: '#71717a', family: 'Zinc' },
  { name: 'Zinc 700', id: 'zinc-700', color: '#3f3f46', family: 'Zinc' },

  // Neutral
  { name: 'Neutral 100', id: 'neutral-100', color: '#f5f5f5', family: 'Neutral' },
  { name: 'Neutral 300', id: 'neutral-300', color: '#d4d4d4', family: 'Neutral' },
  { name: 'Neutral 500', id: 'neutral-500', color: '#737373', family: 'Neutral' },
  { name: 'Neutral 700', id: 'neutral-700', color: '#404040', family: 'Neutral' },

  // Stone
  { name: 'Stone 100', id: 'stone-100', color: '#f5f5f4', family: 'Stone' },
  { name: 'Stone 300', id: 'stone-300', color: '#d6d3d1', family: 'Stone' },
  { name: 'Stone 500', id: 'stone-500', color: '#78716c', family: 'Stone' },
  { name: 'Stone 700', id: 'stone-700', color: '#44403c', family: 'Stone' },
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
