import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

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

// Default contact info - fallback when API is unavailable
const DEFAULT_CONTACT: ContactInfo = {
    phone: {
        hotline: '0768426262',
        display: '0768 426 262',
    },
    email: 'audiotailoc@gmail.com',
    address: {
        full: '37/9 Đường 44, Phường Linh Đông, TP. Thủ Đức, TP.HCM',
        street: '37/9 Đường 44',
        ward: 'Phường Linh Đông',
        district: 'TP. Thủ Đức',
        city: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
    },
    social: {
        facebook: 'https://facebook.com/audiotailoc',
        instagram: 'https://instagram.com/audiotailoc',
        youtube: 'https://youtube.com/audiotailoc',
        zalo: 'https://zalo.me/0768426262',
    },
    businessHours: {
        display: '08:00 - 21:00 (T2 - CN)',
    },
    zalo: {
        phoneNumber: '0768426262',
        displayName: 'Audio Tài Lộc',
    },
};

export function useContactInfo() {
    return useQuery({
        queryKey: ['contact-info'],
        queryFn: async (): Promise<ContactInfo> => {
            try {
                const response = await apiClient.get('/site/contact-info');
                return response.data;
            } catch {
                return DEFAULT_CONTACT;
            }
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        placeholderData: DEFAULT_CONTACT,
    });
}
