'use client';

import dynamic from 'next/dynamic';
import { CONTACT_CONFIG } from '@/lib/contact-config';

// Lazy load ChatWidget - not needed for initial render
const ChatWidgetComponent = dynamic(
  () => import('@/components/ui/chat-widget').then(mod => ({ default: mod.ChatWidget })),
  { ssr: false }
);

export function LazyChatWidget() {
  return <ChatWidgetComponent zaloPhoneNumber={CONTACT_CONFIG.zalo.phoneNumber} />;
}
