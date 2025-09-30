import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BACKEND_URL = 'http://localhost:3010/api/v1';

const resolveBackendBaseUrl = (): string => {
  const candidates = [
    process.env.BACKEND_API_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NEXT_PUBLIC_API_URL,
  ];

  for (const value of candidates) {
    if (!value) continue;
    const trimmed = value.trim();
    if (trimmed.startsWith('http')) {
      return trimmed.replace(/\/$/, '');
    }
  }

  return DEFAULT_BACKEND_URL;
};

export async function GET(request: NextRequest) {
  const backendBaseUrl = resolveBackendBaseUrl();
  // Use a relative path here (no leading slash). If we pass an absolute
  // path (starting with '/'), the URL constructor will replace the entire
  // pathname and drop any base path like '/api/v1'. Using 'catalog/products'
  // preserves the base path stored in `backendBaseUrl`.
  const targetUrl = new URL('catalog/products', `${backendBaseUrl}/`);

  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch products', data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to proxy products request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal error proxying products request' },
      { status: 500 }
    );
  }
}
