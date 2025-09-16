// Simple toast hook without complex JSX to avoid build issues
import React, { useState, useCallback } from 'react';

interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
}

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback((props: Omit<ToastProps, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    const newToast = { ...props, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
    
    return id;
  }, []);

  const dismiss = useCallback((toastId: string) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}

// Mock exports for compatibility
export const ToastProvider = 'div';
export const ToastViewport = 'div';
export const Toast = 'div';
export const ToastTitle = 'div';
export const ToastDescription = 'div';
export const ToastClose = 'div';
export const ToastAction = 'button';
export type ToastActionElement = React.ReactElement;
