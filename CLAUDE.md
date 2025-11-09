# FrameIt Development Guide

FrameIt is a lightweight, open-source image generator for creating beautiful title images—thumbnails, OG images, and title cards—across multiple platforms. Built with React, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Technology Stack

- **Framework**: React 19 RC with TypeScript 5 (strict mode)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Deployment**: Vercel (with Serverless Functions)
- **Canvas**: HTML5 Canvas API (UI) + @napi-rs/canvas (API)
- **API**: Vercel Serverless Functions for programmatic generation

GitHub repo: https://github.com/edspencer/frameit

## Project Structure

```
src/
├── main.tsx                 # React entry point
├── App.tsx                  # Main app component
├── index.css                # Global styles (Tailwind imports)
├── lib/
│   ├── constants.ts         # Platform presets and backgrounds
│   ├── types.ts             # TypeScript interfaces
│   └── canvas-utils.ts      # Canvas drawing utilities
├── components/
│   ├── ThumbnailGenerator.tsx    # Main component (state management)
│   ├── CanvasPreview.tsx         # Canvas rendering wrapper
│   ├── ControlPanel.tsx          # Control UI container
│   ├── PlatformSelector.tsx      # Platform preset buttons
│   ├── HeadingContent.tsx        # Heading text & color controls
│   ├── SubheadingContent.tsx     # Subheading text & color controls
│   ├── BackgroundSelector.tsx    # Background gallery
│   ├── ColorPicker.tsx           # Reusable color picker
│   └── OpacitySlider.tsx         # Logo opacity control
└── public/
    └── favicon.ico
```

## Key Features

- **Multiple Platform Presets**: YouTube, YouTube Shorts, Twitter/X, TikTok, Square
- **Real-time Preview**: Live canvas updates as you customize
- **Independent Color Controls**: Separate colors for heading and subheading
- **Background Options**: Multiple gradient backgrounds
- **Logo Opacity**: Adjustable BragDoc logo opacity
- **Download & Copy**: Export as PNG or copy to clipboard
- **Persistent State**: Settings saved to localStorage

## State Management

`ThumbnailGenerator.tsx` manages all application state:
- `selectedPreset`: Current platform dimensions
- `title` / `subtitle`: Text content
- `titleColor` / `subtitleColor`: Independent text colors
- `selectedBackground`: Background image URL
- `logoOpacity`: Logo opacity (0-1)

All state is persisted to localStorage via `saveConfigToStorage()` and restored on page load via `loadConfigFromStorage()`.

## Canvas Rendering

FrameIt uses a layout-based rendering system via `LayoutRenderer` class ([src/lib/layout-renderer.ts](src/lib/layout-renderer.ts)):
- **Layout System**: JSON-defined layouts with text, image, and overlay elements
- **Positioning**: Supports percentage-based, pixel-based, and auto positioning
- **Anchor Points**: 9-point anchor system (top-left, center, bottom-right, etc.)
- **Text Wrapping**: Automatic word wrapping via `wrapText()` utility
- **Gradient Backgrounds**: Linear gradients via `drawGradientBackground()`

The same `LayoutRenderer` is used for both UI preview and API generation, ensuring 1:1 parity.

## API Endpoint

FrameIt provides a serverless API endpoint for programmatic thumbnail generation at `/api/generate`.

### API Usage

**GET Request:**
```bash
curl "https://frameit.dev/api/generate?layout=open-graph&title=Hello%20World&subtitle=My%20Subtitle&format=png" -o thumbnail.png
```

**POST Request:**
```bash
curl -X POST https://frameit.dev/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "layout": "youtube",
    "title": "Amazing Tutorial",
    "subtitle": "Learn something new",
    "titleColor": "ffffff",
    "subtitleColor": "cccccc",
    "background": "default",
    "logoOpacity": 0.3,
    "format": "webp"
  }' -o thumbnail.webp
```

### API Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `layout` | string | Yes | - | Platform preset: `youtube`, `youtube-shorts`, `linkedin-video`, `twitter-x`, `tiktok`, `instagram-reels`, `open-graph`, `instagram-feed`, `x-header`, `pinterest-pin` |
| `title` | string | Yes | - | Main heading text (max 200 chars) |
| `subtitle` | string | No | `""` | Subheading text (max 300 chars) |
| `titleColor` | string | No | `ffffff` | Title color as hex without # |
| `subtitleColor` | string | No | `cccccc` | Subtitle color as hex without # |
| `background` | string | No | `default` | Gradient ID: `default`, `dark-blue`, `sunset`, `ocean-blue`, `forest-green`, `purple-pink`, etc. |
| `logoOpacity` | number | No | `0.3` | Logo opacity (0-1) |
| `logoUrl` | string | No | - | Custom logo image URL |
| `layoutId` | string | No | `default` | Layout style: `default`, `classic`, `minimal`, `photo-essay` |
| `format` | string | No | `webp` | Output format: `png` or `webp` |

