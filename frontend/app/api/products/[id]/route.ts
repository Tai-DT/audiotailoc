import { NextRequest, NextResponse } from 'next/server';

interface ProductSpecifications {
  [key: string]: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  specifications: ProductSpecifications;
  images: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
    
    // Attempt to fetch from backend by ID first, then by slug if it fails
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const endpoint = isUUID ? `${backendUrl}/catalog/products/${id}` : `${backendUrl}/catalog/products/slug/${id}`;
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
        if (response.status === 404 && isUUID) {
            // If it was a UUID attempt and failed, try as slug just in case
            const slugResponse = await fetch(`${backendUrl}/catalog/products/slug/${id}`);
            if (slugResponse.ok) {
                const data = await slugResponse.json();
                return NextResponse.json(data);
            }
        }
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching product from backend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
