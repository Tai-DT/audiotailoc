import { apiClient } from '@/lib/api-client';
import { SoftwareFormData } from '@/types/software';

export const softwareService = {
  async list(params?: { page?: number; limit?: number }) {
    const response = await apiClient.get('/software', { params });
    return response;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/software/admin/${id}`);
    return response;
  },

  async create(payload: SoftwareFormData) {
    const response = await apiClient.post('/software', payload);
    return response;
  },

  async update(id: string, payload: Partial<SoftwareFormData>) {
    const response = await apiClient.patch(`/software/${id}`, payload);
    return response;
  },

  async remove(id: string) {
    await apiClient.delete(`/software/${id}`);
  }
};
