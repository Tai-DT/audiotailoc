import { create } from 'zustand';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  images?: string;
  categoryId?: string;
  featured: boolean;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  stockQuantity?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
}

export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  categories: Category[];
  pagination: Pagination;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
}

interface ProductActions {
  fetchProducts: (filters: ProductFilters, page?: number) => Promise<void>;
  fetchProduct: (slug: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  clearError: () => void;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  categories: [],
  pagination: { page: 1, pageSize: 20, total: 0 },
  filters: { sortBy: 'createdAt', sortOrder: 'desc' },
  isLoading: false,
  error: null,
};

export const useProductStore = create<ProductState & ProductActions>((set, get) => ({
  ...initialState,

  fetchProducts: async (filters: ProductFilters, page = 1) => {
    set({ isLoading: true, error: null });
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: get().pagination.pageSize.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
      });

      const response = await fetch(`http://localhost:8000/api/v1/catalog/products?${params}`);
      const data = await response.json();

      if (data.success) {
        set({
          products: data.data.items || [],
          pagination: {
            page,
            pageSize: data.data.pageSize || 20,
            total: data.data.total || 0,
          },
          filters,
          isLoading: false,
        });
      } else {
        set({ error: data.message || 'Failed to fetch products', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch products', isLoading: false });
    }
  },

  fetchProduct: async (slug: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/catalog/products/${slug}`);
      const data = await response.json();

      if (data.success) {
        set({ currentProduct: data.data, isLoading: false });
      } else {
        set({ error: data.message || 'Product not found', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch product', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/catalog/categories');
      const data = await response.json();

      if (data.success) {
        set({ categories: data.data || [] });
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  setFilters: (filters: ProductFilters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },
}));