import { NextRequest, NextResponse } from 'next/server';

const resolveBackendBaseUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
  return base.replace(/\/$/, ''); // Only strip trailing slash
};

const resolveAuthHeader = (request: NextRequest): string | undefined => {
  const authHeader = request.headers.get('authorization');
  if (authHeader) return authHeader;

  const token = request.cookies.get('audiotailoc_token')?.value;
  return token ? `Bearer ${token}` : undefined;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  const backendBaseUrl = resolveBackendBaseUrl();
  const pathParts = path ?? [];
  const targetPath = pathParts.length > 0 ? `/health/${pathParts.join('/')}` : '/health';
  const targetUrl = new URL(targetPath, backendBaseUrl);

  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  const authHeader = resolveAuthHeader(request);
  if (authHeader) {
    headers.Authorization = authHeader;
  }

  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey) {
    headers['X-Admin-Key'] = adminKey;
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers,
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': contentType || 'text/plain',
      },
    });
  } catch (error) {
    console.error('Health proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 502 }
    );
  }
}
