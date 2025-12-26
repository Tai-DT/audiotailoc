import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { Technician } from '../types';

interface GetTechniciansParams {
    isActive?: boolean;
    specialty?: string;
    page?: number;
    pageSize?: number;
}

interface TechniciansResponse {
    items: Technician[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export const useTechnicians = (params: GetTechniciansParams = {}) => {
    return useQuery({
        queryKey: ['technicians', params],
        queryFn: async () => {
            const { isActive, specialty, page, pageSize } = params;
            const queryParams = new URLSearchParams();

            if (isActive !== undefined) queryParams.append('isActive', String(isActive));
            if (specialty) queryParams.append('specialty', specialty);
            if (page) queryParams.append('page', String(page));
            if (pageSize) queryParams.append('pageSize', String(pageSize));

            const response = await apiClient.get(`/technicians?${queryParams.toString()}`);

            // Backend might return array directly or paginated object, need to handle both based on controller
            // Based on controller it calls techniciansService.getTechnicians which likely returns paginated result
            return handleApiResponse<TechniciansResponse | Technician[]>(response);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useTechnician = (id: string) => {
    return useQuery({
        queryKey: ['technicians', id],
        queryFn: async () => {
            const response = await apiClient.get(`/technicians/${id}`);
            return handleApiResponse<Technician>(response);
        },
        enabled: !!id,
    });
};
