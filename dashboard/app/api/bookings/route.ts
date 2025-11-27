import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3010';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If ID is provided, get single booking
    if (id) {
      const backendUrl = `${BACKEND_URL}/api/v1/bookings/${id}`;
      console.log('Fetching single booking from backend:', backendUrl);

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Backend response not ok:', response.status, response.statusText);
        return NextResponse.json(
          { error: 'Failed to fetch booking from backend' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    // Build query parameters for backend
    const params = new URLSearchParams();
    const status = searchParams.get('status');
    const technicianId = searchParams.get('technicianId');
    const userId = searchParams.get('userId');
    const serviceId = searchParams.get('serviceId');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '20';

    params.append('page', page);
    params.append('pageSize', pageSize);

    if (status) params.append('status', status);
    if (technicianId) params.append('technicianId', technicianId);
    if (userId) params.append('userId', userId);
    if (serviceId) params.append('serviceId', serviceId);
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);

    // Forward request to backend with correct API prefix
    const backendUrl = `${BACKEND_URL}/api/v1/bookings?${params}`;
    console.log('Fetching from backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend response not ok:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch bookings from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform backend response to match dashboard expectations
    if (data.success && data.data) {
      return NextResponse.json({
        bookings: data.data.bookings || [],
        total: data.data.total || 0,
        page: data.data.page || 1,
        pageSize: data.data.pageSize || 20,
      });
    } else {
      // Fallback for unexpected response format
      return NextResponse.json({
        bookings: [],
        total: 0,
        page: 1,
        pageSize: 20,
      });
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend with correct API prefix
    const backendUrl = `${BACKEND_URL}/api/v1/bookings`;
    console.log('Creating booking via backend:', backendUrl, body);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend response not ok:', response.status, response.statusText, errorData);
      return NextResponse.json(
        { error: 'Failed to create booking', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Forward request to backend with correct API prefix
    const backendUrl = `${BACKEND_URL}/api/v1/bookings/${id}`;
    console.log('Updating booking via backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend response not ok:', response.status, response.statusText, errorData);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Forward request to backend with correct API prefix
    const backendUrl = `${BACKEND_URL}/api/v1/bookings/${id}`;
    console.log('Deleting booking via backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend response not ok:', response.status, response.statusText, errorData);
      return NextResponse.json(
        { error: 'Failed to delete booking' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}