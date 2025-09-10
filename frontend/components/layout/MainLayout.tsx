'use client';

import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuthStore, useCartStore, useProductStore } from '@/lib/store';
import { Toaster } from 'sonner';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  const { isAuthenticated } = useAuthStore();
  const { getCart } = useCartStore();
  const { getCategories } = useProductStore();

  useEffect(() => {
    // Initialize app data
    const initializeApp = async () => {
      try {
        // Load categories (always needed for navigation)
        await getCategories();
        
        // Load cart if authenticated
        if (isAuthenticated) {
          await getCart();
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, [isAuthenticated, getCart, getCategories]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className={`flex-1 ${className || ''}`}>
        {children}
      </main>
      
      <Footer />
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </div>
  );
}
