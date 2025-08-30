import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('http://localhost:8000/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await response.json();
          
          if (data.success) {
            set({
              user: data.data.user,
              token: data.data.accessToken,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ error: data.message || 'Login failed', isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message || 'Login failed', isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('http://localhost:8000/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          const result = await response.json();
          
          if (result.success) {
            // Auto login after successful registration
            await get().login(data.email, data.password);
          } else {
            set({ error: result.message || 'Registration failed', isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message || 'Registration failed', isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch('http://localhost:8000/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          const data = await response.json();
          
          if (data.success) {
            set({ user: data.data, isAuthenticated: true });
          } else {
            get().logout();
          }
        } catch (error) {
          get().logout();
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