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

export async function POST(request: NextRequest) {
  const backendBaseUrl = resolveBackendBaseUrl();
  // Use relative path without leading slash to preserve base path
  const targetUrl = new URL('orders', `${backendBaseUrl}/`);

  try {
    const body = await request.json();

    const response = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Pass public order API key configured in environment to backend
        ...(process.env.PUBLIC_ORDER_API_KEY ? { 'x-order-key': process.env.PUBLIC_ORDER_API_KEY } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to create order', data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to proxy order creation:', error);
    return NextResponse.json(
      { success: false, message: 'Internal error proxying order creation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const backendBaseUrl = resolveBackendBaseUrl();
  const orderId = request.nextUrl.searchParams.get('id');

  // Use relative path without leading slash to preserve base path
  const path = orderId ? `orders/${orderId}` : 'orders';
  const targetUrl = new URL(path, `${backendBaseUrl}/`);

  if (!orderId) {
    request.nextUrl.searchParams.forEach((value, key) => {
      if (key !== 'id') {
        targetUrl.searchParams.set(key, value);
      }
    });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        ...(process.env.PUBLIC_ORDER_API_KEY ? { 'x-order-key': process.env.PUBLIC_ORDER_API_KEY } : {}),
      },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch orders', data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to proxy orders request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal error proxying orders request' },
      { status: 500 }
    );
  }
}
