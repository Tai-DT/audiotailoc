import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '@/lib/api';
import type { ContactInfo } from '@/lib/contact-info';

export function useContactInfo() {
    return useQuery({
        queryKey: ['contact-info'],
        queryFn: async (): Promise<ContactInfo> => {
            const response = await apiClient.get('/site/contact-info');
            return handleApiResponse<ContactInfo>(response);
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

export type { ContactInfo };
