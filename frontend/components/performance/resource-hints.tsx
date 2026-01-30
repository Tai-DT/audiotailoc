'use client';

import { useEffect } from 'react';

/**
 * ResourceHints - Preloads critical resources dynamically
 * This helps improve LCP by prefetching resources before they're needed
 */
export function ResourceHints() {
 useEffect(() => {
 // Only run in browser
 if (typeof window === 'undefined') return;

 // Prefetch critical navigation pages after initial render
 const prefetchAfterIdle = () => {
 const criticalPaths = [
 '/products',
 '/services',  '/contact',
 ];

 criticalPaths.forEach((path) => {
 const link = document.createElement('link');
 link.rel = 'prefetch';
 link.href = path;
 link.as = 'document';
 document.head.appendChild(link);
 });

 // Preload first product images if we're on homepage
 if (window.location.pathname === '/') {
 // Find product images and preload the first few
 setTimeout(() => {
 const productImages = document.querySelectorAll('[data-product-image]');
 productImages.forEach((img, index) => {
 if (index < 4 && img instanceof HTMLImageElement && img.src) {
 const link = document.createElement('link');
 link.rel = 'preload';
 link.as = 'image';
 link.href = img.src;
 document.head.appendChild(link);
 }
 });
 }, 100);
 }
 };

 // Use requestIdleCallback to run when browser is idle
 if ('requestIdleCallback' in window) {
 window.requestIdleCallback(prefetchAfterIdle, { timeout: 3000 });
 } else {
 setTimeout(prefetchAfterIdle, 1000);
 }
 }, []);

 return null;
}

/**
 * DeferredScripts - Loads non-critical scripts after page is interactive
 */
export function DeferredScripts() {
 useEffect(() => {
 if (typeof window === 'undefined') return;

 const loadDeferredScripts = () => {
 // Add any third-party scripts that can be deferred here
 // Example: Analytics, social widgets, etc.
 };

 // Wait for page to be fully loaded
 if (document.readyState === 'complete') {
 loadDeferredScripts();
 } else {
 window.addEventListener('load', loadDeferredScripts);
 return () => window.removeEventListener('load', loadDeferredScripts);
 }
 }, []);

 return null;
}
