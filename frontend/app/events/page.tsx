'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /events to /news (events are shown in news page)
export default function EventsPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/news?category=event');
    }, [router]);

    return null;
}
