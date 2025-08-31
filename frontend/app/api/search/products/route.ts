import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return NextResponse.json({ error: 'Missing API base' }, { status: 500 });
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const res = await fetch(`${base}/catalog/products?q=${encodeURIComponent(q)}&pageSize=50`, { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  // Unwrap items list
  return NextResponse.json({ items: data.items || [] }, { status: res.status });
}

