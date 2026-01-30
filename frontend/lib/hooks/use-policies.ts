import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface Policy {
    id: string;
    slug: string;
    title: string;
    content: string;
    type: string;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export function usePolicies() {
    return useQuery({
        queryKey: ['policies'],
        queryFn: async (): Promise<Policy[]> => {
            const response = await apiClient.get('/policies');
            // Handle different response structures
            if (Array.isArray(response.data)) {
                return response.data;
            }
            if (response.data?.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            if (response.data?.items && Array.isArray(response.data.items)) {
                return response.data.items;
            }
            return [];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function usePolicy(slug: string) {
    return useQuery({
        queryKey: ['policy', slug],
        queryFn: async (): Promise<Policy | null> => {
            try {
                const response = await apiClient.get<{ success: boolean; data: any }>(`/policies/${slug}`);
                const rawData = response.data?.data || response.data;

                if (!rawData) return null;

                // Map contentHtml from backend to content for frontend components
                return {
                    ...rawData,
                    content: rawData.contentHtml || rawData.content || '',
                };
            } catch {
                return null;
            }
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
