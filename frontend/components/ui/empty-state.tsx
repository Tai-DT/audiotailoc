'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

/**
 * EmptyState Component - Optimized without framer-motion
 * Uses CSS animations for fade-in effects
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const IconComponent = Icon || Package;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in-up',
        className
      )}
      style={{ animationDuration: '0.5s' }}
    >
      <div 
        className="relative mb-6 animate-fade-in-up"
        style={{ animationDelay: '0.1s', animationDuration: '0.5s' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center border border-primary/20">
          <IconComponent className="w-12 h-12 sm:w-14 sm:h-14 text-primary/60" />
        </div>
      </div>

      <h3
        className="text-xl sm:text-2xl font-semibold text-foreground mb-2 animate-fade-in-up"
        style={{ animationDelay: '0.2s', animationDuration: '0.5s' }}
      >
        {title}
      </h3>

      <p
        className="text-sm sm:text-base text-muted-foreground max-w-md mb-6 animate-fade-in-up"
        style={{ animationDelay: '0.3s', animationDuration: '0.5s' }}
      >
        {description}
      </p>

      {action && (
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: '0.4s', animationDuration: '0.5s' }}
        >
          <Button
            asChild
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            <a href={action.href}>{action.label}</a>
          </Button>
        </div>
      )}
    </div>
  );
}
