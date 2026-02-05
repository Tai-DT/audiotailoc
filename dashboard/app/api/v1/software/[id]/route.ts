import { NextRequest, NextResponse } from 'next/server';

// Import mock data từ parent route (workaround cho development)
// Trong production sẽ gọi backend API
const getMockSoftware = () => {
  // Placeholder - sẽ được thay thế bằng database call
  return [];
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // TODO: Call backend API khi software module được fix
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/software/admin/${id}`);
    
    return NextResponse.json({
      id,
      name: 'Software Detail',
      message: 'Backend software module đang được sửa. Vui lòng sử dụng list view.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch software' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // TODO: Update mock data hoặc call backend
    return NextResponse.json({
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update software' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // TODO: Delete from mock data hoặc call backend
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete software' },
      { status: 500 }
    );
  }
}
