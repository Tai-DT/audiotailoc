import { ServiceType, CreateServiceTypeDto, UpdateServiceTypeDto } from '@/types/service-type';
import { apiClient } from '../api-client';

const ENDPOINT = '/service-types';

export const serviceTypeApi = {
  // Get all service types
  getAll: async (categoryId?: string): Promise<ServiceType[]> => {
    const params = categoryId ? { categoryId } : undefined;
    const { data } = await apiClient.get<ServiceType[]>(ENDPOINT, params ? { params } : {});
    return data;
  },

  // Get a single service type by ID
  getById: async (id: string): Promise<ServiceType> => {
    const { data } = await apiClient.get<ServiceType>(`${ENDPOINT}/${id}`);
    return data;
  },

  // Create a new service type
  create: async (serviceType: CreateServiceTypeDto): Promise<ServiceType> => {
    const { data } = await apiClient.post<ServiceType>(ENDPOINT, serviceType as unknown as Record<string, unknown>);
    return data;
  },

  // Update an existing service type
  update: async (id: string, updates: UpdateServiceTypeDto): Promise<ServiceType> => {
    const { data } = await apiClient.patch<ServiceType>(`${ENDPOINT}/${id}`, updates);
    return data;
  },

  // Delete a service type
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },

  // Toggle service type status
  toggleStatus: async (id: string, isActive: boolean): Promise<ServiceType> => {
    const { data } = await apiClient.patch<ServiceType>(`${ENDPOINT}/${id}`, { isActive });
    return data;
  }
};
