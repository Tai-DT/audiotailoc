"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'
import { apiClient } from '@/lib/api-client'
import { logger } from '@/lib/logger'

interface User {
  id: string
  email: string
  name: string
  role?: string
  avatarUrl?: string
}

interface AuthTokens {
  accessToken: string
  refreshToken?: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: (redirectTo?: string) => void
  refreshToken: () => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isFetchingUser = useRef(false)
  const lastUserFetch = useRef(0)

  const getStoredTokens = (): AuthTokens | null => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      // Accept cases where only accessToken is present (backend may not return refresh token)
      if (accessToken) {
        return { accessToken, refreshToken }
      }
    } catch (error) {
      logger.error('Failed to get stored tokens', error)
    }
    return null
  }

  const setStoredTokens = (tokens: AuthTokens) => {
    try {
      localStorage.setItem('accessToken', tokens.accessToken)
      // store refreshToken only if non-empty
      if (tokens.refreshToken) {
        localStorage.setItem('refreshToken', tokens.refreshToken)
      } else {
        localStorage.removeItem('refreshToken')
      }
    } catch (error) {
      logger.error('Failed to store tokens', error)
    }
  }

  const clearStoredTokens = () => {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } catch (error) {
      logger.error('Failed to clear tokens', error)
    }
  }

  const getCurrentPath = () => {
    if (typeof window === 'undefined') return '/dashboard'
    const { pathname, search } = window.location
    const fullPath = `${pathname}${search || ''}`
    // Avoid redirecting back to login endlessly
    if (pathname === '/login') return '/dashboard'
    return fullPath || '/dashboard'
  }

  const logout = useCallback((redirectToOverride?: string) => {
    setUser(null)
    setToken(null)
    clearStoredTokens()
    apiClient.clearToken()

    // Redirect to login if we're in the browser
    if (typeof window !== 'undefined') {
      if (redirectToOverride && redirectToOverride.trim().length > 0) {
        window.location.href = redirectToOverride
        return
      }

      const redirect = encodeURIComponent(getCurrentPath())
      window.location.href = `/login?redirect=${redirect}`
    }
  }, [])

  const refreshToken = useCallback(async () => {
    const storedTokens = getStoredTokens()
    if (!storedTokens?.refreshToken) {
      // Some environments only return access tokens (no refresh token).
      // In that case we cannot refresh proactively; just skip.
      logger.debug('Skip token refresh: no refresh token available')
      return
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

  const refreshUser = useCallback(async () => {
    const now = Date.now()
    // throttle and skip concurrent fetches to avoid rate limits
    if (isFetchingUser.current || now - lastUserFetch.current < 5000) {
      return
    }
    isFetchingUser.current = true
    try {
      const response = await apiClient.getCurrentUser()
      // Backend response can vary; keep this defensive.
      const userData = response.data as { userId: string; email: string; role?: string; name?: string }

      if (userData.userId && userData.email) {
        setUser((prev) => {
          const derivedName = userData.email.split("@")[0]
          const prevName = prev?.email === userData.email ? prev?.name : undefined
          return {
            id: userData.userId,
            email: userData.email,
            name: userData.name || prevName || derivedName,
            role: userData.role || prev?.role || 'user',
          }
        })
      }
    } catch (error) {

      const status = (error as any)?.status ?? (error as any)?.response?.status
      if (status === 401 || status === 403) {
        // Token is missing/expired/invalid. Clear locally without spamming console errors.
        try {
          clearStoredTokens()
        } catch {
          // ignore
        }
        apiClient.clearToken()
        setUser(null)
        setToken(null)
        return
      }
      if (status === 429) {
        logger.warn('Skipped user refresh due to rate limiting', { status })
        return
      }
      logger.error('Failed to fetch user data', error)
      throw error
    } finally {
      lastUserFetch.current = Date.now()
      isFetchingUser.current = false
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password })

      // Backend returns success/data structure, but throws error for 401
      // So if we get here, login was successful
      if (!response.success) {
        throw new Error(response.message || 'Login failed')
      }

      // Backend API shape: { success, data: { token, refreshToken, user, ... }, ... }
      const respData = response as any
      const inner = respData?.data ?? respData
      let accessToken: string | null = inner?.token ?? null
      let refreshTokenValue: string | null = inner?.refreshToken ?? inner?.refresh_token ?? null
      let userData: { id: string; email: string; name?: string; role?: string } | null =
        inner?.user ?? null

      if (!accessToken) {
        logger.error('Invalid tokens in response', undefined, { response: { success: response.success, message: response.message } })
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
        logger.error('Failed to store tokens', e)
      }

      // Set token in API client
      apiClient.setToken(accessToken)
      logger.debug('JWT Token set in ApiClient', { tokenLength: accessToken.length })

      // Set user data if available
      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.email.split('@')[0],
          role: userData.role || 'user'
        })
      } else {
        // Fallback: try to get user data from token or API
        try {
          await refreshUser()
        } catch (error) {
          logger.warn('Could not fetch user data after login', { error })
          // Set basic user info from email
          setUser({
            id: 'unknown',
            email: email,
            name: email.split('@')[0],
            role: 'user'
          })
        }
      }
    } catch (error) {

      const status = (error as any)?.status ?? (error as any)?.response?.status
      if (status === 429) {
        logger.warn('Login throttled by rate limit', { email })
        throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.')
      }

      logger.error('Login error', error, { email })
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
            logger.error('Failed to refresh user', error)
            clearStoredTokens()
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Set up global 401 handler
    apiClient.setUnauthorizedHandler(() => {
      logger.warn('Unauthorized request detected - logging out')
      logout()
    })

    initAuth()
  }, [logout, refreshUser])

  // Auto refresh token before expiration
  useEffect(() => {
    if (!token) return

    // Only auto-refresh when a refresh token is available.
    // If the backend doesn't issue refresh tokens, keep the session simple:
    // it will expire naturally and the 401 handler will log out.
    let storedRefreshToken: string | null = null
    try {
      storedRefreshToken = localStorage.getItem('refreshToken')
    } catch (e) {
      logger.warn('Failed to read refresh token for auto-refresh', { e })
    }
    if (!storedRefreshToken) return

    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken()
      } catch (error) {
        logger.error('Auto refresh failed', error)
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
    refreshUser,
    setUser
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
