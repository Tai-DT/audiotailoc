import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011/api/v1';
  const backendRoot = apiUrl.replace(/\/api\/v1\/?$/, '');

  let backendStatus: 'connected' | 'error' | 'disconnected' | 'unknown' = 'unknown';
  try {
    const res = await fetch(`${backendRoot}/health`, { cache: 'no-store' });
    backendStatus = res.ok ? 'connected' : 'error';
  } catch {
    backendStatus = 'disconnected';
  }

  return NextResponse.json({
    status: 'ok',
    dashboard: 'running',
    backend: backendStatus,
    apiUrl,
    timestamp: new Date().toISOString(),
  });
}
