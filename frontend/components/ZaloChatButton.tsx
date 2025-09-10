"use client";

import React from "react";

type ZaloChatButtonProps = {
  phone?: string;
  className?: string;
};

export default function ZaloChatButton({ phone, className }: ZaloChatButtonProps) {
  const configuredPhone = phone || process.env.NEXT_PUBLIC_ZALO_PHONE || "0582454014";
  const url = `https://zalo.me/${configuredPhone}`;

  const handleClick = () => {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // no-op
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className || ""}`}>
      <button
        onClick={handleClick}
        aria-label="Chat qua Zalo"
        title="Chat qua Zalo"
        className="w-14 h-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white flex items-center justify-center transition-colors"
      >
        {/* Simple Z icon */}
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
          <text x="50%" y="55%" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">Z</text>
        </svg>
      </button>
    </div>
  );
}

