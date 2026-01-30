'use client';

import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create QueryClient instance factory to ensure it's not created during SSR
function makeQueryClient() {
 return new QueryClient({
 defaultOptions: {
 queries: {
 // Data is considered fresh for 5 minutes
 staleTime: 5 * 60 * 1000,
 // Keep unused data in cache for 30 minutes (for back navigation)
 gcTime: 30 * 60 * 1000,
 // Only retry once to reduce network overhead
 retry: 1,
 // Don't refetch on window focus to reduce API calls
 refetchOnWindowFocus: false,
 // Don't refetch on reconnect to reduce API calls
 refetchOnReconnect: false,
 // Enable structural sharing for better performance
 structuralSharing: true,
 },
 mutations: {
 // Retry mutations once
 retry: 1,
 },
 },
 });
}

// Browser: create a single QueryClient instance
// Server: create new instance per request (will be replaced on hydration)
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
 if (typeof window === 'undefined') {
 // Server: always create a new QueryClient
 return makeQueryClient();
 }
 // Browser: make a new client if we don't have one yet
 if (!browserQueryClient) {
 browserQueryClient = makeQueryClient();
 }
 return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
 // useMemo ensures we only create once per render cycle
 const queryClient = useMemo(() => getQueryClient(), []);

 return (
 <QueryClientProvider client={queryClient}>
 {children}
 </QueryClientProvider>
 );
}
