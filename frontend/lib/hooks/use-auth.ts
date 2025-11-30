import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { User, LoginForm, RegisterForm, ApiResponse } from '../types';
import { useRouter } from 'next/navigation';
import { authStorage } from '../auth-storage';

export const authQueryKeys = {
  user: ['auth', 'user'] as const,
  profile: ['auth', 'profile'] as const,
};

// Track when token was last set to avoid clearing it too quickly after login
let tokenSetTime: number | null = null;

export const useUser = () => {
  return useQuery({
    queryKey: authQueryKeys.user,
    queryFn: async () => {
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
              // The protected pages will check if user is available after retries
              // If still no user after retries, they will redirect to login
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
    enabled: () => Boolean(authStorage.getAccessToken()), // Check token directly - reactive
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
      // Faster retry: 100ms, 200ms, 400ms, 800ms, 1600ms (instead of 1s, 2s, 4s, 8s, 16s)
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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:37',message:'Login mutationFn - before API call',data:{email:data.email,hasTokenBefore:!!authStorage.getAccessToken()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const response = await apiClient.post('/auth/login', data);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:40',message:'Login mutationFn - response received',data:{hasResponse:!!response,hasData:!!response?.data,responseDataKeys:response?.data?Object.keys(response.data):null,responseDataString:JSON.stringify(response?.data).substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const result = handleApiResponse<{ user: User; token: string; refreshToken?: string }>(response);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:45',message:'Login mutationFn - after handleApiResponse',data:{hasResult:!!result,resultKeys:result?Object.keys(result):null,hasToken:!!result?.token,hasRefreshToken:!!result?.refreshToken,hasUser:!!result?.user,tokenField:result?.token?'token':'NOT_FOUND',resultString:JSON.stringify(result).substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return result;
    },
    onSuccess: async (data) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:48',message:'Login onSuccess - entry',data:{hasData:!!data,hasToken:!!data?.token,hasUser:!!data?.user,hasRefreshToken:!!data?.refreshToken,tokenInStorage:!!authStorage.getAccessToken()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
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
            avatar: data.user.avatar || (data.user as any).avatarUrl,
            role: data.user.role,
          } : undefined,
          rememberMe: false, // TODO: Get from login form if needed
        });
        // Track when token was set to avoid clearing it too quickly after login
        tokenSetTime = Date.now();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:67',message:'Login onSuccess - after setSession',data:{tokenInStorage:!!authStorage.getAccessToken(),tokenLength:authStorage.getAccessToken()?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Small delay to ensure token is set in localStorage and axios interceptor is ready
        await new Promise(resolve => setTimeout(resolve, 200));
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
        console.warn('Failed to refetch user data after login:', error);
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:73',message:'Login onSuccess - before router.push',data:{tokenInStorage:!!authStorage.getAccessToken()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
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
            avatar: data.user.avatar || (data.user as any).avatarUrl,
            role: data.user.role,
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
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      // Clear session from authStorage
      authStorage.clearSession();
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