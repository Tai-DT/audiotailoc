import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category?: string;
    displayOrder: number;
    isActive: boolean;
}

export const useFAQs = () => {
    return useQuery({
        queryKey: ['faqs'],
        queryFn: async () => {
            try {
                const response = await apiClient.get('/faq');
                return handleApiResponse<FAQ[]>(response);
            } catch (error: unknown) {
                // Handle 404 gracefully
                const status = (error as { response?: { status?: number } })?.response?.status;
                if (status === 404) {
                    return [];
                }
                throw error;
            }
        },
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
};
