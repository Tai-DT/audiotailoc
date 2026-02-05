import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011/api/v1';

// Mock software data - khi backend software module được fix, sẽ gọi API thật
let MOCK_SOFTWARE = [
  {
    id: '1',
    name: 'Driver Âm Thanh Realtek HD',
    slug: 'driver-am-thanh-realtek-hd',
    description: 'Driver chính hãng cho card âm thanh Realtek HD Audio. Hỗ trợ đầy đủ các tính năng âm thanh vòm, chống ồn và equalizer.',
    category: 'Driver',
    platform: 'Windows 10/11',
    version: '6.0.9506.1',
    priceCents: 0,
    isPaidRequired: false,
    imageUrl: null,
    downloadUrl: 'https://www.realtek.com/downloads',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Audacity',
    slug: 'audacity',
    description: 'Phần mềm chỉnh sửa âm thanh miễn phí mã nguồn mở. Hỗ trợ đa track, nhiều hiệu ứng và plugins.',
    category: 'Audio Editor',
    platform: 'Windows/Mac/Linux',
    version: '3.4.2',
    priceCents: 0,
    isPaidRequired: false,
    imageUrl: null,
    downloadUrl: 'https://www.audacityteam.org/download/',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'ASIO4ALL',
    slug: 'asio4all',
    description: 'Universal ASIO Driver cho Windows. Giảm độ trễ âm thanh khi recording và mixing.',
    category: 'Driver',
    platform: 'Windows',
    version: '2.15',
    priceCents: 0,
    isPaidRequired: false,
    imageUrl: null,
    downloadUrl: 'https://www.asio4all.org/',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    // Filter active software
    const data = MOCK_SOFTWARE.filter(s => s.isActive).slice(0, limit);

    return NextResponse.json({
      items: data,
      total: data.length,
      page,
      limit,
    });
  } catch (error) {
    console.error('Software API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch software', items: [], total: 0 },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSoftware = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_SOFTWARE.push(newSoftware);
    
    return NextResponse.json(newSoftware, { status: 201 });
  } catch (error) {
    console.error('Software create error:', error);
    return NextResponse.json(
      { error: 'Failed to create software' },
      { status: 500 }
    );
  }
}
