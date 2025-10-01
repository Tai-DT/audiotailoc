# DNS Coexistence Decision Guide

Strategy: Temporary coexistence (Squarespace + Vercel) for root domain
Start Date: 2025-10-01
Target Cutoff: 2025-10-08 (7 days)

## Goals
- Preserve legacy root availability while validating new Next.js deployment
- Avoid SEO penalties (duplicate canonical, mixed content)
- Provide app namespace at `app.audiotailoc.com`

## Daily Checklist
1. dig A audiotailoc.com -> confirm only expected IPs (no unexpected)  
2. curl -I https://audiotailoc.com -> check server headers (Squarespace)  
3. curl -I https://app.audiotailoc.com -> check Vercel headers (x-vercel-id)  
4. Check Search Console (if connected) for coverage anomalies  
5. Check error rate in backend logs (orders, products)  

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Random resolution split | Users see different experiences | Canonical meta consistently points to primary app domain |
| SEO duplicate content | Ranking dilution | Add rel=canonical + robots where needed |
| Cache fragmentation | Inconsistent UX | Encourage users to use app.audiotailoc.com early |
| Email DNS modification accidental | Email disruption | Do not alter MX/SPF/DKIM records |

## Decision Triggers
Proceed to SINGLE PLATFORM (choose one) if ANY:
- 3+ days stable app traffic through `app.` with no critical errors
- SEO inspection shows duplicate risk
- Marketing wants unified analytics

Rollback to Squarespace ONLY if:
- Core checkout flows fail twice in < 24h
- Performance regression > 2x TTFB vs baseline

Rollback to Vercel ONLY path if:
- Squarespace no longer needed
- All content migrated

## Commands Reference
```
# List records
vercel dns ls audiotailoc.com --scope=kadevs-projects

# Cleanup to Vercel only
./scripts/dns/cleanup-to-vercel-only.sh

# Cleanup to Squarespace only
./scripts/dns/cleanup-to-squarespace-only.sh

# Test headers
curl -I https://audiotailoc.com
curl -I https://app.audiotailoc.com

# Resolve chain
nslookup app.audiotailoc.com
```

## Recommendation (Initial)
Run in coexistence no longer than 7 days. Prefer migrating fully to Vercel (modern stack, unified deployment, performance).

## Notes
- Remove duplicate A 198.185.159.145 later to reduce clutter.
- Ensure canonical tags on Vercel version reflect `https://app.audiotailoc.com` or future chosen root.
