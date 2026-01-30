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
                className: 'elite-toast',
                style: {
                    background: 'rgba(8, 4, 4, 0.95)', // Deep obsidian glass
                    color: '#fff',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '12px 16px',
                    maxWidth: '400px',
                },
                success: {
                    duration: 3000,
                    style: {
                        border: '1px solid rgba(34, 197, 94, 0.2)', // Green glow
                        background: 'radial-gradient(circle at left, rgba(34, 197, 94, 0.1) 0%, rgba(8, 4, 4, 0.95) 100%)',
                    },
                    iconTheme: {
                        primary: '#22c55e',
                        secondary: '#fff',
                    },
                },
                error: {
                    duration: 5000,
                    style: {
                        border: '1px solid rgba(220, 38, 38, 0.2)', // Red glow
                        background: 'radial-gradient(circle at left, rgba(220, 38, 38, 0.15) 0%, rgba(8, 4, 4, 0.95) 100%)',
                    },
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                },
                loading: {
                    style: {
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                },
            }}
        />
    );
}
