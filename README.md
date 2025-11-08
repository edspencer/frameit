# FrameIt

A lightweight, open-source image generator for creating beautiful title images—thumbnails, OG images, and title cards—across multiple platforms. Built with React, TypeScript, and Tailwind CSS, deployable to Cloudflare Pages.

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

- Node.js 16+ and pnpm (version 9 recommended)
- Cloudflare account (for deployment)

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

The application will open at `http://localhost:5173`

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
│   │   ├── HeadingContent.tsx        # Heading text and color controls
│   │   ├── SubheadingContent.tsx     # Subheading text and color controls
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

- **API Endpoint** (`/api/generate`): Generate images programmatically via API
- **Custom Backgrounds**: Upload your own background images
- **Template System**: Create and save custom image templates
- **Batch Generation**: Generate multiple images at once
- **Animation Support**: Create animated GIF/MP4 videos
- **Collaboration**: Share and export templates for team use

## Deployment

### Cloudflare Pages (Recommended)

The easiest way to deploy FrameIt is to connect your GitHub repository to Cloudflare Pages for automatic deployments.

**Git-based Deployment:**
1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
3. Click **"Create Application"** → **"Pages"** → **"Connect to Git"**
4. Select your repository
5. Configure build settings:
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Deploy command**: Leave blank (Cloudflare automatically deploys the build output)
6. Click **"Save and Deploy"**

FrameIt will now deploy automatically on every push to your main branch.

**Direct Upload (One-time):**
```bash
# Build the project
pnpm build

# Install Wrangler CLI (if not already installed)
pnpm add -g wrangler

# Deploy the dist/ folder
wrangler pages deploy dist/
```

### Custom Domain

To use a custom domain (like `frameit.dev`):
1. In your Cloudflare Pages project settings
2. Go to **Custom domains**
3. Add your domain
4. Update your domain's DNS if needed (Cloudflare will provide instructions)

## API Documentation

### Planned Endpoints

#### Generate Image

```
GET /api/generate?title=...&subtitle=...&preset=youtube&background=dark-blue&titleColor=%23ffffff&subtitleColor=%23ffffff
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

Built as a standalone, open-source image generator for creating beautiful title images—thumbnails, OG images, and title cards—inspired by design tools like Canva and Adobe Express.
