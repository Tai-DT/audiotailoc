import { NextResponse } from 'next/server';

const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1').replace(/\/$/, '');

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.toString();
  const target = `${BACKEND_BASE}/support/kb/articles${search ? `?${search}` : ''}`;
  try {
    const res = await fetch(target, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: 'Proxy fetch knowledge base failed', error: message }, { status: 500 });
  }
}
