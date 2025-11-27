import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { User, LoginForm, RegisterForm, ApiResponse } from '../types';
import { useRouter } from 'next/navigation';

export const authQueryKeys = {
  user: ['auth', 'user'] as const,
  profile: ['auth', 'profile'] as const,
};

export const useUser = () => {
  return useQuery({
    queryKey: authQueryKeys.user,
    queryFn: async () => {
      try {
        const response = await apiClient.get('/auth/me');
        return handleApiResponse<User>(response);
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiClient.post('/auth/login', data);
      return handleApiResponse<{ user: User; token: string }>(response);
    },
    onSuccess: (data) => {
      // Token is usually handled by apiClient interceptors or cookies, 
      // but if we need to store it manually we can do it here.
      // Assuming apiClient handles storage or cookies are used.
      queryClient.setQueryData(authQueryKeys.user, data.user);
      router.push('/dashboard');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterForm) => {
      const response = await apiClient.post('/auth/register', data);
      return handleApiResponse<{ user: User; token: string }>(response);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authQueryKeys.user, data.user);
      router.push('/dashboard');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.user, null);
      queryClient.clear(); // Clear all cache on logout
      router.push('/login');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await apiClient.patch('/users/profile', data);
      return handleApiResponse<User>(response);
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authQueryKeys.user, updatedUser);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiClient.post('/auth/change-password', data);
      return handleApiResponse<ApiResponse<void>>(response);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return handleApiResponse<ApiResponse<void>>(response);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      const response = await apiClient.post('/auth/reset-password', data);
      return handleApiResponse<ApiResponse<void>>(response);
    },
  });
};

export const useAuth = () => {
  const { data: user, isLoading, error } = useUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
};