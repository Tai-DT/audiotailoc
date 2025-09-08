import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { serviceService } from '@/lib/services/service-service';
import { Service, ServiceFormData, ServiceCategory, ServiceType } from '@/types/service';

interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  limit: number;
}

interface CategoriesResponse {
  categories: ServiceCategory[];
  total: number;
}

interface TypesResponse {
  types: ServiceType[];
  total: number;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [types, setTypes] = useState<ServiceType[]>([]);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [servicesResponse, categoriesResponse, typesResponse] = await Promise.all([
        serviceService.getServices({ limit: 100 }) as Promise<ServicesResponse>,
        serviceService.getServiceCategories() as Promise<CategoriesResponse>,
        serviceService.getServiceTypes() as Promise<TypesResponse>
      ]);

      setServices(servicesResponse.services || []);
      setCategories(categoriesResponse.categories || []);
      setTypes(typesResponse.types || []);
    } catch (err) {
      console.error('Error fetching services data:', err);
      setError('Failed to load services. Please try again later.');
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = async (data: ServiceFormData) => {
    try {
      const newService = await serviceService.createService(data);
      setServices(prev => [newService as Service, ...prev]);
      toast.success('Tạo dịch vụ thành công');
      return newService;
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Không thể tạo dịch vụ');
      throw error;
    }
  };

  const updateService = async (id: string, data: Partial<ServiceFormData>) => {
    try {
      const updatedService = await serviceService.updateService(id, data);
      setServices(prev => 
        prev.map(service => 
          service.id === id ? { ...service, ...(updatedService as Service) } : service
        )
      );
      toast.success('Cập nhật dịch vụ thành công');
      return updatedService;
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Không thể cập nhật dịch vụ');
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await serviceService.deleteService(id);
      setServices(prev => prev.filter(service => service.id !== id));
      toast.success('Service deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
      throw error;
    }
  };

  const toggleServiceStatus = async (id: string, isActive: boolean) => {
    try {
      await updateService(id, { isActive: !isActive });
      toast.success(`Service ${isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error toggling service status:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    categories,
    types,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    refresh: fetchServices
  };
}
