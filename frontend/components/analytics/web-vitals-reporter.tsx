'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/web-vitals';

/**
 * Web Vitals Reporter Component
 * Initializes Web Vitals tracking on mount
 * Should be placed in the root layout
 */
export function WebVitalsReporter() {
 useEffect(() => {
 initWebVitals();
 }, []);

 return null;
}
