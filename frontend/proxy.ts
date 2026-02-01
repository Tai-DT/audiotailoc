import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Next.js proxy handler for route protection and redirection.

const protectedRoutes = [
  '/profile',
  '/orders',
  '/wishlist',
  '/booking-history',
  '/payment-history',
  '/service-orders',
  '/customer-admin',
]

const adminRoutes = ['/admin']

const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']

export function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Handle malformed requests like `/[` (observed from some embedded browsers/tools)
    // Redirect to home to avoid noisy 404s.
    if (pathname === '/[') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.search = ''
      return NextResponse.redirect(url, 308)
    }

    const tokenCookie = request.cookies.get('audiotailoc_token')
    const authHeader = request.headers.get('Authorization')
    const token = tokenCookie?.value || (authHeader ? authHeader.replace('Bearer ', '') : undefined)

    const userCookie = request.cookies.get('audiotailoc_user')
    let user: { role?: string } | null = null
    if (userCookie?.value) {
      try {
        // Decode URI component if it was encoded
        const decodedValue = decodeURIComponent(userCookie.value)
        user = JSON.parse(decodedValue)
      } catch {
        user = null
      }
    }

    const isAuthenticated = !!token
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'MODERATOR'

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Intentionally avoid logging on every request to prevent noisy dev output.

    if (isProtectedRoute && !isAuthenticated) {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    if (isAdminRoute && !isAuthenticated) {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('redirect', pathname)
      url.searchParams.set('requireAdmin', 'true')
      return NextResponse.redirect(url)
    }

    if (isAdminRoute && isAuthenticated && !isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (isAuthRoute && isAuthenticated) {
      const redirectTo = request.nextUrl.searchParams.get('redirect') || '/'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
