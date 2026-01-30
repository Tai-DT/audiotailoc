'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { apiClient, handleApiResponse } from '@/lib/api';
import { authStorage, AUTH_EVENTS } from '@/lib/auth-storage';
import { parseImages } from '@/lib/utils';

// API Response types for cart operations
interface CartApiItem {
 id?: string;
 productId?: string;
 name?: string;
 price?: number;
 image?: string;
 quantity?: number;
 product?: {
 id?: string;
 name?: string;
 priceCents?: number;
 price?: number;
 images?: string | string[] | null;
 imageUrl?: string;
 category?: { name?: string };
 shortDescription?: string;
 description?: string;
 };
 products?: {
 id?: string;
 name?: string;
 priceCents?: number;
 price?: number;
 images?: string | string[] | null;
 imageUrl?: string;
 category?: { name?: string };
 shortDescription?: string;
 description?: string;
 };
 category?: string;
 description?: string;
}

interface CartApiResponse {
 id?: string;
 cartId?: string;
 items?: CartApiItem[];
 cart_items?: CartApiItem[];
}

export interface CartItem {
 id: string;
 name: string;
 price: number;
 image: string;
 quantity: number;
 category: string;
 description?: string;
}

interface CartState {
 items: CartItem[];
 total: number;
 itemCount: number;
}

type CartAction =
 | { type: 'ADD_ITEM'; payload: CartItem }
 | { type: 'REMOVE_ITEM'; payload: string }
 | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
 | { type: 'CLEAR_CART' }
 | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
 addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
 removeItem: (id: string) => void;
 updateQuantity: (id: string, quantity: number) => void;
 clearCart: () => void;
 isInCart: (id: string) => boolean;
 getItemQuantity: (id: string) => number;
 totalPrice: number;
 totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const GUEST_CART_ID_KEY = 'audiotailoc_guest_cart_id';

const hasValidToken = () => {
 const token = authStorage.getAccessToken();
 return !!(token && token.trim().length > 0 && token !== 'null');
};

const getStoredGuestCartId = () => {
 if (typeof window === 'undefined') return null;
 return localStorage.getItem(GUEST_CART_ID_KEY);
};

const setStoredGuestCartId = (cartId: string) => {
 if (typeof window === 'undefined') return;
 localStorage.setItem(GUEST_CART_ID_KEY, cartId);
};

const clearStoredGuestCartId = () => {
 if (typeof window === 'undefined') return;
 localStorage.removeItem(GUEST_CART_ID_KEY);
};

const normalizeCartItems = (payload: CartApiResponse | null | undefined): CartItem[] => {
 const rawItems = payload?.items || payload?.cart_items || [];
 return rawItems
 .map((item: CartApiItem) => {
 const product = item.product || item.products || {};
 const images = parseImages(product.images || product.imageUrl || item.image || null);
 const imageUrl = images[0] || product.imageUrl || item.image || '/placeholder-product.jpg';
 const price = Number(item.price ?? product.priceCents ?? product.price ?? 0);
 const productId = String(item.productId || product.id || item.id || '');

 if (!productId) return null;

 return {
 id: productId,
 name: product.name || item.name || 'Sản phẩm',
 price,
 image: imageUrl,
 quantity: Number(item.quantity || 1),
 category: product.category?.name || item.category || 'Sản phẩm',
 description: product.shortDescription || product.description || item.description,
 } as CartItem;
 })
 .filter((item: CartItem | null): item is CartItem => Boolean(item));
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
 switch (action.type) {
 case 'ADD_ITEM': {
 const quantityToAdd = Math.max(1, action.payload.quantity);
 const existingItem = state.items.find(item => item.id === action.payload.id);

 if (existingItem) {
 const updatedItems = state.items.map(item =>
 item.id === action.payload.id
 ? { ...item, quantity: item.quantity + quantityToAdd }
 : item
 );
 return {
 ...state,
 items: updatedItems,
 total: calculateTotal(updatedItems),
 itemCount: calculateItemCount(updatedItems),
 };
 }

 const newItems = [...state.items, { ...action.payload, quantity: quantityToAdd }];
 return {
 ...state,
 items: newItems,
 total: calculateTotal(newItems),
 itemCount: calculateItemCount(newItems),
 };
 }

 case 'REMOVE_ITEM': {
 const newItems = state.items.filter(item => item.id !== action.payload);
 return {
 ...state,
 items: newItems,
 total: calculateTotal(newItems),
 itemCount: calculateItemCount(newItems),
 };
 }

 case 'UPDATE_QUANTITY': {
 if (action.payload.quantity <= 0) {
 return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
 }

 const updatedItems = state.items.map(item =>
 item.id === action.payload.id
 ? { ...item, quantity: action.payload.quantity }
 : item
 );
 return {
 ...state,
 items: updatedItems,
 total: calculateTotal(updatedItems),
 itemCount: calculateItemCount(updatedItems),
 };
 }

 case 'CLEAR_CART':
 return {
 items: [],
 total: 0,
 itemCount: 0,
 };

 case 'LOAD_CART':
 return {
 items: action.payload,
 total: calculateTotal(action.payload),
 itemCount: calculateItemCount(action.payload),
 };

 default:
 return state;
 }
};

