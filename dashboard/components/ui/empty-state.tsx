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
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

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
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl opacity-50" />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center border border-primary/20">
          <IconComponent className="w-12 h-12 sm:w-14 sm:h-14 text-primary/60" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
        {title}
      </h3>

      <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-6">
        {description}
      </p>

      {action && (
        <div>
          {action.href ? (
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href={action.href}>{action.label}</a>
            </Button>
          ) : (
            <Button 
              onClick={action.onClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
