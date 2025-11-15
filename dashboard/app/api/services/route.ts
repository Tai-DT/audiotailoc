import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3010'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = new URLSearchParams()
    for (const [k, v] of searchParams.entries()) {
      if (v) query.append(k, v)
    }

    const backendUrl = `${BACKEND_URL}/api/v1/services${query.toString() ? `?${query.toString()}` : ''}`

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    // Forward Authorization header if present
    const auth = request.headers.get('Authorization')
    if (auth) headers['Authorization'] = auth

    // Forward admin key from env if present
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || process.env.ADMIN_API_KEY
    if (adminKey) headers['X-Admin-Key'] = adminKey

    const response = await fetch(backendUrl, { headers })
    const data = await response.text()

    return NextResponse.json(JSON.parse(data || '{}'), { status: response.status })
  } catch (error) {
    console.error('Error proxying services:', error)
    return NextResponse.json({ error: 'Failed to fetch services from backend' }, { status: 500 })
  }
}
