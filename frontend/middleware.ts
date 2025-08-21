import { NextRequest, NextResponse } from 'next/server';

const locales = ['vi', 'en'] as const;
const defaultLocale: (typeof locales)[number] = 'vi';

function getLocaleFromPathname(pathname: string): typeof locales[number] | null {
  const segment = pathname.split('/')[1];
  return locales.includes(segment as any) ? (segment as any) : null;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Ignore Next.js internals and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(?:[\w-]+)$/)
  ) {
    return NextResponse.next();
  }

  // Redirect root to default locale
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  const locale = getLocaleFromPathname(pathname);
  if (locale) {
    // Persist locale in cookie (optional)
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', locale, { path: '/' });

    // Rewrite to route without the locale segment, preserve visible URL
    const withoutLocale = pathname.replace(`/${locale}`, '') || '/';
    const url = request.nextUrl.clone();
    url.pathname = withoutLocale;
    url.search = search;
    return NextResponse.rewrite(url, { request: { headers: request.headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};



