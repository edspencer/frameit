import type { LayoutDefinition } from '../types'

export const LAYOUTS: LayoutDefinition[] = [
  // Default Layout - Matches the original FrameIt layout (logo top-right)
  {
    id: 'default',
    name: 'Default',
    description: 'Original FrameIt layout with logo in top-right',
    elements: [
      {
        id: 'title',
        type: 'text',
        position: { x: '8%', y: '30%', anchor: 'top-left' },
        sizing: { maxWidth: '84%', fontSize: '8%', lineHeight: 1.125 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '8%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '84%', fontSize: '4.5%', lineHeight: 1.22 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'logo',
        type: 'image',
        position: { x: '98%', y: '2%', anchor: 'top-right' },
        sizing: { maxWidth: '8%' },
        zIndex: 200,
      },
    ],
  },

  // Classic Layout - Traditional top-left aligned title with subtitle below
  {
    id: 'classic',
    name: 'Classic',
    enabled: false,
    description: 'Traditional top-left layout with subtitle',
    elements: [
      {
        id: 'title',
        type: 'text',
        position: { x: '10%', y: '15%', anchor: 'top-left' },
        sizing: { maxWidth: '80%', fontSize: '8%', lineHeight: 1.1 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '10%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '70%', fontSize: '3%', lineHeight: 1.4 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'logo',
        type: 'image',
        position: { x: '10%', y: '85%', anchor: 'bottom-left' },
        sizing: { maxWidth: '15%' },
        zIndex: 200,
      },
    ],
  },


  // Minimal Layout - Large title, small subtitle, logo at bottom
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Large title with minimal subtitle',
    elements: [
      {
        id: 'title',
        type: 'text',
        position: { x: '10%', y: '30%', anchor: 'top-left' },
        sizing: { maxWidth: '85%', fontSize: '10%', lineHeight: 1.0 },
        styling: {
          fontWeight: 800,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '10%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '60%', fontSize: '2.5%', lineHeight: 1.3 },
        styling: {
          fontWeight: 300,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'logo',
        type: 'image',
        position: { x: '95%', y: '95%', anchor: 'bottom-right' },
        sizing: { maxWidth: '6%' },
        zIndex: 200,
      },
    ],
  },

  // Photo Essay Layout - Keynote-style with artist and photo title at top
  {
    id: 'photo-essay',
    name: 'Photo Essay',
    description: 'Keynote-style layout with artist and photo title',
    elements: [
      // Main photo - fills entire canvas
      {
        id: 'main-image',
        type: 'image',
        name: 'Main Image',
        position: { x: '50%', y: '50%', anchor: 'center' },
        sizing: { maxWidth: '100%' }, // Will scale to fill width
        zIndex: 1,
      },
      // Top scrim overlay - dark gradient at top for text legibility
      {
        id: 'top-scrim',
        type: 'overlay',
        position: { x: '0%', y: '0%', anchor: 'top-left' },
        sizing: {
          width: '100%',
          height: '25%',
        },
        styling: {
          fill: '#000000', // Fallback (unused with gradient)
          opacity: 1.0,
          gradient: {
            direction: 'vertical',
            colorStart: 'rgba(0,0,0,0.7)', // Dark grey at top
            colorEnd: 'rgba(0,0,0,0)',     // Transparent at bottom
          },
        },
        zIndex: 10,
      },
      {
        id: 'artist',
        type: 'text',
        position: { x: '5%', y: '5%', anchor: 'top-left' },
        sizing: { maxWidth: '90%', fontSize: '1.75%', lineHeight: 1.3 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '5%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '90%', fontSize: '4.5%', lineHeight: 1.2 },
        styling: {
          fontWeight: 600,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
    ],
  },

  // Sidebar Layout - Logo-prominent left side with right-aligned text
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Logo-prominent design with left branding and right-aligned text',
    elements: [
      {
        id: 'icon',
        type: 'image',
        position: { x: '20%', y: '50%', anchor: 'center' },
        sizing: { maxWidth: '25%' },
        zIndex: 200,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '40%', y: '20%', anchor: 'top-left' },
        sizing: { maxWidth: '55%', fontSize: '8%', lineHeight: 1.2 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '40%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '55%', fontSize: '4%', lineHeight: 1.3 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'cta',
        type: 'text',
        position: { x: '40%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '40%', fontSize: '3.5%', lineHeight: 1.2 },
        styling: {
          fontWeight: 600,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
          borderRadius: '12px',
          backgroundColor: '#333333',
          padding: '14px 8px',
        },
        zIndex: 100,
      },
    ],
  },

  // Accent-Split Layout - Two-tone design with left text and right accent area
  {
    id: 'accent-split',
    name: 'Accent Split',
    enabled: false,
    description: 'Two-tone accent design with left text and right accent area',
    elements: [
      {
        id: 'accent-overlay',
        type: 'overlay',
        position: { x: '60%', y: '0%', anchor: 'top-left' },
        sizing: { width: '40%', height: '100%' },
        styling: {
          fill: '#000000',
          opacity: 0.1,
          gradient: {
            direction: 'vertical',
            colorStart: 'rgba(0,0,0,0.15)',
            colorEnd: 'rgba(0,0,0,0)',
          },
        },
        zIndex: 5,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '10%', y: '15%', anchor: 'top-left' },
        sizing: { maxWidth: '50%', fontSize: '8.5%', lineHeight: 1.2 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '10%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '50%', fontSize: '4%', lineHeight: 1.3 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'logo',
        type: 'image',
        position: { x: '80%', y: '50%', anchor: 'center' },
        sizing: { maxWidth: '8%' },
        zIndex: 200,
      },
    ],
  },

  // Quote Layout - Centered testimonial with quotation mark and attribution
  {
    id: 'quote',
    name: 'Quote',
    enabled: false,
    description: 'Centered testimonial and featured statement layout with attribution',
    elements: [
      {
        id: 'quotemark',
        type: 'text',
        position: { x: '50%', y: '10%', anchor: 'center' },
        sizing: { maxWidth: '5%', fontSize: '15%', lineHeight: 1.0 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '50%', y: '25%', anchor: 'center' },
        sizing: { maxWidth: '80%', fontSize: '7%', lineHeight: 1.3 },
        styling: {
          fontWeight: 600,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '50%', y: 'auto', anchor: 'center' },
        sizing: { maxWidth: '80%', fontSize: '3%', lineHeight: 1.2 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#cccccc',
        },
        zIndex: 100,
      },
      {
        id: 'logo',
        type: 'image',
        position: { x: '50%', y: '90%', anchor: 'bottom-center' },
        sizing: { maxWidth: '5%' },
        zIndex: 200,
      },
    ],
  },

  // Feature-Card Layout - Left icon with right-aligned feature description
  {
    id: 'feature-card',
    name: 'Feature Card',
    description: 'Product feature highlight with icon and right-aligned description',
    elements: [
      {
        id: 'main-image',
        type: 'image',
        position: { x: '20%', y: '50%', anchor: 'center' },
        sizing: { maxWidth: '30%' },
        zIndex: 50,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '40%', y: '25%', anchor: 'top-left' },
        sizing: { maxWidth: '55%', fontSize: '7%', lineHeight: 1.2 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '40%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '55%', fontSize: '3.5%', lineHeight: 1.4 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'logo',
        type: 'image',
        position: { x: '92%', y: '5%', anchor: 'top-right' },
        sizing: { maxWidth: '5%' },
        zIndex: 200,
      },
    ],
  },

  // Bottom Title Layout - Brand top-left, large title bottom-left, space for graphic on right
  {
    id: 'bottom-title',
    name: 'Bottom Title',
    description: 'Bottom title layout with small brand top-left and large title bottom-left',
    elements: [
      {
        id: 'brand',
        type: 'text',
        position: { x: '5%', y: '8%', anchor: 'top-left' },
        sizing: { maxWidth: '30%', fontSize: '2.5%', lineHeight: 1.2 },
        styling: {
          fontWeight: 600,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '5%', y: '90%', anchor: 'bottom-left' },
        sizing: { maxWidth: '50%', fontSize: '4.5%', lineHeight: 1.2 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'logo',
        type: 'image',
        position: { x: '95%', y: '88%', anchor: 'bottom-right' },
        sizing: { maxWidth: '5%' },
        zIndex: 200,
      },
    ],
  },

  // DevTerms Layout - Centered brand identity with logo, title, and tagline
  {
    id: 'simple-centered',
    name: 'Simple Centered',
    description: 'Clean centered layout with brand icon, bold title, and tagline',
    elements: [
      {
        id: 'icon',
        type: 'image',
        position: { x: '50%', y: '30%', anchor: 'center' },
        sizing: { maxWidth: '15%' },
        zIndex: 200,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '50%', y: '58%', anchor: 'center' },
        sizing: { maxWidth: '80%', fontSize: '7.5%', lineHeight: 1.1 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '50%', y: '70%', anchor: 'center' },
        sizing: { maxWidth: '70%', fontSize: '2.5%', lineHeight: 1.3 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#d1d5db',
        },
        zIndex: 100,
      },
    ],
  },

  // List My SaaS Layout - Directory listing showcase with brand badge
  {
    id: 'listmysaas',
    enabled: false,
    name: 'List My SaaS',
    description: 'Directory showcase with brand badge and categories',
    elements: [
      // Brand badge icon
      {
        id: 'logo',
        type: 'image',
        position: { x: '50%', y: '7%', anchor: 'top-center' },
        sizing: { maxWidth: '2.5%' },
        zIndex: 200,
      },
      // Brand badge text
      {
        id: 'badge-text',
        type: 'text',
        position: { x: '50%', y: '7.5%', anchor: 'top-left' },
        sizing: { maxWidth: '20%', fontSize: '1.8%', lineHeight: 1.2 },
        styling: {
          fontWeight: 600,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
        },
        zIndex: 200,
      },
      // Main headline
      {
        id: 'title',
        type: 'text',
        position: { x: '50%', y: '20%', anchor: 'top-center' },
        sizing: { maxWidth: '92%', fontSize: '6.5%', lineHeight: 1.15 },
        styling: {
          fontWeight: 900,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      // Category 1: Directories
      {
        id: 'category-1',
        type: 'text',
        position: { x: '25%', y: '65%', anchor: 'center' },
        sizing: { maxWidth: '20%', fontSize: '2.8%', lineHeight: 1.2 },
        styling: {
          fontWeight: 500,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      // Category 2: Launch Platforms
      {
        id: 'category-2',
        type: 'text',
        position: { x: '50%', y: '65%', anchor: 'center' },
        sizing: { maxWidth: '24%', fontSize: '2.8%', lineHeight: 1.2 },
        styling: {
          fontWeight: 500,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      // Category 3: Startup sites
      {
        id: 'category-3',
        type: 'text',
        position: { x: '75%', y: '65%', anchor: 'center' },
        sizing: { maxWidth: '20%', fontSize: '2.8%', lineHeight: 1.2 },
        styling: {
          fontWeight: 500,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      // Note about cards
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '50%', y: '86%', anchor: 'top-center' },
        sizing: { maxWidth: '80%', fontSize: '2.2%', lineHeight: 1.3 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#e0e7ff',
        },
        zIndex: 100,
      },
    ],
  },

  // Niche Business Idea Layout - Clean minimal layout with domain and large title
  {
    id: 'domain-and-title',
    name: 'Domain & Title',
    description: 'Clean minimal layout with small domain text, large bold title, and decorative icon',
    elements: [
      {
        id: 'domain',
        type: 'text',
        position: { x: '15%', y: '25%', anchor: 'top-left' },
        sizing: { maxWidth: '70%', fontSize: '3.5%', lineHeight: 1.2 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#000000',
        },
        zIndex: 100,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '15%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '70%', fontSize: '8%', lineHeight: 1.1 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#000000',
        },
        zIndex: 100,
      },
      {
        id: 'icon',
        type: 'image',
        position: { x: '92%', y: '85%', anchor: 'bottom-right' },
        sizing: { maxWidth: '12%' },
        zIndex: 200,
      },
    ],
  },

  // OG Image Generator Layout - Centered CTA-focused design with icon and button
  {
    id: 'ogimage',
    name: 'Icon, Title & CTA',
    description: 'Centered layout with brand icon, title, and prominent CTA button',
    elements: [
      {
        id: 'icon',
        type: 'image',
        position: { x: '50%', y: '18%', anchor: 'center' },
        sizing: { maxWidth: '15%' },
        zIndex: 200,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '50%', y: '50%', anchor: 'center' },
        sizing: { maxWidth: '80%', fontSize: '5%', lineHeight: 1.2 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'cta',
        type: 'text',
        position: { x: '50%', y: '81%', anchor: 'center' },
        sizing: { maxWidth: '60%', fontSize: '3.5%', lineHeight: 1.2 },
        styling: {
          fontWeight: 800,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#000000',
          backgroundColor: '#FBBF24',
          borderColor: '#FFFFFF',
          borderWidth: '0.4%',
          borderRadius: '40px',
          padding: '1.5% 2.5%'
        },
        zIndex: 100,
      },
    ],
  },

  {
    id: 'centered-long',
    name: 'Centered Long',
    description: 'Clean centered layout with domain, large title, and subtitle',
    elements: [
      {
        id: 'domain',
        type: 'text',
        position: { x: '50%', y: '17%', anchor: 'center' },
        sizing: { maxWidth: '40%', fontSize: '3%', lineHeight: 1.2 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '50%', y: '50%', anchor: 'center' },
        sizing: { maxWidth: '90%', fontSize: '5.5%', lineHeight: 1.2 },
        styling: {
          fontWeight: 800,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '50%', y: '72%', anchor: 'center' },
        sizing: { maxWidth: '65%', fontSize: '2.5%', lineHeight: 1.3 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          color: '#ffffff',
        },
        zIndex: 100,
      },
    ],
  },

  {
    id: 'stacked-text-right',
    name: 'Stacked Text Right',
    description: 'Split layout with icon on left and stacked text content on right',
    elements: [
      {
        id: 'icon',
        type: 'image',
        position: { x: '25%', y: '50%', anchor: 'center' },
        sizing: { maxWidth: '22%' },
        zIndex: 200,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '50%', y: '20%', anchor: 'top-left' },
        sizing: { maxWidth: '45%', fontSize: '8.8%', lineHeight: 1.15 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#4a5568',
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '50%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '45%', fontSize: '3.5%', lineHeight: 1.3 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#718096',
        },
        zIndex: 100,
      },
      {
        id: 'description',
        type: 'text',
        position: { x: '50%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '45%', fontSize: '3%', lineHeight: 1.5 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'left',
          color: '#718096',
        },
        zIndex: 100,
      },
    ],
  },

  // House Price History Layout - Screenshot left (60%), text + logo right (40%)
  {
    id: 'featured-image-left',
    name: 'Featured Image Left',
    description: 'Split layout with large screenshot on left (60%) and text with centered logo on right',
    elements: [
      {
        id: 'main',
        type: 'image',
        position: { x: '28%', y: '50%', anchor: 'center' },
        sizing: { maxWidth: '45%' },
        zIndex: 200,
      },
      {
        id: 'title',
        type: 'text',
        position: { x: '55%', y: '10%', anchor: 'top-left' },
        sizing: { maxWidth: '43%', fontSize: '4.2%', lineHeight: 1.5 },
        styling: {
          fontWeight: 700,
          fontFamily: 'Helvetica, sans-serif',
          textAlign: 'left',
          color: '#ffffff'
        },
        zIndex: 100,
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: '55%', y: 'auto', anchor: 'top-left' },
        sizing: { maxWidth: '43%', fontSize: '2.2%', lineHeight: 1.9 },
        styling: {
          fontWeight: 400,
          fontFamily: 'Helvetica, sans-serif',
          textAlign: 'left',
          color: '#ffffff',
          padding: '5% 0%'
        },
        zIndex: 100,
      },
      {
        id: 'logo',
        type: 'image',
        position: { x: '75%', y: '78%', anchor: 'center' },
        sizing: { maxWidth: '6%' },
        zIndex: 100,
      },
    ],
  },
]
