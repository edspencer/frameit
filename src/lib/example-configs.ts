/**
 * Shared example configurations for both UI and API testing
 * Based on real Open Graph images from opengraphexamples.com
 */

import { LAYOUTS } from './constants'
import type { TextElement, ImageElement, BackgroundConfig } from './types'

export interface ExampleConfig {
  id: string
  name: string
  description: string
  enabled?: boolean // Optional - defaults to true, if false example is hidden in UI only (API/test script ignores this)
  layoutId: string
  presetName: string
  gradientId: string
  solidColor?: string // Optional solid color hex (overrides gradient)
  title: string
  subtitle: string
  brand?: string // Optional branding text (top of statement layouts)
  cta?: string // Optional call-to-action text (sidebar layouts)
  ctaColor?: string // Optional CTA text color
  titleColor?: string
  subtitleColor?: string
  customTextElements?: Array<{ id: string; content: string; color?: string }> // Additional text elements beyond title/subtitle
  pageUrl: string // opengraphexamples.com URL
  originalImageUrl?: string // Direct URL to original OG image (if available)
  notes?: string // Implementation notes
}

export const EXAMPLE_CONFIGS: ExampleConfig[] = [
  {
    id: 'shipped',
    name: 'Centered long text',
    description: 'Clean centered SaaS landing page with domain and tagline',
    layoutId: 'centered-long',
    presetName: 'Open Graph',
    gradientId: 'purple-gradient',
    solidColor: '#8B5CF6', // Purple background
    title: 'You are really good at dealing with performance reviews.',
    subtitle: 'Oh, you\'re not? Nobody is? True! But thankfully bragdoc.ai exists and does most of the work for you',
    titleColor: '#ffffff',
    subtitleColor: '#ffffff',
    customTextElements: [
      { id: 'domain', content: '🚀 bragdoc.ai', color: '#ffffff' },
    ],
    pageUrl: 'https://opengraphexamples.com/examples/shipped/',
    originalImageUrl: '/layouts/original/shipped.jpg',
    notes: 'Custom shipped layout with rocket icon and domain text at top (10%), large centered title (35%), and subtitle below (55%). Clean purple gradient background with white text.',
  },
  {
    id: 'birthday-cake',
    name: 'Birthday Cake',
    description: 'Split layout with icon on left and stacked text on right',
    layoutId: 'stacked-text-right',
    presetName: 'Open Graph',
    gradientId: 'slate',
    solidColor: '#e2e8f0', // Light gray/lavender background
    title: 'Birthday Cake',
    subtitle: 'by Yo Momma',
    titleColor: '#4a5568',
    subtitleColor: '#718096',
    customTextElements: [
      { id: 'description', content: 'What a lucky creature you are to receive such a thing', color: '#718096' },
    ],
    pageUrl: 'https://opengraphexamples.com/examples/saas-starters/',
    originalImageUrl: '/layouts/original/saas-starters.png',
    notes: 'Custom saas-starters layout with square icon centered at 25% from left, and three text elements (title, subtitle, description) stacked vertically with left edges aligned at 50% of canvas width.',
  },
  {
    id: 'simple-centered',
    name: 'Simple Centered',
    description: 'Clean centered brand identity with logo and tagline',
    layoutId: 'simple-centered',
    presetName: 'Open Graph',
    gradientId: 'slate',
    solidColor: '#0f0f0f', // Very dark charcoal background
    title: 'Klingon Proverb',
    subtitle: 'Revenge is a dish best served cold',
    titleColor: '#ffffff',
    subtitleColor: '#d1d5db',
    pageUrl: 'https://opengraphexamples.com/examples/devterms/',
    originalImageUrl: 'https://devterms.io/og-image.png',
    notes: 'Custom centered layout for brand identity pages. Logo positioned at top-center (20%), large title centered (48%), tagline below (58%). Very dark background with clean typography.',
  },
  {
    id: 'listmysaas',
    enabled: false,
    name: 'List My SaaS Directory',
    description: 'Directory showcase with brand badge and categories',
    layoutId: 'listmysaas',
    presetName: 'Open Graph',
    gradientId: 'ocean',
    solidColor: '#3b82f6', // Bright blue background
    title: '115 Directories and platforms to list your SaaS',
    subtitle: '(Directory preview cards shown in original)',
    titleColor: '#ffffff',
    subtitleColor: '#e0e7ff',
    customTextElements: [
      { id: 'category-1', content: '✓ Directories', color: '#ffffff' },
      { id: 'category-2', content: '✓ Launch Platforms', color: '#ffffff' },
      { id: 'category-3', content: '✓ Startup sites', color: '#ffffff' },
    ],
    pageUrl: 'https://opengraphexamples.com/examples/listmysaas/',
    originalImageUrl: '/layouts/original/listmysaas.png',
    notes: 'Custom listmysaas layout with brand badge at top (icon + text), large centered headline, three category labels with checkmarks, and note section. Bottom directory preview cards are too complex for layout system.',
  },
  {
    id: 'bragdoc',
    name: 'BragDoc.ai',
    description: 'Clean minimal layout with domain and large bold title',
    layoutId: 'domain-and-title',
    presetName: 'Open Graph',
    gradientId: 'slate', // Will be overridden by solidColor
    solidColor: '#F5F5F5', // Very light gray background
    title: 'Career Copilot for Software Pros',
    subtitle: 'BragDoc.ai',
    titleColor: '#000000',
    subtitleColor: '#000000',
    pageUrl: 'https://opengraphexamples.com/examples/niche-business-idea/',
    originalImageUrl: '/layouts/original/niche-business-idea.png',
    notes: 'Custom niche-business-idea layout with domain text at top-left (25%), large bold title below (auto-positioned), and decorative icon in bottom-right corner. Clean minimal design with lots of whitespace.',
  },
  // {
  //   id: 'hyperbolic-statement',
  //   name: 'Hyperbolic',
  //   description: 'Powerful centered message for impact',
  //   layoutId: 'statement',
  //   presetName: 'Open Graph',
  //   gradientId: 'rose',
  //   title: 'Workout Tracker With Superpowers',
  //   subtitle: 'Track your progress. Smash your goals.',
  //   pageUrl: 'https://opengraphexamples.com/examples/hyperbolic/',
  //   notes: 'Statement layout, missing wave background pattern',
  // },
  {
    id: 'simple-cta',
    name: 'Simple CTA',
    description: 'Centered CTA-focused design with icon and button',
    layoutId: 'ogimage',
    presetName: 'Open Graph',
    gradientId: 'blue',
    solidColor: '#2563EB', // Bright blue background
    title: 'Splendid title cards and thumbs for videos',
    subtitle: '', // Not used in this layout
    cta: 'Get started FREE',
    titleColor: '#FFFFFF',
    ctaColor: '#000000',
    pageUrl: 'https://opengraphexamples.com/examples/ogimage.org/',
    originalImageUrl: '/layouts/original/ogimage.webp',
    notes: 'Custom ogimage layout with centered icon at top (15%), title below (35%), and prominent CTA button (50%). CTA button styled as yellow pill with white border. Note: CTA button background/border styling not supported by layout system.',
  },
  {
    id: 'feature-card',
    name: 'Feature Card',
    description: 'Feature highlight with icon',
    layoutId: 'feature-card',
    presetName: 'Open Graph',
    gradientId: 'teal',
    title: 'Career Copilot for Developers',
    subtitle: 'bragdoc.ai reads your git commits and beautiful docs for your boss',
    pageUrl: 'https://opengraphexamples.com/examples/meteor-files/',
    notes: 'Feature-card layout, missing upload icon',
  },
  {
    id: 'boring-launch-sidebar',
    name: 'Orwell.ai',
    description: 'Logo-left sidebar with CTA button',
    layoutId: 'sidebar',
    presetName: 'Open Graph',
    gradientId: 'yellow', // Will be overridden by solidColor in UI
    solidColor: '#fbbf24', // Tailwind Amber 400 - bright yellow-orange
    title: 'Monitor Your Employees',
    subtitle: 'They are yours to observe and control',
    cta: 'Watch them now',
    titleColor: '#000000',
    subtitleColor: '#000000',
    ctaColor: '#ffffff',
    pageUrl: 'https://opengraphexamples.com/examples/boring-launch/',
    notes: 'Sidebar layout with logo-left, text-right, bright yellow background using solid color',
  },
  {
    id: 'bottom-title',
    name: 'Bottom Title',
    description: 'Authentication platform branding',
    layoutId: 'bottom-title',
    presetName: 'Open Graph',
    gradientId: 'midnight',
    solidColor: '#0a0e1a', // Very dark blue-black
    brand: 'bragdoc.ai',
    title: 'Career Copilot for Developers',
    subtitle: '',
    titleColor: '#ffffff',
    pageUrl: 'https://opengraphexamples.com/examples/clerk/',
    originalImageUrl: 'https://clerk.com/opengraph-image.jpg',
    notes: 'Custom clerk layout with brand top-left and title bottom-left, missing large 3D graphic element',
  },
  {
    id: 'featured-image-left',
    name: 'Featured Image Left',
    description: 'Split layout with screenshot and branding',
    layoutId: 'featured-image-left',
    presetName: 'Open Graph',
    gradientId: 'blue',
    solidColor: '#3b82f6', // Blue background matching original
    title: 'The Grim Barbarity of Optics and Design',
    subtitle: 'the surest way to tame a prisoner is to let him believe he is free',
    titleColor: '#ffffff',
    subtitleColor: '#ffffff',
    pageUrl: 'https://opengraphexamples.com/examples/housepricehistory.co.uk/',
    originalImageUrl: '/layouts/original/housepricehistory.png',
    notes: 'Custom housepricehistory layout with screenshot on left (60% width), text and logo on right (40%). Logo centered below text. Missing decorative dot patterns in corners.',
  }
]

