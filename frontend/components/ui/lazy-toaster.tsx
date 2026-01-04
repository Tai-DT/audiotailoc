'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Lazy load Toaster - not needed for initial render
const ToasterComponent = dynamic(
  () => import('react-hot-toast').then(mod => ({ default: mod.Toaster })),
  { ssr: false }
);

/**
 * LazyToaster - Defers loading of react-hot-toast until after initial render
 * Since toasts are typically triggered by user actions, we don't need them immediately
 */
export function LazyToaster() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load after a short delay - toasts are triggered by user actions
    const timer = setTimeout(() => setShouldLoad(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <ToasterComponent
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
        },
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
      }}
    />
  );
}