const calculateTotal = (items: CartItem[]): number => {
 return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateItemCount = (items: CartItem[]): number => {
 return items.reduce((count, item) => count + item.quantity, 0);
};

// Lazy initializer for useReducer - defers localStorage read
const initializeCart = (): CartState => {
 return {
 items: [],
 total: 0,
 itemCount: 0,
 };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
 const [state, dispatch] = useReducer(cartReducer, undefined, initializeCart);

 const applyCartPayload = useCallback((payload: CartApiResponse | null | undefined) => {
 const items = normalizeCartItems(payload);
 dispatch({ type: 'LOAD_CART', payload: items });
 }, []);

 const ensureGuestCartId = useCallback(async () => {
 const stored = getStoredGuestCartId();
 if (stored) return stored;

 const response = await apiClient.post('/cart/guest');
 const payload = handleApiResponse<CartApiResponse>(response);
 const cartId = payload?.id || payload?.cartId;

 if (!cartId) {
 throw new Error('Guest cart ID missing');
 }

 setStoredGuestCartId(cartId);
 return cartId;
 }, []);

 const fetchGuestCart = useCallback(async () => {
 let cartId = await ensureGuestCartId();
 try {
 const response = await apiClient.get(`/cart/guest/${cartId}`);
 return handleApiResponse<CartApiResponse>(response);
 } catch (error) {
 const status = (error as { response?: { status?: number } })?.response?.status;
 if (status === 404) {
 clearStoredGuestCartId();
 cartId = await ensureGuestCartId();
 const response = await apiClient.get(`/cart/guest/${cartId}`);
 return handleApiResponse<CartApiResponse>(response);
 }
 throw error;
 }
 }, [ensureGuestCartId]);

 const convertGuestCartIfNeeded = useCallback(async () => {
 const cartId = getStoredGuestCartId();
 if (!cartId) return;

 try {
 await apiClient.post(`/cart/guest/${cartId}/convert`);
 clearStoredGuestCartId();
 } catch (error) {
 const status = (error as { response?: { status?: number } })?.response?.status;
 if (status === 404) {
 clearStoredGuestCartId();
 }
 }
 }, []);

 const syncCart = useCallback(async () => {
 try {
 if (hasValidToken()) {
 await convertGuestCartIfNeeded();
 const response = await apiClient.get('/cart');
 const payload = handleApiResponse<CartApiResponse>(response);
 applyCartPayload(payload);
 } else {
 const payload = await fetchGuestCart();
 applyCartPayload(payload);
 }
 } catch (error) {
 console.error('Failed to sync cart', error);
 toast.error('Không thể tải giỏ hàng. Vui lòng thử lại.');
 } finally {
 // noop
 }
 }, [applyCartPayload, convertGuestCartIfNeeded, fetchGuestCart]);

 useEffect(() => {
 syncCart();
 }, [syncCart]);

 useEffect(() => {
 if (typeof window === 'undefined') return;

 const handleAuthChange = () => {
 syncCart();
 };

 window.addEventListener(AUTH_EVENTS.SESSION_UPDATED, handleAuthChange);
 window.addEventListener(AUTH_EVENTS.LOGOUT, handleAuthChange);

 return () => {
 window.removeEventListener(AUTH_EVENTS.SESSION_UPDATED, handleAuthChange);
 window.removeEventListener(AUTH_EVENTS.LOGOUT, handleAuthChange);
 };
 }, [syncCart]);

 const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
 const normalizedQuantity = Math.max(1, quantity);
 const action = async () => {
 const payload = { productId: item.id, quantity: normalizedQuantity };
 let responsePayload: CartApiResponse | null = null;

 if (hasValidToken()) {
 const response = await apiClient.post('/cart/items', payload);
 responsePayload = handleApiResponse<CartApiResponse>(response);
 } else {
 const cartId = await ensureGuestCartId();
 const response = await apiClient.post(`/cart/guest/${cartId}/items`, payload);
 responsePayload = handleApiResponse<CartApiResponse>(response);
 }

 applyCartPayload(responsePayload);
 toast.success(`${item.name} đã được thêm vào giỏ hàng (${normalizedQuantity})!`);
 };

 void action();
 };

 const removeItem = (id: string) => {
 const action = async () => {
 const existingItem = state.items.find(item => item.id === id);
 let responsePayload: CartApiResponse | null = null;

 if (hasValidToken()) {
 const response = await apiClient.delete(`/cart/user/items/${id}`);
 responsePayload = handleApiResponse<CartApiResponse>(response);
 } else {
 const cartId = await ensureGuestCartId();
 const response = await apiClient.delete(`/cart/guest/${cartId}/items/${id}`);
 responsePayload = handleApiResponse<CartApiResponse>(response);
 }

 applyCartPayload(responsePayload);
 if (existingItem) {
 toast.success(`${existingItem.name} đã được xóa khỏi giỏ hàng!`);
 }
 };

 void action();
 };

 const updateQuantity = (id: string, quantity: number) => {
 const action = async () => {
 if (quantity <= 0) {
 removeItem(id);
 return;
 }

 let responsePayload: CartApiResponse | null = null;
 if (hasValidToken()) {
 const response = await apiClient.put(`/cart/user/items/${id}`, { quantity });
 responsePayload = handleApiResponse<CartApiResponse>(response);
 } else {
 const cartId = await ensureGuestCartId();
 const response = await apiClient.put(`/cart/guest/${cartId}/items/${id}`, { quantity });
 responsePayload = handleApiResponse<CartApiResponse>(response);
 }

 applyCartPayload(responsePayload);
 };

 void action();
 };

 const clearCart = () => {
 const action = async () => {
 let responsePayload: CartApiResponse | null = null;
 if (hasValidToken()) {
 const response = await apiClient.delete('/cart/user/clear');
 responsePayload = handleApiResponse<CartApiResponse>(response);
 } else {
 const cartId = await ensureGuestCartId();
 const response = await apiClient.delete(`/cart/guest/${cartId}/clear`);
 responsePayload = handleApiResponse<CartApiResponse>(response);
 }

 if (responsePayload) {
 applyCartPayload(responsePayload);
 } else {
 dispatch({ type: 'CLEAR_CART' });
 }
 toast.success('Giỏ hàng đã được làm trống!');
 };

 void action();
 };

 const isInCart = (id: string): boolean => {
 return state.items.some(item => item.id === id);
 };

 const getItemQuantity = (id: string): number => {
 const item = state.items.find(item => item.id === id);
 return item?.quantity || 0;
 };

 const value: CartContextType = {
 ...state,
 addItem,
 removeItem,
 updateQuantity,
 clearCart,
 isInCart,
 getItemQuantity,
 totalPrice: state.total,
 totalItems: state.itemCount,
 };

 return (
 <CartContext.Provider value={value}>
 {children}
 </CartContext.Provider>
 );
}

export function useCart() {
 const context = useContext(CartContext);
 if (context === undefined) {
 throw new Error('useCart must be used within a CartProvider');
 }
 return context;
}
