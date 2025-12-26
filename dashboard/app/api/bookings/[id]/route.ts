import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await apiClient.get(`/bookings/${id}`);
    return NextResponse.json(booking);
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
    // Backend uses PATCH for updates, not PUT
    const updatedBooking = await apiClient.patch(`/bookings/${id}`, body);
    return NextResponse.json(updatedBooking);
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
    await apiClient.delete(`/bookings/${id}`);
    return NextResponse.json({ message: 'Booking deleted successfully' });
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