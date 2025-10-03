import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';

export interface SiteStat {
  id: string;
  key: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const useSiteStats = () => {
  return useQuery({
    queryKey: ['site-stats'],
    queryFn: async () => {
      // Check if API URL is configured
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl || apiUrl.trim() === '') {
        console.warn('NEXT_PUBLIC_API_URL not configured, using default site stats');
        return getDefaultSiteStats();
      }

      try {
        const response = await apiClient.get('/homepage-stats');
        return handleApiResponse<SiteStat[]>(response);
      } catch (error) {
        console.warn('Site stats not available, using defaults:', error);
        return getDefaultSiteStats();
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Helper function to get default site stats
function getDefaultSiteStats(): SiteStat[] {
  return [
    {
      id: '1',
      key: 'happy_customers',
      value: '500+',
      label: 'Khách hàng hài lòng',
      description: 'Số lượng khách hàng đã sử dụng dịch vụ',
      icon: 'users',
      isActive: true,
      displayOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      key: 'projects_completed',
      value: '300+',
      label: 'Dự án hoàn thành',
      description: 'Số lượng dự án âm thanh đã triển khai thành công',
      icon: 'briefcase',
      isActive: true,
      displayOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      key: 'years_experience',
      value: '5+',
      label: 'Năm kinh nghiệm',
      description: 'Kinh nghiệm trong lĩnh vực âm thanh chuyên nghiệp',
      icon: 'award',
      isActive: true,
      displayOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      key: 'products_available',
      value: '1000+',
      label: 'Sản phẩm',
      description: 'Đa dạng sản phẩm âm thanh chất lượng cao',
      icon: 'package',
      isActive: true,
      displayOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
