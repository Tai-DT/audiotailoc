import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const { sessionId } = (await req.json()) as { sessionId: string };
  const res = await fetch(`${base}/ai/escalate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status, headers: { 'content-type': 'application/json' } });
}


