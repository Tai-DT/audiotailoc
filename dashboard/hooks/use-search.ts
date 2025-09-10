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
  metadata?: any
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
  const search = useCallback(async (query: string, type: string = 'all', filters?: any) => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock data for now - replace with actual API call
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'product',
          title: 'Loa JBL EON615',
          description: 'Loa chuyên nghiệp công suất 1000W',
          price: 15000000,
          score: 0.95
        },
        {
          id: '2',
          type: 'service',
          title: 'Lắp đặt hệ thống âm thanh',
          description: 'Dịch vụ lắp đặt âm thanh chuyên nghiệp',
          price: 5000000,
          score: 0.88
        }
      ]

      // Filter by type
      let filtered = mockResults
      if (type !== 'all') {
        filtered = mockResults.filter(r => r.type === type)
      }

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

      // Track search analytics
      await trackSearch(query, filtered.length)
      
    } catch (err) {
      const errorMessage = 'Không thể thực hiện tìm kiếm'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error searching:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Track search for analytics
  const trackSearch = useCallback(async (query: string, resultCount: number) => {
    try {
      await apiClient.post('/search/analytics', { query, resultCount })
    } catch (err) {
      console.error('Error tracking search:', err)
    }
  }, [])

  // Fetch search history
  const fetchHistory = useCallback(async () => {
    try {
      // Mock data - replace with actual API call
      const mockHistory: SearchHistory[] = [
        { id: '1', query: 'loa JBL', timestamp: '2025-09-08T10:30:00Z', resultCount: 12 },
        { id: '2', query: 'micro', timestamp: '2025-09-08T09:15:00Z', resultCount: 8 },
        { id: '3', query: 'dịch vụ lắp đặt', timestamp: '2025-09-08T08:45:00Z', resultCount: 5 }
      ]
      setSearchHistory(mockHistory)
    } catch (err) {
      console.error('Error fetching search history:', err)
    }
  }, [])

  // Fetch popular searches
  const fetchPopular = useCallback(async () => {
    try {
      // Mock data - replace with actual API call
      const mockPopular: PopularSearch[] = [
        { id: '1', query: 'loa karaoke', count: 245 },
        { id: '2', query: 'micro không dây', count: 189 },
        { id: '3', query: 'mixer', count: 156 },
        { id: '4', query: 'sửa chữa loa', count: 134 },
        { id: '5', query: 'amply', count: 112 }
      ]
      setPopularSearches(mockPopular)
    } catch (err) {
      console.error('Error fetching popular searches:', err)
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
      const response = await apiClient.get(`/search/suggestions?q=${encodeURIComponent(query)}`)
      return response.data || []
    } catch (err) {
      console.error('Error getting suggestions:', err)
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
      
    } catch (err) {
      const errorMessage = 'Không thể thực hiện tìm kiếm'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error searching:', err)
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
