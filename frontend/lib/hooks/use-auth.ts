'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, handleApiResponse, handleApiError } from '@/lib/api';
import { authStorage, AUTH_EVENTS, StoredUser } from '@/lib/auth-storage';
import toast from 'react-hot-toast';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR' | 'DISABLED';
  avatar?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresInMs?: number;
}

// Hooks
export function useAuth() {
  const queryClient = useQueryClient();
  const hasToken = typeof window !== 'undefined' ? Boolean(authStorage.getAccessToken()) : false;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAuthEvent = () => {
      const storedUser = authStorage.getUser<User>();
      if (storedUser) {
        queryClient.setQueryData(['auth', 'profile'], storedUser);
      } else {
        queryClient.removeQueries({ queryKey: ['auth', 'profile'] });
      }
    };

    window.addEventListener(AUTH_EVENTS.SESSION_UPDATED, handleAuthEvent);
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleAuthEvent);

    return () => {
      window.removeEventListener(AUTH_EVENTS.SESSION_UPDATED, handleAuthEvent);
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleAuthEvent);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
        const user = handleApiResponse<User>(response);
        authStorage.setUser(user as unknown as StoredUser);
        return user;
      } catch (error) {
        const { status } = handleApiError(error as { response?: { status?: number }; message?: string });
        if (status === 401 || status === 403) {
          authStorage.clearSession();
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: hasToken,
    initialData: hasToken ? undefined : null,
  });
}

// Mutations
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
      return handleApiResponse<AuthResponse>(response);
    },
    onSuccess: (data, variables) => {
      if (data.user.role === 'DISABLED') {
        toast.error('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.');
        authStorage.clearSession();
        return;
      }

      const accessToken = data.token ?? data.accessToken;
      if (!accessToken) {
        toast.error('Không nhận được mã phiên đăng nhập');
        return;
      }

      authStorage.setSession({
        accessToken,
        refreshToken: data.refreshToken,
        user: data.user as unknown as StoredUser,
        rememberMe: variables.rememberMe,
        expiresInMs: data.expiresInMs,
      });

      queryClient.setQueryData(['auth', 'profile'], data.user);
      toast.success(`Chào mừng ${data.user.name}!`);
    },
    onError: (error: unknown) => {
      const { message } = handleApiError(error as { message?: string });
      toast.error(message || 'Đăng nhập thất bại');
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
      return handleApiResponse<AuthResponse>(response);
    },
    onSuccess: (data) => {
      if (data.user.role === 'DISABLED') {
        toast.error('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.');
        authStorage.clearSession();
        return;
      }

      const accessToken = data.token ?? data.accessToken;
      if (!accessToken) {
        toast.error('Không nhận được mã phiên đăng nhập');
        return;
      }

      authStorage.setSession({
        accessToken,
        refreshToken: data.refreshToken,
        user: data.user as unknown as StoredUser,
        expiresInMs: data.expiresInMs,
      });

      queryClient.setQueryData(['auth', 'profile'], data.user);
      toast.success(`Đăng ký thành công! Chào mừng ${data.user.name}!`);
    },
    onError: (error: unknown) => {
      const { message } = handleApiError(error as { message?: string });
      toast.error(message || 'Đăng ký thất bại');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      authStorage.clearSession();
      
      // Clear query cache
      queryClient.removeQueries({ queryKey: ['auth', 'profile'] });
      queryClient.removeQueries({ queryKey: ['wishlist'] });
      
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success('Đã đăng xuất thành công!');
      window.location.href = '/';
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, data);
      return handleApiResponse<User>(response);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'profile'], data);
      authStorage.setUser(data as unknown as StoredUser);
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    },
  });
}
