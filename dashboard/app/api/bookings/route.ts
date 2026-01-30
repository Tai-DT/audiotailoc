import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { apiClient } from '@/lib/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If ID is provided, get single booking
    if (id) {
      const booking = await apiClient.getBooking(id);
      return NextResponse.json(booking);
    }

    // Build query parameters for backend
    const params: any = {};
    const status = searchParams.get('status');
    const technicianId = searchParams.get('technicianId');
    const userId = searchParams.get('userId');
    const serviceId = searchParams.get('serviceId');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 20;
    const search = searchParams.get('search');

    if (page) params.page = page;
    if (pageSize) params.limit = pageSize; // Backend expects 'limit'
    if (status) params.status = status;
    if (technicianId) params.technicianId = technicianId;
    if (userId) params.userId = userId;
    if (serviceId) params.serviceId = serviceId; // Note: apiClient.getBookings type definition doesn't include serviceId but backend likely supports it or it was missed in type
    if (fromDate) params.startDate = fromDate;
    if (toDate) params.endDate = toDate;
    if (search) params.search = search;

    // We can use the generic request or the typed getBookings. 
    // Since getBookings might be missing some fields in its type definition (like serviceId based on my read),
    // and we want to pass everything, we can key off the type or just use standard getBookings and cast.
    // However, apiClient.getBookings builds its own query string. Let's use it if mapped correctly, or use generic get.
    // The previous implementation manually built params. Let's trust apiClient.getBookings but add the missing 'serviceId' if needed by using a direct request if getBookings falls short.
    // Looking at apiClient.getBookings (lines 908+), it supports many fields but NOT serviceId directly (it has serviceTypeId). 
    // The previous code supported serviceId. Let's fallback to generic GET to be safe and flexible.

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });

    const backendUrl = `${API_BASE_URL}/bookings${query.toString() ? `?${query.toString()}` : ''}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = request.headers.get('Authorization');
    if (auth) headers['Authorization'] = auth;
    const adminKey = process.env.ADMIN_API_KEY;
    if (adminKey) headers['X-Admin-Key'] = adminKey;

    const response = await fetch(backendUrl, { headers });
    const responseText = await response.text();

    let data: any;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      console.error('[Bookings API] Failed to parse backend response:', responseText);
      return NextResponse.json({
        error: 'Invalid response from backend',
        details: responseText.slice(0, 500)
      }, { status: 500 });
    }

    let bookings: any[] = [];
    let total = 0;
    let pageNum = 1;
    let pageSizeNum = 20;

    // Handle various response formats
    if (data.success && data.data) {
      // Wrapped format from backend: { success: true, data: ... }
      if (Array.isArray(data.data)) {
        // Backend returns { success: true, data: [...bookings...] }
        bookings = data.data;
        total = data.total || bookings.length;
        pageNum = data.page || 1;
        pageSizeNum = data.pageSize || 20;
      } else {
        // Backend returns { success: true, data: { bookings: [...], total, ... } }
        bookings = data.data.bookings || data.data.items || [];
        total = data.data.total || bookings.length;
        pageNum = data.data.page || 1;
        pageSizeNum = data.data.pageSize || 20;
      }
    } else if (data.bookings && Array.isArray(data.bookings)) {
      // Direct format with bookings property
      bookings = data.bookings;
      total = data.total || bookings.length;
      pageNum = data.page || 1;
      pageSizeNum = data.pageSize || 20;
    } else if (Array.isArray(data)) {
      // Direct array
      bookings = data;
      total = data.length;
      pageNum = 1;
      pageSizeNum = 20;
    } else if (data.data && Array.isArray(data.data)) {
      // Format: { data: [...] }
      bookings = data.data;
      total = data.total || bookings.length;
      pageNum = data.page || 1;
      pageSizeNum = data.pageSize || 20;
    }

    // Helper function to serialize date to ISO string
    const serializeDate = (dateValue: any): string | null => {
      if (!dateValue) return null;
      // Check if it's an empty object
      if (typeof dateValue === 'object' && Object.keys(dateValue).length === 0) return null;
      // If it's already a string, return it
      if (typeof dateValue === 'string') return dateValue;
      // If it's a Date object or has toISOString
      if (dateValue instanceof Date || (dateValue && typeof dateValue.toISOString === 'function')) {
        try {
          return dateValue.toISOString();
        } catch {
          return null;
        }
      }
      return null;
    };

    const transformedBookings = bookings.map((booking: any) => {
      const { users, services, technicians, ...rest } = booking;
      return {
        ...rest,
        // Serialize date fields
        scheduledAt: serializeDate(booking.scheduledAt),
        createdAt: serializeDate(booking.createdAt),
        updatedAt: serializeDate(booking.updatedAt),
        completedAt: serializeDate(booking.completedAt),
        user: users ? {
          id: users.id,
          name: users.name,
          phone: users.phone,
          address: booking.address,
        } : booking.user,
        service: services ? {
          id: services.id,
          name: services.name,
          serviceType: services.service_types ? {
            name: services.service_types.name,
          } : booking.service?.serviceType,
        } : booking.service,
        technician: technicians ? {
          id: technicians.id,
          name: technicians.name,
        } : booking.technician,
      };
    });

    return NextResponse.json({
      bookings: transformedBookings,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    }, { status: response.status });

  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    const status = error?.status || 500;
    const message = error?.message || 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.serviceId) {
      return NextResponse.json(
        { error: 'serviceId is required' },
        { status: 400 }
      );
    }

    const bookingData = {
      id: body.id || randomUUID(),
      userId: body.userId || null,
      serviceId: body.serviceId,
      technicianId: body.technicianId || null,
      status: body.status || 'PENDING',
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      scheduledTime: body.scheduledTime || null,
      notes: body.notes || null,
      estimatedCosts: body.estimatedCosts || null,
      actualCosts: body.actualCosts || null,
      updatedAt: new Date(),
    };

    const backendUrl = `${API_BASE_URL}/bookings`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = request.headers.get('Authorization');
    if (auth) headers['Authorization'] = auth;
    const adminKey = process.env.ADMIN_API_KEY;
    if (adminKey) headers['X-Admin-Key'] = adminKey;

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData),
    });

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error('Error creating booking:', error);
    const status = error?.status || 500;
    const message = error?.message || 'Failed to create booking';
    return NextResponse.json(
      { error: message, message },
      { status }
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

    // FIXED: Use apiClient.patch instead of PUT, as backend controller expects @Patch(':id')
    // See backend/src/modules/booking/booking.controller.ts: @Patch(':id') -> update
    const response = await apiClient.patch(`/bookings/${id}`, body);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error updating booking:', error);
    const status = error?.status || 500;
    const message = error?.message || 'Failed to update booking';
    return NextResponse.json(
      { error: message },
      { status }
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

    await apiClient.delete(`/bookings/${id}`);
    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    const status = error?.status || 500;
    const message = error?.message || 'Failed to delete booking';
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
