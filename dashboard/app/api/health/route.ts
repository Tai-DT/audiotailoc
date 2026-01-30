import { NextResponse } from 'next/server';

export async function GET() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

    let backendStatus = 'unknown';
    try {
        const res = await fetch(`${backendUrl.replace('/api/v1', '')}/health`, {
            cache: 'no-store',
        });
        if (res.ok) {
            backendStatus = 'connected';
        } else {
            backendStatus = 'error';
        }
    } catch {
        backendStatus = 'disconnected';
    }

    return NextResponse.json({
        status: 'ok',
        dashboard: 'running',
        backend: backendStatus,
        apiUrl: backendUrl,
        timestamp: new Date().toISOString(),
    });
}
