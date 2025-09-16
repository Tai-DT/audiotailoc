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
      
      // Mock data for now - replace with actual API call
      const mockReviews: Review[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Nguyễn Văn A',
          productId: 'prod1',
          productName: 'Loa JBL EON615',
          rating: 5,
          comment: 'Sản phẩm rất tốt, âm thanh chất lượng cao. Giao hàng nhanh chóng.',
          images: ['https://picsum.photos/100/100?random=1'],
          status: 'pending',
          helpfulCount: 12,
          reportCount: 0,
          createdAt: '2025-09-08T10:00:00Z',
          updatedAt: '2025-09-08T10:00:00Z'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Trần Thị B',
          serviceId: 'serv1',
          serviceName: 'Lắp đặt hệ thống âm thanh',
          rating: 4,
          comment: 'Dịch vụ tốt, nhân viên nhiệt tình. Cần cải thiện thời gian làm việc.',
          status: 'approved',
          response: 'Cảm ơn bạn đã sử dụng dịch vụ. Chúng tôi sẽ cải thiện thời gian phục vụ.',
          helpfulCount: 8,
          reportCount: 0,
          createdAt: '2025-09-07T14:30:00Z',
          updatedAt: '2025-09-07T15:00:00Z'
        }
      ]

      // Mock stats
      const mockStats: ReviewStats = {
        totalReviews: 156,
        averageRating: 4.3,
        pendingReviews: 12,
        approvedReviews: 138,
        rejectedReviews: 6,
        responseRate: 75,
        ratingDistribution: {
          1: 3,
          2: 8,
          3: 25,
          4: 52,
          5: 68
        }
      }

      // Filter by status
      let filtered = mockReviews
      if (status !== 'all') {
        filtered = mockReviews.filter(r => r.status === status)
      }

      setReviews(filtered)
      setStats(mockStats)
    } catch (err) {
      const errorMessage = 'Không thể tải danh sách đánh giá'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Approve review
  const approveReview = useCallback(async (reviewId: string) => {
    try {
      setLoading(true)
      await apiClient.post(`/reviews/${reviewId}/approve`)
      toast.success('Đã duyệt đánh giá')
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, status: 'approved' as const } : review
      ))
    } catch (err) {
      toast.error('Không thể duyệt đánh giá')
      console.error('Error approving review:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Reject review
  const rejectReview = useCallback(async (reviewId: string, reason?: string) => {
    try {
      setLoading(true)
      await apiClient.post(`/reviews/${reviewId}/reject`, { reason })
      toast.success('Đã từ chối đánh giá')
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, status: 'rejected' as const } : review
      ))
    } catch (err) {
      toast.error('Không thể từ chối đánh giá')
      console.error('Error rejecting review:', err)
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
      console.error('Error responding to review:', err)
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
      console.error('Error deleting review:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Mark review as helpful
  const markHelpful = useCallback(async (reviewId: string) => {
    try {
      await apiClient.post(`/reviews/${reviewId}/helpful`)
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount + 1 } 
          : review
      ))
    } catch (err) {
      console.error('Error marking review as helpful:', err)
    }
  }, [])

  // Report review
  const reportReview = useCallback(async (reviewId: string, reason: string) => {
    try {
      await apiClient.post(`/reviews/${reviewId}/report`, { reason })
      toast.success('Đã báo cáo đánh giá')
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, reportCount: review.reportCount + 1 } 
          : review
      ))
    } catch (err) {
      toast.error('Không thể báo cáo đánh giá')
      console.error('Error reporting review:', err)
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
