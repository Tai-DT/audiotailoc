import { NextResponse } from 'next/server';

const getBackendUrl = () => {
    return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1').replace(/\/$/, '');
};

export async function POST(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname.replace('/api/v1', '');
    const target = `${getBackendUrl()}${path}`;

    try {
        const body = await req.json();
        const res = await fetch(target, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': req.headers.get('Authorization') || '',
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        });
        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: 'Proxy login failed', error: String(error) }, { status: 500 });
    }
}
