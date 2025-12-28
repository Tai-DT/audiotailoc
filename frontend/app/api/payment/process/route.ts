import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface OrderItem {
  id?: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface OrderData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  finalTotal: number;
  items: OrderItem[];
}

interface PayOSSignatureData {
  amount: number;
  cancelUrl: string;
  description: string;
  orderCode: number;
  returnUrl: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderData, paymentMethod } = body;

    // Validate required fields
    if (!orderData || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For PayOS payment
    if (paymentMethod === 'payos') {
      const paymentUrl = await createPayOSPayment(orderData);
      return NextResponse.json({
        success: true,
        paymentMethod: 'payos',
        paymentUrl,
        message: 'Redirecting to PayOS payment'
      });
    }

    // For COD payment
    if (paymentMethod === 'cod') {
      const orderResult = await processCODOrder(orderData);
      return NextResponse.json({
        success: true,
        paymentMethod: 'cod',
        orderId: orderResult.orderId,
        message: 'COD order created successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid payment method' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

async function createPayOSPayment(orderData: OrderData) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
    
    // 1. Create order in backend
    const orderRes = await fetch(`${backendUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderData.items.map(i => ({ productId: i.productId || i.id, quantity: i.quantity })),
        shippingAddress: orderData.shippingAddress,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
      })
    });

    if (!orderRes.ok) throw new Error('Failed to create order in backend');
    const { data: order } = await orderRes.json();

    // 2. Create payment intent in backend
    const intentRes = await fetch(`${backendUrl}/payments/intents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        provider: 'PAYOS',
        idempotencyKey: `payos_${order.id}_${Date.now()}`,
        returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success?method=payos&orderId=${order.orderNo}`
      })
    });

    if (!intentRes.ok) throw new Error('Failed to create payment intent in backend');
    const intentData = await intentRes.json();

    return intentData.redirectUrl;
  } catch (error) {
    console.error('PayOS payment creation error:', error);
    throw error;
  }
}

async function processCODOrder(orderData: OrderData) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
    
    // 1. Create order in backend
    const orderRes = await fetch(`${backendUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderData.items.map(i => ({ productId: i.productId || i.id, quantity: i.quantity })),
        shippingAddress: orderData.shippingAddress,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
      })
    });

    if (!orderRes.ok) throw new Error('Failed to create order in backend');
    const { data: order } = await orderRes.json();

    // 2. Create intent for COD
    const intentRes = await fetch(`${backendUrl}/payments/intents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        provider: 'COD',
        idempotencyKey: `cod_${order.id}_${Date.now()}`
      })
    });

    if (!intentRes.ok) throw new Error('Failed to mark COD payment');
    
    return { orderId: order.orderNo, status: 'PENDING' };
  } catch (error) {
    console.error('COD order creation error:', error);
    throw error;
  }
}
