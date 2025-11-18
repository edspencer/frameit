/**
 * Example configurations for both UI and API testing
 * Based on real Open Graph images from opengraphexamples.com
 */

import type { SerializableThumbnailConfig } from './types'

/**
 * Example configuration that wraps a SerializableThumbnailConfig
 * with metadata about the example itself
 */
export interface ExampleConfig {
  // Metadata (example-specific)
  id: string
  name: string
  description: string
  enabled?: boolean // Optional - defaults to true, if false example is hidden in UI only
  pageUrl: string // opengraphexamples.com URL
  originalImageUrl?: string // Direct URL to original OG image (if available)
  notes?: string // Implementation notes

  // The actual thumbnail configuration
  config: SerializableThumbnailConfig
}

export const EXAMPLE_CONFIGS: ExampleConfig[] = [
  {
    id: 'shipped',
    name: 'Centered long text',
    description: 'Clean centered SaaS landing page with domain and tagline',
    pageUrl: 'https://opengraphexamples.com/examples/shipped/',
    originalImageUrl: '/layouts/original/shipped.jpg',
    notes: 'Custom shipped layout with rocket icon and domain text at top (10%), large centered title (35%), and subtitle below (55%). Clean purple gradient background with white text.',
    config: {
      presetName: 'Open Graph',
      layoutId: 'centered-long',
      background: { type: 'solid', solidColor: '#8B5CF6' },
      textElements: [
        { id: 'title', content: 'You are really good at dealing with performance reviews.', color: '#ffffff' },
        { id: 'subtitle', content: "Oh, you're not? Nobody is? True! But thankfully bragdoc.ai exists and does most of the work for you", color: '#ffffff' },
        { id: 'domain', content: '🚀 bragdoc.ai', color: '#ffffff' },
      ],
      imageElements: [
        { id: 'logo', url: '/bragdoc-logo-black-text.png', opacity: 1.0, scale: 100 },
      ],
    },
  },
  {
    id: 'birthday-cake',
    name: 'Birthday Cake',
    description: 'Split layout with icon on left and stacked text on right',
    pageUrl: 'https://opengraphexamples.com/examples/saas-starters/',
    originalImageUrl: '/layouts/original/saas-starters.png',
    notes: 'Custom saas-starters layout with square icon centered at 25% from left, and three text elements (title, subtitle, description) stacked vertically with left edges aligned at 50% of canvas width.',
    config: {
      presetName: 'Open Graph',
      layoutId: 'stacked-text-right',
      background: { type: 'solid', solidColor: '#e2e8f0' },
      textElements: [
        { id: 'title', content: 'Birthday Cake', color: '#4a5568' },
        { id: 'subtitle', content: 'by Yo Momma', color: '#718096' },
        { id: 'description', content: 'What a lucky creature you are to receive such a thing', color: '#718096' },
      ],
      imageElements: [
        { id: 'icon', url: '/cake.jpg', opacity: 1.0, scale: 170 },
      ],
    },
  },
  {
    id: 'simple-centered',
    name: 'Simple Centered',
    description: 'Clean centered brand identity with logo and tagline',
    pageUrl: 'https://opengraphexamples.com/examples/devterms/',
    originalImageUrl: 'https://devterms.io/og-image.png',
    notes: 'Custom centered layout for brand identity pages. Logo positioned at top-center (20%), large title centered (48%), tagline below (58%). Very dark background with clean typography.',
    config: {
      presetName: 'Open Graph',
      layoutId: 'simple-centered',
      background: { type: 'solid', solidColor: '#0f0f0f' },
      textElements: [
        { id: 'title', content: 'Glory to the Empire', color: '#ffffff' },
        { id: 'subtitle', content: 'Revenge is a dish best served cold', color: '#d1d5db' },
      ],
      imageElements: [
        { id: 'logo', url: '/frameit-logo.png', opacity: 1.0, scale: 100 },
        { id: 'icon', url: '/gowron.jpg', opacity: 1.0, scale: 130 },
      ],
    },
  },
  {
    id: 'listmysaas',
    enabled: false,
    name: 'List My SaaS Directory',
    description: 'Directory showcase with brand badge and categories',
    pageUrl: 'https://opengraphexamples.com/examples/listmysaas/',
    originalImageUrl: '/layouts/original/listmysaas.png',
    notes: 'Custom listmysaas layout with brand badge at top (icon + text), large centered headline, three category labels with checkmarks, and note section. Bottom directory preview cards are too complex for layout system.',
    config: {
      presetName: 'Open Graph',
      layoutId: 'listmysaas',
      background: { type: 'solid', solidColor: '#3b82f6' },
      textElements: [
        { id: 'title', content: '115 Directories and platforms to list your SaaS', color: '#ffffff' },
        { id: 'subtitle', content: '(Directory preview cards shown in original)', color: '#e0e7ff' },
        { id: 'category-1', content: '✓ Directories', color: '#ffffff' },
        { id: 'category-2', content: '✓ Launch Platforms', color: '#ffffff' },
        { id: 'category-3', content: '✓ Startup sites', color: '#ffffff' },
      ],
      imageElements: [
        { id: 'logo', url: '/frameit-logo.png', opacity: 1.0, scale: 100 },
      ],
    },
  },
  {
    id: 'bragdoc',
    name: 'BragDoc.ai',
    description: 'Clean minimal layout with domain and large bold title',
    pageUrl: 'https://opengraphexamples.com/examples/niche-business-idea/',
    originalImageUrl: '/layouts/original/niche-business-idea.png',
    notes: 'Custom niche-business-idea layout with domain text at top-left (25%), large bold title below (auto-positioned), and decorative icon in bottom-right corner. Clean minimal design with lots of whitespace.',
    config: {
      presetName: 'Open Graph',
      layoutId: 'domain-and-title',
      background: { type: 'solid', solidColor: '#F5F5F5' },
      textElements: [
        { id: 'title', content: 'Career Copilot for Software Pros', color: '#000000' },
        { id: 'subtitle', content: 'BragDoc.ai', color: '#000000' },
        { id: 'domain', content: 'BragDoc.ai', color: '#000000' },
      ],
      imageElements: [
        { id: 'icon', url: '/bragdoc-icon.png', opacity: 1.0, scale: 100 },
      ],
    },
  },
  {
    id: 'simple-cta',
    name: 'Simple CTA',
    description: 'Centered CTA-focused design with icon and button',
    pageUrl: 'https://opengraphexamples.com/examples/ogimage.org/',
    originalImageUrl: '/layouts/original/ogimage.webp',
    notes: 'Custom ogimage layout with centered icon at top (15%), title below (35%), and prominent CTA button (50%). CTA button styled as yellow pill with white border. Note: CTA button background/border styling not supported by layout system.',
    config: {
      presetName: 'Open Graph',
      layoutId: 'ogimage',
      background: { type: 'solid', solidColor: '#2563EB' },
      textElements: [
        { id: 'title', content: 'Splendid title cards and thumbs for videos', color: '#FFFFFF' },
        { id: 'subtitle', content: '', color: '#FFFFFF' },
        { id: 'cta', content: 'Get started FREE', color: '#000000' },
      ],
      imageElements: [
        { id: 'icon', url: '/frameit-icon.png', opacity: 1.0, scale: 100 },
      ],
    },
  },
  {
    id: 'feature-card',
    name: 'Feature Card',
    description: 'Feature highlight with icon',
    pageUrl: 'https://opengraphexamples.com/examples/meteor-files/',
    notes: 'Feature-card layout, missing upload icon',
    config: {
      presetName: 'Open Graph',
      layoutId: 'feature-card',
      background: { type: 'gradient', gradientId: 'teal' },
      textElements: [
        { id: 'title', content: 'Career Copilot for Developers', color: '#ffffff' },
        { id: 'subtitle', content: 'bragdoc.ai reads your git commits and beautiful docs for your boss', color: '#ffffff' },
      ],
      imageElements: [
        { id: 'main', url: '/bragdoc-icon.png', opacity: 1.0, scale: 100 },
      ],
    },
  },
  {
    id: 'orwell',
    name: 'Orwell.ai',
    description: 'Logo-left sidebar with CTA button',
    pageUrl: 'https://opengraphexamples.com/examples/boring-launch/',
    notes: 'Sidebar layout with logo-left, text-right, bright yellow background using solid color',
    config: {
      presetName: 'Open Graph',
      layoutId: 'sidebar',
      background: { type: 'solid', solidColor: '#fbbf24' },
      textElements: [
        { id: 'title', content: 'Monitor Your Employees', color: '#000000' },
        { id: 'subtitle', content: 'They are yours to observe and control', color: '#000000' },
        { id: 'cta', content: 'Watch them now', color: '#ffffff' },
      ],
      imageElements: [
        { id: 'icon', url: '/gowron.jpg', opacity: 1.0, scale: 120 },
      ],
    },
  },
  {
    id: 'bottom-title',
    name: 'Bottom Title',
    description: 'Authentication platform branding',
    pageUrl: 'https://opengraphexamples.com/examples/clerk/',
    originalImageUrl: 'https://clerk.com/opengraph-image.jpg',
    notes: 'Custom clerk layout with brand top-left and title bottom-left, missing large 3D graphic element',
    config: {
      presetName: 'Open Graph',
      layoutId: 'bottom-title',
      background: { type: 'solid', solidColor: '#0a0e1a' },
      textElements: [
        { id: 'title', content: 'Career Copilot for Developers', color: '#ffffff' },
        { id: 'subtitle', content: '', color: '#ffffff' },
        { id: 'brand', content: 'bragdoc.ai', color: '#ffffff' },
      ],
      imageElements: [
        { id: 'logo', url: '/bragdoc-logo.png', opacity: 1.0, scale: 100 },
      ],
    },
  },
  {
    id: 'featured-image-left',
    name: 'Featured Image Left',
    description: 'Split layout with screenshot and branding',
    pageUrl: 'https://opengraphexamples.com/examples/housepricehistory.co.uk/',
    originalImageUrl: '/layouts/original/housepricehistory.png',
    notes: 'Custom housepricehistory layout with screenshot on left (60% width), text and logo on right (40%). Logo centered below text. Missing decorative dot patterns in corners.',
    config: {
      presetName: 'Open Graph',
      layoutId: 'featured-image-left',
      background: { type: 'solid', solidColor: '#3b82f6' },
      textElements: [
        { id: 'title', content: 'The Grim Barbarity of Optics and Design', color: '#ffffff' },
        { id: 'subtitle', content: 'the surest way to tame a prisoner is to let him believe he is free', color: '#ffffff' },
      ],
      imageElements: [
        { id: 'main', url: '/gowron.jpg', opacity: 1.0, scale: 100 },
        { id: 'logo', url: '/frameit-logo.png', opacity: 1.0, scale: 100 },
      ],
    },
  },
]

/**
 * Get enabled examples for UI display
 */
export function getEnabledExamples(): ExampleConfig[] {
  return EXAMPLE_CONFIGS.filter(config => config.enabled !== false)
}

/**
 * Get all examples including disabled ones (for API/testing)
 */
export function getAllExamples(): ExampleConfig[] {
  return EXAMPLE_CONFIGS
}

/**
 * Find an example by ID
 */
export function getExampleById(id: string): ExampleConfig | undefined {
  return EXAMPLE_CONFIGS.find(config => config.id === id)
}
