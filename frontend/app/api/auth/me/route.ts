import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return NextResponse.json({ error: 'Missing API base' }, { status: 500 });
  const c = await cookies();
  const access = c.get('atl_access')?.value;
  if (!access) return NextResponse.json({ user: null }, { status: 200 });
  const res = await fetch(`${base}/auth/me`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: 'no-store',
  });
  if (!res.ok) return NextResponse.json({ user: null }, { status: 200 });
  const data = (await res.json()) as any;
  return NextResponse.json(data);
}

