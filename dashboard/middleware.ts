import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Auth pages that should not have the main layout
  const authPages = ['/login', '/forgot-password', '/reset-password'];
  
  if (authPages.includes(pathname)) {
    // For auth pages, we'll handle them specially
    return NextResponse.next();
  }
  
  // For all other pages, continue with normal processing
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

