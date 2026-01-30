import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { authStorage } from '../auth-storage';
import { ServiceBooking, Service } from '../types';

const normalizeImages = (value: unknown): string[] | undefined => {
    if (!value) return undefined;
    if (Array.isArray(value)) {
        return value.map(item => String(item)).filter(Boolean);
    }
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed.map(item => String(item)).filter(Boolean);
            }
        } catch {
            return value
                .split(',')
                .map(item => item.trim())
                .filter(Boolean);
        }
    }
    return undefined;
};

// Extended booking type for raw API response that may have different field names
interface RawBookingData extends Omit<ServiceBooking, 'service' | 'user' | 'technician'> {
    service?: Service;
    services?: Service;
    user?: { name?: string; email?: string; id?: string };
    users?: { name?: string; email?: string; id?: string };
    technician?: { name?: string; id?: string };
    technicians?: { name?: string; id?: string };
    customerPhone?: string;
}

export const useMyBookings = () => {
    const token = typeof window !== 'undefined' ? authStorage.getAccessToken() : null;
    const user = typeof window !== 'undefined' ? authStorage.getUser() : null;
    const enabled = Boolean(token && token.trim().length > 0 && token !== 'null' && user);

    return useQuery({
        queryKey: ['my-bookings'],
        queryFn: async (): Promise<ServiceBooking[]> => {
            const response = await apiClient.get('/bookings/my-bookings');
            const data = handleApiResponse<RawBookingData[]>(response);
            return data.map((booking) => {
                const rawService = booking.service || booking.services;
                const rawUser = booking.user || booking.users;
                const rawTech = booking.technician || booking.technicians;

                // Normalize service images if present
                const normalizedService = rawService
                    ? { ...rawService, images: normalizeImages(rawService.images) }
                    : undefined;

                return {
                    ...booking,
                    service: normalizedService,
                    user: rawUser,
                    technician: rawTech,
                    phoneNumber: booking.phoneNumber || booking.customerPhone,
                    customerName: booking.customerName || rawUser?.name,
                    customerEmail: booking.customerEmail || rawUser?.email,
                } as ServiceBooking;
            });
        },
        staleTime: 5 * 60 * 1000,
        enabled,
    });
};
