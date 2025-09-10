"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

interface User {
  id: string
  email: string
  name: string
  role?: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  refreshUser: () => Promise<void>
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
      const userData = response.data as { userId: string; email: string; role?: string }
      
      if (userData.userId && userData.email) {
        setUser({
          id: userData.userId,
          email: userData.email,
          name: userData.email.split('@')[0],
          role: userData.role || 'user'
        })
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password })

      if (!response.success) {
        throw new Error(response.message || 'Login failed')
      }

      // Normalize various response shapes from backend
      // Possible shapes:
      // - { data: { accessToken, refreshToken } }
      // - { data: { data: { token, user } } }
      // - { data: { token, user } }
      // - { token }
      const respData: any = response?.data ?? response
      let accessToken: string | null = null
      let refreshToken: string | null = null

      // Try nested data.data first
      if (respData?.data && typeof respData.data === 'object') {
        const inner = respData.data.data ?? respData.data
        if (inner?.token || inner?.accessToken) {
          accessToken = inner.token ?? inner.accessToken
          refreshToken = inner.refreshToken ?? null
        }
      }

      // Fallback to top-level fields
      if (!accessToken) {
        accessToken = respData?.token ?? respData?.accessToken ?? null
        refreshToken = respData?.refreshToken ?? null
      }

      if (!accessToken) {
        console.error('Invalid tokens in response:', response)
        throw new Error('Invalid login response: Missing access token')
      }

      setToken(accessToken)

      // Store tokens: if refresh token available, store both; otherwise store accessToken only
      try {
        if (refreshToken) {
          setStoredTokens({ accessToken, refreshToken })
        } else {
          localStorage.setItem('accessToken', accessToken)
          localStorage.removeItem('refreshToken')
        }
      } catch (e) {
        console.error('Failed to store tokens:', e)
      }

      // Ensure token is set before any API calls
      apiClient.setToken(accessToken)
      console.log('🔐 JWT Token set in ApiClient:', accessToken.substring(0, 30) + '...')

      await refreshUser()
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
          
          try {
            await refreshUser()
          } catch (error) {
            console.error('Failed to refresh user:', error)
            clearStoredTokens()
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

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
