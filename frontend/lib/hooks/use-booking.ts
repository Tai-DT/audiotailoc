
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse, API_ENDPOINTS } from '@/lib/api';
import { authStorage } from '@/lib/auth-storage';

export interface ServiceBookingDTO {
    serviceId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
    coordinates?: { lat: number; lng: number };
    goongPlaceId?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    notes?: string;
    // Legacy support
    phone?: string;
    email?: string;
    preferredDate?: string;
    preferredTime?: string;
}

export const useCreateServiceBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ServiceBookingDTO) => {
            const token = authStorage.getAccessToken();
            // Check token validity more robustly
            const hasValidToken = !!(token && typeof token === 'string' && token.trim().length > 0 && token !== 'null');

            // Explicitly choose endpoint with safe fallback
            const guestEndpoint = API_ENDPOINTS.SERVICES.GUEST_BOOKING || '/bookings/guest';
            const primaryEndpoint = hasValidToken
                ? (API_ENDPOINTS.SERVICES.CREATE_BOOKING || '/bookings')
                : guestEndpoint;
            const fallbackEndpoint = guestEndpoint;

            console.log('HOOK_USE_BOOKING_V2_ACTIVATED', {
                hasValidToken,
                token: hasValidToken ? 'HIDDEN' : token,
                primaryEndpoint,
                fallbackEndpoint,
                GUEST_OPT: API_ENDPOINTS.SERVICES.GUEST_BOOKING,
                USER_OPT: API_ENDPOINTS.SERVICES.CREATE_BOOKING
            });

            // Guest DTO also accepts customerAddress, so we can always pass it if present
            // Ensure payload matches backend expectation with flexible mapping
            const payload = {
                ...data,
                address: data.customerAddress,
                coordinates: data.coordinates,
                goongPlaceId: data.goongPlaceId,
                // Fallback mapping in case BE expects different names
                phone: data.customerPhone || data.phone,
                email: data.customerEmail || data.email,
                preferredDate: data.scheduledDate || data.preferredDate,
                preferredTime: data.scheduledTime || data.preferredTime
            };

            const sendBooking = async (targetEndpoint: string) =>
                handleApiResponse(await apiClient.post(targetEndpoint, payload));

            try {
                return await sendBooking(primaryEndpoint);
            } catch (error) {
                const unauthorized =
                    hasValidToken &&
                    axios.isAxiosError(error) &&
                    [401, 403].includes(error.response?.status || 0);

                if (unauthorized && primaryEndpoint !== fallbackEndpoint) {
                    console.warn(
                        'Authenticated booking failed, retrying as guest',
                        error.response?.status,
                        error.response?.data?.message || error.message,
                    );
                    return await sendBooking(fallbackEndpoint);
                }

                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        }
    });
}
