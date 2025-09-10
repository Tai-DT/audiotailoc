import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  User,
  Product,
  Category,
  CartItem,
  Cart,
  Order,
  Service,
  Notification,
  WishlistItem,
  ProductFilters,
  AuthState,
  CartState,
  ProductState
} from './types-prisma';
import { api } from './api-client';

// Auth Store
interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: undefined,
      isAuthenticated: false,
      isLoading: false,
      error: undefined,

  login: async (email: string, password: string) => {
        set({ isLoading: true, error: undefined });
        try {
          const response = await api.auth.login({ email, password });
          if (response.success && response.data) {
            // Store token in localStorage
            if (response.data.token) {
              localStorage.setItem('auth_token', response.data.token);
            }
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            throw new Error(response.message || 'Đăng nhập thất bại');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đăng nhập thất bại',
            isLoading: false
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string, phone?: string) => {
        set({ isLoading: true, error: undefined });
        try {
          const response = await api.auth.register({ name, email, password, phone });
          if (response.success && response.data) {
            // Store token in localStorage
            if (response.data.token) {
              localStorage.setItem('auth_token', response.data.token);
            }
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            throw new Error(response.message || 'Đăng ký thất bại');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đăng ký thất bại',
            isLoading: false
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.auth.logout();
        } catch (error) {
          console.error('Logout API call failed:', error);
        } finally {
          // Always clear local state and token
          localStorage.removeItem('auth_token');
          set({
            user: undefined,
            isAuthenticated: false,
            isLoading: false,
            error: undefined
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await api.auth.getCurrentUser();
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            set({
              user: undefined,
              isAuthenticated: false,
              isLoading: false
            });
          }
        } catch (error) {
          set({
            user: undefined,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      clearError: () => set({ error: undefined })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Cart Store
interface CartStore extends CartState {
  getCart: (guestId?: string) => Promise<void>;
  addToCart: (productId: string, quantity: number, guestId?: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number, guestId?: string) => Promise<void>;
  removeCartItem: (productId: string, guestId?: string) => Promise<void>;
  clearCart: (guestId?: string) => Promise<void>;
  calculateTotal: () => void;
  clearError: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: undefined,
      total: 0,

      getCart: async (guestId?: string) => {
        set({ isLoading: true, error: undefined });
        try {
          const response = await api.cart.get(guestId);
          if (response.success && response.data) {
            const items = response.data.items || [];
            set({ 
              items, 
              isLoading: false 
            });
            get().calculateTotal();
          } else {
            set({ items: [], isLoading: false });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lỗi khi tải giỏ hàng',
            isLoading: false
          });
        }
      },

      addToCart: async (productId: string, quantity: number, guestId?: string) => {
        set({ isLoading: true, error: undefined });
        try {
          const response = await api.cart.addItem({ productId, quantity }, guestId);
          if (response.success && response.data) {
            const items = response.data.items || [];
            set({ 
              items, 
              isLoading: false 
            });
            get().calculateTotal();
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lỗi khi thêm sản phẩm vào giỏ hàng',
            isLoading: false
          });
          throw error;
        }
      },

      updateCartItem: async (productId: string, quantity: number, guestId?: string) => {
        set({ isLoading: true, error: undefined });
        try {
          const response = await api.cart.updateItem(productId, quantity, guestId);
          if (response.success && response.data) {
            const items = response.data.items || [];
            set({ 
              items, 
              isLoading: false 
            });
            get().calculateTotal();
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lỗi khi cập nhật giỏ hàng',
            isLoading: false
          });
        }
      },

      removeCartItem: async (productId: string, guestId?: string) => {
        set({ isLoading: true, error: undefined });
        try {
          const response = await api.cart.removeItem(productId, guestId);
          if (response.success && response.data) {
            const items = response.data.items || [];
            set({ 
              items, 
              isLoading: false 
            });
            get().calculateTotal();
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lỗi khi xóa sản phẩm khỏi giỏ hàng',
            isLoading: false
          });
        }
      },

      clearCart: async (guestId?: string) => {
        set({ items: [], total: 0 });
      },

      calculateTotal: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        set({ total });
      },

      clearError: () => set({ error: undefined })
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items, 
        total: state.total 
      }),
    }
  )
);

