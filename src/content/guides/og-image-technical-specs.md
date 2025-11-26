---
title: "OG Image Technical Specifications: Dimensions, Formats & Requirements"
description: "Complete guide to OG image dimensions, file sizes, and formats for Facebook, Twitter, LinkedIn, and other platforms."
publishDate: 2025-01-15
author: "FrameIt Team"
tags: ["og-images", "technical", "dimensions", "formats"]
order: 2
---

Getting the technical details right ensures your OG images display correctly across all platforms. Here's what you need to know.

## Primary Dimensions & Aspect Ratios

The universal standard for OG images is **1200×630 pixels** with a 1.91:1 aspect ratio. This dimension works across Facebook, Twitter/X, LinkedIn, and most other platforms. While some platforms accept alternative formats, this single size covers 90% of use cases.

| Platform | Recommended Size | Aspect Ratio | Alternative Formats |
|----------|------------------|--------------|---------------------|
| Facebook | 1200×630px | 1.91:1 | 1200×1200px (1:1) |
| Twitter/X | 1200×675px | 1.78:1 | Uses 1200×630px |
| LinkedIn | 1200×628px | 1.91:1 | Note: 628px not 630px |
| Generic/Universal | 1200×630px | 1.91:1 | 600×315px (minimum) |

### Why 1200×630px?

This size provides sharp rendering on high-DPI displays while remaining under platform file size limits. When platforms scale your image for mobile display (typically 50% of original size), text remains readable and details stay crisp.

The minimum recommended size is 600×315px—exactly half of the standard dimensions. Going smaller risks pixelation and poor text readability on modern screens.

## File Size Requirements

Most platforms accept OG images up to **5MB**, but you should aim for **100-200KB** for optimal performance. Here's why:

- Faster loading times on mobile networks
- Better user experience (images appear quickly)
- Lower bandwidth costs for high-traffic sites
- Platforms may reject images exceeding 5MB

### Practical File Sizes

- **JPG at 85% quality:** 100-150KB (ideal for most cases)
- **PNG with graphics/text:** 200-400KB
- **WebP:** 80-120KB (limited platform support)

An uncompressed 1200×630px image (RGB, 8-bit) would be approximately 3MB. Proper compression reduces this by 95% with minimal visual quality loss.

## File Format Guidance

Choose your format based on content:

### Use JPG when:
- Image contains photos or complex gradients
- File size is a priority
- Maximum platform compatibility is needed

### Use PNG when:
- Image has flat colors and sharp edges
- Text is the primary element
- You need crisp, artifact-free rendering

### Avoid WebP:
- LinkedIn doesn't support it
- Many platforms still default to JPG/PNG fallbacks
- Limited benefits outweigh compatibility risks

## Platform-Specific Requirements

### Facebook
- Minimum: 1200×630px (recommended)
- Formats: JPG, PNG, GIF, WebP
- Will accept images with aspect ratios up to 8:1
- Square images (1200×1200px) work well for certain content

### Twitter/X
- Preferred: 1200×675px for `summary_large_image` card
- Minimum: 600×335px
- Supports alt text via `twitter:image:alt` (recommended for accessibility)

### LinkedIn
- Recommended: 1200×**628**px (note the 628, not 630)
- Minimum: 200×200px
- Displays consistently across desktop and mobile

## HTML Implementation

### Basic OG Tags (Required)

```html
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
```

### Platform-Specific Enhancements

```html
<!-- Twitter/X specific -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://example.com/image.jpg">

<!-- Alt text for accessibility -->
<meta property="og:image:alt" content="Article title with key visual elements described">
```

**Critical:** Always use absolute URLs (https://...), never relative paths (/images/...). Platforms must be able to fetch your image from any context.

---

Ready to create technically perfect OG images? [Try FrameIt](/) for automatic sizing and format optimization.
