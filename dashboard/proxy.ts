import { NextResponse } from 'next/server'

// Minimal proxy used to prevent middleware deprecation warnings.
// Keep this file as a no-op so we don't accidentally block Next.js static assets.
// When ready to add server-side auth guards, implement named `proxy` handlers
// with route matchers and response rewriting as needed.

export function proxy() {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
