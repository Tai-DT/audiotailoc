import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { ServiceBooking } from '../types';

export const useMyBookings = () => {
    return useQuery({
        queryKey: ['my-bookings'],
        queryFn: async () => {
            const response = await apiClient.get('/bookings/my-bookings');
            return handleApiResponse<ServiceBooking[]>(response);
        },
        staleTime: 5 * 60 * 1000,
    });
};
