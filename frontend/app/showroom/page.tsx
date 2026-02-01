'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /showroom to /stores
export default function ShowroomPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/stores');
    }, [router]);

    return null;
}
