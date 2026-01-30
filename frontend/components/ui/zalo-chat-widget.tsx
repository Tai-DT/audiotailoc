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
 // Clean phone number (remove spaces, dashes, parentheses, plus signs)
 const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)\+]/g, '');

 return (
 <ZaloChat
 phoneNumber={cleanPhoneNumber}
 position={position}
 size={size}
 />
 );
}