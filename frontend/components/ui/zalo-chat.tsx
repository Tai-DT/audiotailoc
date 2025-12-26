'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { MagicCard } from './magic-card';
import { MessageCircle } from 'lucide-react';

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
  // const [isLoaded, setIsLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Zalo SDK loading removed to prevent "ERR_BLOCKED_BY_CLIENT" errors 
  // and because the custom button below handles the chat functionality via window.open
  /*
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
  */

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
    small: 'w-14 h-14',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative"
      >
        <MagicCard
          className="rounded-full"
          gradientSize={200}
          gradientColor="oklch(0.65 0.15 220 / 0.3)"
          gradientFrom="oklch(0.65 0.15 220)"
          gradientTo="oklch(0.70 0.22 40)"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              onClick={handleChatClick}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`
                ${sizeClasses[size]}
                rounded-full bg-gradient-to-br from-[#0068FF] to-[#0052CC]
                text-white shadow-2xl hover:shadow-[#0068FF]/50
                transition-all duration-300 ease-in-out
                flex items-center justify-center
                group relative overflow-hidden
                border-2 border-white/20
                hover:border-white/40
              `}
              title={`Chat Zalo: ${phoneNumber}`}
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#0084FF] via-[#0068FF] to-[#0052CC]"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              />

              {/* Zalo Logo SVG */}
              <motion.svg
                className={`${iconSizes[size]} relative z-10`}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <path
                  d="M24 4C12.96 4 4 12.96 4 24c0 9.52 6.64 17.52 15.52 19.52V48l4.48-4.48c11.04 0 20-8.96 20-20S35.04 4 24 4z"
                  fill="white"
                />
                <path
                  d="M17.28 27.76c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88zm4.32 0c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88zm4.8 0c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88zm4.32 0c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88z"
                  fill="#0068FF"
                />
              </motion.svg>

              {/* Pulse animation rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/30"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.5, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/20"
                animate={{
                  scale: [1, 1.3, 1.6],
                  opacity: [0.4, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: 'easeOut',
                }}
              />
            </Button>
          </motion.div>
        </MagicCard>

        {/* Enhanced Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-3"
            >
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white text-sm rounded-xl px-4 py-2.5 shadow-2xl whitespace-nowrap pointer-events-none border border-white/10">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#0068FF]" />
                  <span className="font-semibold">Chat Zalo</span>
                </div>
                <div className="text-xs text-muted-foreground/60 mt-1">{phoneNumber}</div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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