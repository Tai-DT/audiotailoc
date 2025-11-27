"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

interface User {
  id: string
  email: string
  name: string
  role?: string
  avatarUrl?: string | null
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  refreshUser: () => Promise<boolean | undefined>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getStoredTokens = (): AuthTokens | null => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      // Accept cases where only accessToken is present (backend may not return refresh token)
      if (accessToken) {
        return { accessToken, refreshToken: refreshToken ?? '' }
      }
    } catch (error) {
      console.error('Failed to get stored tokens:', error)
    }
    return null
  }

  const setStoredTokens = (tokens: AuthTokens) => {
    try {
      localStorage.setItem('accessToken', tokens.accessToken)
      // store refreshToken if provided (may be empty string)
      if (tokens.refreshToken !== undefined && tokens.refreshToken !== null) {
        localStorage.setItem('refreshToken', tokens.refreshToken)
      } else {
        localStorage.removeItem('refreshToken')
      }
    } catch (error) {
      console.error('Failed to store tokens:', error)
    }
  }

  const clearStoredTokens = () => {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } catch (error) {
      console.error('Failed to clear tokens:', error)
    }
  }

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    clearStoredTokens()
    apiClient.clearToken()

    // Redirect to login if we're in the browser
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Only redirect if we're on a protected route
      if (currentPath.startsWith('/dashboard')) {
        // Use window.location.href to ensure full state reset on logout
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
  }, [])

  const refreshToken = useCallback(async () => {
    const storedTokens = getStoredTokens()
    if (!storedTokens?.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await apiClient.refreshToken(storedTokens.refreshToken)
      const newTokens = response.data as AuthTokens

      if (newTokens.accessToken) {
        setToken(newTokens.accessToken)
        setStoredTokens({
          accessToken: newTokens.accessToken,
          refreshToken: storedTokens.refreshToken
        })
        apiClient.setToken(newTokens.accessToken)
      }
    } catch (error) {
      logout()
      throw error
    }
  }, [logout])

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser()
      const userData = response.data as { userId?: string; id?: string; email: string; role?: string; name?: string; avatarUrl?: string | null }

      // Handle both userId and id fields
      const userId = userData.userId || userData.id
      if (userId && userData.email) {
        setUser({
          id: userId,
          email: userData.email,
          name: userData.name || userData.email.split('@')[0],
          role: userData.role || 'user',
          avatarUrl: userData.avatarUrl || null
        })
        return true
      } else {
        console.warn('Incomplete user data from API:', userData)
        throw new Error('Incomplete user data received')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Failed to fetch user data:', errorMessage)
      
      // If it's a 401 error, logout the user
      if (error instanceof Error && (errorMessage.includes('session has expired') || errorMessage.includes('Unauthorized'))) {
        logout()
      }
      
      return false
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password })

      // Backend returns success/data structure, but throws error for 401
      // So if we get here, login was successful
      if (!response.success) {
        throw new Error(response.message || 'Login failed')
      }

      // Handle nested response structure from backend
      // Format: { data: { data: { data: { token, user } } } }
      const respData = response?.data ?? response
      let accessToken: string | null = null
      let refreshTokenValue: string | null = null
      let userData: { id: string; email: string; name?: string; role?: string; avatarUrl?: string | null } | null = null

      // Extract token from nested structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((respData as any)?.data?.data?.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inner = (respData as any).data.data.data
        accessToken = inner.token
        refreshTokenValue = inner.refreshToken || null
        userData = inner.user
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((respData as any)?.data?.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inner = (respData as any).data.data
        accessToken = inner.token
        refreshTokenValue = inner.refreshToken || null
        userData = inner.user
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((respData as any)?.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        accessToken = (respData as any).data.token
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refreshTokenValue = (respData as any).data.refreshToken || null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userData = (respData as any).data.user
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        accessToken = (respData as any)?.token
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refreshTokenValue = (respData as any)?.refreshToken || null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userData = (respData as any)?.user
      }

      if (!accessToken) {
        console.error('Invalid tokens in response:', response)
        throw new Error('Invalid login response: Missing access token')
      }

      setToken(accessToken)

      // Store token
      try {
        localStorage.setItem('accessToken', accessToken)
        if (refreshTokenValue) {
          localStorage.setItem('refreshToken', refreshTokenValue)
        } else {
          localStorage.removeItem('refreshToken')
        }
      } catch (e) {
        console.error('Failed to store tokens:', e)
      }

      // Set token in API client
      apiClient.setToken(accessToken)
      console.log('🔐 JWT Token set in ApiClient:', accessToken.substring(0, 30) + '...')

      // Set user data if available
      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.email.split('@')[0],
          role: userData.role || 'user',
          avatarUrl: userData.avatarUrl || null
        })
      } else {
        // Fallback: try to get user data from token or API
        const refreshed = await refreshUser()
        if (!refreshed) {
           throw new Error('Could not fetch user data after login');
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unknown error occurred during login')
    }
  }

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedTokens = getStoredTokens()
        if (storedTokens?.accessToken) {
          setToken(storedTokens.accessToken)
          apiClient.setToken(storedTokens.accessToken)

          const userRefreshed = await refreshUser()
          if (!userRefreshed) {
            // If user refresh failed, clear tokens
            clearStoredTokens()
            setToken(null)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Set up global 401 handler
    apiClient.setUnauthorizedHandler(() => {
      console.warn('Unauthorized request detected - logging out')
      logout()
    })

    initAuth()
  }, [logout])

  // Auto refresh token before expiration
  useEffect(() => {
    if (!token) return

    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken()
      } catch (error) {
        console.error('Auto refresh failed:', error)
      }
    }, 10 * 60 * 1000) // 10 minutes

    return () => clearInterval(refreshInterval)
  }, [token, refreshToken])

  const value: AuthContextType = {
    user,
    setUser,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    refreshToken,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
