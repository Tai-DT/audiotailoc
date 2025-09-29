'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from './button';

interface ZaloChatProps {
  phoneNumber: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function ZaloChat({
  phoneNumber,
  position = 'bottom-right',
  size = 'medium',
  className = ''
}: ZaloChatProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load Zalo SDK if not already loaded
    if (!window.zaloSDK) {
      const script = document.createElement('script');
      script.src = 'https://sp.zalo.me/plugins/sdk.js';
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
        // Initialize Zalo Chat
        if (window.zaloSDK) {
          window.zaloSDK.init({
            oaid: phoneNumber,
            appId: phoneNumber // Using phone number as appId for direct chat
          });
        }
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, [phoneNumber]);

  const handleChatClick = () => {
    if (isLoaded && window.zaloSDK) {
      // Open Zalo chat
      const zaloUrl = `https://zalo.me/${phoneNumber}`;
      window.open(zaloUrl, '_blank', 'width=400,height=600');
    } else {
      // Fallback: open Zalo app or web
      const zaloUrl = `https://zalo.me/${phoneNumber}`;
      window.open(zaloUrl, '_blank');
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      <Button
        onClick={handleChatClick}
        className={`
          ${sizeClasses[size]}
          rounded-full bg-blue-500 hover:bg-blue-600
          text-white shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          group relative overflow-hidden
        `}
        title="Chat với chúng tôi qua Zalo"
      >
        {/* Zalo logo background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Zalo icon */}
        <MessageCircle className="w-6 h-6 relative z-10" />

        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
      </Button>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Chat Zalo
        <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
      </div>
    </div>
  );
}

// TypeScript declaration for Zalo SDK
declare global {
  interface Window {
    zaloSDK?: {
      init: (config: { oaid: string; appId: string }) => void;
    };
  }
}