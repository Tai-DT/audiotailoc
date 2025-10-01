import { NextRequest, NextResponse } from 'next/server';

// Get dashboard API base URL
const getDashboardApiBase = () => {
  // Use STRAPI environment variables if available
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL;
  if (strapiUrl) {
    return `${strapiUrl}/api`;
  }
  
  // Fallback to localhost for development
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:3001/api`;
  }
  return 'http://localhost:3001/api';
};

// GET /api/blog/categories - Get all blog categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();

    // Copy all search params
    for (const [key, value] of searchParams.entries()) {
      params.append(key, value);
    }

    const dashboardUrl = `${getDashboardApiBase()}/blog/categories?${params.toString()}`;

    const response = await fetch(dashboardUrl, {
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
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}