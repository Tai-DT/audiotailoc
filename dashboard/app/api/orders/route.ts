import { NextRequest, NextResponse } from 'next/server'

// Standardized: Use NEXT_PUBLIC_API_URL (includes /api/v1)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = new URLSearchParams()
    for (const [k, v] of searchParams.entries()) {
      if (v) query.append(k, v)
    }

    const backendUrl = `${API_BASE_URL}/orders${query.toString() ? `?${query.toString()}` : ''}`

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    // Forward Authorization header if present
    const auth = request.headers.get('Authorization')
    if (auth) headers['Authorization'] = auth

    // SECURITY: Prefer server-side only ADMIN_API_KEY over NEXT_PUBLIC_* to avoid exposing in client bundle
    // Forward admin key from env if present
    const adminKey = process.env.ADMIN_API_KEY
    if (adminKey) headers['X-Admin-Key'] = adminKey

    const response = await fetch(backendUrl, { headers })
    const data = await response.text()

    return NextResponse.json(JSON.parse(data || '{}'), { status: response.status })
  } catch (error) {
    console.error('Error proxying orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders from backend' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backendUrl = `${API_BASE_URL}/orders`

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const auth = request.headers.get('Authorization')
    if (auth) headers['Authorization'] = auth

    const adminKey = process.env.ADMIN_API_KEY
    if (adminKey) headers['X-Admin-Key'] = adminKey

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    const data = await response.text()
    return NextResponse.json(JSON.parse(data || '{}'), { status: response.status })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}




