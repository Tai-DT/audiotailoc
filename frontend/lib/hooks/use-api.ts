import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { 
  Product, 
  Category,
  Order, 
  Cart, 
  Service, 
  ServiceType, 
  User,
  Project,
  DashboardOverview,
  SalesAnalytics,
  CustomerAnalytics,
  BusinessKPIs,
  ProductFilters,
  OrderFilters,
  ServiceFilters,
  PaginatedResponse,
  ProductForm,
  CategoryForm,
  LoginForm,
  RegisterForm,
  Promotion,
  KnowledgeBaseArticle,
  BlogArticle,
  BlogCategory,
  PaginatedBlogResponse,
  ProductReview
} from '../types';

// Additional types for API operations
interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice?: number;
    name?: string;
  }>;
  shippingAddress?: string;
  promotionCode?: string;
}

interface UpdateOrderData {
  status?: Order['status'];
  shippingAddress?: string;
  promotionCode?: string;
}

interface ProductAnalytics {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  topCategories: Array<{ name: string; count: number }>;
}

interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    originalPriceCents?: number;
    imageUrl?: string;
    images?: string[];
    isActive: boolean;
    stockQuantity: number;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface WishlistResponse {
  items: WishlistItem[];
  total: number;
}

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
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: () => [...queryKeys.projects.lists()] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
    featured: ['projects', 'featured'] as const,
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
      return handleApiResponse<ProductAnalytics>(response);
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
    mutationFn: async (data: CreateOrderData) => {
      const response = await apiClient.post('/orders/create', {
        ...data,
        items: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          name: item.name,
        })),
      });
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
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderData }) => {
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

export const useServiceBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['services', 'slug', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/services/slug/${slug}`);
      return handleApiResponse<Service>(response);
    },
    enabled: !!slug,
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

export const useServicesByType = () => {
  return useQuery({
    queryKey: ['services', 'by-type'],
    queryFn: async () => {
      const response = await apiClient.get('/services', {
        params: {
          isActive: true,
          page: 1,
          pageSize: 200,
          include: 'type',
        },
      });
      const data = handleApiResponse<PaginatedResponse<Service>>(response);

      return data.items.reduce<Record<string, Service[]>>((acc, service) => {
        const key = service.typeId ?? 'unclassified';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(service);
        return acc;
      }, {});
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedServices = (limit = 4) => {
  return useQuery({
    queryKey: ['services', 'featured', limit],
    queryFn: async () => {
      const response = await apiClient.get('/services', {
        params: {
          isFeatured: true,
          isActive: true,
          page: 1,
          pageSize: limit,
        },
      });
      const data = handleApiResponse<PaginatedResponse<Service>>(response);
      return data.items;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Projects hooks
export const useProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects.list(),
    queryFn: async () => {
      const response = await apiClient.get('/projects');
      return handleApiResponse<PaginatedResponse<Project>>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${id}`);
      return handleApiResponse<Project>(response);
    },
    enabled: !!id,
  });
};

export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects.featured,
    queryFn: async () => {
      const response = await apiClient.get('/projects', {
        params: { isFeatured: true, limit: 6 }
      });
      return handleApiResponse<Project[]>(response);
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

interface InventoryAnalytics {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  stockValueCents: number;
  topLowStockProducts: Array<{ id: string; name: string; stockQuantity: number }>;
}

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
      customerPhone: string;
      customerEmail?: string;
      customerAddress: string;
      scheduledDate: string;
      scheduledTime: string;
      notes?: string;
    }) => {
      const response = await apiClient.post('/bookings', data);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['service-bookings'] });
    },
  });
};

// Wishlist hooks
export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await apiClient.get('/wishlist');
      return handleApiResponse<WishlistResponse>(response);
    },
  });
};

// Newsletter hooks
export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (data: { email: string; name?: string }) => {
      const response = await apiClient.post('/newsletter/subscribe', data);
      return handleApiResponse(response);
    },
  });
};

