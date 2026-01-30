import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-signature') || request.headers.get('payos-signature');

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

    // Forward the webhook to the real backend
    const response = await fetch(`${backendUrl}/payments/payos/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signature': signature || '',
        'payos-signature': signature || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to forward webhook to backend:', errorText);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PayOS webhook forward error:', error);
    return NextResponse.json({ success: true }); // Always success to PayOS
  }
}

export async function GET() {
  return NextResponse.json({ status: 'active' });
}
