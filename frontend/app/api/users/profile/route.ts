import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;
	if (!base) return NextResponse.json({ error: 'Missing API base' }, { status: 500 });
	const c = await cookies();
	const token = c.get('atl_access')?.value;
	if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const res = await fetch(`${base}/users/profile`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
	const data = await res.json().catch(() => ({}));
	return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;
	if (!base) return NextResponse.json({ error: 'Missing API base' }, { status: 500 });
	const c = await cookies();
	const token = c.get('atl_access')?.value;
	if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const body = await req.text();
	const res = await fetch(`${base}/users/profile`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body });
	const data = await res.json().catch(() => ({}));
	return NextResponse.json(data, { status: res.status });
}