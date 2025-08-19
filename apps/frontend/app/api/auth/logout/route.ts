import { NextResponse } from 'next/server';

export async function POST() {
  const resp = NextResponse.json({ ok: true });
  resp.cookies.set('atl_access', '', { httpOnly: true, path: '/', maxAge: 0 });
  resp.cookies.set('atl_refresh', '', { httpOnly: true, path: '/', maxAge: 0 });
  return resp;
}

