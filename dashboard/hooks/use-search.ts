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

interface SearchApiItem {
  id?: string
  type?: 'product' | 'service' | 'order' | 'user'
  title?: string
  name?: string
  description?: string
  price?: number
  relevanceScore?: number
  metadata?: Record<string, unknown>
}

interface SearchApiResponse {
  results?: SearchApiItem[]
  total?: number
}

interface PopularApiItem {
  query?: string
  count?: number
}

interface PopularSearchApiResponse {
  data?: PopularApiItem[]
}

interface SuggestionsApiResponse {
  data?: string[]
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
      const response = await apiClient.get<SearchApiResponse>(`/search?q=${encodeURIComponent(query)}&type=${type}`)
      const data = response.data
      const results = data.results || []

      // Transform backend results to match SearchResult interface
      const filtered: SearchResult[] = results.map((item) => ({
        id: String(item.id || ''),
        type: item.type || 'product',
        title: String(item.title || item.name || ''),
        description: String(item.description || ''),
        price: typeof item.price === 'number' ? item.price : undefined,
        score: typeof item.relevanceScore === 'number' ? item.relevanceScore : undefined,
        metadata: item.metadata
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

      // Tracking is handled by backend now

    } catch (err) {
      const errorMessage = 'Không thể thực hiện tìm kiếm'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

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
      const response = await apiClient.get<PopularSearchApiResponse>('/search/popular?limit=10')
      const popular = response.data?.data || []

      // Transform to match PopularSearch interface
      const transformed: PopularSearch[] = popular.map((item, index: number) => ({
        id: String(index),
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
      const response = await apiClient.get<SuggestionsApiResponse>(`/search/suggestions?q=${encodeURIComponent(query)}&limit=5`)
      const suggestions = response.data?.data || []

      // Return array of suggestion strings
      return suggestions
    } catch {
      return []
    }
  }, [])



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
