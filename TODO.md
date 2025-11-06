# FrameIt TODO & Roadmap

## High Priority - Core Value Add

### 1. API Endpoint (`/api/generate`)
Generate thumbnails programmatically via HTTP requests. Enables:
- Integration with other applications
- Automated batch processing workflows
- CI/CD pipeline integration

**Spec:**
```
GET /api/generate?title=...&subtitle=...&preset=youtube&background=dark-blue&titleColor=%23ffffff&subtitleColor=%23ffffff
```

Returns PNG image with specified configuration.

**Implementation Notes:**
- Use Cloudflare Pages Functions (serverless backend)
- Reuse existing `canvas-utils.ts` drawing functions
- Return PNG blob with appropriate headers
- Validate query parameters

### 2. Custom Background Upload
Allow users to upload their own background images instead of selecting from presets.

**Features:**
- File upload input (image only)
- Image preview before generating
- Support common formats (JPEG, PNG, WebP)
- Size/dimension validation
- CORS handling for cross-origin images

**Implementation Notes:**
- Add upload component to BackgroundSelector
- Store as data URL or temporary URL
- Handle large files gracefully
- Fallback to gradient if upload fails

### 3. Batch Generation
Generate multiple images at once with different text/settings.

**Features:**
- CSV or JSON input for multiple configurations
- Download as ZIP file
- Progress indicator during batch processing

**Implementation Notes:**
- Create batch processing UI component
- Implement file parsing (CSV/JSON)
- Use Web Workers to avoid blocking UI
- Chunk processing for large batches

## Medium Priority - Nice to Have

### 4. Template System
Save and load custom design templates for reuse.

**Features:**
- Save current settings as named template
- Load previously saved templates
- Delete templates
- Export/import templates as JSON

**Implementation Notes:**
- Extend localStorage to support multiple templates
- Add template management UI modal
- Show template list in control panel
- Consider backend sync for cross-device access (future)

### 5. More Platform Presets
Expand to cover additional social media and marketing platforms.

**Platforms to Add:**
- LinkedIn (1200×628)
- LinkedIn Post (1200×627)
- Instagram Post (1080×1080)
- Instagram Stories (1080×1920)
- Instagram Reels (1080×1920)
- Pinterest Pin (1000×1500)
- Pinterest Story (1080×1920)
- Twitch Panels (320×213, 320×320)
- Discord Banner (960×540)
- Slack Post (800×400)
- Email Header (600×200)

**Implementation Notes:**
- Add to PRESETS array in `lib/constants.ts`
- Organize by category in UI selector
- Maintain 2-column grid layout
- Test aspect ratios with various content

## Lower Priority - Advanced Features

### 6. Animation Support
Create animated GIF or MP4 output.

**Features:**
- Text animations (fade in, slide, typewriter)
- Background animations
- Logo animations
- Export as GIF or MP4

**Implementation Notes:**
- Research canvas animation libraries
- Consider ffmpeg.js for video encoding
- Start simple: fade transitions, slides
- Video encoding is computationally expensive - may require backend

### 7. Team Collaboration
Share templates and designs with team members.

**Features:**
- Share template via link
- Team workspace/project management
- Collaborative editing (stretch goal)
- Usage analytics

**Implementation Notes:**
- Requires user accounts and authentication
- Need database for storing user templates
- Consider Better Auth integration
- Define sharing permissions model

## Optional/Exploratory

### 8. Advanced Image Editing
Add filters, effects, and transformations.

**Potential Features:**
- Image filters (brightness, contrast, saturation, blur)
- Text effects (shadow, outline, gradient)
- Image cropping and positioning
- Sticker/shape overlays

**Implementation Notes:**
- Use canvas filters API
- Consider WebGL for advanced effects
- Performance optimization critical

### 9. User Accounts & Backend
Store user templates and enable cross-device sync.

**Features:**
- User registration/login (via Better Auth)
- Cloud template storage
- User preferences sync
- Usage analytics

**Implementation Notes:**
- Requires database (PostgreSQL recommended)
- User authentication flow
- API endpoints for template CRUD
- Consider cost implications for storage

### 10. Mobile App
Native iOS/Android version of FrameIt.

**Options:**
- React Native app sharing code
- Standalone native apps
- Progressive Web App (PWA) first

**Implementation Notes:**
- PWA would be fastest path to mobile
- Offline support needed
- Touch UI optimizations
- Push notifications for scheduled generation

---

## Current Status

**Completion:** ~60-70% of vision

**What's Working:**
- ✅ Core UI and canvas rendering
- ✅ 6 platform presets
- ✅ Independent text color controls
- ✅ Background selection (presets only)
- ✅ Download and clipboard copy
- ✅ Responsive design
- ✅ localStorage persistence
- ✅ Live Cloudflare Pages deployment

**What's Missing:**
- ❌ API endpoint (high priority)
- ❌ Custom background upload (high priority)
- ❌ Batch generation (high priority)
- ❌ Template system
- ❌ Additional platform presets
- ❌ Animation support
- ❌ Collaboration features
- ❌ User accounts
- ❌ Backend storage

---

## Notes for Future Development

### Performance Considerations
- Canvas rendering is GPU-accelerated but text wrapping can be slow
- Large batch operations need Web Worker implementation
- File uploads should validate dimensions early

### Browser Support
- Current: Modern browsers (Chrome, Firefox, Safari, Edge)
- Ensure Clipboard API fallback for older browsers
- Test on mobile browsers frequently

### Dependencies
Currently minimal dependencies (React, Tailwind, Vite). Keep it that way where possible.
For advanced features:
- ffmpeg.js for video encoding (large)
- Sharp or similar for image processing (optional backend)
- Better Auth for user auth (if going that route)

### Deployment Strategy
- Stay on Cloudflare Pages for frontend
- Use Cloudflare Workers for API endpoints/Pages Functions
- Consider Neon or Supabase for database if needed
- Keep infrastructure costs minimal for open source project
