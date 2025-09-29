import { NextRequest, NextResponse } from 'next/server';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Mock cart storage - in a real app, this would be a database or session
let cartItems: CartItem[] = [];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      },
      message: 'Cart retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Mock product data - in a real app, this would come from the products API
    const mockProducts: Record<string, Product> = {
      '1': { id: '1', name: 'Loa Bluetooth Sony SRS-XB13', price: 1200000, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
      '2': { id: '2', name: 'Microphone AKG C214', price: 8500000, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
      '3': { id: '3', name: 'Mixer Yamaha MG10XU', price: 6500000, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400' },
      '4': { id: '4', name: 'Amplifier Crown XLi 800', price: 12000000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }
    };

    const product = mockProducts[productId];
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);

    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({
        ...product,
        quantity
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      },
      message: 'Item added to cart successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    cartItems = cartItems.filter(item => item.id !== productId);

    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      },
      message: 'Item removed from cart successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
