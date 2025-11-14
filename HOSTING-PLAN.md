# FrameIt Premium Hosting Architecture Plan

## Overview

This document outlines the architecture for FrameIt's premium custom domain feature, enabling customers to serve generated images from their own domains (e.g., `ogimage.customer.com`) with enterprise-grade caching and cost optimization.

## Business Model

### Pricing Tiers

Images are billed based on **unique images generated**, not requests served. All cached requests are unlimited and free.

| Tier | Price | Unique Images/Month | Serving | Custom Domain | Watermark | Cache TTL |
|------|-------|--------------------:|---------|---------------|-----------|-----------|
| **Free** | $0 | 100 | Unlimited | ❌ | ✅ Yes | 30 days |
| **Starter** | $19 | 1,000 | Unlimited | ✅ | ❌ No | 1 year |
| **Pro** | $49 | 10,000 | Unlimited | ✅ | ❌ No | Forever |
| **Enterprise** | $299 | 100,000 | Unlimited | ✅ | ❌ No | Forever |

### Value Proposition

**Example**: A blog with 100 posts using OG images
- **Unique images**: 100 (counts toward quota)
- **Total requests**: 1M+ (free, served from cache)
- **Cost**: $19/month (Starter tier)
- **Savings vs pay-per-request**: ~$1,000/month

## Architecture

### High-Level Flow

```
Customer DNS: ogimage.customer.com → CNAME → frameit.workers.dev
                                                      ↓
                                        Cloudflare Worker (edge)
                                                      ↓
                                    Domain validation + quota check
                                                      ↓
                          Cache HIT? → Return immediately (free)
                                    ↘
                                     Cache MISS → Vercel Origin (generate)
                                                      ↓
                                            Increment quota counter
                                                      ↓
                                            Cache at edge (1 year)
```

### Request Lifecycle

#### First Request (Cache MISS)
```
Browser → Cloudflare Edge (no cache)
              ↓
        Worker Executes
              ↓
        Check domain → account mapping
              ↓
        Verify account status (active/suspended)
              ↓
        Check monthly quota (uniqueImages < limit?)
              ↓
        Fetch from Vercel origin
              ↓
        Generate image (@napi-rs/canvas)
              ↓
        Increment unique image counter (KV)
              ↓
        Return with Cache-Control headers
              ↓
        Cloudflare caches at edge
              ↓
        Return to browser

Cost: ~$0.001 (Vercel function + KV write)
Latency: ~500-800ms (includes generation)
```

#### Subsequent Requests (Cache HIT)
```
Browser → Cloudflare Edge (found in cache!)
              ↓
        Return immediately

✗ Worker doesn't run
✗ Vercel never touched
✗ No quota check needed

Cost: ~$0.00000001
Latency: ~50-100ms (edge response)
```

## Technical Implementation

### 1. Cloudflare Worker

