'use client';

import dynamic from 'next/dynamic';
import { useContactInfo } from '@/lib/hooks/use-contact-info';

// Lazy load ChatWidget - not needed for initial render
const ChatWidgetComponent = dynamic(
 () => import('@/components/ui/chat-widget').then(mod => ({ default: mod.ChatWidget })),
 { ssr: false }
);

export function LazyChatWidget() {
 const { data: contactInfo } = useContactInfo();
 const zaloPhoneNumber = contactInfo?.zalo?.phoneNumber || contactInfo?.phone?.hotline || '';
 return <ChatWidgetComponent zaloPhoneNumber={zaloPhoneNumber} />;
}
