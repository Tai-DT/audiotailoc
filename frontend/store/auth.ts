import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; phone: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  checkAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          
          const response = await api.auth.login({ email, password });
          const { token, user } = response.data.data;
          
          // Store token in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
          }
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
          set({
            loading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      register: async (userData: { name: string; email: string; password: string; phone: string }) => {
        try {
          set({ loading: true, error: null });
          
          const response = await api.auth.register(userData);
          const { token, user } = response.data.data;
          
          // Store token in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
          }
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
          set({
            loading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        // Remove token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      checkAuth: async () => {
        try {
          const { token } = get();
          if (!token) {
            set({ isAuthenticated: false });
            return;
          }

          const response = await api.auth.me();
          const user = response.data.data;
          
          set({
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token is invalid, clear auth state
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
