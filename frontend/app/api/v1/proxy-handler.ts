import { NextResponse } from 'next/server';

const getBackendUrl = () => {
    return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1').replace(/\/$/, '');
};

async function proxyRequest(req: Request, method: string) {
    const url = new URL(req.url);
    const path = url.pathname.replace('/api/v1', '');
    const search = url.searchParams.toString();
    const target = `${getBackendUrl()}${path}${search ? `?${search}` : ''}`;

    try {
        let options: RequestInit = {
            method,
            headers: {
                'Accept': 'application/json',
                'Authorization': req.headers.get('Authorization') || '',
            },
            cache: 'no-store',
        };

        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            const contentType = req.headers.get('content-type') || 'application/json';
            options.headers = {
                ...options.headers,
                'Content-Type': contentType,
            };

            if (contentType.includes('application/json')) {
                const body = await req.json().catch(() => null);
                if (body) {
                    options.body = JSON.stringify(body);
                }
            } else {
                // Handle multipart/form-data or other types if needed, 
                // but for now most API calls we care about are JSON
                options.body = await req.blob();
            }
        }

        const res = await fetch(target, options);

        // For binary responses (like images)
        const contentType = res.headers.get('content-type');
        if (contentType && (contentType.includes('image/') || contentType.includes('application/pdf'))) {
            const blob = await res.blob();
            return new NextResponse(blob, {
                status: res.status,
                headers: { 'Content-Type': contentType }
            });
        }

        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: `Proxy ${method} ${path} failed`, error: String(error) }, { status: 500 });
    }
}

export async function GET(req: Request) { return proxyRequest(req, 'GET'); }
export async function POST(req: Request) { return proxyRequest(req, 'POST'); }
export async function PUT(req: Request) { return proxyRequest(req, 'PUT'); }
export async function PATCH(req: Request) { return proxyRequest(req, 'PATCH'); }
export async function DELETE(req: Request) { return proxyRequest(req, 'DELETE'); }