### Layout Styles

- **default**: Logo top-right, text left-aligned at 30% height
- **classic**: Traditional top-left layout
- **minimal**: Centered, minimalist aesthetic
- **photo-essay**: Prominent centered text

### Available Gradients

`default`, `dark-blue`, `purple-gradient`, `sunset`, `ocean-blue`, `teal-cyan`, `red-orange`, `purple-pink`, `yellow-orange`, `green-teal`, `indigo-purple`, `pink-red`, `forest-green`, `navy-blue`, `warm-sunset`, `cool-ocean`, `dark-slate`

### Example: Build Process Integration

```javascript
// generate-og-image.js
import { writeFile } from 'fs/promises'

const params = new URLSearchParams({
  layout: 'open-graph',
  title: process.env.PAGE_TITLE,
  subtitle: process.env.PAGE_DESCRIPTION,
  background: 'ocean-blue',
  format: 'png'
})

const response = await fetch(`https://frameit.dev/api/generate?${params}`)
const buffer = await response.arrayBuffer()
await writeFile('public/og-image.png', Buffer.from(buffer))
```

### Testing Locally

```bash
# Start development server (runs both UI and API)
vercel dev

# Test API endpoint
curl "http://localhost:3000/api/generate?layout=youtube&title=Test&format=png" -o test.png

# Run comprehensive test suite
npx tsx test-api.ts
```

## Deployment

### Vercel

FrameIt is deployed to Vercel with automatic deployments:

1. **Build command**: `pnpm build`
2. **Output directory**: `dist`
3. **Serverless Functions**: Automatically deployed from `api/` directory

The API uses [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas) for server-side rendering with the Inter font registered for consistent typography.

## Development Tips

### Adding New Platform Presets

1. Add to `PRESETS` array in `lib/constants.ts`:
```typescript
{
  name: 'Your Platform',
  width: 1080,
  height: 1920,
  aspectRatio: '9:16',
  description: 'Description here',
}
```

2. The UI will automatically show the new preset in the platform selector.

### Adding Background Options

1. Add to `BACKGROUND_IMAGES` array in `lib/constants.ts`:
```typescript
{
  name: 'Background Name',
  url: 'data:image/svg+xml,...',  // or regular image URL
}
```

2. Users can select from the background gallery.

### Color Controls

Each text section (Heading/Subheading) has independent color control via the `ColorPicker` component. Colors are displayed as hex values and can be picked from a native color picker.

## Testing

Run tests with:
```bash
pnpm test
pnpm test:watch
```

## Code Style

- TypeScript with strict mode enabled
- Use interfaces for object shapes
- Named exports (avoid default exports)
- Destructure props in function signatures
- Explicit return types on public functions
- Tailwind CSS for all styling

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (tested on macOS and iOS)

Requires support for:
- HTML5 Canvas API
- ES2020+ JavaScript
- CSS Grid and Flexbox
- localStorage API
- Clipboard API (for copy-to-clipboard feature)

## Architecture

### Rendering System

Both the UI and API use the same rendering pipeline for 1:1 parity:

1. **Layout Definition** ([src/lib/constants.ts](src/lib/constants.ts#L197)): JSON-based layout configurations
2. **LayoutRenderer** ([src/lib/layout-renderer.ts](src/lib/layout-renderer.ts)): Interprets layouts and renders to canvas
3. **Canvas Utils** ([src/lib/canvas-utils.ts](src/lib/canvas-utils.ts)): Shared utilities (`wrapText`, `drawGradientBackground`)

### Type System

- **[src/lib/types.ts](src/lib/types.ts)**: Core type definitions (shared by UI and API)
- **[src/lib/ui-constants.ts](src/lib/ui-constants.ts)**: UI-specific constants with React icons
- **[src/lib/api-types.ts](src/lib/api-types.ts)**: API parameter validation and types

### API Implementation

The API ([api/generate.ts](api/generate.ts)) transforms URL parameters into the same `ThumbnailConfigNew` format used by the UI, then uses `LayoutRenderer` to generate images server-side with @napi-rs/canvas.

## Future Enhancements

- Custom background image upload
- Template system for saving custom designs
- Batch generation for multiple thumbnails
- Animation support (GIF/MP4 output)
- Team collaboration features
- Additional layout customization options

## Troubleshooting

### Canvas shows black/blank
- Check that background image URL is valid and CORS-enabled
- Verify text colors are not matching background color

### Download/Copy buttons don't work
- Ensure browser supports Clipboard API (modern browsers only)
- Check browser console for errors

### Settings not persisting
- Verify localStorage is enabled
- Check browser privacy settings

## Contributing

When adding features:
1. Follow the existing component structure
2. Add TypeScript types for all props
3. Update this documentation
4. Test on multiple browsers
5. Ensure accessibility (keyboard navigation, color contrast, etc.)
