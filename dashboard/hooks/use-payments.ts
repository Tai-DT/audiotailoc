"use client"

import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

export interface Payment {
  id: string
  orderId: string
  orderNo: string
  amountCents: number
  provider: 'VNPAY' | 'MOMO' | 'PAYOS'
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
  paidAt?: string
  refundedAt?: string
  refundAmountCents?: number
  refundReason?: string
}

export interface PaymentStats {
  totalPayments: number
  totalRevenue: number
  pendingPayments: number
  failedPayments: number
  refundedAmount: number
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all payments
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/payments')
      setPayments((response.data as Payment[]) || [])
    } catch (err) {
      const errorMessage = 'Không thể tải danh sách thanh toán'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error fetching payments:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch payment statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.get('/payments/stats')
      setStats(response.data as PaymentStats)
    } catch (err) {
      console.error('Error fetching payment stats:', err)
    }
  }, [])

  // Create payment intent
  const createPaymentIntent = useCallback(async (data: {
    orderId: string
    provider: 'VNPAY' | 'MOMO' | 'PAYOS'
    returnUrl?: string
  }) => {
    try {
      const response = await apiClient.post('/payments/intents', data)
      toast.success('Tạo intent thanh toán thành công')
      return response.data
    } catch (err) {
      toast.error('Không thể tạo intent thanh toán')
      console.error('Error creating payment intent:', err)
      throw err
    }
  }, [])

  // Process refund
  const processRefund = useCallback(async (data: {
    paymentId: string
    amountCents?: number
    reason?: string
  }) => {
    try {
      setLoading(true)
      await apiClient.post('/payments/refunds', data)
      toast.success('Hoàn tiền thành công')
      // Refresh data after refund
      await fetchPayments()
      await fetchStats()
    } catch (err) {
      toast.error('Không thể xử lý hoàn tiền')
      console.error('Error processing refund:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchPayments, fetchStats])

  // Get payment methods
  const getPaymentMethods = useCallback(async () => {
    try {
      const response = await apiClient.get('/payments/methods')
      return response.data
    } catch (err) {
      console.error('Error fetching payment methods:', err)
      return { methods: [] }
    }
  }, [])

  // Get payment status
  const getPaymentStatus = useCallback(async () => {
    try {
      const response = await apiClient.get('/payments/status')
      return response.data
    } catch (err) {
      console.error('Error fetching payment status:', err)
      return { status: 'unknown' }
    }
  }, [])

  return {
    // State
    payments,
    stats,
    loading,
    error,

    // Actions
    fetchPayments,
    fetchStats,
    createPaymentIntent,
    processRefund,
    getPaymentMethods,
    getPaymentStatus,

    // Utilities
    refresh: fetchPayments
  }
}
