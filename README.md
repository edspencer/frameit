# FrameIt

A lightweight, open-source image generator for creating beautiful title images—thumbnails, OG images, and title cards—across multiple platforms. Built with Astro, React, TypeScript, and Tailwind CSS.

## Features

- **Multiple Platform Presets**: Pre-configured dimensions for YouTube, YouTube Shorts, Twitter/X, TikTok, and more
- **Real-time Preview**: Live canvas preview as you customize your image
- **Customizable Text**: Add heading and subheading text with independent color controls
- **Background Options**: Choose from multiple gradient backgrounds or use solid colors
- **Color Customization**: Pick custom colors for heading and subheading text
- **Logo Control**: Adjust logo opacity for different design needs
- **One-click Download**: Export images as PNG files
- **Clipboard Copy**: Copy generated image directly to clipboard
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (version 9 recommended)
- Vercel account (for deployment, optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/frameit.git
cd frameit

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

The application will open at `http://localhost:4321`

### Building

```bash
# Create a production build
pnpm build

# Preview the production build locally
pnpm preview
```

## Project Structure

```
frameit/
├── src/
│   ├── pages/                   # Astro pages (file-based routing)
│   │   ├── index.astro          # Homepage with ThumbnailGenerator
│   │   └── guides/              # Guide pages
│   ├── layouts/                 # Astro layouts
│   │   └── BaseLayout.astro     # Shared layout with meta tags
│   ├── content/                 # Content collections
│   │   ├── config.ts            # Collection schema (Zod)
│   │   └── guides/              # Markdown guide files
│   ├── components/              # React + Astro components
│   ├── lib/                     # Shared utilities
│   └── index.css                # Global styles (Tailwind)
├── api/
│   └── generate.ts              # Serverless image generation API
├── public/                      # Static assets
├── astro.config.ts              # Astro configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── package.json                 # Project metadata
```

See [CLAUDE.md](./CLAUDE.md) for detailed project structure documentation.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical documentation.

### Tech Stack

- **Framework**: Astro 5 with React islands (React 19)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3
- **Content**: Astro Content Collections with Zod schema
- **Deployment**: Vercel (with Serverless Functions)
- **Canvas**: HTML5 Canvas API + @napi-rs/canvas (server-side)

## Features

- **Programmatic API** (`/api/generate`): Generate images via REST API
- **OG Image Guides**: Learn best practices at `/guides`
- **10+ Platform Presets**: YouTube, LinkedIn, Twitter/X, TikTok, and more
- **Custom Backgrounds**: Choose from gradient backgrounds or upload custom images
- **Real-time Preview**: Live canvas preview as you customize

## Future Features

- **Template System**: Create and save custom image templates
- **Batch Generation**: Generate multiple images at once
- **Animation Support**: Create animated GIF/MP4 videos
- **Collaboration**: Share and export templates for team use

## Deployment

### Vercel (Recommended)

FrameIt is deployed to Vercel with automatic deployments via the `@astrojs/vercel` adapter.

**Git-based Deployment:**
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects Astro and configures build settings:
   - **Build command**: `pnpm build`
   - **Output directory**: `dist`
5. Click **"Deploy"**

FrameIt will now deploy automatically on every push to your main branch.

**Manual Deployment:**
```bash
# Build the project
pnpm build

# Install Vercel CLI (if not already installed)
pnpm add -g vercel

# Deploy
vercel
```

### Custom Domain

To use a custom domain (like `frameit.dev`):
1. In your Vercel project settings
2. Go to **Domains**
3. Add your domain
4. Update your domain's DNS as instructed

## API Documentation

### Generate Image Endpoint

```
GET /api/generate?layout=youtube&title=Hello%20World&subtitle=My%20Subtitle&format=png
```

Returns a PNG or WebP image with the specified configuration.

**Example:**
```bash
curl "https://frameit.dev/api/generate?layout=open-graph&title=My%20Title&format=png" -o og-image.png
```

See [CLAUDE.md](./CLAUDE.md) for complete API documentation including all parameters and layout options.

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

Built as a standalone, open-source image generator for creating beautiful title images—thumbnails, OG images, and title cards—inspired by design tools like Canva and Adobe Express.
