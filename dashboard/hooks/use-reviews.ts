"use client"

import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import { Review, ReviewStats, ReviewsResponse } from '@/types/review'

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

      const params: any = {
        page: 1,
        pageSize: 100, // Fetch more for now since we filter client side
      }

      if (status !== 'all') {
        params.status = status.toUpperCase()
      }

      const [reviewsResponse, statsResponse] = await Promise.all([
        apiClient.getReviews(params),
        apiClient.getReviewStats()
      ])

      const reviewsData = reviewsResponse.data as unknown as ReviewsResponse
      const statsData = statsResponse.data as unknown as ReviewStats

      // If API returns array directly (legacy support)
      if (Array.isArray(reviewsResponse.data)) {
        setReviews(reviewsResponse.data as unknown as Review[])
      } else if (reviewsData && Array.isArray(reviewsData.data)) {
        setReviews(reviewsData.data)
      } else {
        setReviews([])
      }

      if (statsData) {
        setStats(statsData)
      }

    } catch (err) {
      console.error('Error fetching reviews:', err)
      const errorMessage = 'Không thể tải danh sách đánh giá'
      setError(errorMessage)
      toast.error(errorMessage)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Approve review
  const approveReview = useCallback(async (reviewId: string) => {
    try {
      setLoading(true)
      await apiClient.updateReviewStatus(reviewId, 'APPROVED')
      toast.success('Đã duyệt đánh giá')

      // Update local state
      setReviews(prev => prev.map(review =>
        review.id === reviewId ? { ...review, status: 'APPROVED' } : review
      ))

      // Refresh stats
      const statsResponse = await apiClient.getReviewStats()
      if (statsResponse.data) {
        setStats(statsResponse.data as unknown as ReviewStats)
      }
    } catch {
      toast.error('Không thể duyệt đánh giá')
    } finally {
      setLoading(false)
    }
  }, [])

  // Reject review
  const rejectReview = useCallback(async (reviewId: string) => {
    try {
      setLoading(true)
      await apiClient.updateReviewStatus(reviewId, 'REJECTED')
      toast.success('Đã từ chối đánh giá')

      // Update local state
      setReviews(prev => prev.map(review =>
        review.id === reviewId ? { ...review, status: 'REJECTED' } : review
      ))

      // Refresh stats
      const statsResponse = await apiClient.getReviewStats()
      if (statsResponse.data) {
        setStats(statsResponse.data as unknown as ReviewStats)
      }
    } catch {
      toast.error('Không thể từ chối đánh giá')
    } finally {
      setLoading(false)
    }
  }, [])

  // Respond to review
  const respondToReview = useCallback(async (reviewId: string, response: string) => {
    try {
      setLoading(true)
      await apiClient.respondToReview(reviewId, response)
      toast.success('Đã phản hồi đánh giá')

      // Update local state
      setReviews(prev => prev.map(review =>
        review.id === reviewId ? { ...review, response } : review
      ))
    } catch {
      toast.error('Không thể phản hồi đánh giá')
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete review
  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      setLoading(true)
      await apiClient.deleteReview(reviewId)
      toast.success('Đã xóa đánh giá')

      // Remove from local state
      setReviews(prev => prev.filter(review => review.id !== reviewId))

      // Refresh stats
      const statsResponse = await apiClient.getReviewStats()
      if (statsResponse.data) {
        setStats(statsResponse.data as unknown as ReviewStats)
      }
    } catch {
      toast.error('Không thể xóa đánh giá')
    } finally {
      setLoading(false)
    }
  }, [])

  // Mark review as helpful
  const markHelpful = useCallback(async (reviewId: string) => {
    try {
      // Note: This endpoint might need to be added to API client if needed
      // await apiClient.post(`/reviews/${reviewId}/helpful`)

      // Update local state
      setReviews(prev => prev.map(review =>
        review.id === reviewId
          ? { ...review, helpfulCount: review.helpfulCount + 1 }
          : review
      ))
    } catch {
      // Silent error
    }
  }, [])

  // Report review
  const reportReview = useCallback(async (reviewId: string, reason: string) => {
    try {
      // Note: This endpoint might need to be added to API client if needed
      // await apiClient.post(`/reviews/${reviewId}/report`, { reason })
      toast.success('Đã báo cáo đánh giá')

      // Update local state
      setReviews(prev => prev.map(review =>
        review.id === reviewId
          ? { ...review, reportCount: review.reportCount + 1 }
          : review
      ))
    } catch {
      toast.error('Không thể báo cáo đánh giá')
    }
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
