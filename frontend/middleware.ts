import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/orders',
  '/wishlist',
  '/booking-history',
  '/payment-history',
  '/service-orders',
  '/customer-admin',
];

// Admin-only routes
const adminRoutes = [
  '/admin',
];

// Public routes that authenticated users shouldn't access
const authRoutes = [
  '/login',
  '/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookie or Authorization header
  const tokenCookie = request.cookies.get('audiotailoc_token');
  const authHeader = request.headers.get('Authorization');
  const token = tokenCookie?.value || (authHeader ? authHeader.replace('Bearer ', '') : undefined);
  
  // Get user data from cookie if available
  const userCookie = request.cookies.get('audiotailoc_user');
  let user: { role?: string } | null = null;
  
  if (userCookie?.value) {
    try {
      user = JSON.parse(userCookie.value);
    } catch (error) {
      // Invalid user cookie, continue without user data
      console.error('Failed to parse user cookie:', error);
      user = null;
    }
  }
  
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Redirect unauthenticated users from admin routes to login
  if (isAdminRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    url.searchParams.set('requireAdmin', 'true');
    return NextResponse.redirect(url);
  }
  
  // Redirect non-admin users from admin routes to home
  if (isAdminRoute && isAuthenticated && !isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Redirect authenticated users from auth routes to home
  if (isAuthRoute && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap)
     * - robots.txt (robots)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
