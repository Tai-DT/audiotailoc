'use client';

import React, { useState } from 'react';
import AIChatWidget from './AIChatWidget';

export default function AIChatWidgetProvider() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleMinimizeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <AIChatWidget
      isOpen={isChatOpen}
      onToggle={handleToggleChat}
      onMinimize={handleMinimizeChat}
    />
  );
}
