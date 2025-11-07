# FrameIt Pricing Strategy

## Overview

FrameIt uses a freemium model with a very generous anonymous tier to maximize adoption, then converts users to paid tiers through API access, batch processing, and custom platform support.

## Storage Cost Analysis

### Image Size Estimates
- **1-2 megapixels** at typical PNG compression: ~200-500 KB per image
- **Average: 300 KB per image**

### Cost per Tier (Cloudflare R2 at $0.015/GB/month)

| Tier | Storage Usage | Monthly Cost per User |
|------|---------------|----------------------|
| Free Account | 100 images × 300 KB = 30 MB | $0.00045 (~0.05¢) |
| Pro (30 days) | 300 images × 300 KB = 90 MB | $0.00135 (~0.14¢) |
| Pro (1 year) | 3,650 images × 300 KB = 1.1 GB | $0.0165 (~1.6¢) |

**Conclusion:** Storage is essentially free. Even with 10,000 free users, storage costs only ~$5/month.

---

## Tier Structure

### Anonymous Tier (No Login Required)
**Goal: Zero friction for casual users, maximum adoption**

**Included:**
- ✅ Unlimited manual downloads via UI
- ✅ All 6 platform presets (YouTube, YouTube Shorts, Twitter/X, TikTok, Square, Custom)
- ✅ All backgrounds and customization options
- ✅ Copy to clipboard
- ✅ No watermark
- ✅ Saved layouts (unlimited)

**Not Included:**
- ❌ No API access
- ❌ No image history/retention
- ❌ No custom platform definitions
- ❌ No batch processing

**Cost per user:** $0

---

### Free Account (Sign Up Required, $0/month)
**Goal: Convert anonymous users, enable API experimentation**

**Everything in Anonymous, plus:**
- ✅ **API access** (100 requests/month)
- ✅ **Image history** (last 100 images, 30 days retention)

**Not Included:**
- ❌ No custom platform definitions
- ❌ No batch processing

**Cost per user:** ~$0.0005/month (0.05 cents)

---

### Pro Tier ($9/month or $90/year)
**Target: Content creators, agencies, small businesses**

**Everything in Free Account, plus:**
- ✅ **API access** (10,000 requests/month)
- ✅ **Custom platform definitions** (define your own dimensions/aspect ratios)
- ✅ **Batch upload** (CSV/JSON → 100 images per batch)
- ✅ **Image history** (1 year retention, unlimited images)
- ✅ Priority support

**Cost per user:** ~$0.02/month (2 cents)
**Margin:** 99.8%

---

### Business Tier ($49/month)
**Target: Agencies, SaaS companies, high-volume automation**

**Everything in Pro, plus:**
- ✅ **API access** (100,000 requests/month)
- ✅ **Unlimited batch uploads** (no size limit per batch)
- ✅ **Webhook callbacks** (async notifications when batch completes)
- ✅ **Team access** (5 seats)
- ✅ **99.9% uptime SLA**

**Cost per user:** ~$0.07/month (7 cents)
**Margin:** 99.9%

---

### Enterprise (Custom Pricing)
**Target: Large agencies, platforms embedding FrameIt**

**Just a "Contact Us" button** → Custom pricing, custom solutions

Potential features:
- Unlimited API requests
- White-label deployment (their domain)
- Custom integrations
- Dedicated support
- Custom contract/invoicing

---

## Key Monetization Levers (Ranked)

### 1. API Access (Primary monetization)
- **Anonymous:** No API
- **Free Account:** 100 requests/month (experimentation)
- **Pro:** 10,000 requests/month (real usage)
- **Business:** 100,000 requests/month (automation)
- **Overage pricing:** $1 per 1,000 additional requests

**Why it works:** APIs enable automation, integration, and scale. SaaS companies and agencies will pay for this.

### 2. Custom Platform Definitions (Pro+)
- **Anonymous/Free:** 6 built-in presets only
- **Pro+:** Define custom dimensions and aspect ratios

**Why it works:** Professionals need custom sizes for specific platforms, clients, or use cases.

### 3. Batch Processing (Pro+)
- **Anonymous/Free:** Manual one-by-one only
- **Pro:** 100 images per batch
- **Business:** Unlimited batch size

**Implementation:**
- UI: CSV upload with columns `title,subtitle,platform,background`
- API: `POST /api/batch` with JSON array
- Return: ZIP file or webhook callback

**Why it works:** Huge time-saver for agencies generating 50+ thumbnails per week.

### 4. Image History (Retention feature)
- **Anonymous:** Download immediately or lose it
- **Free Account:** Last 100 images, 30 days retention
- **Pro/Business:** Unlimited images, 1 year retention

**Why it works:** Safety net for "I forgot to download that" moments. Not a primary purchase driver, but nice-to-have.

