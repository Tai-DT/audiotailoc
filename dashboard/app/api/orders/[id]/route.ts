import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = `${API_BASE_URL}/orders/${id}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = request.headers.get('Authorization');
    if (auth) headers['Authorization'] = auth;
    const adminKey = process.env.ADMIN_API_KEY;
    if (adminKey) headers['X-Admin-Key'] = adminKey;

    const response = await fetch(backendUrl, { headers });
    const data = await response.text();
    return NextResponse.json(JSON.parse(data || '{}'), { status: response.status });
  } catch (error) {
    console.error('Error proxying order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const backendUrl = `${API_BASE_URL}/orders/${id}`;

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
    const data = await response.text();
    return NextResponse.json(JSON.parse(data || '{}'), { status: response.status });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = `${API_BASE_URL}/orders/${id}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = request.headers.get('Authorization');
    if (auth) headers['Authorization'] = auth;
    const adminKey = process.env.ADMIN_API_KEY;
    if (adminKey) headers['X-Admin-Key'] = adminKey;

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers,
    });
    const data = await response.text();
    return NextResponse.json(JSON.parse(data || '{}'), { status: response.status });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
