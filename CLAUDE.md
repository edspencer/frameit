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
- **Deployment**: Cloudflare Pages
- **Canvas**: HTML5 Canvas API for image rendering

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

Canvas utilities are in `lib/canvas-utils.ts`:
- `drawThumbnail()`: Renders with background image
- `drawThumbnailWithoutBackground()`: Renders with gradient fallback
- `drawTextContent()`: Renders title and subtitle with word wrapping
- `drawBragDocLogo()`: Renders logo with opacity control
- `wrapText()`: Wraps text to fit maximum width

**Important**: Canvas dimensions are only reset when the platform preset changes. This prevents the "flash" effect on text updates.

## Deployment

### Cloudflare Pages

FrameIt is deployed to Cloudflare Pages:

1. **Build command**: `pnpm build`
2. **Build output directory**: `dist`
3. **Deploy command**: Leave blank (Pages automatically deploys the build output)

The project connects to your GitHub repository for automatic deployments on push.

**Important**: Do NOT use `npx wrangler deploy` in the deploy command—this creates a Cloudflare Worker that will override your Pages deployment.

### Custom Domain

To connect `frameit.dev`:
1. Go to your Pages project settings
2. Add custom domain
3. Point your domain's DNS to Cloudflare (if not already)

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

## Future Enhancements

- API endpoint (`/api/generate`) for programmatic thumbnail generation
- Custom background upload
- Template system for saving custom designs
- Batch generation for multiple thumbnails
- Animation support (GIF/MP4 output)
- Team collaboration features

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