// Promotions hooks
export const usePromotions = (filters: { active?: boolean } = {}) => {
  return useQuery({
    queryKey: ['promotions', filters],
    queryFn: async () => {
      const response = await apiClient.get('/promotions', { params: filters });
      return handleApiResponse<PaginatedResponse<Promotion>>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Knowledge Base Articles hooks
export const useArticles = (filters: {
  category?: string;
  published?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) => {
  return useQuery({
    queryKey: ['articles', filters],
    queryFn: async () => {
      const response = await apiClient.get('/support/kb/articles', { params: filters });
      return handleApiResponse<PaginatedResponse<KnowledgeBaseArticle>>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['articles', 'detail', id],
    queryFn: async () => {
      const response = await apiClient.get(`/support/kb/articles/${id}`);
      return handleApiResponse<KnowledgeBaseArticle>(response);
    },
    enabled: !!id,
  });
};

export const useArticleCategories = () => {
  return useQuery({
    queryKey: ['articles', 'categories'],
    queryFn: async () => {
      const response = await apiClient.get('/support/kb/categories');
      return handleApiResponse<string[]>(response);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useSearchArticles = (query: string) => {
  return useQuery({
    queryKey: ['articles', 'search', query],
    queryFn: async () => {
      const response = await apiClient.get('/support/kb/search', { params: { q: query } });
      return handleApiResponse<KnowledgeBaseArticle[]>(response);
    },
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Reviews hooks
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', 'product', productId],
    queryFn: async () => {
      const response = await apiClient.get('/reviews', { 
        params: { 
          productId,
          status: 'APPROVED' 
        } 
      });
      return handleApiResponse<{
        reviews: ProductReview[];
        stats: {
          totalReviews: number;
          averageRating: number;
          ratingDistribution: Record<string, number>;
        };
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(response);
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: string;
      rating: number;
      title?: string;
      comment?: string;
      images?: string[];
    }) => {
      const response = await apiClient.post('/reviews', data);
      return handleApiResponse<ProductReview>(response);
    },
    onSuccess: (data) => {
      // Invalidate reviews for this product
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', 'product', data.productId] 
      });
      // Invalidate product data to update rating
      queryClient.invalidateQueries({ 
        queryKey: ['products', data.productId] 
      });
    },
  });
};

export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await apiClient.post(`/reviews/${reviewId}/helpful`);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      // Invalidate all review queries to update helpful counts
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

// Blog API Hooks
export interface BlogFilters {
  status?: string;
  categoryId?: string;
  authorId?: string;
  search?: string;
  published?: boolean;
  page?: number;
  limit?: number;
}

export const useBlogArticles = (filters: BlogFilters = {}) => {
  return useQuery({
    queryKey: ['blog-articles', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.status) params.append('status', filters.status);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.authorId) params.append('authorId', filters.authorId);
      if (filters.search) params.append('search', filters.search);
      if (filters.published !== undefined) params.append('published', filters.published.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await apiClient.get(`/blog/articles?${params.toString()}`);
      return handleApiResponse<PaginatedBlogResponse<BlogArticle>>(response);
    },
  });
};

export const useBlogArticle = (id: string) => {
  return useQuery({
    queryKey: ['blog-article', id],
    queryFn: async () => {
      const response = await apiClient.get(`/blog/articles/${id}`);
      return handleApiResponse<BlogArticle>(response);
    },
    enabled: !!id,
  });
};

export const useBlogArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blog-article-slug', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/blog/articles/slug/${slug}`);
      return handleApiResponse<BlogArticle>(response);
    },
    enabled: !!slug,
  });
};

export const useBlogCategories = (filters?: { published?: boolean; parentId?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['blog-categories', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.published !== undefined) params.append('published', filters.published.toString());
      if (filters?.parentId !== undefined) params.append('parentId', filters.parentId || '');
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await apiClient.get(`/blog/categories?${params.toString()}`);
      return handleApiResponse<PaginatedBlogResponse<BlogCategory>>(response);
    },
  });
};

export const useBlogCategory = (id: string) => {
  return useQuery({
    queryKey: ['blog-category', id],
    queryFn: async () => {
      const response = await apiClient.get(`/blog/categories/${id}`);
      return handleApiResponse<BlogCategory>(response);
    },
    enabled: !!id,
  });
};

export const useBlogCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blog-category-slug', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/blog/categories/slug/${slug}`);
      return handleApiResponse<BlogCategory>(response);
    },
    enabled: !!slug,
  });
};