```typescript
// worker.ts
interface Env {
  DOMAINS: KVNamespace      // Custom domain → account mapping
  USAGE: KVNamespace        // Account usage tracking
}

interface Account {
  id: string
  tier: 'free' | 'starter' | 'pro' | 'enterprise'
  status: 'active' | 'suspended' | 'past_due'
  monthlyQuota: number
}

interface Usage {
  uniqueImages: number
  month: string  // "2024-01"
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const hostname = request.headers.get('host') || url.hostname

    // 1. Validate custom domain and get account
    const accountData = await env.DOMAINS.get(hostname, { type: 'json' }) as Account | null

    if (!accountData) {
      return new Response('Domain not configured', { status: 404 })
    }

    if (accountData.status !== 'active') {
      return new Response(`Account ${accountData.status}`, { status: 403 })
    }

    // 2. Check usage quota
    const usageKey = `usage:${accountData.id}:${getCurrentMonth()}`
    const usage = await env.USAGE.get(usageKey, { type: 'json' }) as Usage | null
    const currentUsage = usage?.uniqueImages || 0

    if (currentUsage >= accountData.monthlyQuota) {
      return new Response(JSON.stringify({
        error: 'Monthly quota exceeded',
        quota: accountData.monthlyQuota,
        used: currentUsage,
        message: 'Upgrade your plan for more unique images'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 3. Fetch from origin with Cloudflare cache options
    const originUrl = `https://frameit.vercel.app${url.pathname}${url.search}`
    const response = await fetch(originUrl, {
      headers: {
        'X-Frameit-Account-Id': accountData.id,
        'X-Frameit-Tier': accountData.tier,
      },
      cf: {
        cacheTtl: getTierCacheTTL(accountData.tier),
        cacheEverything: true  // Cache with query strings
      }
    })

    if (!response.ok) {
      return response
    }

    // 4. Increment unique image counter (only on cache miss)
    const newUsage: Usage = {
      uniqueImages: currentUsage + 1,
      month: getCurrentMonth()
    }
    ctx.waitUntil(env.USAGE.put(usageKey, JSON.stringify(newUsage), {
      expirationTtl: 60 * 60 * 24 * 60 // 60 days
    }))

    // 5. Return with appropriate cache headers
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...response.headers,
        'Cache-Control': getCacheControlHeader(accountData.tier),
        'CDN-Cache-Control': `public, max-age=${getTierCacheTTL(accountData.tier)}`,
        'X-Unique-Images-Used': newUsage.uniqueImages.toString(),
        'X-Monthly-Quota': accountData.monthlyQuota.toString(),
        'X-Account-Id': accountData.id,
        'X-Cache': 'MISS'
      }
    })
  }
}

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7) // "2024-01"
}

function getTierCacheTTL(tier: string): number {
  const ttls = {
    free: 2592000,      // 30 days
    starter: 31536000,  // 1 year
    pro: 31536000,      // 1 year
    enterprise: 31536000 // 1 year
  }
  return ttls[tier] || ttls.free
}

function getCacheControlHeader(tier: string): string {
  const ttl = getTierCacheTTL(tier)
  return `public, max-age=${ttl}, immutable`
}
```

### 2. Vercel API Updates

```typescript
// api/generate.ts - Add account context handling
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const accountId = req.headers['x-frameit-account-id'] as string
  const tier = req.headers['x-frameit-tier'] as string

  // Reject direct access (must come through Cloudflare Worker)
  if (!accountId) {
    return res.status(403).json({ error: 'Direct access not allowed' })
  }

  // ... existing image generation logic ...

  // Add tier-specific features
  const features = getTierFeatures(tier)

  // Add watermark for free tier
  if (features.watermark) {
    // Render "Powered by FrameIt" watermark on image
  }

  // Set cache headers
  res.setHeader('Cache-Control', `public, max-age=${features.cacheTTL}`)
  res.setHeader('CDN-Cache-Control', `public, max-age=${features.cacheTTL}`)

  // Return image
  res.status(200).send(buffer)
}

function getTierFeatures(tier: string) {
  const features = {
    free: {
      watermark: true,
      cacheTTL: 2592000,
      hourlyLimit: 100
    },
    starter: {
      watermark: false,
      cacheTTL: 31536000,
      hourlyLimit: 1000
    },
    pro: {
      watermark: false,
      cacheTTL: 31536000,
      hourlyLimit: 10000
    },
    enterprise: {
      watermark: false,
      cacheTTL: 31536000,
      hourlyLimit: 100000
    }
  }
  return features[tier] || features.free
}
```

### 3. Custom Domain Onboarding

```typescript
// api/domains/add.ts - Customer adds their domain
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { domain, accountId } = req.body

  // 1. Create custom hostname in Cloudflare for SaaS
  const cfResponse = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/custom_hostnames`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hostname: domain,
        ssl: {
          method: 'http',  // HTTP validation
          type: 'dv'       // Domain validated SSL
        }
      })
    }
  )

  const { result } = await cfResponse.json()

  // 2. Store domain → account mapping in Cloudflare KV
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/${process.env.KV_NAMESPACE_DOMAINS}/values/${domain}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: accountId,
        tier: 'pro',
        status: 'active',
        monthlyQuota: 10000,
        createdAt: new Date().toISOString()
      })
    }
  )

  // 3. Return DNS instructions to customer
  return res.json({
    success: true,
    domain,
    dnsRecords: [
      {
        type: 'CNAME',
        name: domain,
        value: 'frameit.workers.dev',
        ttl: 1
      }
    ],
    sslStatus: result.ssl.status,
    verificationToken: result.ownership_verification.name,
    message: 'Add the CNAME record to your DNS. SSL will be provisioned automatically within 24 hours.'
  })
}
```

