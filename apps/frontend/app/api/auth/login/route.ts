import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return NextResponse.json({ error: 'Missing API base' }, { status: 500 });
  const body = (await req.json()) as { email: string; password: string };
  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'Sai email hoặc mật khẩu' }, { status: 401 });
  }
  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  const resp = NextResponse.json({ ok: true });
  resp.cookies.set('atl_access', data.accessToken, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 15 });
  resp.cookies.set('atl_refresh', data.refreshToken, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return resp;
}

