# Canonical & Metadata Configuration

This project now supports a configurable canonical base URL via environment variable.

## Environment Variable

`NEXT_PUBLIC_CANONICAL_BASE_URL` – Set this to the primary domain you want search engines to treat as canonical.

Fallback: `https://audiotailoc.com` if not set.

## How It Works
- `app/layout.tsx` reads the variable and sets `metadataBase` and `alternates.canonical`.
- OpenGraph `url` also reflects the same base.
- Utility `lib/canonical.ts` exports `buildCanonical()` to construct per‑page canonicals if needed.

## Usage Example
```ts
import { buildCanonical } from "@/lib/canonical";

const canonical = buildCanonical("/products/abc", { stripParams: true });
```

## Migration Strategy
During coexistence (Squarespace + Vercel):
1. Keep canonical pointing to the domain you intend to be authoritative long-term.
2. After cutover, update env variable and redeploy.
3. (Optional) Add 301 redirects from legacy host to canonical host.

## Adding Page-Level Canonical (Optional)
You can add a `generateMetadata` function in a route to override.
```ts
export function generateMetadata({ params }): Metadata {
  return {
    alternates: { canonical: buildCanonical(`/products/${params.slug}`) }
  };
}
```

## Tracking Parameter Stripping
`buildCanonical` can remove UTM and tracking params when `stripParams: true`.

## Checklist Before Go-Live
- [ ] Set `NEXT_PUBLIC_CANONICAL_BASE_URL` in Vercel project env vars (Production + Preview if desired)
- [ ] Verify `<link rel="canonical">` in page source
- [ ] Test with `curl -s https://domain | grep canonical`
- [ ] Request recrawl in Search Console after major switch

## Future Enhancements
- Dynamic sitemap canonical alignment
- Automatic hreflang support if multi-language introduced
