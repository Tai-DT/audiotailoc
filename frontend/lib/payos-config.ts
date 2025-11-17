/**
 * PayOS Configuration
 * Cấu hình PayOS cho ứng dụng Audio Tài Lộc
 */

export interface PayOSConfig {
  clientId: string;
  apiKey: string;
  checksumKey: string;
  env: 'sandbox' | 'production';
  returnUrl: string;
  cancelUrl: string;
  webhookUrl: string;
}

// Default configuration for development
const defaultConfig: PayOSConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYOS_CLIENT_ID || '',
  apiKey: process.env.NEXT_PUBLIC_PAYOS_API_KEY || '',
  checksumKey: process.env.NEXT_PUBLIC_PAYOS_CHECKSUM_KEY || '',
  env: (process.env.NEXT_PUBLIC_PAYOS_ENV as 'sandbox' | 'production') || 'sandbox',
  returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
  webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhook/payos`,
};

/**
 * Lấy cấu hình PayOS
 */
export function getPayOSConfig(): PayOSConfig {
  // Validate required configuration
  if (!defaultConfig.clientId || !defaultConfig.apiKey || !defaultConfig.checksumKey) {
    console.warn('PayOS configuration is missing. Please check environment variables.');
  }

  return defaultConfig;
}

/**
 * Kiểm tra xem PayOS có được cấu hình đúng không
 */
export function isPayOSConfigured(): boolean {
  const config = getPayOSConfig();
  return !!(config.clientId || config.apiKey || config.checksumKey);
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
 */
export function generateOrderCode(prefix: string = 'ORDER'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}${timestamp}${random}`;
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
export function generateWebhookSignature(data: any, checksumKey: string): string {
  const crypto = require('crypto');
  
  // Sort the data object keys alphabetically
  const sortedKeys = Object.keys(data).sort();
  
  // Create the signature string
  let signatureString = '';
  sortedKeys.forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      signatureString += `${key}=${data[key]}&`;
    }
  });
  
  // Remove the trailing '&'
  signatureString = signatureString.slice(0, -1);
  
  // Generate HMAC SHA256 signature
  return crypto.createHmac('sha256', checksumKey)
    .update(signatureString)
    .digest('hex');
}

/**
 * Xác thực webhook signature từ PayOS
 */
export function verifyWebhookSignature(
  receivedSignature: string, 
  data: any, 
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