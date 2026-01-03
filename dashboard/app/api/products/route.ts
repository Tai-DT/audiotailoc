import { NextRequest, NextResponse } from 'next/server'

// Standardized: Use NEXT_PUBLIC_API_URL (includes /api/v1)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1'

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    // If ID parameter is provided, validate it
    if (productId) {
      // Validate UUID format
      if (!isValidUUID(productId)) {
        return NextResponse.json(
          { 
            error: 'Invalid product ID format',
            message: 'Product ID must be a valid UUID'
          },
          { status: 400 }
        )
      }
      
      // For single product, backend might use a different endpoint
      // Check if backend has /catalog/products/:id endpoint
      // For now, we'll let backend handle it, but validate the ID first
    }
    
    const query = new URLSearchParams()
    for (const [k, v] of searchParams.entries()) {
      if (v) query.append(k, v)
    }

    // Backend uses /catalog/products, not /products
    const backendUrl = `${API_BASE_URL}/catalog/products${query.toString() ? `?${query.toString()}` : ''}`

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    // Forward Authorization header if present
    const auth = request.headers.get('Authorization')
    if (auth) headers['Authorization'] = auth

    // Forward admin key from env if present
    // SECURITY: Prefer server-side only ADMIN_API_KEY over NEXT_PUBLIC_* to avoid exposing in client bundle
    const adminKey = process.env.ADMIN_API_KEY
    if (adminKey) headers['X-Admin-Key'] = adminKey

    const response = await fetch(backendUrl, { headers })
    const data = await response.text()
    
    // If ID was provided and response is empty or doesn't contain the product, return 404
    if (productId && response.ok) {
      try {
        const parsedData = JSON.parse(data || '{}')
        // Check if it's a list response or single product response
        if (parsedData.data?.items) {
          // It's a list - check if product exists in list
          const product = parsedData.data.items.find((p: any) => p.id === productId)
          if (!product) {
            return NextResponse.json(
              { 
                error: 'Product not found',
                message: `Product with ID ${productId} does not exist`
              },
              { status: 404 }
            )
          }
          // Return single product
          return NextResponse.json({ success: true, data: product }, { status: 200 })
        } else if (parsedData.data?.id) {
          // Single product response
          if (parsedData.data.id !== productId) {
            return NextResponse.json(
              { 
                error: 'Product not found',
                message: `Product with ID ${productId} does not exist`
              },
              { status: 404 }
            )
          }
        }
      } catch (parseError) {
        // If parsing fails, return original response
      }
    }

    return NextResponse.json(JSON.parse(data || '{}'), { status: response.status })
  } catch (error) {
    console.error('Error proxying products:', error)
    return NextResponse.json({ error: 'Failed to fetch products from backend' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backendUrl = `${API_BASE_URL}/catalog/products`

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const auth = request.headers.get('Authorization')
    if (auth) headers['Authorization'] = auth

    // SECURITY: Prefer server-side only ADMIN_API_KEY over NEXT_PUBLIC_* to avoid exposing in client bundle
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
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}




