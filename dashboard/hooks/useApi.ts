import { useState, useEffect } from 'react'
import axios from 'axios'

interface UseApiOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  headers?: Record<string, string>
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  autoExecute?: boolean
}

interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: any
  execute: () => Promise<void>
  refetch: () => Promise<void>
}

export function useApi<T>(options: UseApiOptions<T>): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const execute = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios({
        url: options.url,
        method: options.method || 'GET',
        data: options.data,
        headers: options.headers,
      })
      
      setData(response.data)
      options.onSuccess?.(response.data)
    } catch (err) {
      setError(err)
      options.onError?.(err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = async () => {
    await execute()
  }

  useEffect(() => {
    if (options.autoExecute !== false) {
      execute()
    }
  }, [options.url])

  return { data, loading, error, execute, refetch }
}

// Hook cho authentication
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials)
      setUser(response.data.user)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      setUser(response.data.user)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user
  }
}
