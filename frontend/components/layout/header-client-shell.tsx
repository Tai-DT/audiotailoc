 'use client';

 import dynamic from 'next/dynamic';

 const AppHeader = dynamic(() => import('@/components/layout/header-client'), {
     ssr: false,
 });

 export default function HeaderClientShell() {
     return <AppHeader />;
 }
