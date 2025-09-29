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
      const response = await apiClient.get('/testimonials');
      return handleApiResponse<Testimonial[]>(response);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
