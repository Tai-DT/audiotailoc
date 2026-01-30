import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json(
      { error: 'Both from and to parameters are required (format: lat,lng)' },
      { status: 400 }
    );
  }

  try {
    const backendUrl = `${API_BASE_URL}/maps/directions?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
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
