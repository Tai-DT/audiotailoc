'use client';

import { useEffect } from 'react';
import Script from 'next/script';
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
  const handleChatClick = () => {
    // Open Zalo chat with correct URL format
    const zaloUrl = `https://zalo.me/${phoneNumber.replace(/[\s\-\(\)\+]/g, '')}`;
    window.open(zaloUrl, '_blank', 'width=400,height=600');
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
    <>
      <Script
        src="https://sp.zalo.me/plugins/sdk.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Initialize Zalo Chat
          if (window.zaloSDK) {
            window.zaloSDK.init({
              oaid: phoneNumber,
              appId: phoneNumber // Using phone number as appId for direct chat
            });
          }
        }}
      />
      <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
        <Button
          onClick={handleChatClick}
        className={`
          ${sizeClasses[size]}
          rounded-full bg-[#0068FF] hover:bg-[#0052CC]
          text-white shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          group relative overflow-hidden
          border-2 border-white
        `}
        title="Chat Zalo: 0768426262"
      >
        {/* Zalo logo background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0084FF] to-[#0052CC] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Zalo Logo SVG */}
        <svg
          className="w-7 h-7 relative z-10"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 4C12.96 4 4 12.96 4 24c0 9.52 6.64 17.52 15.52 19.52V48l4.48-4.48c11.04 0 20-8.96 20-20S35.04 4 24 4z"
            fill="white"
          />
          <path
            d="M17.28 27.76c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88zm4.32 0c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88zm4.8 0c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88zm4.32 0c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88z"
            fill="#0068FF"
          />
        </svg>

        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-[#0068FF] animate-ping opacity-20" />
      </Button>

      {/* Tooltip with phone number */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 4C12.96 4 4 12.96 4 24c0 9.52 6.64 17.52 15.52 19.52V48l4.48-4.48c11.04 0 20-8.96 20-20S35.04 4 24 4z"
              fill="#0068FF"
            />
          </svg>
          <span className="font-semibold">0768426262</span>
        </div>
        <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </>
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