import { NextResponse } from 'next/server';

export function GET(req: Request) {
  const url = new URL(req.url);
  url.pathname = '/sitemap.xml';
  url.search = '';
  return NextResponse.redirect(url, 308);
}
