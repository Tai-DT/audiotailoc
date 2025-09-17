'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  getValidToken: () => Promise<string | null>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('audiotailoc_user');
        const storedToken = localStorage.getItem('audiotailoc_token');
        const storedRefreshToken = localStorage.getItem('audiotailoc_refresh_token');
        const storedTokenExpiry = localStorage.getItem('audiotailoc_token_expiry');

        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);
          const tokenExpiry = storedTokenExpiry ? parseInt(storedTokenExpiry) : null;

          // Check if token is expired (with 5 minute buffer)
          if (tokenExpiry && Date.now() > (tokenExpiry - 5 * 60 * 1000)) {
            // Try to refresh token if refresh token exists
            if (storedRefreshToken) {
              refreshToken(storedRefreshToken);
            } else {
              // Clear expired data
              localStorage.removeItem('audiotailoc_user');
              localStorage.removeItem('audiotailoc_token');
              localStorage.removeItem('audiotailoc_refresh_token');
              localStorage.removeItem('audiotailoc_token_expiry');
            }
          } else {
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('audiotailoc_user');
        localStorage.removeItem('audiotailoc_token');
        localStorage.removeItem('audiotailoc_refresh_token');
        localStorage.removeItem('audiotailoc_token_expiry');
      }
    };

    loadUser();
  }, []);

  // Periodic check for token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedRefreshToken = localStorage.getItem('audiotailoc_refresh_token');
      if (!storedRefreshToken) return;

      try {
        // Decode the refresh token to check its expiration
        const payload = JSON.parse(atob(storedRefreshToken.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds

        // If refresh token is expired, logout the user
        if (Date.now() > expiryTime) {
          console.log('Refresh token expired, logging out user');
          localStorage.removeItem('audiotailoc_user');
          localStorage.removeItem('audiotailoc_token');
          localStorage.removeItem('audiotailoc_refresh_token');
          localStorage.removeItem('audiotailoc_token_expiry');
          dispatch({ type: 'AUTH_LOGOUT' });
          toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        // If we can't decode the token, clear everything
        localStorage.removeItem('audiotailoc_user');
        localStorage.removeItem('audiotailoc_token');
        localStorage.removeItem('audiotailoc_refresh_token');
        localStorage.removeItem('audiotailoc_token_expiry');
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    // Check immediately and then every 5 minutes
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to refresh access token
  const refreshToken = async (refreshTokenValue: string) => {
    try {
      const response = await fetch('http://localhost:3010/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      // Update stored tokens
      localStorage.setItem('audiotailoc_token', data.accessToken);
      localStorage.setItem('audiotailoc_refresh_token', data.refreshToken);
      // Set new expiry time (15 minutes from now)
      localStorage.setItem('audiotailoc_token_expiry', (Date.now() + 15 * 60 * 1000).toString());

      // Load user data if not already loaded
      const storedUser = localStorage.getItem('audiotailoc_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear all stored data on refresh failure
      localStorage.removeItem('audiotailoc_user');
      localStorage.removeItem('audiotailoc_token');
      localStorage.removeItem('audiotailoc_refresh_token');
      localStorage.removeItem('audiotailoc_token_expiry');
    }
  };

  // Function to get a valid access token (refreshes if needed)
  const getValidToken = async (): Promise<string | null> => {
    const storedToken = localStorage.getItem('audiotailoc_token');
    const storedRefreshToken = localStorage.getItem('audiotailoc_refresh_token');
    const storedTokenExpiry = localStorage.getItem('audiotailoc_token_expiry');

    if (!storedToken) return null;

    const tokenExpiry = storedTokenExpiry ? parseInt(storedTokenExpiry) : null;

    // If token is expired or will expire in next 5 minutes, refresh it
    if (tokenExpiry && Date.now() > (tokenExpiry - 5 * 60 * 1000)) {
      if (storedRefreshToken) {
        try {
          await refreshToken(storedRefreshToken);
          return localStorage.getItem('audiotailoc_token');
        } catch (error) {
          console.error('Failed to refresh token:', error);
          return null;
        }
      } else {
        return null;
      }
    }

    return storedToken;
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('http://localhost:3010/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const data = await response.json();

      // Store user data and tokens
      localStorage.setItem('audiotailoc_user', JSON.stringify(data.user));
      localStorage.setItem('audiotailoc_token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('audiotailoc_refresh_token', data.refreshToken);
        // Set token expiry time (15 minutes from now)
        localStorage.setItem('audiotailoc_token_expiry', (Date.now() + 15 * 60 * 1000).toString());
        // Store remember me preference
        localStorage.setItem('audiotailoc_remember_me', rememberMe.toString());
      }

      dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
      toast.success('Đăng nhập thành công!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('http://localhost:3010/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }

      const data = await response.json();

      // Store user data and tokens
      localStorage.setItem('audiotailoc_user', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('audiotailoc_token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('audiotailoc_refresh_token', data.refreshToken);
          // Set token expiry time (15 minutes from now)
          localStorage.setItem('audiotailoc_token_expiry', (Date.now() + 15 * 60 * 1000).toString());
        }
      }

      dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
      toast.success('Đăng ký thành công!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('audiotailoc_user');
    localStorage.removeItem('audiotailoc_token');
    localStorage.removeItem('audiotailoc_refresh_token');
    localStorage.removeItem('audiotailoc_token_expiry');
    dispatch({ type: 'AUTH_LOGOUT' });
    toast.success('Đã đăng xuất');
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!state.user) return;

    dispatch({ type: 'AUTH_START' });

    try {
      const token = await getValidToken();

      // Simulate API call - replace with actual API endpoint
      const response = await fetch('http://localhost:3010/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cập nhật thất bại');
      }

      const data = await response.json();

      // Update stored user data
      localStorage.setItem('audiotailoc_user', JSON.stringify(data.user));

      dispatch({ type: 'UPDATE_PROFILE', payload: data.user });
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Cập nhật thất bại';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    getValidToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};