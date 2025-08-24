import { create } from 'zustand';
import apiClient from '@/lib/api-client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
  images?: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  featured: boolean;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sortBy?: 'name' | 'priceCents' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductState {
  products: Product[];
  categories: Category[];
  currentProduct: Product | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface ProductActions {
  fetchProducts: (filters?: ProductFilters, page?: number) => Promise<void>;
  fetchProduct: (slug: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export type ProductStore = ProductState & ProductActions;

const initialState: ProductState = {
  products: [],
  categories: [],
  currentProduct: null,
  filters: {
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    pageSize: 12,
    total: 0,
  },
  isLoading: false,
  error: null,
};

export const useProductStore = create<ProductStore>((set, get) => ({
  ...initialState,

  fetchProducts: async (filters = {}, page = 1) => {
    const currentFilters = { ...get().filters, ...filters };
    
    set({ isLoading: true, error: null });

    try {
      const params = {
        page,
        pageSize: get().pagination.pageSize,
        ...currentFilters,
      };

      const response = await apiClient.getProducts(params);
      
      if (response.success) {
        set({
          products: response.data.items,
          pagination: {
            page: response.data.page,
            pageSize: response.data.pageSize,
            total: response.data.total,
          },
          filters: currentFilters,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to fetch products',
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch products',
      });
    }
  },

  fetchProduct: async (slug: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.getProduct(slug);
      
      if (response.success) {
        set({
          currentProduct: response.data,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to fetch product',
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch product',
      });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.getCategories();
      
      if (response.success) {
        set({
          categories: response.data,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to fetch categories',
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch categories',
      });
    }
  },

  searchProducts: async (query: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.searchProducts(query);
      
      if (response.success) {
        set({
          products: response.data,
          isLoading: false,
        });
        return response.data;
      } else {
        set({
          isLoading: false,
          error: response.message || 'Search failed',
        });
        return [];
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Search failed',
      });
      return [];
    }
  },

  setFilters: (filters: Partial<ProductFilters>) => {
    const currentFilters = { ...get().filters, ...filters };
    set({ filters: currentFilters });
  },

  clearFilters: () => {
    set({
      filters: {
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  clearError: () => {
    set({ error: null });
  },
}));
