/**
 * PayOS Configuration
 * Cấu hình PayOS cho ứng dụng Audio Tài Lộc
 */

import crypto from 'crypto';

export interface PayOSConfig {
  clientId: string;
  apiKey: string;
  checksumKey: string;
  env: 'sandbox' | 'production';
  returnUrl: string;
  cancelUrl: string;
  webhookUrl: string;
}

// ⚠️ SECURITY: This file has been refactored to NOT expose sensitive API keys in client bundle.
// All PayOS API operations should be done through server-side API routes (e.g., /api/payment/process).
// 
// This file now only contains:
// - Non-sensitive configuration (env, URLs)
// - Utility functions that don't require API keys
// - Signature verification functions (checksumKey is passed as parameter, not from env)

// SECURITY: Only expose non-sensitive configuration in client bundle
const defaultConfig: PayOSConfig = {
  clientId: '', // Not used in client - all operations go through server-side API
  apiKey: '', // Not used in client - all operations go through server-side API
  checksumKey: '', // Not used in client - passed as parameter when needed
  env: (process.env.NEXT_PUBLIC_PAYOS_ENV as 'sandbox' | 'production') || 'sandbox',
  returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
  webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhook/payos`,
};

/**
 * Lấy cấu hình PayOS (non-sensitive only)
 * 
 * ⚠️ SECURITY NOTE: This function no longer returns sensitive API keys.
 * All PayOS API operations must be done through server-side API routes.
 * Use /api/payment/process for creating payments.
 */
export function getPayOSConfig(): PayOSConfig {
  // Note: API keys are not exposed in client bundle
  // All PayOS operations should go through server-side API routes
  return defaultConfig;
}

/**
 * Kiểm tra xem PayOS có được cấu hình đúng không
 * 
 * ⚠️ SECURITY NOTE: This function only checks non-sensitive config.
 * Actual API key validation should be done server-side.
 */
export function isPayOSConfigured(): boolean {
  // SECURITY: Only check non-sensitive config (env, URLs)
  // API keys are handled server-side
  const config = getPayOSConfig();
  return !!(config.env && config.returnUrl && config.cancelUrl);
}

/**
 * Lấy URL PayOS dựa trên môi trường
 */
export function getPayOSBaseUrl(): string {
  const config = getPayOSConfig();
  return config.env === 'production' 
    ? 'https://api.payos.vn' 
    : 'https://api-merchant.payos.vn';
}

/**
 * Tạo order code cho PayOS
 * 
 * ⚠️ SECURITY: Uses cryptographically secure random for better uniqueness
 */
export function generateOrderCode(prefix: string = 'ORDER'): string {
  const timestamp = Date.now();
  // SECURITY: Use crypto for better randomness (if available in browser)
  // Fallback to Math.random() if crypto is not available
  let random: number;
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    random = array[0] % 10000;
  } else {
    random = Math.floor(Math.random() * 10000);
  }
  return `${prefix}${timestamp}${random.toString().padStart(4, '0')}`;
}

/**
 * Format số tiền cho PayOS (đơn vị: VND)
 */
export function formatAmountForPayOS(amount: number): number {
  // PayOS expects amount in VND, no decimal places
  return Math.round(amount);
}

/**
 * Tạo signature cho PayOS webhook
 */
export function generateWebhookSignature(data: Record<string, unknown>, checksumKey: string): string {

  // Sort the data object keys alphabetically
  const sortedKeys = Object.keys(data).sort();

  // Create the signature string using stable serialization for objects
  let signatureString = '';
  sortedKeys.forEach((key) => {
    const raw = (data as Record<string, unknown>)[key];
    if (raw !== undefined && raw !== null) {
      let value: string;
      if (typeof raw === 'object') {
        try {
          value = JSON.stringify(raw);
        } catch {
          value = String(raw);
        }
      } else {
        value = String(raw);
      }
      signatureString += `${key}=${value}&`;
    }
  });

  // Remove the trailing '&' if present
  if (signatureString.endsWith('&')) signatureString = signatureString.slice(0, -1);

  // Generate HMAC SHA256 signature
  return crypto.createHmac('sha256', checksumKey).update(signatureString).digest('hex');
}

/**
 * Xác thực webhook signature từ PayOS
 */
export function verifyWebhookSignature(
  receivedSignature: string,
  data: Record<string, unknown>,
  checksumKey: string
): boolean {
  const expectedSignature = generateWebhookSignature(data, checksumKey);
  return receivedSignature === expectedSignature;
}

/**
 * Map PayOS payment status to application status
 */
export function mapPayOSStatus(payosStatus: string): string {
  switch (payosStatus) {
    case 'PAID':
    case 'SUCCESS':
      return 'PAID';
    case 'PENDING':
      return 'PENDING';
    case 'FAILED':
    case 'CANCELLED':
      return 'CANCELLED';
    case 'REFUNDED':
      return 'REFUNDED';
    default:
      return 'UNKNOWN';
  }
}

/**
 * Lấy thông tin lỗi PayOS
 */
export function getPayOSErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    '400': 'Yêu cầu không hợp lệ',
    '401': 'Xác thực thất bại',
    '403': 'Không có quyền truy cập',
    '404': 'Không tìm thấy tài nguyên',
    '409': 'Xung đột dữ liệu',
    '422': 'Dữ liệu không hợp lệ',
    '429': 'Quá nhiều yêu cầu',
    '500': 'Lỗi máy chủ PayOS',
    '503': 'Dịch vụ không khả dụng',
  };

  return errorMessages[errorCode] || 'Lỗi không xác định từ PayOS';
}
