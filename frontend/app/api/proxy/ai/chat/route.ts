import { NextResponse } from 'next/server';

const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1').replace(/\/$/, '');

export async function POST(req: Request) {
  const target = `${BACKEND_BASE}/ai/chat`;
  try {
    const body = await req.json();
    const res = await fetch(target, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    
    const contentType = res.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await res.json().catch(() => ({}));
    } else {
      const text = await res.text().catch(() => 'No response body');
      console.warn('Backend returned non-JSON response:', text);
      data = { 
        success: false, 
        message: 'Backend returned non-JSON response', 
        detail: text,
        statusCode: res.status
      };
    }
    
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    console.error('Proxy AI Chat Route Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Proxy connection to backend failed', 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
