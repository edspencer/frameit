# Thumbnail Generator

A lightweight, open-source video thumbnail generator for creating branded thumbnails across multiple platforms. Built with React, TypeScript, and Tailwind CSS, deployable to Cloudflare Pages.

## Features

- **Multiple Platform Presets**: Pre-configured dimensions for LinkedIn, YouTube, Twitter/X, and Instagram
- **Real-time Preview**: Live canvas preview as you customize your thumbnail
- **Customizable Text**: Add heading and subheading text with full control
- **Background Options**: Choose from multiple gradient backgrounds or use solid colors
- **Color Customization**: Pick any text color with a color picker
- **Logo Control**: Adjust logo opacity for different design needs
- **One-click Download**: Export thumbnails as PNG files
- **Clipboard Copy**: Copy generated thumbnail directly to clipboard
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 16+ and npm or pnpm
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/thumbnail-generator.git
cd thumbnail-generator

# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
# Start the development server
npm run dev
# or
pnpm dev
```

The application will open at `http://localhost:5173`

### Building

```bash
# Create a production build
npm run build
# or
pnpm build

# Preview the production build locally
npm run preview
# or
pnpm preview
```

## Project Structure

```
thumbnail-generator/
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Main app component
│   ├── index.css                # Global styles (Tailwind imports)
│   ├── lib/
│   │   ├── constants.ts         # PRESETS and BACKGROUND_IMAGES
│   │   ├── types.ts             # TypeScript interfaces
│   │   └── canvas-utils.ts      # Shared canvas drawing functions
│   ├── components/
│   │   ├── ThumbnailGenerator.tsx    # Main generator component
│   │   ├── CanvasPreview.tsx         # Canvas rendering wrapper
│   │   ├── ControlPanel.tsx          # Control UI wrapper
│   │   ├── PlatformSelector.tsx      # Platform preset selector
│   │   ├── TextContent.tsx           # Text input controls
│   │   ├── BackgroundSelector.tsx    # Background gallery
│   │   ├── ColorPicker.tsx           # Text color control
│   │   └── OpacitySlider.tsx         # Logo opacity control
│   └── pages/
│       ├── Home.tsx             # Home page
│       └── NotFound.tsx          # 404 page
├── public/
│   └── favicon.ico
├── index.html                   # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Project metadata and dependencies
└── README.md                   # This file
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical documentation.

### Tech Stack

- **Framework**: React 19 (React Server Components compatible)
- **Build Tool**: Vite 5
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3
- **Deployment**: Cloudflare Pages
- **Future Backend**: Cloudflare Workers (for API endpoints)

## Future Features

- **API Endpoint** (`/api/thumbnail`): Generate thumbnails programmatically via API
- **Custom Backgrounds**: Upload your own background images
- **Template System**: Create and save custom thumbnail templates
- **Batch Generation**: Generate multiple thumbnails at once
- **Animation Support**: Create animated GIF/MP4 thumbnails
- **Collaboration**: Share and export templates for team use

## Deployment

### Cloudflare Pages

```bash
# Build the project
npm run build

# Install Wrangler CLI (if not already installed)
npm install -g @cloudflare/wrangler

# Deploy to Cloudflare Pages
wrangler pages deploy dist/
```

Alternatively, connect your GitHub repository to Cloudflare Pages for automatic deployments.

## API Documentation

### Planned Endpoints

#### Generate Thumbnail

```
GET /api/thumbnail?title=...&subtitle=...&preset=youtube&background=dark-blue&textColor=%23ffffff
```

Returns a PNG image with the specified configuration. See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete API documentation.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows the existing style
- TypeScript strict mode compliance
- Components are properly documented
- Changes are tested manually

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

For questions, issues, or feedback:
- Open an issue on GitHub
- Check existing documentation in [ARCHITECTURE.md](./ARCHITECTURE.md)
- Review the [Getting Started](#getting-started) section

## Acknowledgments

Built as a standalone, open-source alternative to commercial thumbnail generators, inspired by design tools like Canva and Adobe Express.
