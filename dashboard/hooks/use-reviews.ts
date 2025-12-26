"use client"

import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

export interface Review {
  id: string
  userId: string
  userName: string
  productId?: string
  productName?: string
  serviceId?: string
  serviceName?: string
  rating: number
  comment: string
  images?: string[]
  status: 'pending' | 'approved' | 'rejected'
  response?: string
  helpfulCount: number
  reportCount: number
  createdAt: string
  updatedAt: string
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  pendingReviews: number
  approvedReviews: number
  rejectedReviews: number
  responseRate: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

type BackendReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

type BackendReview = {
  id: string
  userId: string
  productId: string
  rating: number
  title?: string | null
  comment?: string | null
  images?: string | null
  response?: string | null
  status: BackendReviewStatus
  upvotes: number
  downvotes: number
  createdAt: string
  updatedAt: string
  users?: {
    id: string
    name?: string | null
    email?: string | null
  } | null
  products?: {
    id: string
    name?: string | null
  } | null
}

type BackendListResponse = {
  data: BackendReview[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

type BackendStatsResponse = {
  total: number
  approved: number
  pending: number
  rejected: number
  averageRating: number
}

function normalizeImages(images: string | null | undefined): string[] {
  if (!images) return []
  const trimmed = images.trim()
  if (!trimmed) return []

  // JSON array string
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
      }
    } catch {
      // fall through
    }
  }

  // Comma-separated list
  if (trimmed.includes(',')) {
    return trimmed
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }

  // Single URL/string
  return [trimmed]
}

function mapStatus(status: BackendReviewStatus): Review['status'] {
  switch (status) {
    case 'APPROVED':
      return 'approved'
    case 'REJECTED':
      return 'rejected'
    case 'PENDING':
    default:
      return 'pending'
  }
}

function toBackendStatus(tab: string): BackendReviewStatus | undefined {
  switch (tab) {
    case 'approved':
      return 'APPROVED'
    case 'rejected':
      return 'REJECTED'
    case 'pending':
      return 'PENDING'
    case 'all':
    default:
      return undefined
  }
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch reviews
  const fetchReviews = useCallback(async (status: string = 'all') => {
    try {
      setLoading(true)
      setError(null)

      const backendStatus = toBackendStatus(status)
      const query = new URLSearchParams({
        page: '1',
        pageSize: '50',
      })
      if (backendStatus) query.set('status', backendStatus)

      const [listRes, statsRes] = await Promise.all([
        apiClient.get<BackendListResponse>(`/reviews?${query.toString()}`),
        apiClient.get<BackendStatsResponse>('/reviews/stats/summary'),
      ])

      const mappedReviews: Review[] = (listRes.data?.data || []).map((r) => {
        const images = normalizeImages(r.images)
        return {
          id: r.id,
          userId: r.userId,
          userName: r.users?.name || 'Không rõ',
          productId: r.productId,
          productName: r.products?.name || undefined,
          rating: r.rating,
          comment: r.comment || '',
          images: images.length > 0 ? images : undefined,
          status: mapStatus(r.status),
          response: r.response || undefined,
          helpfulCount: r.upvotes || 0,
          reportCount: 0,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }
      })

      // Compute some UI-only stats from the current page (backend doesn't provide these)
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as ReviewStats['ratingDistribution']
      let respondedCount = 0
      for (const r of mappedReviews) {
        ratingDistribution[r.rating as 1 | 2 | 3 | 4 | 5] = (ratingDistribution[r.rating as 1 | 2 | 3 | 4 | 5] || 0) + 1
        if (r.response && r.response.trim().length > 0) respondedCount += 1
      }

      const totalOnPage = mappedReviews.length
      const responseRate = totalOnPage > 0 ? Math.round((respondedCount / totalOnPage) * 100) : 0

      setReviews(mappedReviews)
      setStats({
        totalReviews: statsRes.data?.total || 0,
        averageRating: statsRes.data?.averageRating || 0,
        pendingReviews: statsRes.data?.pending || 0,
        approvedReviews: statsRes.data?.approved || 0,
        rejectedReviews: statsRes.data?.rejected || 0,
        responseRate,
        ratingDistribution,
      })
    } catch (err) {
      const errorMessage = 'Không thể tải danh sách đánh giá'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Approve review
  const approveReview = useCallback(async (reviewId: string) => {
    try {
      setLoading(true)
      await apiClient.patch(`/reviews/${reviewId}/status/APPROVED`)
      toast.success('Đã duyệt đánh giá')
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, status: 'approved' as const } : review
      ))
    } catch (err) {
      toast.error('Không thể duyệt đánh giá')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Reject review
  const rejectReview = useCallback(async (reviewId: string, reason?: string) => {
    try {
      setLoading(true)
      // Backend does not currently accept a reject reason; keep this param for UI compatibility.
      await apiClient.patch(`/reviews/${reviewId}/status/REJECTED`)
      toast.success('Đã từ chối đánh giá')
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, status: 'rejected' as const } : review
      ))
    } catch (err) {
      toast.error('Không thể từ chối đánh giá')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Respond to review
  const respondToReview = useCallback(async (reviewId: string, response: string) => {
    try {
      setLoading(true)
      await apiClient.put(`/reviews/${reviewId}`, { response })
      toast.success('Đã phản hồi đánh giá')
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, response } : review
      ))
    } catch (err) {
      toast.error('Không thể phản hồi đánh giá')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete review
  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      setLoading(true)
      await apiClient.delete(`/reviews/${reviewId}`)
      toast.success('Đã xóa đánh giá')
      
      // Remove from local state
      setReviews(prev => prev.filter(review => review.id !== reviewId))
    } catch (err) {
      toast.error('Không thể xóa đánh giá')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Mark review as helpful
  const markHelpful = useCallback(async (reviewId: string) => {
    try {
      await apiClient.patch(`/reviews/${reviewId}/helpful/true`)
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount + 1 } 
          : review
      ))
    } catch (err) {
      // Silent error
    }
  }, [])

  // Report review
  const reportReview = useCallback(async (reviewId: string, reason: string) => {
    // Backend currently has no report endpoint for reviews.
    toast.error('Chức năng báo cáo đánh giá chưa được hỗ trợ')
  }, [])

  return {
    // State
    reviews,
    stats,
    loading,
    error,

    // Actions
    fetchReviews,
    approveReview,
    rejectReview,
    respondToReview,
    deleteReview,
    markHelpful,
    reportReview,

    // Utilities
    refresh: fetchReviews
  }
}