/**
 * Helper Functions for Building Complete Configs
 */

function getDefaultImageUrl(elementId: string): string {
  if (elementId === 'icon') {
    return '/frameit-icon.png'
  }
  if (elementId === 'logo') {
    return '/frameit-logo.png'
  }
  if (elementId === 'main-image') {
    return '/frameit-icon.png'
  }
  return '' // main-image and other elements have no default
}

function buildTextElements(config: ExampleConfig): TextElement[] {
  const elements: TextElement[] = [
    { id: 'title', content: config.title, color: config.titleColor || '#ffffff' },
    { id: 'subtitle', content: config.subtitle, color: config.subtitleColor || '#ffffff' },
  ]

  // Add optional text elements
  if (config.brand) {
    elements.push({ id: 'brand', content: config.brand, color: '#ffffff' })
  }

  if (config.cta) {
    elements.push({ id: 'cta', content: config.cta, color: config.ctaColor || '#ffffff' })
  }

  // Add custom text elements
  if (config.customTextElements) {
    for (const element of config.customTextElements) {
      elements.push({
        id: element.id,
        content: element.content,
        color: element.color || '#ffffff'
      })
    }
  }

  return elements
}

function buildImageElements(layoutId: string): ImageElement[] {
  const layout = LAYOUTS.find(l => l.id === layoutId)
  if (!layout) return []

  const imageElements: ImageElement[] = []

  for (const element of layout.elements) {
    if (element.type === 'image') {
      const url = getDefaultImageUrl(element.id)
      if (url) {
        imageElements.push({
          id: element.id,
          url,
          opacity: 1.0,
          scale: 100
        })
      }
    }
  }

  return imageElements
}

