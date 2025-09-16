import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3010';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || 'application/json';
    const bodyText = await request.text();

    const backendUrl = `${BACKEND_URL.replace(/\/$/, '')}/api/v1/bookings/${id}/status`;
    console.log('Proxying PUT to backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: bodyText,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend returned error for PUT status:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to update booking status' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying PUT /api/bookings/:id/status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}