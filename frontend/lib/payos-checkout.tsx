'use client';

import React, { useEffect, useState } from 'react';
import { PayOS } from '@payos-inc/payos-js';
import {
  getPayOSConfig,
  isPayOSConfigured,
  formatAmountForPayOS
} from '@/lib/payos-config';

interface PayOSCheckoutProps {
  amount: number;
  orderCode: string;
  orderDescription: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  onSuccess: (data: any) => void;
  onError: (error: Error) => void;
  onCancel: () => void;
}

export default function PayOSCheckout({
  amount,
  orderCode,
  orderDescription,
  buyerName,
  buyerEmail,
  buyerPhone,
  onSuccess,
  onError,
  onCancel,
}: PayOSCheckoutProps) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [payOSClient, setPayOSClient] = useState<PayOS | null>(null);

  useEffect(() => {
    // Check PayOS configuration
    if (!isPayOSConfigured()) {
      setConfigError('PayOS chưa được cấu hình. Vui lòng kiểm tra biến môi trường.');
      return;
    }

    // Initialize PayOS SDK
    const initPayOS = async () => {
      try {
        const config = getPayOSConfig();
        
        // Initialize PayOS client
        const payos = new PayOS({
          // PayOSConfig is optional, can pass empty object
          baseUrl: config.env === 'production'
            ? 'https://api.payos.vn'
            : 'https://api-merchant.payos.vn'
        });

        setPayOSClient(payos);
        setIsSDKLoaded(true);
        console.log('PayOS SDK loaded successfully');
      } catch (error) {
        console.error('Failed to load PayOS SDK:', error);
        setConfigError('Không thể tải PayOS SDK. Vui lòng thử lại sau.');
        onError(error instanceof Error ? error : new Error('Failed to load PayOS SDK'));
      }
    };

    initPayOS();
  }, [onError]);

  const handlePayOSPayment = async () => {
    if (!isSDKLoaded || !payOSClient) {
      onError(new Error('PayOS SDK not loaded'));
      return;
    }

    setIsLoading(true);
    
    try {
      const config = getPayOSConfig();
      
      // Create PayOS payment using SDK
      // Note: We need to get a payment token from backend first
      // This is a simplified example - in production, you'd call your backend API
      const paymentToken = await getPaymentTokenFromBackend({
        orderCode,
        amount: formatAmountForPayOS(amount),
        description: orderDescription,
        buyerName,
        buyerEmail,
        buyerPhone,
        returnUrl: config.returnUrl,
        cancelUrl: config.cancelUrl,
      });

      // Backend returns checkoutUrl, redirect to it
      if (paymentToken.checkoutUrl) {
        // Redirect to PayOS checkout page
        window.location.href = paymentToken.checkoutUrl;
      } else {
        // Fallback: try to use SDK if token is available
        payOSClient.checkout.open({
          token: paymentToken.token || paymentToken,
          environment: config.env === 'production' ? 'production' : 'sandbox',
          onSuccess: (result) => {
            onSuccess(result);
          },
          onError: (error) => {
            onError(error instanceof Error ? error : new Error('Payment failed'));
          },
          onCancel: () => {
            onCancel();
          }
        });
      }
    } catch (error) {
      console.error('PayOS payment error:', error);
      onError(error instanceof Error ? error : new Error('Payment processing failed'));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get payment token from backend
  const getPaymentTokenFromBackend = async (paymentData: any): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/payments/payos/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create payment');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  };

  if (configError) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="text-red-500 text-xl">⚠️</div>
            <div>
              <p className="text-sm text-red-800 font-medium">Lỗi cấu hình PayOS</p>
              <p className="text-xs text-red-600 mt-1">{configError}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="mt-3 w-full bg-red-100 text-red-800 hover:bg-red-200 text-sm font-medium py-2 px-4 rounded transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isSDKLoaded ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-2">Đang tải PayOS...</p>
        </div>
      ) : (
        <button
          onClick={handlePayOSPayment}
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v12a2 2 0 002-2h12a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2zm2.823 7.09l4.235 4.235a1 1 0 01.414 1.414L10 14.828a1 1 0 01.414-1.414l4.235-4.235a1 1 0 01.414-1.414L10 5.172a1 1 0 01.414-1.414l-4.235 4.235a1 1 0 01.414 1.414L4 14.828a1 1 0 01.414-1.414l-4.235-4.235a1 1 0 01.414 1.414L10 5.172a1 1 0 01.414-1.414l-4.235 4.235a1 1 0 01.414 1.414L10 14.828a1 1 0 01.414-1.414l-4.235-4.235a1 1 0 01.414 1.414z" clipRule="evenodd" />
              </svg>
              Thanh toán với PayOS
            </>
          )}
        </button>
      )}
    </div>
  );
}