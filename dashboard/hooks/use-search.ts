"use client"

import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

export interface SearchResult {
  id: string
  type: 'product' | 'service' | 'order' | 'user'
  title: string
  description: string
  price?: number
  score?: number
  metadata?: Record<string, unknown>
}

export interface SearchHistory {
  id: string
  query: string
  timestamp: string
  resultCount: number
}

export interface PopularSearch {
  id: string
  query: string
  count: number
}

export function useSearch() {
  const [searchResults, setSearchResults] = useState<{
    all: SearchResult[]
    products: SearchResult[]
    services: SearchResult[]
    orders: SearchResult[]
    users: SearchResult[]
  }>({
    all: [],
    products: [],
    services: [],
    orders: [],
    users: []
  })
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Perform search
  // Track search for analytics
  const trackSearch = useCallback(async (query: string, resultCount: number) => {
    try {
      await apiClient.post('/search/analytics', { query, resultCount })
    } catch {
      // Silent error
    }
  }, [])

  const search = useCallback(async (query: string, type: string = 'all') => {
    try {
      setLoading(true)
      setError(null)
      
      // Call backend search API
      const response = await apiClient.get<Array<Record<string, unknown>>>(`/search?q=${encodeURIComponent(query)}&type=${type}`)
      const results = (response.data as Array<Record<string, unknown>>) || []
      
      // Transform backend results to match SearchResult interface
      const filtered: SearchResult[] = results.map((item) => ({
        id: String(item.id || ''),
        type: (item.type as 'product' | 'service' | 'order' | 'user') || 'product',
        title: String(item.name || item.title || ''),
        description: String(item.description || ''),
        price: typeof item.price === 'number' ? item.price : undefined,
        score: typeof item.score === 'number' ? item.score : undefined,
        metadata: item
      }))

      setSearchResults({
        all: filtered,
        products: filtered.filter(r => r.type === 'product'),
        services: filtered.filter(r => r.type === 'service'),
        orders: filtered.filter(r => r.type === 'order'),
        users: filtered.filter(r => r.type === 'user')
      })

      // Add to history
      const historyItem: SearchHistory = {
        id: Date.now().toString(),
        query,
        timestamp: new Date().toISOString(),
        resultCount: filtered.length
      }
      setSearchHistory(prev => [historyItem, ...prev.slice(0, 9)])

      // Track search analytics (moved outside useCallback to avoid dependency)
      setTimeout(() => trackSearch(query, filtered.length), 0)
      
    } catch {
      const errorMessage = 'Không thể thực hiện tìm kiếm'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [trackSearch])

  // Fetch search history
  const fetchHistory = useCallback(async () => {
    try {
      // TODO: Backend API for search history not implemented yet
      // Keep search history in local state only for now
      setSearchHistory([])
    } catch {
      // Silent error handling
    }
  }, [])

  // Fetch popular searches
  const fetchPopular = useCallback(async () => {
    try {
      // Call backend API for popular searches
      const response = await apiClient.get<Array<Record<string, unknown>>>('/search/popular?limit=10')
      const popular = (response.data as Array<Record<string, unknown>>) || []
      
      // Transform to match PopularSearch interface
      const transformed: PopularSearch[] = popular.map((item, index) => ({
        id: String(item.id || index),
        query: String(item.query || ''),
        count: typeof item.count === 'number' ? item.count : 0
      }))
      
      setPopularSearches(transformed)
    } catch {
      // Silent error - fallback to empty array
      setPopularSearches([])
    }
  }, [])

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    toast.success('Đã xóa lịch sử tìm kiếm')
  }, [])

  // Get search suggestions
  const getSuggestions = useCallback(async (query: string) => {
    try {
      if (!query || query.trim().length < 2) {
        return []
      }
      
      // Call backend API for search suggestions
      const response = await apiClient.get<Array<Record<string, unknown>>>(`/search/suggestions?q=${encodeURIComponent(query)}&limit=5`)
      const suggestions = (response.data as Array<Record<string, unknown>>) || []
      
      // Return array of suggestion strings
      return suggestions.map((item) => String(item.query || item))
    } catch {
      return []
    }
  }, [])

  // Real API implementation (uncomment when backend is ready)
  /*
  const search = useCallback(async (query: string, type: string = 'all', filters?: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        q: query,
        type,
        ...filters
      })
      
      const response = await apiClient.get(`/search/global?${params}`)
      const results = response.data || []
      
      setSearchResults({
        all: results,
        products: results.filter((r: SearchResult) => r.type === 'product'),
        services: results.filter((r: SearchResult) => r.type === 'service'),
        orders: results.filter((r: SearchResult) => r.type === 'order'),
        users: results.filter((r: SearchResult) => r.type === 'user')
      })
      
      // Track search
      await trackSearch(query, results.length)
      
    } catch {
      const errorMessage = 'Không thể thực hiện tìm kiếm'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [trackSearch])
  */

  return {
    // State
    searchResults,
    searchHistory,
    popularSearches,
    loading,
    error,

    // Actions
    search,
    clearHistory,
    fetchHistory,
    fetchPopular,
    getSuggestions,
    trackSearch,

    // Utilities
    refresh: fetchHistory
  }
}