### 5. Team Access (Business+)
- **Business:** 5 seats included
- **Additional seats:** $9/month each

**Why it works:** Agencies need collaboration. Once multiple people use it, switching costs skyrocket.

---

## Pricing Psychology

### Why Anonymous Tier is So Generous
1. **Viral growth:** "I made 500 thumbnails for free!" → word-of-mouth
2. **No friction:** No signup wall → maximum adoption
3. **Guilt conversion:** After heavy usage, users feel compelled to support
4. **SEO:** High traffic → better search rankings

### Why Free Account Conversion Works
Signing up gets you:
- **API access** (automation potential)
- **Image history** (peace of mind)

Cost to us: ~0.05 cents per user. Worth it for engagement.

### Why Pro Tier is $9/month
- 2 coffees worth of value
- "I make money from content, this pays for itself"
- API unlocks powerful integrations (Zapier, Make, etc.)
- Custom platforms unlock professional workflows

### Why Business Tier is $49/month
- Nothing to an agency billing $5k+/month
- Saves 5+ hours of designer time per month
- Batch processing alone is worth $50/month
- Could charge $99/month and still be a steal

---

## Anti-Patterns to Avoid

❌ **Don't paywall basic UI features**
- No download limits per month (feels cheap)
- No watermarks on free tier (frustrating)
- No limiting platform presets (confusing)

✅ **Paywall automation and scale**
- API = automation = paid
- Batch = scale = paid
- Custom platforms = professional workflows = paid

---

## Revenue Projections

### Conservative Scenario (Year 1)
- **50,000 anonymous users** → $0 revenue, $0 cost
- **10,000 free accounts** → $0 revenue, $5/month cost
- **300 Pro users** ($9/mo) → $2,700/month revenue
- **30 Business users** ($49/mo) → $1,470/month revenue

**Monthly Revenue:** $4,170
**Monthly Cost:** $13 (hosting) + $125 (Stripe 3% fees) = $138
**Net Monthly Profit:** $4,032

**Annual Run Rate:** ~$48,400

### Optimistic Scenario (Year 2)
- **200,000 anonymous users**
- **40,000 free accounts** → $20/month cost
- **1,000 Pro users** → $9,000/month revenue
- **100 Business users** → $4,900/month revenue

**Monthly Revenue:** $13,900
**Monthly Cost:** $437 (hosting + Stripe fees)
**Net Monthly Profit:** $13,463

**Annual Run Rate:** ~$161,500

---

## Implementation Roadmap

### Phase 1: Authentication & Basic API (2-3 weeks)
1. Add Clerk authentication
2. Implement tier detection (anonymous/free/pro/business)
3. Create `/functions/api/generate.ts` endpoint
4. Add rate limiting by tier
5. Basic API key management

### Phase 2: Billing (1 week)
1. Add Stripe integration
2. Create checkout flow for Pro/Business
3. Implement usage tracking
4. Build simple account dashboard

### Phase 3: Image History (1 week)
1. Auto-save generations to Cloudflare R2
2. Implement retention policies per tier
3. Build history UI panel
4. Add "load from history" feature

### Phase 4: Batch Processing (2 weeks)
1. CSV upload parser
2. Batch API endpoint (`POST /api/batch`)
3. ZIP file generation
4. Webhook callback system (Business tier)

### Phase 5: Custom Platforms (1 week)
1. UI for defining custom dimensions
2. Save custom platforms to database
3. Show custom platforms in platform selector
4. Limit to Pro+ tiers

---

## Competitive Positioning

### vs. Canva ($12.99/month)
- ✅ More generous free tier (no login required)
- ✅ API access (Canva doesn't have this)
- ✅ Batch processing
- ✅ Cheaper ($9 vs $12.99)

### vs. Figma ($12/month)
- ✅ Purpose-built for thumbnails (faster workflow)
- ✅ No learning curve
- ✅ API access

### vs. Custom Designers ($50-200 per thumbnail)
- ✅ Instant generation
- ✅ Unlimited iterations
- ✅ Batch processing for agencies

**Value Prop:** "The fastest way to create professional thumbnails, with an API."

---

## Key Metrics to Track

1. **Conversion rates:**
   - Anonymous → Free Account
   - Free Account → Pro
   - Pro → Business

2. **Usage patterns:**
   - Average images per user per month
   - API usage distribution
   - Batch processing frequency

3. **Retention:**
   - Monthly churn rate
   - Lifetime value (LTV)
   - Payback period

4. **Costs:**
   - Cloudflare R2 storage growth
   - API request costs
   - Support ticket volume

---

## Notes

- **Layouts** are a core product feature available to everyone (anonymous+)
- **Templates** are not yet implemented but may be a future feature
- Storage costs are negligible even at scale
- API is the primary monetization lever
- Keep anonymous tier generous to maximize viral growth