### 4. Cache Purging API

```typescript
// api/cache/purge.ts - Allow users to regenerate images
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { accountId, imageUrl } = req.body

  // Verify account owns this domain
  // ... authentication logic ...

  // Purge from Cloudflare cache
  await fetch(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/purge_cache`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: [imageUrl]
      })
    }
  )

  // NOTE: This doesn't decrement their quota
  // Next request will regenerate and count as new unique image

  return res.json({
    success: true,
    message: 'Cache purged. Next request will regenerate the image.'
  })
}
```

## Database Schema

```sql
-- PostgreSQL schema for account management

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  tier VARCHAR(50) NOT NULL DEFAULT 'free',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  monthly_quota INTEGER NOT NULL,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  domain VARCHAR(255) UNIQUE NOT NULL,
  verification_token VARCHAR(255),
  verified_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending', -- pending, verified, suspended
  cloudflare_hostname_id VARCHAR(255),
  ssl_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- "2024-01"
  unique_images INTEGER DEFAULT 0,
  total_requests BIGINT DEFAULT 0,
  cache_hit_rate NUMERIC(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(account_id, month)
);

CREATE INDEX idx_custom_domains_domain ON custom_domains(domain);
CREATE INDEX idx_custom_domains_account ON custom_domains(account_id);
CREATE INDEX idx_usage_records_account_month ON usage_records(account_id, month);
```

## Cost Analysis

### Infrastructure Costs

**Cloudflare Workers**
- Workers: $5/month (10M requests included)
- KV Reads: $0.50 per 10M reads
- KV Writes: $5.00 per 1M writes
- Bandwidth: FREE (!)
- Custom Hostnames (for SaaS): $2/hostname/month

**Vercel**
- Function execution: ~$0.60 per 1M invocations
- Bandwidth: ~$0.12 per GB
- @napi-rs/canvas overhead: ~100ms per generation

### Example Scenario: 1,000 Customers

**Assumptions:**
- Average 100 unique images/customer/month
- Average 100K requests/customer/month (99% cache hit rate)
- 40KB average image size

**Monthly Costs:**

| Item | Calculation | Cost |
|------|-------------|------|
| **Cloudflare Workers** | 100M requests @ $5/10M | $50 |
| **KV Reads** | 100M reads @ $0.50/10M | $5 |
| **KV Writes** | 100K writes @ $5/1M | $0.50 |
| **Custom Hostnames** | 1,000 domains @ $2/domain | $2,000 |
| **Vercel Functions** | 100K generations @ $0.60/1M | $0.06 |
| **Vercel Bandwidth** | 4GB @ $0.12/GB | $0.48 |
| **TOTAL** | | **$2,056/month** |

**Revenue at $19/month per customer:** $19,000/month

**Gross Margin:** 89% ($16,944 profit)

### Cost per Customer

- Infrastructure: ~$2.06/customer/month
- Revenue: $19/customer/month
- Margin: $16.94/customer/month (89%)

### Scaling Economics

As you scale, margins improve further:
- **10K customers**: 92% margin (~$175K profit/month)
- **100K customers**: 95% margin (~$1.8M profit/month)

The economics are extremely favorable because:
1. Cache hits are essentially free
2. Most infrastructure costs are fixed
3. Cloudflare bandwidth is included
4. Customers naturally stay under quota limits

## Customer Dashboard

### Usage Display

```typescript
interface DashboardData {
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  billing: {
    monthlyQuota: 10000
    uniqueImagesGenerated: 247
    remainingQuota: 9753
    percentUsed: 2.47
  }
  performance: {
    totalRequestsServed: 1847293
    cacheHitRate: 99.98
    averageLatency: 52  // ms
  }
  savings: {
    estimatedCost: '$1,847'  // vs pay-per-request
    actualCost: '$49'
    savings: '$1,798'
  }
  domains: [
    {
      domain: 'ogimage.myblog.com'
      status: 'active'
      verified: true
      sslStatus: 'active'
      uniqueImages: 247
      requests30d: 1847293
    }
  ]
}
```

## Implementation Phases

### Phase 1: Cloudflare Setup (Week 1-2)
- [ ] Create Cloudflare Worker
- [ ] Set up KV namespaces (DOMAINS, USAGE)
- [ ] Configure cache policies
- [ ] Deploy worker to production
- [ ] Test basic caching behavior

### Phase 2: Domain Management (Week 2-3)
- [ ] Enable Cloudflare for SaaS
- [ ] Build domain onboarding API
- [ ] Implement DNS verification flow
- [ ] Create customer dashboard UI
- [ ] Add SSL status monitoring

### Phase 3: Usage Tracking (Week 3-4)
- [ ] Implement quota tracking in Worker
- [ ] Build usage analytics pipeline
- [ ] Create admin dashboard
- [ ] Set up billing webhooks (Stripe)
- [ ] Add overage alerts

### Phase 4: Monitoring & Optimization (Week 4-5)
- [ ] Set up CloudWatch/Datadog metrics
- [ ] Monitor cache hit rates
- [ ] Track generation costs
- [ ] Implement rate limiting
- [ ] Add DDoS protection rules

### Phase 5: Launch (Week 6)
- [ ] Beta test with 10 customers
- [ ] Collect feedback and iterate
- [ ] Public launch
- [ ] Marketing campaign

## Security Considerations

1. **DNS Verification**: Require CNAME verification before activation
2. **Rate Limiting**: Per-domain hourly limits to prevent abuse
3. **DDoS Protection**: Cloudflare's built-in WAF
4. **Origin Protection**: Reject direct Vercel access (require Worker headers)
5. **API Keys**: Optional API key authentication for programmatic access
6. **Audit Logging**: Track all cache purges and configuration changes

## Monitoring & Alerts

### Key Metrics

1. **Cache Hit Rate**: Target >95%
2. **P95 Latency**: <100ms (cache hits), <800ms (cache misses)
3. **Error Rate**: <0.1%
4. **Quota Utilization**: Alert at 80% usage
5. **Generation Cost**: Track per-customer COGS

### Alerts

```typescript
// Example alert thresholds
{
  cacheHitRate: { min: 95, alert: 'slack' },
  errorRate: { max: 0.1, alert: 'pagerduty' },
  quotaUtilization: { max: 80, alert: 'email' },
  generationCost: { max: 0.01, alert: 'slack' }
}
```

## Future Enhancements

1. **Edge Functions**: Move image generation to Cloudflare Workers (WebAssembly)
2. **Smart Caching**: Predictive cache warming for popular images
3. **Image Optimization**: Automatic WebP conversion, compression
4. **Analytics**: Detailed usage analytics and insights
5. **Multi-Region**: Origin failover and geo-routing
6. **Batch API**: Generate multiple images in single request
7. **Webhooks**: Notify customers of quota thresholds

## Conclusion

This architecture provides:
- ✅ **Cost-effective scaling**: 89%+ margins at all scales
- ✅ **Excellent performance**: Sub-100ms latency for cached requests
- ✅ **Simple pricing**: Charge for unique images, unlimited serving
- ✅ **Customer value**: Massive savings vs traditional solutions
- ✅ **Enterprise-ready**: Custom domains with automatic SSL
- ✅ **Developer-friendly**: Simple CNAME setup, no complex configuration

The combination of Cloudflare Workers + edge caching + Vercel Serverless Functions provides the best economics for this use case, with industry-leading performance and scalability.
