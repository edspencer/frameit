---
description: Analyze an OG image and create a custom layout to reproduce it
arguments:
  - name: image
    description: Path, URL, or name of image file in layouts/original/ directory
    required: true
---

# Reproduce Image Command

You are tasked with analyzing an Open Graph (OG) image and reproducing it using FrameIt's layout system.

## Input

The user has provided: `{{image}}`

## Process

Follow these steps in order:

### 1. Load the Image

First, determine what type of input was provided:

- If it's a filename (e.g., "clerk.jpg", "boring-launch.png"), look for it in `./layouts/original/` directory
- If it's a relative or absolute path, read directly from that path
- If it's a URL starting with http:// or https://, fetch the image from the URL

Use the Read tool to load the image and display it for analysis.

### 2. Thorough Visual Analysis

Analyze the image comprehensively and provide:

**Layout Structure:**
- Overall layout pattern (centered, split, sidebar, etc.)
- Number of distinct sections/regions
- Spatial relationships between elements

**Text Elements:**
- Identify all text content with approximate positioning (top-left, center, bottom-right, etc.)
- Font sizes relative to canvas (estimate as percentages)
- Font weights (light, normal, semi-bold, bold, extra-bold)
- Text alignment (left, center, right)
- Text colors (estimate hex values)
- Line heights and spacing

**Visual Elements:**
- Brand logos and icons (IMPORTANT: Replace with FrameIt assets)
  - Square icons → use FrameIt icon (`/frameit-icon.png`)
  - Wide/rectangular logos → use FrameIt logo (`/frameit-logo.png`)
  - Choose based on aspect ratio of original
- Other graphics or decorative elements
- Positioning and sizing relative to canvas

**Background:**
- Solid color (estimate hex)
- Gradient (direction, colors)
- Pattern or texture
- Estimate closest match from our Tailwind color palette or gradient library

**Spacing & Layout:**
- Margins and padding (estimate as percentages)
- Element anchoring (which corner/edge elements are positioned from)
- Maximum widths for text wrapping

### 3. Propose HTML/CSS Flex Layout

Based on your analysis, describe how you would implement this using modern HTML/CSS flex layouts:

```html
<!-- Provide a conceptual HTML structure -->
<div class="container">
  <div class="brand">...</div>
  <div class="main-content">
    <h1 class="title">...</h1>
    <p class="subtitle">...</p>
  </div>
  <div class="cta">...</div>
</div>
```

```css
/* Provide CSS with flexbox positioning */
.container {
  display: flex;
  flex-direction: column;
  /* ... positioning details ... */
}
```

### 4. Create Custom Layout

Now create a brand new layout in `/Users/ed/Code/thumbnail-generator/src/lib/constants/layouts.ts`:

1. Read the layouts.ts file to see the LAYOUTS array
2. Generate a unique layout ID based on the image name (e.g., "boring-launch" → "boring-launch", "new-image.png" → "new-image")
3. Create layout configuration following the existing pattern with:
   - Text elements with proper positioning, sizing, and styling
   - Image element(s) with appropriate element ID:
     - Use `id: 'logo'` for wide/rectangular logos (automatically gets `/frameit-logo.png`)
     - Use `id: 'icon'` for square icons/avatars (automatically gets `/frameit-icon.png`)
     - Choose based on aspect ratio of the original image being replaced
   - Proper z-index layering
4. Add the new layout to the LAYOUTS array using the Edit tool

**Layout Guidelines:**
- Use percentage-based positioning for responsiveness
- Use anchor points: 'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'
- Font sizes as percentages of canvas height (typically 2-8%)
- Image element IDs determine default assets:
  - `'logo'` → `/frameit-logo.png` (wide horizontal logo with text)
  - `'icon'` → `/frameit-icon.png` (square icon without text)
  - `'main-image'` → no default (user must upload)
- Use Inter font family for all text

### 5. Create Example Configuration

Create a new example configuration entry in `/Users/ed/Code/thumbnail-generator/src/lib/example-configs.ts`:

