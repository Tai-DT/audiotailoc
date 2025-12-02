import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { ServiceBooking } from '../types';
import { authStorage } from '../auth-storage';

export interface BookingFilters {
  status?: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateBookingData {
  serviceId: string;
  scheduledAt: string;
  scheduledTime?: string;
  notes?: string;
  estimatedCosts?: number;
  address?: string;
  coordinates?: string;
  goongPlaceId?: string;
  items?: Array<{
    serviceId: string;
    quantity: number;
  }>;
}

export const bookingQueryKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingQueryKeys.all, 'list'] as const,
  list: (filters?: BookingFilters) => [...bookingQueryKeys.lists(), filters] as const,
  details: () => [...bookingQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingQueryKeys.details(), id] as const,
};

export const useBookings = (filters: BookingFilters = {}) => {
  const hasToken = Boolean(authStorage.getAccessToken());
  
  return useQuery({
    queryKey: bookingQueryKeys.list(filters),
    queryFn: async () => {
      // Backend uses /bookings/my-bookings (not /booking)
      const response = await apiClient.get('/bookings/my-bookings', { params: filters });
      const data = handleApiResponse<{ items?: ServiceBooking[]; bookings?: ServiceBooking[]; total?: number; page?: number; limit?: number }>(response);
      
      // Handle different response formats
      const items = data.items || data.bookings || [];
      const total = data.total || items.length;
      
      return {
        items,
        total,
        page: data.page || 1,
        limit: data.limit || 10,
      };
    },
    enabled: hasToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBooking = (id: string) => {
  const hasToken = Boolean(authStorage.getAccessToken());
  
  return useQuery({
    queryKey: bookingQueryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/bookings/${id}`);
      return handleApiResponse<ServiceBooking>(response);
    },
    enabled: hasToken && !!id,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingData) => {
      const response = await apiClient.post('/bookings', data);
      return handleApiResponse<ServiceBooking>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/bookings/${id}/cancel`, {});
      return handleApiResponse<ServiceBooking>(response);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.detail(id) });
    },
  });
};

