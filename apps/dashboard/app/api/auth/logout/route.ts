import { NextResponse } from 'next/server';

export async function POST() {
  const resp = NextResponse.json({ ok: true });
  ['accessToken', 'refreshToken'].forEach((name) => {
    resp.cookies.set(name, '', { path: '/', httpOnly: true, maxAge: 0 });
  });
  return resp;
}

