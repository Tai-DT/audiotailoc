'use client';

import { ZaloChat } from './zalo-chat';

interface ZaloChatWidgetProps {
  phoneNumber: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
}

export function ZaloChatWidget({
  phoneNumber,
  position = 'bottom-right',
  size = 'medium'
}: ZaloChatWidgetProps) {
  // Validate phone number format (remove spaces, dashes, etc.)
  const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // Ensure phone number starts with country code
  const formattedPhoneNumber = cleanPhoneNumber.startsWith('+84')
    ? cleanPhoneNumber
    : cleanPhoneNumber.startsWith('84')
    ? `+${cleanPhoneNumber}`
    : `+84${cleanPhoneNumber}`;

  return (
    <ZaloChat
      phoneNumber={formattedPhoneNumber}
      position={position}
      size={size}
    />
  );
}