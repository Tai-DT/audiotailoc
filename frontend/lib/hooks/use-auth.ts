import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { User, LoginForm, RegisterForm, ApiResponse } from '../types';
import { useRouter } from 'next/navigation';
import { authStorage, AUTH_EVENTS, TOKEN_KEY } from '../auth-storage';

export const authQueryKeys = {
  user: ['auth', 'user'] as const,
  profile: ['auth', 'profile'] as const,
};

// Track when token was last set to avoid clearing it too quickly after login
let tokenSetTime: number | null = null;

export const useUser = () => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: authQueryKeys.user,
    queryFn: async () => {
      const token = authStorage.getAccessToken();
      
      // If no token, return null (not an error - user is just not authenticated)
      if (!token) {
        return null;
      }
      
      try {
        const response = await apiClient.get('/auth/me');
        return handleApiResponse<User>(response);
      } catch (error) {
        // If we get a 401/403, handle token clearing carefully
        // Don't clear token immediately if it was just set to allow retry logic to work
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as { response?: { status?: number } };
          if (apiError.response?.status === 401 || apiError.response?.status === 403) {
            const timeSinceTokenSet = tokenSetTime ? Date.now() - tokenSetTime : Infinity;
            // If token was set recently (within 5 seconds), don't clear it immediately
            // This allows retry logic in protected pages to work
            if (timeSinceTokenSet < 5000) {
              // Don't clear token yet - let protected pages retry logic handle it
              console.warn('[useUser] 401/403 error but token was set recently, not clearing yet to allow retry');
              // Throw error to trigger React Query retry mechanism
              throw error;
            } else {
              // Token was set a while ago, clear immediately
              authStorage.clearSession();
            }
          }
        }
        return null;
      }
    },
    // Always enable query - it will check for token internally
    enabled: true,
    retry: (failureCount, error) => {
      // Retry if token was set recently (within 5 seconds) and we got 401/403
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number } };
        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
          const timeSinceTokenSet = tokenSetTime ? Date.now() - tokenSetTime : Infinity;
          if (timeSinceTokenSet < 5000 && failureCount < 5) {
            // Retry up to 5 times if token was set recently (within 5 seconds)
            return true;
          }
        }
      }
      return false;
    },
    retryDelay: (attemptIndex) => {
      // Faster retry: 100ms, 200ms, 400ms, 800ms, 1600ms
      return Math.min(100 * 2 ** attemptIndex, 2000);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiClient.post('/auth/login', data);
      const result = handleApiResponse<{ user: User; token: string; refreshToken?: string }>(response);
      return result;
    },
    onSuccess: async (data) => {
      // Store token and user session in authStorage
      if (data?.token) {
        // JWT access token expires in 15 minutes (900000ms) based on backend config
        const expiresInMs = 15 * 60 * 1000; // 15 minutes
        authStorage.setSession({
          accessToken: data.token,
          refreshToken: data.refreshToken,
          expiresInMs,
          user: data.user ? {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            phone: data.user.phone,
            avatar: data.user.avatar,
            role: data.user.role,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          } : undefined,
          rememberMe: false, // TODO: Get from login form if needed
        });
        // Track when token was set to avoid clearing it too quickly after login
        tokenSetTime = Date.now();
        
        // Small delay to ensure token is set in localStorage and axios interceptor is ready
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Update React Query cache with user data immediately (optimistic update)
      queryClient.setQueryData(authQueryKeys.user, data.user);
      
      // Invalidate all queries to trigger refetch with new token
      // This ensures useUser hook picks up the new token and fetches fresh user data
      await queryClient.invalidateQueries();
      
      // Now refetch user data specifically to ensure we have the latest from server
      try {
        await queryClient.refetchQueries({ queryKey: authQueryKeys.user });
      } catch (error) {
        // If refetch fails, the optimistic update from setQueryData will still be available
        console.warn('Failed to refetch user data after login:', error);
      }
      
      // Small delay to ensure React state updates are complete before navigation
      setTimeout(() => {
        router.push('/');
      }, 200);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterForm) => {
      const response = await apiClient.post('/auth/register', data);
      return handleApiResponse<{ user: User; token: string; refreshToken?: string }>(response);
    },
    onSuccess: async (data) => {
      // Store token and user session in authStorage
      if (data?.token) {
        // JWT access token expires in 15 minutes (900000ms) based on backend config
        const expiresInMs = 15 * 60 * 1000; // 15 minutes
        authStorage.setSession({
          accessToken: data.token,
          refreshToken: data.refreshToken,
          expiresInMs,
          user: data.user ? {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            phone: data.user.phone,
            avatar: data.user.avatar,
            role: data.user.role,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          } : undefined,
          rememberMe: false,
        });
        // Track when token was set to avoid clearing it too quickly after register
        tokenSetTime = Date.now();
      }
      
      // Update React Query cache with user data immediately (optimistic update)
      queryClient.setQueryData(authQueryKeys.user, data.user);
      
      // Now that token is set, the useUser query will be enabled automatically
      // Refetch to ensure we have the latest data from server and sync properly
      // Await refetch to ensure query completes before navigation
      try {
        await queryClient.refetchQueries({ queryKey: authQueryKeys.user });
      } catch (error) {
        // If refetch fails, the optimistic update from setQueryData will still be available
        console.warn('Failed to refetch user data after register:', error);
      }
      
      // Small delay to ensure React state updates are complete before navigation
      setTimeout(() => {
        router.push('/');
      }, 200);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        // Try to call logout endpoint, but don't fail if it doesn't exist (404)
        await apiClient.post('/auth/logout');
      } catch (error) {
        // If endpoint doesn't exist (404) or any other error, just ignore it
        // We'll still clear the session locally
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as { response?: { status?: number } };
          // Only log non-404 errors
          if (apiError.response?.status !== 404) {
            console.warn('[useLogout] Logout API call failed:', error);
          }
        }
        // Don't throw - we want to clear session regardless
      }
    },
    onSuccess: () => {
      // Clear session from authStorage
      authStorage.clearSession();
      queryClient.setQueryData(authQueryKeys.user, null);
      queryClient.clear(); // Clear all cache on logout
      router.push('/login');
    },
    onError: () => {
      // Even if API call fails, still clear session and redirect
      // This ensures logout works even if backend endpoint doesn't exist
      authStorage.clearSession();
      queryClient.setQueryData(authQueryKeys.user, null);
      queryClient.clear();
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
  const hasToken = Boolean(authStorage.getAccessToken());
  const { data: user, isLoading, error, isFetching, refetch } = useUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  // If there's no token, we know immediately that user is not authenticated
  // If there's a token, wait for query to complete
  const actualLoading = hasToken ? (isLoading || isFetching) : false;
  const isAuthenticated = hasToken && !!user;

  return {
    user,
    isLoading: actualLoading,
    isAuthenticated,
    error,
    refetch, // Export refetch so components can manually trigger user data refresh
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