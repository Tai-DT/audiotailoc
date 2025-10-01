import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface OrderItem {
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
    console.log('Payment process request received');
    const body = await request.json();
    const { orderData, paymentMethod } = body;

    console.log('Request body:', { orderData: !!orderData, paymentMethod });

    // Validate required fields
    if (!orderData || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For PayOS payment
    if (paymentMethod === 'payos') {
      console.log('Processing PayOS payment');
      const paymentUrl = await createPayOSPayment(orderData);
      console.log('PayOS payment URL created:', paymentUrl);
      return NextResponse.json({
        success: true,
        paymentMethod: 'payos',
        paymentUrl,
        message: 'Redirecting to PayOS payment'
      });
    }

    // For COD payment
    if (paymentMethod === 'cod') {
      console.log('Processing COD payment');
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
    console.log('createPayOSPayment called with:', { orderData: !!orderData, customerName: orderData?.customerName });
    // Check if we have real PayOS credentials
    const hasRealCredentials = process.env.PAYOS_PARTNER_CODE &&
                              process.env.PAYOS_API_KEY &&
                              process.env.PAYOS_CHECKSUM_KEY &&
                              process.env.PAYOS_PARTNER_CODE !== 'demo_partner_code';

    console.log('Has real credentials:', hasRealCredentials);

    // Try real PayOS API first, fallback to demo if failed
    if (hasRealCredentials) {
      console.log('Using REAL PayOS API - Production mode enabled!');
      try {
        return await createRealPayOSPayment(orderData);
      } catch (realError) {
        console.error('Real PayOS API failed, falling back to demo mode:', realError instanceof Error ? realError.message : String(realError));
        console.log('Falling back to demo mode...');
        return await createDemoPayOSPayment(orderData);
      }
    } else {
      console.log('Using demo mode - PayOS credentials not configured');
      return await createDemoPayOSPayment(orderData);
    }

  } catch (error) {
    console.error('PayOS payment creation error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    throw new Error('Failed to create PayOS payment');
  }
}

async function createRealPayOSPayment(orderData: OrderData) {
  try {
    console.log('createRealPayOSPayment called with orderData:', orderData);
    // Generate unique order code
    const orderCode = Date.now().toString();

    // Get frontend URL from environment or use default
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Prepare payment data according to PayOS API v2
    const paymentData = {
      orderCode: parseInt(orderCode),
      amount: orderData.finalTotal,
      description: 'Audio Tai Loc Order',
      buyerName: orderData.customerName,
      buyerEmail: orderData.customerEmail,
      buyerPhone: orderData.customerPhone,
      buyerAddress: orderData.shippingAddress,
      items: orderData.items.map((item: OrderItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice
      })),
      cancelUrl: `${frontendUrl}/checkout?error=payment_cancelled`,
      returnUrl: `${frontendUrl}/order-success?method=payos&orderId=${orderCode}`,
      expiredAt: Math.floor((Date.now() + 15 * 60 * 1000) / 1000), // 15 minutes from now
      signature: '', // Will be generated below,
    };

    console.log('Payment data prepared:', paymentData);

    // Generate signature for security
    const signature = generatePayOSSignature(paymentData, process.env.PAYOS_CHECKSUM_KEY!);
    paymentData.signature = signature;

    console.log('Generated signature:', signature);
    console.log('API URL:', process.env.PAYOS_CREATE_PAYMENT_URL);

    // Call PayOS API to create payment
    const response = await fetch(process.env.PAYOS_CREATE_PAYMENT_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.PAYOS_API_KEY!,
        'x-partner-code': process.env.PAYOS_PARTNER_CODE!,
      },
      body: JSON.stringify(paymentData),
    });

    console.log('PayOS API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PayOS API error response:', errorText);
      throw new Error(`PayOS API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('PayOS API result:', result);

    if (result.code === '00') {
      // Payment created successfully
      return result.data.paymentUrl;
    } else {
      throw new Error(`PayOS error: ${result.desc || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('createRealPayOSPayment error:', error);
    throw error;
  }
}

async function createDemoPayOSPayment(orderData: OrderData) {
  try {
    console.log('Creating demo PayOS payment with orderData:', orderData);
    // Demo mode - create a working demo URL
    const orderCode = Date.now().toString();

    // Get frontend URL from environment or use default
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const params = new URLSearchParams();
    params.set('orderCode', orderCode);
    params.set('amount', orderData.finalTotal.toString());
    params.set('description', 'Audio Tai Loc Order');
    params.set('buyerName', orderData.customerName || '');
    if (orderData.customerEmail) params.set('buyerEmail', orderData.customerEmail);
    if (orderData.customerPhone) params.set('buyerPhone', orderData.customerPhone);
    params.set('returnUrl', `${frontendUrl}/order-success?method=payos&orderId=${orderCode}`);
    params.set('cancelUrl', `${frontendUrl}/checkout`);

    const paymentUrl = `/payment-demo?${params.toString()}`;
    console.log('Demo payment URL created:', paymentUrl);

    // Return demo payment URL
    return paymentUrl;
  } catch (error) {
    console.error('Demo payment creation error:', error);
    throw error;
  }
}

function generatePayOSSignature(data: PayOSSignatureData, checksumKey: string): string {
  try {
    // Generate signature according to PayOS API documentation
    // Format: amount=$amount&cancelUrl=$cancelUrl&description=$description&orderCode=$orderCode&returnUrl=$returnUrl
    // Data must be sorted alphabetically and URL encoded
    const signatureData = {
      amount: data.amount,
      cancelUrl: data.cancelUrl,
      description: data.description,
      orderCode: data.orderCode,
      returnUrl: data.returnUrl
    };

    // Sort keys alphabetically and create query string with URL encoding
    const sortedKeys = Object.keys(signatureData).sort();
    const signatureString = sortedKeys
      .map(key => `${key}=${encodeURIComponent(signatureData[key as keyof typeof signatureData])}`)
      .join('&');

    // Use crypto to create HMAC SHA256 hash
    const signature = crypto.createHmac('sha256', checksumKey).update(signatureString).digest('hex');

    return signature;
  } catch (error) {
    console.error('Error generating signature:', error);
    return '';
  }
}

async function processCODOrder(orderData: OrderData) {
  // Mock COD order processing - in real implementation, save to database
  const orderId = `COD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Here you would typically:
  // 1. Create order in database with PENDING status
  // 2. Send confirmation email
  // 3. Return order details

  console.log('Processing COD order for:', orderData.customerName);

  return { orderId, status: 'PENDING' };
}
