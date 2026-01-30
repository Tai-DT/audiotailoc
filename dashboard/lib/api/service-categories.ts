import { ServiceCategory } from '@/types/service-category';
import { apiClient } from '../api-client';

const ENDPOINT = '/service-categories';

export const serviceCategoryApi = {
  // Get all service categories
  getAll: async (): Promise<ServiceCategory[]> => {
    const { data } = await apiClient.get<ServiceCategory[]>(ENDPOINT);
    return data;
  },

  // Get a single category by ID
  getById: async (id: string): Promise<ServiceCategory> => {
    const { data } = await apiClient.get<ServiceCategory>(`${ENDPOINT}/${id}`);
    return data;
  },

  // Create a new category
  create: async (category: Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceCategory> => {
    const { data } = await apiClient.post<ServiceCategory>(ENDPOINT, category);
    return data;
  },

  // Update a category
  update: async (id: string, updates: Partial<ServiceCategory>): Promise<ServiceCategory> => {
    const { data } = await apiClient.patch<ServiceCategory>(`${ENDPOINT}/${id}`, updates);
    return data;
  },

  // Delete a category
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },

  // Toggle category status
  toggleStatus: async (id: string, isActive: boolean): Promise<ServiceCategory> => {
    const { data } = await apiClient.patch<ServiceCategory>(`${ENDPOINT}/${id}`, { isActive });
    return data;
  }
};
