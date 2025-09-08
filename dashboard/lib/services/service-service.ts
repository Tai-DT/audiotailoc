import { apiClient } from "@/lib/api-client";
import { Service, ServiceFormData } from "@/types/service";

export type { Service, ServiceFormData };

export const serviceService = {
  async getServices(params?: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    type?: string; 
    isActive?: boolean 
  }) {
    const response = await apiClient.getServices(params);
    return response.data;
  },

  async getService(id: string) {
    const response = await apiClient.getService(id);
    return response.data;
  },

  async createService(serviceData: ServiceFormData) {
    const response = await apiClient.createService(serviceData);
    return response.data;
  },

  async updateService(id: string, serviceData: Partial<ServiceFormData>) {
    const response = await apiClient.updateService(id, serviceData);
    return response.data;
  },

  async deleteService(id: string) {
    await apiClient.deleteService(id);
  },

  async getServiceCategories() {
    const response = await apiClient.getServiceCategories();
    return response.data;
  },

  async getServiceTypes() {
    const response = await apiClient.getServiceTypes();
    return response.data;
  },

  formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  },

  formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }
};

export type { Service as ServiceType };
