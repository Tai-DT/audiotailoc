import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';

export interface Testimonial {
  id: string;
  name: string;
  position?: string;
  company?: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/testimonials');
        return handleApiResponse<Testimonial[]>(response);
      } catch (error: unknown) {
        // Handle 404 or missing endpoint gracefully
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          console.warn('[useTestimonials] Testimonials endpoint not found (404). Returning empty array.');
          return [];
        }
        // Re-throw other errors
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
