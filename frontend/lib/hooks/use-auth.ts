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
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:101',message:'useAuth queryFn started',data:{hasToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        // Double check token exists before making request
        const token = authStorage.getAccessToken();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:105',message:'Token check in queryFn',data:{hasToken:!!token,tokenLength:token?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        if (!token) {
          return null;
        }
        
        const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:110',message:'Profile API response',data:{status:response.status,hasUser:!!response.data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        const user = handleApiResponse<User>(response);
        authStorage.setUser(user as unknown as StoredUser);
        return user;
      } catch (error) {
        // #region agent log
        const errorStatus = (error as any)?.response?.status;
        console.error('[DEBUG] Profile API error', { status: errorStatus, error });
        fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:114',message:'Profile API error',data:{status:errorStatus,errorMessage:(error as Error)?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:125',message:'initialData check',data:{hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      if (!token) return null;
      const storedUser = authStorage.getUser<User>();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:129',message:'initialData result',data:{hasStoredUser:!!storedUser,storedUserId:storedUser?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return storedUser || undefined;
    },
  });
}

// Mutations
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginData) => {
      // #region agent log
      console.log('[DEBUG] Login mutation started', { email: data.email, hasPassword: !!data.password, rememberMe: data.rememberMe });
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:139',message:'Login mutation started',data:{email:data.email,hasPassword:!!data.password,rememberMe:data.rememberMe},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
      // #region agent log
      console.log('[DEBUG] Login API response', { status: response.status, data: response.data });
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:142',message:'Login API response received',data:{status:response.status,hasToken:!!response.data?.token,hasAccessToken:!!response.data?.accessToken,hasRefreshToken:!!response.data?.refreshToken,hasUser:!!response.data?.user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return handleApiResponse<AuthResponse>(response);
    },
    onSuccess: (data, variables) => {
      // #region agent log
      console.log('[DEBUG] Login onSuccess started', { userRole: data.user?.role, hasToken: !!data.token, hasAccessToken: !!data.accessToken, hasRefreshToken: !!data.refreshToken, userId: data.user?.id });
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:145',message:'Login onSuccess started',data:{userRole:data.user?.role,hasToken:!!data.token,hasAccessToken:!!data.accessToken,hasRefreshToken:!!data.refreshToken,userId:data.user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      if (data.user.role === 'DISABLED') {
        toast.error('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.');
        authStorage.clearSession();
        return;
      }

      const accessToken = data.token ?? data.accessToken;
      // #region agent log
      console.log('[DEBUG] Token extracted', { accessTokenLength: accessToken?.length || 0, hasAccessToken: !!accessToken, token: data.token, accessToken: data.accessToken });
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:153',message:'Token extracted',data:{accessTokenLength:accessToken?.length||0,hasAccessToken:!!accessToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
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
      // #region agent log
      const storedToken = authStorage.getAccessToken();
      const storedUser = authStorage.getUser();
      console.log('[DEBUG] Session stored', { storedTokenLength: storedToken?.length || 0, hasStoredToken: !!storedToken, hasStoredUser: !!storedUser, storedUserId: storedUser?.id });
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:163',message:'Session stored',data:{storedTokenLength:storedToken?.length||0,hasStoredToken:!!storedToken,hasStoredUser:!!storedUser,storedUserId:storedUser?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      // Update query cache with user data
      queryClient.setQueryData(['auth', 'profile'], data.user);
      // Invalidate to ensure all components using useAuth get the updated data
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'], refetchType: 'active' }).catch(() => {});
      // #region agent log
      const cachedUser = queryClient.getQueryData(['auth', 'profile']);
      console.log('[DEBUG] Query cache updated and invalidated', { hasCachedUser: !!cachedUser, cachedUserId: cachedUser?.id });
      fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-auth.ts:165',message:'Query cache updated',data:{hasCachedUser:!!cachedUser,cachedUserId:cachedUser?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      toast.success(`Chào mừng ${data.user.name}!`);
    },
    onError: (error: unknown) => {
      console.error('[DEBUG] Login error', error);
      const { message, status } = handleApiError(error as { response?: { data?: { message?: string; retryAfter?: number }; status?: number }; message?: string });
      console.log('[DEBUG] Login error handled', { message, status });
      
      // Handle rate limiting (429) with specific message
      if (status === 429) {
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
