import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse, handleApiError } from '../api';
import { 
  Product, 
  Category, 
  Order, 
  Cart, 
  Service, 
  ServiceType, 
  User,
  DashboardOverview,
  SalesAnalytics,
  CustomerAnalytics,
  InventoryAnalytics,
  BusinessKPIs,
  ProductFilters,
  OrderFilters,
  ServiceFilters,
  PaginatedResponse,
  ProductForm,
  CategoryForm,
  ServiceForm,
  LoginForm,
  RegisterForm
} from '../types';

// Query keys factory
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: ProductFilters) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    analytics: ['products', 'analytics'] as const,
    topViewed: ['products', 'top-viewed'] as const,
    recent: ['products', 'recent'] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: () => [...queryKeys.categories.lists()] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters: OrderFilters) => [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters: ServiceFilters) => [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
    types: ['services', 'types'] as const,
  },
  cart: {
    all: ['cart'] as const,
    get: () => [...queryKeys.cart.all, 'get'] as const,
  },
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    overview: () => [...queryKeys.dashboard.all, 'overview'] as const,
    analytics: () => [...queryKeys.dashboard.all, 'analytics'] as const,
    sales: () => [...queryKeys.dashboard.all, 'sales'] as const,
    customers: () => [...queryKeys.dashboard.all, 'customers'] as const,
    inventory: () => [...queryKeys.dashboard.all, 'inventory'] as const,
    kpis: () => [...queryKeys.dashboard.all, 'kpis'] as const,
  },
};

// Products hooks
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/catalog/products', { params: filters });
      return handleApiResponse<PaginatedResponse<Product>>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/catalog/products/${id}`);
      return handleApiResponse<Product>(response);
    },
    enabled: !!id,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/catalog/products/slug/${slug}`);
      return handleApiResponse<Product>(response);
    },
    enabled: !!slug,
  });
};

export const useProductSearch = (query: string, limit = 10) => {
  return useQuery({
    queryKey: ['products', 'search', query, limit],
    queryFn: async () => {
      const response = await apiClient.get('/catalog/products/search', {
        params: { q: query, limit },
      });
      return handleApiResponse<Product[]>(response);
    },
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProductAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.products.analytics,
    queryFn: async () => {
      const response = await apiClient.get('/catalog/products/analytics/overview');
      return handleApiResponse<any>(response);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useTopViewedProducts = (limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.products.topViewed, limit],
    queryFn: async () => {
      const response = await apiClient.get('/catalog/products/analytics/top-viewed', {
        params: { limit },
      });
      const paginatedResponse = handleApiResponse<PaginatedResponse<Product>>(response);
      return paginatedResponse.items;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRecentProducts = (limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.products.recent, limit],
    queryFn: async () => {
      const response = await apiClient.get('/catalog/products/analytics/recent', {
        params: { limit },
      });
      const paginatedResponse = handleApiResponse<PaginatedResponse<Product>>(response);
      return paginatedResponse.items;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ProductForm) => {
      const response = await apiClient.post('/catalog/products', data);
      return handleApiResponse<Product>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.analytics });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductForm> }) => {
      const response = await apiClient.put(`/catalog/products/${id}`, data);
      return handleApiResponse<Product>(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.analytics });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/catalog/products/${id}`);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.analytics });
    },
  });
};

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      const response = await apiClient.get('/catalog/categories');
      return handleApiResponse<Category[]>(response);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/catalog/categories/${id}`);
      return handleApiResponse<Category>(response);
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CategoryForm) => {
      const response = await apiClient.post('/catalog/categories', data);
      return handleApiResponse<Category>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CategoryForm> }) => {
      const response = await apiClient.put(`/catalog/categories/${id}`, data);
      return handleApiResponse<Category>(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(id) });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/catalog/categories/${id}`);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
    },
  });
};

// Orders hooks
export const useOrders = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/orders', { params: filters });
      return handleApiResponse<PaginatedResponse<Order>>(response);
    },
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${id}`);
      return handleApiResponse<Order>(response);
    },
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/orders', data);
      return handleApiResponse<Order>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.get() });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/orders/${id}`, data);
      return handleApiResponse<Order>(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
    },
  });
};

// Services hooks
export const useServices = (filters: ServiceFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/services', { params: filters });
      return handleApiResponse<PaginatedResponse<Service>>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/services/${id}`);
      return handleApiResponse<Service>(response);
    },
    enabled: !!id,
  });
};

export const useServiceTypes = () => {
  return useQuery({
    queryKey: queryKeys.services.types,
    queryFn: async () => {
      const response = await apiClient.get('/services/types');
      return handleApiResponse<ServiceType[]>(response);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Cart hooks
export const useCart = () => {
  return useQuery({
    queryKey: queryKeys.cart.get(),
    queryFn: async () => {
      const response = await apiClient.get('/cart');
      return handleApiResponse<Cart>(response);
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { productId: string; quantity: number }) => {
      const response = await apiClient.post('/cart/items', data);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.get() });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await apiClient.put(`/cart/items/${id}`, { quantity });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.get() });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/cart/items/${id}`);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.get() });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/cart/clear');
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.get() });
    },
  });
};

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiClient.post('/auth/login', data);
      return handleApiResponse<{ user: User; token: string }>(response);
    },
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterForm) => {
      const response = await apiClient.post('/auth/register', data);
      return handleApiResponse<{ user: User; token: string }>(response);
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      const response = await apiClient.get('/auth/profile');
      return handleApiResponse<User>(response);
    },
  });
};

// Dashboard hooks
export const useDashboardOverview = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard');
      return handleApiResponse<DashboardOverview>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSalesAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.sales(),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/sales');
      return handleApiResponse<SalesAnalytics>(response);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCustomerAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.customers(),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/customers');
      return handleApiResponse<CustomerAnalytics>(response);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useInventoryAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.inventory(),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/inventory');
      return handleApiResponse<InventoryAnalytics>(response);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useBusinessKPIs = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.kpis(),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/kpis');
      return handleApiResponse<BusinessKPIs>(response);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Service Booking hooks
export const useCreateServiceBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      serviceId: string;
      customerName: string;
      phone: string;
      email: string;
      address?: string;
      preferredDate: string;
      preferredTime: string;
      notes?: string;
    }) => {
      await apiClient.post('/service-bookings', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['service-bookings'] });
    },
  });
};

