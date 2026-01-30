import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = `${API_BASE_URL}/bookings/${id}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = request.headers.get('Authorization');
    if (auth) headers['Authorization'] = auth;
    const adminKey = process.env.ADMIN_API_KEY;
    if (adminKey) headers['X-Admin-Key'] = adminKey;

    const response = await fetch(backendUrl, { headers });
    const responseText = await response.text();

    let result;
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      result = { error: responseText || 'Invalid response from backend' };
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    const status = error?.status || error?.statusCode || 500;
    const message = error?.message || 'Failed to fetch booking';
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const backendUrl = `${API_BASE_URL}/bookings/${id}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = request.headers.get('Authorization');
    if (auth) headers['Authorization'] = auth;
    const adminKey = process.env.ADMIN_API_KEY;
    if (adminKey) headers['X-Admin-Key'] = adminKey;

    const response = await fetch(backendUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    const responseText = await response.text();

    let result;
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      result = { error: responseText || 'Invalid response from backend' };
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    const status = error?.status || error?.statusCode || 500;
    const message = error?.message || 'Failed to update booking';
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = `${API_BASE_URL}/bookings/${id}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = request.headers.get('Authorization');
    if (auth) headers['Authorization'] = auth;
    const adminKey = process.env.ADMIN_API_KEY;
    if (adminKey) headers['X-Admin-Key'] = adminKey;

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers,
    });
    const responseText = await response.text();

    let result;
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      result = { error: responseText || 'Invalid response from backend' };
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    const status = error?.status || error?.statusCode || 500;
    const message = error?.message || 'Failed to delete booking';
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
