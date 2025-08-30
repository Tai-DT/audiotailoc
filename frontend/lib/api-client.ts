import { apiClient } from './api';

// Cart API methods
const cartApiClient = {
  ...apiClient,
  
  // Cart specific methods
  async getCart(cartId: string) {
    return apiClient.get(`/cart?cartId=${cartId}`);
  },

  async addToCart(data: { productId: string; quantity: number }, cartId: string) {
    return apiClient.post(`/cart/items?cartId=${cartId}`, data);
  },

  async updateCartItem(productId: string, quantity: number, cartId: string) {
    return apiClient.put(`/cart/items/${productId}?cartId=${cartId}`, { quantity });
  },

  async removeFromCart(productId: string, cartId: string) {
    return apiClient.delete(`/cart/items/${productId}?cartId=${cartId}`);
  },

  async createGuestCart() {
    return apiClient.post('/cart/guest');
  },
};

export default cartApiClient;
export const api = cartApiClient;