import { NextRequest, NextResponse } from 'next/server'

// Standardized: Use NEXT_PUBLIC_API_URL (includes /api/v1)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backendUrl = `${API_BASE_URL}/auth/login`

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    const data = await response.text()
    
    if (!response.ok) {
      return NextResponse.json(JSON.parse(data || '{}'), { status: response.status })
    }

    const result = JSON.parse(data || '{}')
    
    // Return the response with token
    return NextResponse.json(result, { status: response.status })
  } catch (error) {
    console.error('Error proxying login:', error)
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 })
  }
}




