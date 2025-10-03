import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = url.searchParams.toString();
  try {
    const res = await fetch(`${API_BASE}/support/kb/articles${search ? `?${search}` : ''}`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data.items ? data : { items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 });
  } catch (error) {
    return NextResponse.json({ items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/support/kb/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
