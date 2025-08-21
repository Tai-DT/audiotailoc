import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const body = await req.text();
  const upstream = await fetch(`${base}/ai/chat/stream`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' },
  });
}


