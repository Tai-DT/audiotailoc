import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface PayOSWebhookData {
  orderCode: string;
  amount: number;
  reference?: string;
  paidAt?: string;
  buyerEmail?: string;
  [key: string]: unknown;
}

interface PayOSWebhookBody {
  data: PayOSWebhookData;
  eventType: string;
}

interface SortableObject {
  [key: string]: unknown;
}

// PayOS webhook verification function
function verifyPayOSWebhook(data: SortableObject, signature: string, checksumKey: string): boolean {
  try {
    // Sort object by key alphabetically
    function sortObjDataByKey(object: SortableObject): SortableObject {
      const orderedObject: SortableObject = {};
      Object.keys(object).sort().forEach(key => {
        orderedObject[key] = object[key];
      });
      return orderedObject;
    }

    // Convert object to query string
    function convertObjToQueryStr(object: SortableObject): string {
      return Object.keys(object)
        .filter(key => object[key] !== undefined)
        .map(key => {
          let value = object[key];
          // Sort nested object if array
          if (value && Array.isArray(value)) {
            value = JSON.stringify(value.map((val: SortableObject) => sortObjDataByKey(val)));
          }
          // Set empty string if null
          if ([null, undefined, 'undefined', 'null'].includes(value as string)) {
            value = '';
          }
          return `${key}=${value}`;
        })
        .join('&');
    }

    const sortedDataByKey = sortObjDataByKey(data);
    const dataQueryStr = convertObjToQueryStr(sortedDataByKey);
    const calculatedSignature = crypto.createHmac('sha256', checksumKey).update(dataQueryStr).digest('hex');

    return calculatedSignature === signature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PayOSWebhookBody = await request.json();
    const signature = request.headers.get('x-signature') || request.headers.get('payos-signature');

    // Verify webhook signature for security
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY!;
    if (!signature || !verifyPayOSWebhook(body.data || body, signature, checksumKey)) {
      console.error('Invalid PayOS webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const { data, eventType } = body;

    if (!data || !eventType) {
      return NextResponse.json(
        { error: 'Invalid webhook data' },
        { status: 400 }
      );
    }

    // Handle different webhook events
    switch (eventType) {
      case 'payment.success':
        await handlePaymentSuccess(data);
        break;
      case 'payment.failed':
        await handlePaymentFailed(data);
        break;
      case 'payment.cancelled':
        await handlePaymentCancelled(data);
        break;
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    // Always return success to PayOS
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('PayOS webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    payosVars: Object.keys(process.env).filter(key => key.includes('PAYOS')),
    checksumKey: process.env.PAYOS_CHECKSUM_KEY ? 'FOUND' : 'NOT FOUND',
    checksumLength: process.env.PAYOS_CHECKSUM_KEY?.length || 0
  });
}

async function handlePaymentSuccess(data: PayOSWebhookData) {
  console.log('Payment success:', data);

  // Update order status in database
  // In real implementation, you would:
  // 1. Find order by orderCode
  // 2. Update order status to PAID
  // 3. Send confirmation email
  // 4. Trigger fulfillment process

  const { orderCode, amount, reference } = data;

  // Example database update (mock implementation)
  console.log(`Order ${orderCode} paid successfully: ${amount} VND, Transaction: ${reference}`);

  // Send confirmation email
  await sendPaymentConfirmationEmail(data);
}

async function handlePaymentFailed(data: PayOSWebhookData) {
  console.log('Payment failed:', data);

  const { orderCode, amount } = data;

  // Update order status in database
  console.log(`Order ${orderCode} payment failed: ${amount} VND`);

  // Send failure notification
  await sendPaymentFailureEmail(data);
}

async function handlePaymentCancelled(data: PayOSWebhookData) {
  console.log('Payment cancelled:', data);

  const { orderCode, amount } = data;

  // Update order status in database
  console.log(`Order ${orderCode} payment cancelled: ${amount} VND`);

  // Send cancellation notification
  await sendPaymentCancellationEmail(data);
}

async function sendPaymentConfirmationEmail(paymentData: PayOSWebhookData) {
  // Mock email sending - in real implementation, use email service
  console.log('Sending payment confirmation email to:', paymentData.buyerEmail);

  // Example email content:
  // Subject: Thanh toán thành công - Audio Tài Lộc
  // Content: Cảm ơn bạn đã thanh toán. Đơn hàng sẽ được xử lý trong 24h.
}

async function sendPaymentFailureEmail(paymentData: PayOSWebhookData) {
  // Mock email sending
  console.log('Sending payment failure email to:', paymentData.buyerEmail);

  // Example email content:
  // Subject: Thanh toán thất bại - Audio Tài Lộc
  // Content: Thanh toán của bạn đã thất bại. Vui lòng thử lại.
}

async function sendPaymentCancellationEmail(paymentData: PayOSWebhookData) {
  // Mock email sending
  console.log('Sending payment cancellation email to:', paymentData.buyerEmail);

  // Example email content:
  // Subject: Đơn hàng đã hủy - Audio Tài Lộc
  // Content: Đơn hàng của bạn đã được hủy theo yêu cầu.
}
