import { NextRequest, NextResponse } from 'next/server';

type BackendPayment = {
  status?: string;
  transactionId?: string | null;
  id?: string | null;
  updatedAt?: string | null;
};

type BackendOrder = {
  status?: string;
  payments?: BackendPayment[];
  totalCents?: number;
  createdAt?: string;
  orderNo?: string;
};

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
    const normalizedMethod = paymentMethod === 'cos' ? 'cod' : paymentMethod;
    const authHeader = getAuthHeader(request);
    const adminKey = process.env.ADMIN_API_KEY;
    const headers = buildOrderHeaders({
      authHeader,
      adminKey,
      origin: request.headers.get('origin') || request.nextUrl.origin,
      referer: request.headers.get('referer') || request.url,
    });

    if (normalizedMethod === 'payos') {
      const status = await checkPayOSStatus(orderId, headers);
      return NextResponse.json({
        success: true,
        paymentMethod: 'payos',
        orderId,
        status,
        message: 'PayOS payment status retrieved'
      });
    }

    if (normalizedMethod === 'cod') {
      const status = await checkCODStatus(orderId, headers);
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

async function checkPayOSStatus(orderId: string, headers: Record<string, string>) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

    // Fetch order from backend (which includes payments)
    const response = await fetch(`${backendUrl}/orders/${orderId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error('Failed to fetch order status from backend');
    const payload = (await response.json()) as { data?: BackendOrder } | BackendOrder;
    const order = normalizeOrderPayload(payload);

    // Map backend order/payment status to frontend format
    let status = 'PENDING';
    if (order.status === 'CONFIRMED' || order.status === 'PROCESSING' || order.status === 'COMPLETED') {
      const hasPaid = order.payments?.some((p: BackendPayment) => p.status === 'SUCCEEDED');
      if (hasPaid) status = 'COMPLETED';
    } else if (order.status === 'CANCELLED') {
      status = 'FAILED';
    }

    const latestPayment = order.payments?.length
      ? order.payments[order.payments.length - 1]
      : undefined;

    return {
      status: status,
      transactionId: latestPayment?.transactionId || latestPayment?.id || null,
      amount: (order.totalCents ?? 0) / 100,
      currency: 'VND',
      createdAt: order.createdAt,
      completedAt: latestPayment?.updatedAt || null,
      description: `Payment for order ${order.orderNo || orderId}`,
      paymentMethod: 'PayOS',
    };
  } catch (error) {
    console.error('PayOS status check error:', error);
    throw error;
  }
}

async function checkCODStatus(orderId: string, headers: Record<string, string>) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

    // Fetch order from backend
    const response = await fetch(`${backendUrl}/orders/${orderId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error('Failed to fetch order status from backend');
    const payload = (await response.json()) as { data?: BackendOrder } | BackendOrder;
    const order = normalizeOrderPayload(payload);

    return {
      status: order.status === 'CANCELLED' ? 'FAILED' : 'PENDING',
      orderId: order.orderNo || orderId,
      createdAt: order.createdAt,
      estimatedDelivery: order.createdAt
        ? new Date(new Date(order.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error('COD status check error:', error);
    throw error;
  }
}

function getAuthHeader(request: NextRequest) {
  const cookieToken = request.cookies.get('audiotailoc_token')?.value;
  const header = request.headers.get('authorization');
  const bearer = header && header.startsWith('Bearer ') ? header.slice(7).trim() : null;
  const token = cookieToken || bearer;
  return token ? `Bearer ${token}` : undefined;
}

function buildOrderHeaders({
  authHeader,
  adminKey,
  origin,
  referer,
}: {
  authHeader?: string;
  adminKey?: string;
  origin?: string;
  referer?: string;
}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authHeader) {
    headers.Authorization = authHeader;
  } else if (adminKey) {
    headers['x-admin-key'] = adminKey;
  }
  if (origin) {
    headers.Origin = origin;
  }
  if (referer) {
    headers.Referer = referer;
  }
  return headers;
}

function normalizeOrderPayload(payload: { data?: BackendOrder } | BackendOrder) {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data) {
    return payload.data;
  }
  return payload as BackendOrder;
}
