# Architecture Documentation

## Overview

Thumbnail Generator is a lightweight, single-page application (SPA) for creating branded video thumbnails. The project is organized into clear layers with shared utilities that will support both client-side and server-side (future API) thumbnail generation.

## Frontend Architecture

### Core Layers

```
UI Components (React)
       ↓
Canvas Rendering
       ↓
Shared Utilities (Canvas Utils)
       ↓
Constants & Types
```

### Component Structure

#### Top-Level Components

- **`App.tsx`**: Main application wrapper, routing and layout
- **`ThumbnailGenerator.tsx`**: Main component orchestrating state and rendering

#### Canvas & Preview

- **`CanvasPreview.tsx`**: Wraps HTML5 canvas element and handles rendering logic

#### Control Components

- **`ControlPanel.tsx`**: Container for all control sections
- **`PlatformSelector.tsx`**: Platform preset selection (LinkedIn, YouTube, etc.)
- **`TextContent.tsx`**: Heading and subheading text input fields
- **`BackgroundSelector.tsx`**: Background gallery and selection
- **`ColorPicker.tsx`**: Text color picker
- **`OpacitySlider.tsx`**: Logo opacity slider

### State Management

State is managed at the `ThumbnailGenerator` component level using React hooks:

```typescript
const [selectedPreset, setSelectedPreset] = useState<ThumbnailPreset>
const [selectedBackground, setSelectedBackground] = useState<string>
const [title, setTitle] = useState<string>
const [subtitle, setSubtitle] = useState<string>
const [textColor, setTextColor] = useState<string>
const [logoOpacity, setLogoOpacity] = useState<number>
```

**Why top-level state?**
- Simplified data flow
- Easy to pass state to both canvas rendering and future API calls
- Facilitates sharing configuration between frontend and backend

### Canvas Rendering

Canvas drawing logic is separated into utilities for maximum reusability:

#### `lib/canvas-utils.ts`

Exported functions:

```typescript
// Main drawing functions
drawThumbnail(ctx: CanvasRenderingContext2D, backgroundImg: HTMLImageElement, config: ThumbnailConfig): void
drawThumbnailWithoutBackground(ctx: CanvasRenderingContext2D, config: ThumbnailConfig): void

// Component drawing functions
drawBragDocLogo(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, logoOpacity: number): void
drawTextContent(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, config: ThumbnailConfig): void

// Utility functions
wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[]
```

**Design principle**: All canvas operations are **pure functions** that don't depend on React state or the DOM, making them easily testable and reusable in server-side code (Workers).

### Constants & Types

#### `lib/types.ts`

```typescript
interface ThumbnailPlatform {
  name: string
  width: number
  height: number
  aspectRatio: string
  description: string
  category: 'video' | 'social'
}

interface BackgroundConfig {
  type: 'gradient' | 'solid' | 'none'
  gradientId?: string      // For gradient backgrounds
  solidColor?: string      // For solid backgrounds
}

interface TextElement {
  id: string              // "title", "subtitle", etc.
  content: string
  color?: string
  fontSize?: string
  fontFamily?: string
  fontWeight?: number
}

interface ImageElement {
  id: string              // "logo", "avatar", etc.
  url?: string
  opacity?: number        // 0-1
  scale?: number          // 0-200
}

interface ThumbnailConfig {
  preset: ThumbnailPlatformWithIcon
  layoutId: string        // References LayoutDefinition.id
  background: BackgroundConfig
  textElements: TextElement[]
  imageElements: ImageElement[]
}
```

#### `lib/constants.ts`

```typescript
// Platform presets
const PRESETS: ThumbnailPreset[] = [
  { name: 'LinkedIn Video', width: 1200, height: 627, ... },
  { name: 'YouTube', width: 1280, height: 720, ... },
  // ...
]

// Background options
const BACKGROUND_IMAGES: BackgroundImage[] = [
  { name: 'None (Gradient)', url: '' },
  { name: 'Dark Blue', url: 'data:image/svg+xml,...' },
  // ...
]
```

## Data Flow

### User Input → Canvas Update

```
User Input (text, color, preset, background)
    ↓
State Update (React hooks)
    ↓
useEffect triggers
    ↓
Canvas Drawing (canvas-utils functions)
    ↓
Canvas displayed in DOM
```

### Download/Copy Flow

```
User clicks Download/Copy
    ↓
Canvas.toDataURL() or Canvas.toBlob()
    ↓
Trigger download or clipboard copy
```

## File I/O Operations

### Download PNG

```typescript
const downloadThumbnail = () => {
  const canvas = canvasRef.current
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `thumbnail-${preset.name}.png`
  link.click()
}
```

### Copy to Clipboard

```typescript
const copyToClipboard = async () => {
  const canvas = canvasRef.current
  canvas.toBlob((blob) => {
    navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
  })
}
```

## Future API Architecture

### Planned Server-Side Implementation

