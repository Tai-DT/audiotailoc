import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

// Helper function to handle API responses
function handleApiResponse(response: Response) {
  return response.json().then(data => {
    if (response.ok) {
      // Backend returns { success: true, data: { data: [...], meta: {...} } }
      // We need to return { items: [...], total: number, page: number, pageSize: number }
      if (data.data && data.data.data && data.data.meta) {
        return NextResponse.json({
          items: data.data.data,
          total: data.data.meta.total,
          page: data.data.meta.page,
          pageSize: data.data.meta.limit,
        });
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

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const apiUrl = `${API_BASE_URL}/projects${queryString ? `?${queryString}` : ''}`;

    console.log('Projects API request:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', status: 500 },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create project (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Admin-Key': 'dev-admin-key-2024',
      },
      body: JSON.stringify(body),
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Create project API error:', error);
    return NextResponse.json(
      { error: 'Failed to create project', status: 500 },
      { status: 500 }
    );
  }
}
