declare module '@payos-inc/payos-js' {
  export interface PayOSConfig {
    clientId?: string;
    apiKey?: string;
    checksumKey?: string;
    baseUrl?: string;
  }

  export interface PaymentRequest {
    orderCode: number;
    amount: number;
    description: string;
    items?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    cancelUrl?: string;
    returnUrl?: string;
  }

  export interface PaymentResponse {
    code: string;
    desc: string;
    data?: {
      bin: string;
      accountNumber: string;
      accountName: string;
      amount: number;
      description: string;
      orderCode: number;
      currency: string;
      paymentLinkId: string;
      status: string;
      expiredAt: number;
      createdAt: string;
      transactions: unknown[];
      cancellationReason?: string;
      canceledAt?: string;
      checksum: string;
    };
  }

  export interface CheckoutOpenOptions {
    token: string;
    environment?: 'production' | 'sandbox';
    onSuccess?: (result: unknown) => void;
    onError?: (error: unknown) => void;
    onCancel?: () => void;
  }

  export interface PayOSCheckout {
    open: (options: CheckoutOpenOptions) => void;
  }

  export class PayOS {
    constructor(config?: PayOSConfig);
    createPaymentLink(data: PaymentRequest): Promise<PaymentResponse>;
    getPaymentLinkInformation(orderCode: number): Promise<PaymentResponse>;
    cancelPaymentLink(orderCode: number, cancellationReason: string): Promise<PaymentResponse>;
    confirmWebhook(webhookBody: unknown, signature: string): boolean;
    checkout: PayOSCheckout;
  }

  export default PayOS;
}
