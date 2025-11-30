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
    // This matches the actual header structure to prevent layout shift
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        {/* Top bar skeleton */}
        <div className="border-b border-border/40 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex h-14 items-center justify-center">
              <div className="h-4 w-32 bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between gap-2 sm:gap-4">
            {/* Logo placeholder */}
            <div className="h-7 w-24 sm:h-8 sm:w-32 bg-muted/20 rounded animate-pulse shrink-0" />
            
            {/* Navigation placeholder - hidden on mobile */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              <div className="h-9 w-20 bg-muted/20 rounded animate-pulse" />
              <div className="h-9 w-20 bg-muted/20 rounded animate-pulse" />
            </div>
            
            {/* Search placeholder - hidden on mobile */}
            <div className="hidden lg:flex lg:flex-1 lg:max-w-md xl:max-w-xl">
              <div className="h-9 w-full bg-muted/20 rounded animate-pulse" />
            </div>
            
            {/* Actions placeholder */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="h-9 w-9 bg-muted/20 rounded animate-pulse" />
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-9 w-20 bg-muted/20 rounded animate-pulse" />
              </div>
              <div className="lg:hidden h-9 w-9 bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return <Header />;
}
