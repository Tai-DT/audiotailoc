import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latlng = searchParams.get('latlng');

  if (!latlng) {
    return NextResponse.json(
      { error: 'LatLng parameter is required (format: lat,lng)' },
      { status: 400 }
    );
  }

  try {
    const backendUrl = `${API_BASE_URL}/maps/reverse?latlng=${encodeURIComponent(latlng)}`;
    const response = await fetch(backendUrl);

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from backend' },
      { status: 500 }
    );
  }
}