// Product Store
interface ProductStore extends ProductState {
  getProducts: (filters?: ProductFilters) => Promise<void>;
  getProduct: (slug: string) => Promise<void>;
  getFeaturedProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  getCategories: () => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductStore>()((set, get) => ({
  products: [],
  currentProduct: undefined,
  categories: [],
  filters: {},
  isLoading: false,
  error: undefined,

  getProducts: async (filters?: ProductFilters) => {
    set({ isLoading: true, error: undefined });
    try {
      const response = await api.products.getAll(filters);
      if (response.success && response.data) {
        set({ 
          products: response.data.items || [],
          isLoading: false 
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi khi tải danh sách sản phẩm',
        isLoading: false
      });
    }
  },

  getProduct: async (slug: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const response = await api.products.getById(slug);
      if (response.success && response.data) {
        set({ 
          currentProduct: response.data,
          isLoading: false 
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi khi tải thông tin sản phẩm',
        isLoading: false
      });
    }
  },

  getFeaturedProducts: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const response = await api.products.getAll({ featured: true });
      if (response.success && response.data) {
        set({ 
          products: response.data.items || [],
          isLoading: false 
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi khi tải sản phẩm nổi bật',
        isLoading: false
      });
    }
  },

  searchProducts: async (query: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const response = await api.products.getAll({ search: query });
      if (response.success && response.data) {
        set({ 
          products: response.data.items || [],
          isLoading: false 
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi khi tìm kiếm sản phẩm',
        isLoading: false
      });
    }
  },

  getCategories: async () => {
    try {
      const response = await api.categories.getAll();
      if (response.success && response.data) {
        set({ categories: response.data });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },

  setFilters: (newFilters: Partial<ProductFilters>) => {
    const { filters } = get();
    set({ filters: { ...filters, ...newFilters } });
  },

  clearError: () => set({ error: undefined })
}));

// Service Store
interface ServiceStore {
  services: Service[];
  currentService?: Service;
  isLoading: boolean;
  error?: string;
  getServices: () => Promise<void>;
  getService: (slug: string) => Promise<void>;
  clearError: () => void;
}

export const useServiceStore = create<ServiceStore>()((set, get) => ({
  services: [],
  currentService: undefined,
  isLoading: false,
  error: undefined,

  getServices: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const response = await api.services.getAll();
      if (response.success) {
        // Backend may return either an array or a paginated object
        const raw = (response as any).data;
        const services = Array.isArray(raw)
          ? raw
          : raw?.services || raw?.items || [];
        set({ services, isLoading: false });
      } else {
        set({ isLoading: false, error: response.message || 'Không thể tải dịch vụ' });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi khi tải danh sách dịch vụ',
        isLoading: false
      });
    }
  },

  getService: async (slug: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const response = await api.services.getBySlug(slug);
      if (response.success && response.data) {
        set({ currentService: response.data, isLoading: false });
      } else {
        set({ isLoading: false, error: response.message || 'Không thể tải dịch vụ' });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi khi tải thông tin dịch vụ',
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: undefined })
}));

// Order Store
interface OrderStore {
  orders: Order[];
  currentOrder?: Order;
  isLoading: boolean;
  error?: string;
  getOrders: () => Promise<void>;
  getOrder: (orderId: string) => Promise<void>;
  createOrder: (orderData: any) => Promise<Order>;
  clearError: () => void;
}

export const useOrderStore = create<OrderStore>()((set, get) => ({
  orders: [],
  currentOrder: undefined,
  isLoading: false,
  error: undefined,

  getOrders: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const response = await api.orders.getAll();
      if (response.success && response.data) {
        set({ 
          orders: response.data,
          isLoading: false 
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi khi tải danh sách đơn hàng',
        isLoading: false
      });
    }
  },

  getOrder: async (orderId: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const response = await api.orders.getById(orderId);
      if (response.success && response.data) {
        set({ 
          currentOrder: response.data,
          isLoading: false 
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi khi tải thông tin đơn hàng',
        isLoading: false
      });
    }
  },

  createOrder: async (orderData: any) => {
    set({ isLoading: true, error: undefined });
    try {
      const response = await api.orders.create(orderData);
      if (response.success && response.data) {
        set({ 
          currentOrder: response.data,
          isLoading: false 
        });
        return response.data;
      } else {
        throw new Error(response.message || 'Lỗi khi tạo đơn hàng');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi khi tạo đơn hàng',
        isLoading: false
      });
      throw error;
    }
  },

  clearError: () => set({ error: undefined })
}));
