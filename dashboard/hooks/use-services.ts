import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { serviceService } from '@/lib/services/service-service';
import { Service, ServiceFormData, ServiceType } from '@/types/service';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<ServiceType[]>([]);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [servicesResponse, typesResponse] = await Promise.all([
        serviceService.getServices({ limit: 100 }),
        serviceService.getServiceTypes()
      ]);

      // Handle the wrapped API response structure
      const servicesData = servicesResponse?.data || servicesResponse;
      const typesData = typesResponse?.data || typesResponse;

      setServices(Array.isArray(servicesData) ? servicesData : ((servicesData as { services?: Service[] })?.services || []));

      // Transform types to add value and label fields
      const typesArray = Array.isArray(typesData) ? typesData : ((typesData as { types?: ServiceType[] })?.types || []);
      const transformedTypes = typesArray.map((type: ServiceType) => ({
        ...type,
        value: type.id,
        label: type.name
      }));
      setTypes(transformedTypes);
    } catch (err) {
      setError('Failed to load services. Please try again later.');
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = async (data: ServiceFormData) => {
    try {
      const response = await serviceService.createService(data);
      const newService = response?.data || response;
      setServices(prev => [newService as Service, ...prev]);
      toast.success('Tạo dịch vụ thành công');
      return newService;
    } catch (error) {
      toast.error('Không thể tạo dịch vụ');
      throw error;
    }
  };

  const updateService = async (id: string, data: Partial<ServiceFormData>) => {
    try {
      const response = await serviceService.updateService(id, data);
      const updatedService = response?.data || response;
      setServices(prev =>
        prev.map(service =>
          service.id === id ? { ...service, ...(updatedService as Service) } : service
        )
      );
      toast.success('Cập nhật dịch vụ thành công');
      return updatedService;
    } catch (error) {
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
      toast.error('Failed to delete service');
      throw error;
    }
  };

  const toggleServiceStatus = async (id: string, isActive: boolean) => {
    try {
      await updateService(id, { isActive: !isActive });
      toast.success(`Service ${isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
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