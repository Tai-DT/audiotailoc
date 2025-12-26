'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const themes = [
  {
    key: 'system',
    icon: Monitor,
    label: 'System theme',
  },
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
  },
];

export type ThemeSwitcherProps = {
  className?: string;
};

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!mounted) {
    return null;
  }

  const activeTheme = (theme as 'light' | 'dark' | 'system') ?? 'system';

  return (
    <div
      className={cn(
        'relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border',
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = activeTheme === key;

        if (isActive) {
          return (
            <button
              aria-label={label}
              aria-pressed="true"
              className="relative h-6 w-6 rounded-full"
              key={key}
              onClick={() => setTheme(key as 'light' | 'dark' | 'system')}
              type="button"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-secondary"
                layoutId="activeTheme"
                transition={{ type: 'spring', duration: 0.5 }}
              />
              <Icon className={cn('relative z-10 m-auto h-4 w-4', 'text-foreground')} />
            </button>
          );
        }

        return (
          <button
            aria-label={label}
            aria-pressed="false"
            className="relative h-6 w-6 rounded-full"
            key={key}
            onClick={() => setTheme(key as 'light' | 'dark' | 'system')}
            type="button"
          >
            <Icon className={cn('relative z-10 m-auto h-4 w-4', 'text-muted-foreground')} />
          </button>
        );
      })}
    </div>
  );
};