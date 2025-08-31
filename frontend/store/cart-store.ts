import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '@/lib/api-client';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  slug?: string;
}

export interface CartState {
  items: CartItem[];
  guestId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface CartActions {
  addItem: (product: { id: string; name: string; price: number; imageUrl?: string; slug?: string }, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
  loadCart: (guestId?: string) => Promise<void>;
  createGuestCart: () => Promise<string>;
  getTotal: () => number;
  getItemCount: () => number;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export type CartStore = CartState & CartActions;

const initialState: CartState = {
  items: [],
  guestId: null,
  isLoading: false,
  error: null,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: async (product, quantity = 1) => {
        const { guestId, items } = get();
        const existingItem = items.find(item => item.productId === product.id);
        
        if (existingItem) {
          // Update existing item
          await get().updateQuantity(product.id, existingItem.quantity + quantity);
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl,
            slug: product.slug,
          };

          set({ items: [...items, newItem] });

          // Sync with backend if guestId exists
          if (guestId) {
            try {
              await apiClient.addToCart({ productId: product.id, quantity }, guestId);
            } catch (error) {
              console.error('Failed to sync cart with backend:', error);
            }
          }
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        const { items, guestId } = get();
        
        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }

        const updatedItems = items.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        );

        set({ items: updatedItems });

        // Sync with backend if guestId exists
        if (guestId) {
          try {
            await apiClient.updateCartItem(productId, quantity, guestId);
          } catch (error) {
            console.error('Failed to sync cart with backend:', error);
          }
        }
      },

      removeItem: async (productId: string) => {
        const { items, guestId } = get();
        const updatedItems = items.filter(item => item.productId !== productId);
        
        set({ items: updatedItems });

        // Sync with backend if guestId exists
        if (guestId) {
          try {
            await apiClient.removeFromCart(productId, guestId);
          } catch (error) {
            console.error('Failed to sync cart with backend:', error);
          }
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      loadCart: async (guestId?: string) => {
        const currentGuestId = guestId || get().guestId;
        if (!currentGuestId) return;

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.getCart(currentGuestId);
          
          if (response.success) {
            const backendItems = (response.data.items || []) as any[];
            const items = backendItems.map((i: any) => ({
              id: i.id,
              productId: i.productId,
              name: i.product?.name || i.name || 'Sản phẩm',
              price: (i.price ?? i.product?.priceCents ?? 0) / 100,
              quantity: i.quantity,
              imageUrl: i.product?.imageUrl,
              slug: i.product?.slug,
            }));
            set({
              items,
              guestId: currentGuestId,
              isLoading: false,
            });
          } else {
            set({
              isLoading: false,
              error: response.message || 'Failed to load cart',
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to load cart',
          });
        }
      },

      createGuestCart: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post('/cart/guest');
          
          if (response.success) {
            const guestId = response.data?.id || response.data?.guestId || response.data?.cartId;
            set({
              guestId,
              isLoading: false,
            });
            return guestId;
          } else {
            set({
              isLoading: false,
              error: response.message || 'Failed to create guest cart',
            });
            return '';
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to create guest cart',
          });
          return '';
        }
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        guestId: state.guestId,
      }),
    }
  )
);
