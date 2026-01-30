'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /sale to /deals
export default function SalePage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/deals');
    }, [router]);

    return null;
}
