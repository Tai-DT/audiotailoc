import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/ai/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message: String(body?.message || '') }),
    cache: 'no-store',
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status, headers: { 'content-type': 'application/json' } });
}


