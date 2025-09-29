import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

// Helper function to handle API responses
function handleApiResponse(response: Response) {
  return response.json().then(data => {
    if (response.ok) {
      // Backend returns { success: true, data: [...] } for featured projects
      // We need to return the array directly
      if (data.data && Array.isArray(data.data)) {
        return NextResponse.json(data.data);
      }
      // Fallback
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.message || 'API request failed', status: response.status },
        { status: response.status }
      );
    }
  }).catch(() => {
    return NextResponse.json(
      { error: 'Invalid JSON response from API' },
      { status: 502 }
    );
  });
}

// GET /api/projects/featured - Get featured projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '6';

    const apiUrl = `${API_BASE_URL}/projects/featured?limit=${limit}`;

    console.log('Featured projects API request:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Featured projects API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured projects', status: 500 },
      { status: 500 }
    );
  }
}
