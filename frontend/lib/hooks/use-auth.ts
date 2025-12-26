'use client';

import React, { useEffect } from 'react';
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
  avatarUrl?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
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
  // Initialize hasToken by checking localStorage immediately
  const [hasToken, setHasToken] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(authStorage.getAccessToken());
  });

  // Check for token on mount and when storage changes
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkToken = () => {
      const token = authStorage.getAccessToken();
      const wasEnabled = hasToken;
      const nowEnabled = Boolean(token);
      console.log('[DEBUG] useAuth token check', { wasEnabled, nowEnabled, hasToken: !!token });
      if (wasEnabled !== nowEnabled) {
        setHasToken(nowEnabled);
      }
    };

    // Initial check (in case token was set before component mounted)
    checkToken();

    // Listen for storage changes (including from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'audiotailoc_token') {
        console.log('[DEBUG] Storage event detected', { key: e.key, newValue: e.newValue ? 'present' : 'null' });
        checkToken();
      }
    };

    const handleSessionUpdated = () => {
      console.log('[DEBUG] Session updated event');
      checkToken();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(AUTH_EVENTS.SESSION_UPDATED, handleSessionUpdated);
    window.addEventListener(AUTH_EVENTS.LOGOUT, checkToken);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(AUTH_EVENTS.SESSION_UPDATED, handleSessionUpdated);
      window.removeEventListener(AUTH_EVENTS.LOGOUT, checkToken);
    };
  }, [hasToken]);

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
        // Double check token exists before making request
        const token = authStorage.getAccessToken();
        if (!token) {
          return null;
        }

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
    // Return stored user as initial data if token exists
    initialData: () => {
      if (typeof window === 'undefined') return null;
      const token = authStorage.getAccessToken();
      if (!token) return null;
      const storedUser = authStorage.getUser<User>();
      return storedUser || undefined;
    },
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
        console.error('[DEBUG] No access token received!', { data });
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
      // Update query cache with user data
      queryClient.setQueryData(['auth', 'profile'], data.user);
      // Invalidate to ensure all components using useAuth get the updated data
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'], refetchType: 'active' }).catch(() => { });
      toast.success(`Chào mừng ${data.user.name}!`);
    },
    onError: (error: unknown) => {
      console.error('[DEBUG] Login error', error);
      const { message, status } = handleApiError(error as { response?: { data?: { message?: string; retryAfter?: number }; status?: number }; message?: string });
      console.log('[DEBUG] Login error handled', { message, status });

      // Handle rate limiting (429) with specific message
      if (status === 429) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const retryAfter = (error as any)?.response?.data?.retryAfter;
        if (retryAfter) {
          const retryMinutes = Math.ceil(retryAfter / 60);
          toast.error(`Quá nhiều yêu cầu đăng nhập. Vui lòng đợi ${retryMinutes} phút rồi thử lại.`, {
            duration: 5000,
          });
        } else {
          toast.error('Quá nhiều yêu cầu đăng nhập. Vui lòng đợi một chút rồi thử lại.', {
            duration: 5000,
          });
        }
      } else {
        toast.error(message || 'Đăng nhập thất bại');
      }
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
      // Get current user to get their ID if needed for generic update
      const currentProfile = queryClient.getQueryData<User>(['auth', 'profile']);
      const endpoint = currentProfile?.id
        ? API_ENDPOINTS.USERS.UPDATE(currentProfile.id)
        : API_ENDPOINTS.AUTH.PROFILE;

      const response = await apiClient.put(endpoint, data);
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

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      return handleApiResponse<{ success: boolean }>(response);
    },
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!');
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      const { message } = handleApiError(error);
      toast.error(message || 'Đổi mật khẩu thất bại');
    },
  });
}

export function useExportUserData() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS.EXPORT, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user-data-${new Date().toISOString()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    },
    onSuccess: () => {
      toast.success('Dữ liệu đã được xuất thành công!');
    },
    onError: () => {
      toast.error('Xuất dữ liệu thất bại');
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      const user = queryClient.getQueryData<User>(['auth', 'profile']);
      if (!user?.id) throw new Error('User not found');

      const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(user.id), {
        data: { password },
      });
      return handleApiResponse<{ success: boolean }>(response);
    },
    onSuccess: () => {
      toast.success('Tài khoản đã được xóa. Tạm biệt!');
      authStorage.clearSession();
      queryClient.clear();
      setTimeout(() => (window.location.href = '/'), 1500);
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      const { message } = handleApiError(error);
      toast.error(message || 'Xóa tài khoản thất bại');
    },
  });
}

export function useUserBookings() {
  return useQuery({
    queryKey: ['user', 'bookings'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS.BOOKINGS);
      return handleApiResponse<{ id: string; serviceId: string; status: string; createdAt: string }[]>(response);
    },
    retry: 1,
  });
}

export function useUserPayments() {
  return useQuery({
    queryKey: ['user', 'payments'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS.PAYMENTS);
      return handleApiResponse<{ id: string; amountCents: number; status: string; createdAt: string; transactionId?: string }[]>(response);
    },
    retry: 1,
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post(API_ENDPOINTS.USERS.AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiResponse<{ avatarUrl: string }>(response);
    },
    onSuccess: (_data) => {
      // Refetch profile to get new avatarUrl
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      toast.success('Cập nhật ảnh đại diện thành công!');
    },
    onError: () => {
      toast.error('Tải ảnh lên thất bại');
    },
  });
}
