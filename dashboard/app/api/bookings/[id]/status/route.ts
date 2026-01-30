import { NextRequest, NextResponse } from 'next/server';

// Standardized: Use NEXT_PUBLIC_API_URL (includes /api/v1)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || 'application/json';
    const bodyText = await request.text();

    const backendUrl = `${API_BASE_URL}/bookings/${id}/status`;
    console.log('Proxying status update to backend:', backendUrl);

    // Prepare headers with authentication
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };

    // Pass along browser's authorization if present
    const auth = request.headers.get('Authorization');
    if (auth) headers['Authorization'] = auth;

    // Add admin key from environment
    const adminKey = process.env.ADMIN_API_KEY;
    if (adminKey) headers['X-Admin-Key'] = adminKey;

    // Backend uses PATCH, not PUT
    const response = await fetch(backendUrl, {
      method: 'PATCH',
      headers,
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