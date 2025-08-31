import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;
	if (!base) return NextResponse.json({ error: 'Missing API base' }, { status: 500 });
	const c = await cookies();
	const token = c.get('atl_access')?.value;
	const url = new URL(req.url);
	const query = url.searchParams.toString();
	const res = await fetch(`${base}/orders${query ? `?${query}` : ''}`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		cache: 'no-store',
	});
	const data = await res.json().catch(() => ({}));
	return NextResponse.json(data, { status: res.status });
}