1. Read the example-configs.ts file
2. Add a new entry to EXAMPLE_CONFIGS array with:
   - Unique ID matching layout ID
   - Descriptive name and description
   - Layout ID matching the one you just created
   - Preset: 'Open Graph' (1200x630)
   - Background: Choose appropriate gradient or solid color from Tailwind palette
   - Text content extracted from the original image
   - Text colors matching the original
   - Page URL (if known, otherwise use placeholder)
   - Notes about what was replicated and what's missing

### 6. Test in Both Test Script AND UI

**A. Test Script (API Generation):**

Run the test script to generate your reproduction via the API:

```bash
npx tsx test-og-examples.ts --single [your-layout-id]
```

This will:
1. Spin up a static server on port 3001 serving `/frameit-logo.png` and `/frameit-icon.png`
2. Send API request with image URLs like `http://localhost:3001/frameit-icon.png`
3. Generate the image at `./layouts/api/[your-layout-id].png`

The test script automatically discovers image elements from the layout definition and assigns appropriate default URLs based on element IDs.

**B. UI Testing (Browser):**

Open the browser at `http://localhost:3000` and verify:
1. The new example appears in the Examples section
2. Clicking the example loads the layout with:
   - Correct text content
   - Correct background color/gradient
   - FrameIt logo or icon showing (depending on element ID)
3. All controls work (text editing, color changes, etc.)

The UI uses relative paths (`/frameit-logo.png`, `/frameit-icon.png`) which Vite serves from the `public/` directory.

### 7. Compare Results

Read both images (original and generated) and provide:

**Visual Comparison:**
- What matches well
- What differs
- Positioning accuracy
- Color accuracy
- Typography accuracy
- Overall fidelity score (1-10)

**Recommendations for Improvement:**
- Specific adjustments needed
- Missing resources (fonts, graphics, etc.)
- Constraints of the layout system

### 8. Iterate if Needed

If the initial reproduction isn't accurate enough:
1. Identify specific issues
2. Update the layout configuration
3. Regenerate and compare again
4. Repeat until satisfied or constraints are hit

## Important Reminders

- **Choose correct FrameIt asset**: Analyze the aspect ratio of logos/icons in the original
  - Square or nearly square → use `id: 'icon'` (gets `/frameit-icon.png`)
  - Wide/rectangular → use `id: 'logo'` (gets `/frameit-logo.png`)
  - Never try to reproduce brand logos from the original image
- **Element ID determines default**: The system automatically assigns default images based on element ID
  - No need to hardcode URLs in layouts
  - Test script automatically discovers and assigns URLs
  - UI automatically loads from `public/` directory
- **Percentage-based sizing**: All positioning and sizing should use percentages for responsiveness
- **Test in BOTH places**: Verify reproduction works in test script (API) AND browser (UI)
- **Document limitations**: Note any aspects that can't be reproduced due to missing resources

## Example Output

Your response should include:

1. ✅ Image loaded and displayed
2. 📊 Comprehensive visual analysis (including aspect ratio assessment for logo/icon choice)
3. 💡 HTML/CSS flex layout proposal
4. 🎨 New layout created in layouts.ts with appropriate element ID (`logo` vs `icon`)
5. 📝 Example configuration added
6. 🖼️ Image generated via test script (API)
7. 🌐 Verification that example works in UI
8. 🔍 Side-by-side comparison (original vs reproduction)
9. 📈 Recommendations (if needed)

## System Architecture Notes

**How Default Images Work:**

1. **Layout Definition** (`src/lib/constants/layouts.ts`):
   - Defines image elements with IDs like `{ id: 'logo', type: 'image', ... }`
   - Element ID determines which default asset is used

2. **UI** (`src/components/ThumbnailGenerator.tsx`):
   - `getDefaultImageUrl(elementId)` returns `/frameit-logo.png` or `/frameit-icon.png`
   - Vite serves these from `public/` directory
   - Browser loads via normal HTTP

3. **Test Script** (`test-og-examples.ts`):
   - Spins up static server on port 3001
   - Reads layout definition to discover image elements
   - Assigns URLs like `http://localhost:3001/frameit-icon.png`
   - API fetches images via HTTP (same as production)

4. **Production** (Vercel):
   - `public/` files served by CDN
   - API fetches from `https://frameit.dev/frameit-logo.png`
   - Identical behavior to test script
