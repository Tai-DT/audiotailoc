'use client';

import { useState, useEffect } from 'react';
import { Header } from './header';

/**
 * Wrapper component to prevent hydration mismatch from Radix UI NavigationMenu
 * by only rendering on client side after mount
 */
export function HeaderWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a skeleton header during SSR to maintain layout
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between" />
        </div>
      </header>
    );
  }

  return <Header />;
}
