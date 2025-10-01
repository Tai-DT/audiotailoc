import { NextRequest, NextResponse } from 'next/server';

// Get Strapi API base URL from environment or fallback to localhost
const getStrapiApiBase = () => {
  return process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:3001/api';
};

// GET /api/blog/articles - Get all blog articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();

    // Copy all search params
    for (const [key, value] of searchParams.entries()) {
      params.append(key, value);
    }

    const strapiUrl = `${getStrapiApiBase()}/blog/articles?${params.toString()}`;

    const response = await fetch(strapiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Dashboard API returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog articles' },
      { status: 500 }
    );
  }
}