The project structure includes a `functions/` directory (placeholder) for Cloudflare Workers:

```
functions/
└── api/
    └── thumbnail.ts     # Image generation endpoint
```

### API Endpoint Design

```
GET /api/thumbnail
  ?title=string
  &subtitle=string
  &preset=linkedin|youtube|twitter|square
  &background=none|dark-blue|purple|teal
  &textColor=%23ffffff
  &logoOpacity=0-1
```

**Response**: PNG image (binary)

### Server-Side Implementation Strategy

The canvas utilities will be **reused server-side** via:

1. **Node.js Canvas Library**: `canvas` or `@napi-rs/canvas`
2. **Browser Canvas API Polyfill**: Emulate canvas API for Workers
3. **ImageMagick/Sharp**: Pure image manipulation without canvas

**Benefits of shared utilities approach**:
- Same drawing logic on client and server
- Guaranteed identical output
- Easier to test both implementations
- Single source of truth for thumbnail generation

## Build & Deployment

### Development Build

```bash
pnpm dev
# Vite dev server on port 5173
# Hot Module Replacement (HMR) enabled
# Full source maps for debugging
```

### Production Build

```bash
pnpm build
# Output: dist/
# TypeScript compilation in strict mode
# Tree-shaking for smaller bundle
# Minified CSS and JavaScript
```

### Cloudflare Pages Deployment

```bash
wrangler pages deploy dist/
# Deploys the entire dist/ folder to Cloudflare Pages
# Static files served from global CDN
# Zero cold starts
```

## Performance Considerations

### Canvas Rendering

- Canvas rendering uses **requestAnimationFrame** (via useEffect dependencies)
- Only re-renders when configuration changes
- Image loading uses **crossOrigin** attribute for CORS compliance
- Background loading is optimized with early exit if image fails

### Bundle Size Optimization

- React 19 (lighter than React 18)
- No unnecessary dependencies
- Tailwind CSS with PurgeCSS removes unused styles
- Vite's tree-shaking removes dead code

### Browser Compatibility

- Targets ES2020 (modern browsers)
- Canvas API widely supported
- Clipboard API requires modern browser (can add fallback)
- No polyfills needed for current browsers

## Security Considerations

### Canvas Security

- User-provided text is rendered to canvas (safe - no HTML injection)
- Background images use data URIs (safe - controlled sources)
- No localStorage or sensitive data storage

### CORS

- Background images use `crossOrigin="anonymous"`
- Prevents image tainting when downloading
- Allows reading pixel data from loaded images

### API Security (Future)

- Rate limiting on `/api/thumbnail` endpoint
- Request validation for all parameters
- Image generation with timeout to prevent DoS
- Consider authentication if needed for premium features

## Testing Strategy

### Component Testing

- Mock canvas context for unit tests
- Test state management and prop handling
- Verify download/clipboard functionality

### Integration Testing

- Test full user flow (input → preview → download)
- Verify canvas rendering output
- Test across different presets

### Visual Regression

- Screenshot comparison of generated thumbnails
- Ensure consistency across browser engines

## Documentation

### Code Comments

- Canvas drawing functions documented with JSDoc
- Complex calculations explained inline
- Type annotations provide inline documentation

### Architecture Changes

- Update ARCHITECTURE.md when adding new features
- Document API endpoints as they're implemented
- Keep README.md in sync with features

## Future Enhancements

### Phase 2: API Backend

- Cloudflare Workers endpoint for server-side generation
- Shared canvas-utils for client/server consistency
- Caching of generated images in Workers KV

### Phase 3: Advanced Features

- Custom background upload
- Template system (save/load configurations)
- Batch generation
- Animation support (GIF/MP4)

### Phase 4: Team Features

- User accounts (authentication)
- Template sharing
- Organization workspaces
- Usage analytics

## Dependencies

### Production

- **react**: UI framework
- **react-dom**: React DOM rendering

### Development

- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tailwindcss**: Utility-first CSS
- **autoprefixer**: CSS vendor prefixing
- **@vitejs/plugin-react**: React support in Vite

### Zero External UI Libraries

Intentionally using native HTML elements and Tailwind CSS classes for:
- Minimal bundle size
- Full control over styling
- Simple and maintainable code
- Cloudflare Pages deployment simplicity

## Standards & Conventions

### Code Style

- Functional components with React hooks
- TypeScript strict mode enabled
- Consistent naming conventions
  - Components: PascalCase
  - Functions: camelCase
  - Constants: SCREAMING_SNAKE_CASE
  - Types: PascalCase

### Component Organization

- One component per file
- Components in `src/components/`
- Utilities in `src/lib/`
- Pages in `src/pages/`

### Imports

- Absolute imports with `src/` prefix
- Group imports: React, libraries, local

### File Naming

- Components: `ComponentName.tsx`
- Utilities: `utility-name.ts`
- Types: `types.ts`
- Constants: `constants.ts`

