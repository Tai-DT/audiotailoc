"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Volume2, VolumeX, ZoomIn, ZoomOut, Menu, X } from 'lucide-react';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Load user preferences from localStorage
    const saved = localStorage.getItem('accessibility-prefs');
    if (saved) {
      const prefs = JSON.parse(saved);
      setHighContrast(prefs.highContrast);
      setLargeText(prefs.largeText);
      setReducedMotion(prefs.reducedMotion);
      setSoundEnabled(prefs.soundEnabled);
    }

    // Check system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(prefersReducedMotion.matches);

    prefersReducedMotion.addEventListener('change', (e) => {
      setReducedMotion(e.matches);
    });
  }, []);

  useEffect(() => {
    // Apply accessibility settings
    document.documentElement.classList.toggle('high-contrast', highContrast);
    document.documentElement.classList.toggle('large-text', largeText);
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);

    // Save preferences
    localStorage.setItem('accessibility-prefs', JSON.stringify({
      highContrast,
      largeText,
      reducedMotion,
      soundEnabled,
    }));
  }, [highContrast, largeText, reducedMotion, soundEnabled]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleLargeText = () => setLargeText(!largeText);
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion);
  const toggleSound = () => setSoundEnabled(!soundEnabled);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
        aria-label="Mở menu trợ năng"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px]">
          <h3 className="font-semibold text-lg mb-4">Trợ năng</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span className="text-sm">Độ tương phản cao</span>
              </div>
              <Button
                variant={highContrast ? "default" : "outline"}
                size="sm"
                onClick={toggleHighContrast}
                aria-pressed={highContrast}
              >
                {highContrast ? 'Tắt' : 'Bật'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZoomIn size={18} />
                <span className="text-sm">Phông chữ lớn</span>
              </div>
              <Button
                variant={largeText ? "default" : "outline"}
                size="sm"
                onClick={toggleLargeText}
                aria-pressed={largeText}
              >
                {largeText ? 'Tắt' : 'Bật'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZoomOut size={18} />
                <span className="text-sm">Giảm chuyển động</span>
              </div>
              <Button
                variant={reducedMotion ? "default" : "outline"}
                size="sm"
                onClick={toggleReducedMotion}
                aria-pressed={reducedMotion}
              >
                {reducedMotion ? 'Tắt' : 'Bật'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                <span className="text-sm">Âm thanh</span>
              </div>
              <Button
                variant={soundEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleSound}
                aria-pressed={soundEnabled}
              >
                {soundEnabled ? 'Tắt' : 'Bật'}
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHighContrast(false);
                setLargeText(false);
                setReducedMotion(false);
                setSoundEnabled(true);
              }}
              className="w-full"
            >
              Đặt lại mặc định
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Skip link for keyboard navigation
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 rounded-b-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Chuyển đến nội dung chính
      </a>
    </div>
  );
}

// Focus management hook
import { useEffect as useFocusEffect } from 'react';

export function useFocusTrap(ref: React.RefObject<HTMLElement>, isActive: boolean) {
  useFocusEffect(() => {
    if (!isActive || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, ref]);
}

// Screen reader announcement
export function ScreenReaderAnnouncement({
  message,
  priority = 'polite'
}: {
  message: string;
  priority?: 'polite' | 'assertive';
}) {
  const [announcement, setAnnouncement] = useState(message);

  useEffect(() => {
    setAnnouncement(message);
  }, [message]);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

