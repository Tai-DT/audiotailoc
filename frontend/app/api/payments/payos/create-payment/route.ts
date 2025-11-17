import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to backend API (use /api/v1 prefix)
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Ensure we don't accidentally double-prefix /api/v1 if NEXT_PUBLIC_API_URL already contains it
    const target = base.endsWith('/api/v1') ? `${base}/payments/payos/create-payment` : `${base}/api/v1/payments/payos/create-payment`;

    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to create payment' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('PayOS create payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}