import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const paymentMethod = searchParams.get('paymentMethod');

  if (!orderId || !paymentMethod) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    if (paymentMethod === 'payos') {
      const status = await checkPayOSStatus(orderId);
      return NextResponse.json({
        success: true,
        paymentMethod: 'payos',
        orderId,
        status,
        message: 'PayOS payment status retrieved'
      });
    }

    if (paymentMethod === 'cod') {
      const status = await checkCODStatus(orderId);
      return NextResponse.json({
        success: true,
        paymentMethod: 'cod',
        orderId,
        status,
        message: 'COD order status retrieved'
      });
    }

    return NextResponse.json(
      { error: 'Invalid payment method' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}

async function checkPayOSStatus(orderId: string) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
    
    // Fetch order from backend (which includes payments)
    const response = await fetch(`${backendUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to fetch order status from backend');
    const order = await response.json();

    // Map backend order/payment status to frontend format
    let status = 'PENDING';
    if (order.status === 'CONFIRMED' || order.status === 'PROCESSING' || order.status === 'COMPLETED') {
        const hasPaid = order.payments?.some((p: any) => p.status === 'SUCCEEDED');
        if (hasPaid) status = 'COMPLETED';
    } else if (order.status === 'CANCELLED') {
        status = 'FAILED';
    }

    const latestPayment = order.payments?.[order.payments.length - 1];

    return {
      status: status,
      transactionId: latestPayment?.transactionId || latestPayment?.id || null,
      amount: order.totalCents / 100,
      currency: 'VND',
      createdAt: order.createdAt,
      completedAt: latestPayment?.updatedAt || null,
      description: `Payment for order ${order.orderNo}`,
      paymentMethod: 'PayOS',
    };
  } catch (error) {
    console.error('PayOS status check error:', error);
    throw error;
  }
}

async function checkCODStatus(orderId: string) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
    
    // Fetch order from backend
    const response = await fetch(`${backendUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to fetch order status from backend');
    const order = await response.json();

    return {
      status: order.status === 'CANCELLED' ? 'FAILED' : 'PENDING',
      orderId: order.orderNo,
      createdAt: order.createdAt,
      estimatedDelivery: new Date(new Date(order.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error('COD status check error:', error);
    throw error;
  }
}