/**
 * Pre-transformed example configs ready for use in UI and API
 * No transformation needed - just pass through to components
 * NOTE: This includes ALL examples (even disabled ones) for API/test script use
 */
const ALL_EXAMPLE_THUMBNAIL_CONFIGS = EXAMPLE_CONFIGS.map(config => ({
  id: config.id,
  name: config.name,
  description: config.description,
  presetName: config.presetName,
  layoutId: config.layoutId,
  background: config.solidColor
    ? ({ type: 'solid' as const, solidColor: config.solidColor } as BackgroundConfig)
    : ({ type: 'gradient' as const, gradientId: config.gradientId } as BackgroundConfig),
  textElements: buildTextElements(config),
  imageElements: buildImageElements(config.layoutId),
  pageUrl: config.pageUrl,
  originalImageUrl: config.originalImageUrl,
  notes: config.notes,
  enabled: config.enabled,
}))

/**
 * Example configs for UI (filters out disabled examples)
 */
export const EXAMPLE_THUMBNAIL_CONFIGS = ALL_EXAMPLE_THUMBNAIL_CONFIGS.filter(
  config => config.enabled !== false
)

/**
 * All example configs including disabled ones (for API/test script)
 */
export const ALL_EXAMPLE_CONFIGS = ALL_EXAMPLE_THUMBNAIL_CONFIGS
