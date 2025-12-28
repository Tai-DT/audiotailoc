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
    const body = await request.json();
    const signature = request.headers.get('x-signature') || request.headers.get('payos-signature');

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

    // Forward the webhook to the real backend
    const response = await fetch(`${backendUrl}/payments/webhook/payos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signature': signature || '',
        'payos-signature': signature || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to forward webhook to backend:', errorText);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('PayOS webhook forward error:', error);
    return NextResponse.json({ success: true }); // Always success to PayOS
  }
}

export async function GET() {
  return NextResponse.json({ status: 'active' });
}
