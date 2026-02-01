import { NextResponse } from 'next/server';

const getBackendUrl = () => {
    return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1').replace(/\/$/, '');
};

export async function GET(req: Request) {
    const url = new URL(req.url);
    const search = url.searchParams.toString();
    const backendUrl = getBackendUrl();
    const target = `${backendUrl}/catalog/categories${search ? `?${search}` : ''}`;

    try {
        const res = await fetch(target, {
            headers: { 'Accept': 'application/json' },
            cache: 'no-store',
        });
        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: 'Proxy fetch categories failed', error: String(error) }, { status: 500 });
    }
}
