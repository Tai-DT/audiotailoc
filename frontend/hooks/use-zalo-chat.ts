'use client';

import { useCallback } from 'react';

export function useZaloChat() {
  const openZaloChat = useCallback((phoneNumber: string) => {
    // Clean phone number (remove spaces, dashes, parentheses, plus signs)
    const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)\+]/g, '');

    // Try to open Zalo app first, fallback to web
    const zaloUrl = `https://zalo.me/${cleanPhoneNumber}`;

    // Check if it's a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      // Try to open Zalo app
      const zaloAppUrl = `zalo://chat?phone=${cleanPhoneNumber}`;

      // Create a hidden iframe to try opening the app
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = zaloAppUrl;
      document.body.appendChild(iframe);

      // Fallback to web after a short delay
      setTimeout(() => {
        document.body.removeChild(iframe);
        window.open(zaloUrl, '_blank');
      }, 1000);
    } else {
      // Desktop: open web version
      window.open(zaloUrl, '_blank', 'width=400,height=600');
    }
  }, []);

  return { openZaloChat };
}