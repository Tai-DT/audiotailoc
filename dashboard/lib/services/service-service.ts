import { apiClient } from "@/lib/api-client";
import { Service, ServiceFormData } from "@/types/service";

export type { Service, ServiceFormData };

export const serviceService = {
  async getServices(params?: {
    page?: number;
    limit?: number;
    typeId?: string;
    isActive?: boolean
  }) {
    const response = await apiClient.getServices(params);
    return response;
  },

  async getService(id: string) {
    const response = await apiClient.getService(id);
    return response;
  },

  async createService(serviceData: ServiceFormData) {
    // Convert price to proper format for backend
    const payload = {
      ...serviceData,
      estimatedDuration: serviceData.duration,
      // Backend accepts either price or basePriceCents
      price: serviceData.price,
    };
    const response = await apiClient.createService(payload);
    return response;
  },

  async updateService(id: string, serviceData: Partial<ServiceFormData>) {
    // Convert price to proper format for backend
    const payload = {
      ...serviceData,
      estimatedDuration: serviceData.duration,
      price: serviceData.price,
    };
    const response = await apiClient.updateService(id, payload);
    return response;
  },

  async deleteService(id: string) {
    await apiClient.deleteService(id);
  },


  async getServiceTypes() {
    const response = await apiClient.getServiceTypes();
    return response;
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
