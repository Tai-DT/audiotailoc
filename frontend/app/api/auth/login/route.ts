import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  if (!email || !password) return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return NextResponse.json({ error: 'Missing NEXT_PUBLIC_API_BASE_URL' }, { status: 500 });
  const res = await fetch(`${base}/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
  if (!res.ok) return NextResponse.json({ error: 'Đăng nhập thất bại' }, { status: 401 });
  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  const resp = NextResponse.json({ ok: true });
  const isProd = process.env.NODE_ENV === 'production';
  resp.cookies.set('atl_access', data.accessToken, { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 60 * 15 });
  resp.cookies.set('atl_refresh', data.refreshToken, { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return resp;
}

