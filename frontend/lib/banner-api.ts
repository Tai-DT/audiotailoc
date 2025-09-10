// Banner API extension for api-client
import apiClient from './api-client';

// Banners methods
export const bannerApi = {
  getAll: (params?: {
    page?: string;
    active?: boolean;
    search?: string;
    skip?: number;
    take?: number;
  }) => apiClient.getBanners(params),

  getActive: (page?: string) => apiClient.getActiveBanners(page)
};

// Add banner methods to ApiClient class
declare module './api-client' {
  interface ApiClient {
    getBanners(params?: {
      page?: string;
      active?: boolean;
      search?: string;
      skip?: number;
      take?: number;
    }): Promise<any>;

    getActiveBanners(page?: string): Promise<any>;
  }
}

// Add implementations to ApiClient
const originalApiClient = apiClient as any;
originalApiClient.getBanners = async function(params?: {
  page?: string;
  active?: boolean;
  search?: string;
  skip?: number;
  take?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  return this.get(`/content/banners?${queryParams.toString()}`);
};

originalApiClient.getActiveBanners = async function(page?: string) {
  const params = page ? `?page=${encodeURIComponent(page)}` : '';
  return this.get(`/content/banners/active${params}`);
};

export default bannerApi;