import { NextRequest, NextResponse } from 'next/server';

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
  shippingCoordinates?: { lat: number; lng: number };
  notes?: string;
  finalTotal: number;
  items: OrderItem[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderData, paymentMethod, successPath } = body;

    // Validate required fields
    if (!orderData || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const token = getAuthToken(request);
    const authHeader = token ? `Bearer ${token}` : undefined;
    const requestOrigin = request.headers.get('origin') || request.nextUrl.origin;
    const requestReferer = request.headers.get('referer') || request.url;
    const adminKeyConfigured = Boolean( (process.env.ADMIN_API_KEY || '').trim() );

    if (paymentMethod === 'payos' && !authHeader && !adminKeyConfigured) {
      return NextResponse.json(
        {
          error:
            'Thanh toán PayOS cho khách yêu cầu cấu hình ADMIN_API_KEY trên server. Vui lòng kiểm tra biến môi trường.',
        },
        { status: 401 }
      );
    }

    // For PayOS payment
    if (paymentMethod === 'payos') {
      const payment = await createPayOSPayment(orderData, authHeader, {
        origin: requestOrigin,
        referer: requestReferer,
        successPath,
      });
      return NextResponse.json({
        success: true,
        paymentMethod: 'payos',
        paymentUrl: payment.paymentUrl,
        orderId: payment.orderId,
        intentId: payment.intentId,
        message: 'Redirecting to PayOS payment'
      });
    }

    // For COD payment
    if (paymentMethod === 'cod') {
      const orderResult = await processCODOrder(orderData, authHeader, {
        origin: requestOrigin,
        referer: requestReferer,
      });
      return NextResponse.json({
        success: true,
        paymentMethod: 'cod',
        orderId: orderResult.orderId,
        message: orderResult.intentCreated
          ? 'COD order created successfully'
          : 'COD order created successfully (pending confirmation)'
      });
    }

    return NextResponse.json(
      { error: 'Invalid payment method' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    const message = error instanceof Error && error.message
      ? error.message
      : 'Payment processing failed';
    const status = message.includes('ADMIN_API_KEY') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

async function createPayOSPayment(
  orderData: OrderData,
  authHeader?: string,
  headersContext?: { origin?: string; referer?: string; successPath?: string },
) {
  try {
    const backendUrl = getBackendUrl();
    const headers = buildBackendHeaders(authHeader, headersContext);
    
    // 1. Create order in backend
    const orderRes = await fetch(`${backendUrl}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        items: orderData.items.map(i => ({ productId: i.productId || i.id, quantity: i.quantity })),
        shippingAddress: orderData.shippingAddress,
        shippingCoordinates: orderData.shippingCoordinates,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        notes: orderData.notes,
      })
    });

    if (!orderRes.ok) {
      const message = await readBackendError(orderRes, 'Failed to create order in backend');
      throw new Error(message);
    }
    const orderPayload = await orderRes.json();
    const order = normalizeOrderPayload(orderPayload);
    if (!order?.id) throw new Error('Order response missing id');
    const orderIdForRedirect = String(order.orderNo || order.id);

    // 2. Create payment intent in backend
    const intentRes = await fetch(`${backendUrl}/payments/intents`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        orderId: order.id,
        provider: 'PAYOS',
        idempotencyKey: `payos_${order.id}_${Date.now()}`,
        returnUrl: (() => {
          const base = process.env.FRONTEND_URL || 'http://localhost:3000';
          const path =
            typeof headersContext?.successPath === 'string' &&
            headersContext.successPath.trim().startsWith('/')
              ? headersContext.successPath.trim()
              : '/order-success';
          const url = new URL(path, base);
          url.searchParams.set('method', 'payos');
          url.searchParams.set('orderId', orderIdForRedirect);
          return url.toString();
        })()
      })
    });

    if (!intentRes.ok) {
      const message = await readBackendError(intentRes, 'Failed to create payment intent in backend');
      throw new Error(message);
    }
    const intentPayload = await intentRes.json();
    const intent = normalizeIntentPayload(intentPayload);
    const redirectUrl = intent.redirectUrl || intent.checkoutUrl;
    if (!redirectUrl) {
      throw new Error('Missing PayOS redirect URL');
    }
    if (!intent.intentId) {
      throw new Error('Missing PayOS intentId');
    }

    return { paymentUrl: redirectUrl, orderId: orderIdForRedirect, intentId: intent.intentId };
  } catch (error) {
    console.error('PayOS payment creation error:', error);
    throw error;
  }
}

async function processCODOrder(
  orderData: OrderData,
  authHeader?: string,
  headersContext?: { origin?: string; referer?: string },
) {
  try {
    const backendUrl = getBackendUrl();
    const headers = buildBackendHeaders(authHeader, headersContext);
    const canCreateIntent = Boolean(authHeader || process.env.ADMIN_API_KEY);
    
    // 1. Create order in backend
    const orderRes = await fetch(`${backendUrl}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        items: orderData.items.map(i => ({ productId: i.productId || i.id, quantity: i.quantity })),
        shippingAddress: orderData.shippingAddress,
        shippingCoordinates: orderData.shippingCoordinates,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        notes: orderData.notes,
      })
    });

    if (!orderRes.ok) throw new Error('Failed to create order in backend');
    const orderPayload = await orderRes.json();
    const order = normalizeOrderPayload(orderPayload);
    if (!order?.id) throw new Error('Order response missing id');

    // 2. Create intent for COD
    let intentCreated = false;
    if (canCreateIntent) {
      const intentRes = await fetch(`${backendUrl}/payments/intents`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          orderId: order.id,
          provider: 'COD',
          idempotencyKey: `cod_${order.id}_${Date.now()}`
        })
      });

      if (!intentRes.ok) throw new Error('Failed to mark COD payment');
      intentCreated = true;
    }
    
    return { orderId: order.orderNo || order.id, status: 'PENDING', intentCreated };
  } catch (error) {
    console.error('COD order creation error:', error);
    throw error;
  }
}

function getBackendUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
}

function getAuthToken(request: NextRequest) {
  const cookieToken = request.cookies.get('audiotailoc_token')?.value;
  if (cookieToken) return cookieToken;
  const header = request.headers.get('authorization');
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }
  return null;
}

function buildBackendHeaders(
  authHeader?: string,
  headersContext?: { origin?: string; referer?: string },
) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authHeader) {
    headers.Authorization = authHeader;
  } else {
    const adminKey = (process.env.ADMIN_API_KEY || '').trim();
    if (adminKey) {
      headers['x-admin-key'] = adminKey;
    }
  }
  if (headersContext?.origin) {
    headers.Origin = headersContext.origin;
  }
  if (headersContext?.referer) {
    headers.Referer = headersContext.referer;
  }
  return headers;
}

type NormalizedOrder = {
  id?: string;
  orderNo?: string;
};

async function readBackendError(response: Response, fallback: string) {
  const payload = await response.json().catch(() => null);
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
}

function normalizeOrderPayload(payload: unknown): NormalizedOrder {
  if (payload && typeof payload === 'object') {
    if ('data' in payload) {
      const data = (payload as { data?: NormalizedOrder }).data;
      if (data && typeof data === 'object') {
        return data;
      }
    }
    return payload as NormalizedOrder;
  }
  return {};
}

type NormalizedIntent = {
  intentId?: string | null;
  redirectUrl?: string | null;
  checkoutUrl?: string | null;
};

function normalizeIntentPayload(payload: unknown): NormalizedIntent {
  if (payload && typeof payload === 'object') {
    if ('data' in payload) {
      const data = (payload as { data?: NormalizedIntent }).data;
      if (data && typeof data === 'object') {
        return data;
      }
    }
    return payload as NormalizedIntent;
  }
  return {};
}
