import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '@/lib/api';

export interface ContactInfo {
    phone: {
        hotline: string;
        display: string;
    };
    email: string;
    address: {
        full: string;
        street: string;
        ward: string;
        district: string;
        city: string;
        country: string;
    };
    social: {
        facebook: string;
        instagram: string;
        youtube: string;
        zalo: string;
    };
    businessHours: {
        display: string;
    };
    zalo: {
        phoneNumber: string;
        displayName: string;
    };
}

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
