// Utility to construct canonical URL paths consistently
// Ensures no duplicate slashes and strips tracking query params if desired

const STRIP_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"]; 

export function buildCanonical(pathname: string, opts?: { stripParams?: boolean; params?: Record<string, string | undefined | null> }) {
  const base = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL || "https://audiotailoc.com";
  const url = new URL(base);
  // Normalize pathname
  const cleanPath = ("/" + (pathname || "").replace(/^\/+/, "")).replace(/\/+$/,'');
  url.pathname = cleanPath === "/index" ? "/" : cleanPath;

  if (opts?.params) {
    Object.entries(opts.params).forEach(([k,v]) => {
      if (v != null && v !== '') url.searchParams.set(k, String(v));
    });
  }

  if (opts?.stripParams) {
    STRIP_PARAMS.forEach(p => url.searchParams.delete(p));
  }

  // If no search params left, clear ?
  if ([...url.searchParams.keys()].length === 0) {
    url.search = '';
  }

  return url.toString();
}
