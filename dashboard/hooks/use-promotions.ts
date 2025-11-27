import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

interface Promotion {
  id: string
  code: string
  name: string
  description?: string
  type: "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y"
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  isActive: boolean
  startDate: Date
  endDate: Date
  categories?: string[]
  products?: string[]
  customerSegments?: string[]
  createdAt: Date
  createdBy: string
}

interface PromotionStats {
  totalPromotions: number
  activePromotions: number
  expiredPromotions: number
  totalSavings: number
  totalUsage: number
  conversionRate: number
}

interface PromotionApi {
  id: string
  code: string
  name: string
  description?: string
  type: string
  value: number
  minOrderAmount?: number
  min_order_amount?: number
  maxDiscount?: number
  max_discount?: number
  usageLimit?: number
  usageCount?: number
  isActive: boolean
  startDate?: string
  starts_at?: string
  endDate?: string
  expiresAt?: string
  createdAt?: string
  categories?: string[]
  products?: string[]
  customerSegments?: string[]
  created_by?: string
  createdBy?: string
}

interface PromotionsApiData {
  promotions?: PromotionApi[]
}

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<PromotionStats>({
    totalPromotions: 0,
    activePromotions: 0,
    expiredPromotions: 0,
    totalSavings: 0,
    totalUsage: 0,
    conversionRate: 0
  })

  // Fetch promotions data from real API
  const fetchPromotions = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch promotions
      const response = await apiClient.getPromotions()

      if (response.success && response.data) {
        const apiData = response.data as PromotionsApiData
        const promotionsData = apiData.promotions || []

        // Transform data to match interface
        const transformedPromotions: Promotion[] = promotionsData.map((promo) => ({
          id: promo.id,
          code: promo.code,
          name: promo.name,
          description: promo.description,
          type: promo.type.toLowerCase().replace('_', '_') as Promotion['type'],
          value: promo.value,
          minOrderAmount: promo.minOrderAmount ?? promo.min_order_amount,
          maxDiscount: promo.maxDiscount ?? promo.max_discount,
          usageLimit: promo.usageLimit,
          usageCount: promo.usageCount ?? 0,
          isActive: promo.isActive,
          startDate: new Date(promo.startDate || promo.starts_at || promo.createdAt || new Date().toISOString()),
          endDate: new Date(promo.endDate || promo.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
          categories: promo.categories || [],
          products: promo.products || [],
          customerSegments: promo.customerSegments || [],
          createdAt: new Date(promo.createdAt || new Date().toISOString()),
          createdBy: promo.created_by || promo.createdBy || 'Admin'
        }))

        setPromotions(transformedPromotions)
      }

      // Fetch stats
      const statsResponse = await apiClient.getPromotionStats()
      if (statsResponse.success && statsResponse.data) {
        const statsData = statsResponse.data as PromotionStats
        setStats(statsData)
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Không thể tải dữ liệu khuyến mãi"
      console.error('Error fetching promotions:', error)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create promotion
  const createPromotion = useCallback(async (promotionData: Partial<Promotion>) => {
    try {
      const createData = {
        code: promotionData.code || "",
        name: promotionData.name || "",
        description: promotionData.description,
        type: (promotionData.type || "percentage").toUpperCase().replace('_', '_') as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y',
        value: promotionData.value || 0,
        minOrderAmount: promotionData.minOrderAmount,
        maxDiscount: promotionData.maxDiscount,
        usageLimit: promotionData.usageLimit,
        isActive: promotionData.isActive ?? true,
        startsAt: promotionData.startDate,
        expiresAt: promotionData.endDate,
        categories: promotionData.categories,
        products: promotionData.products,
        customerSegments: promotionData.customerSegments,
      }

      const response = await apiClient.createPromotion(createData)

      if (response.success) {
        await fetchPromotions() // Refresh list
        toast.success(response.message || "Đã tạo chương trình khuyến mãi")
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Không thể tạo chương trình khuyến mãi"
      console.error('Error creating promotion:', error)
      toast.error(message)
      throw error
    }
  }, [fetchPromotions])

  // Update promotion
  const updatePromotion = useCallback(async (id: string, promotionData: Partial<Promotion>) => {
    try {
      const updateData: Record<string, unknown> = {}

      if (promotionData.code) updateData.code = promotionData.code
      if (promotionData.name) updateData.name = promotionData.name
      if (promotionData.description !== undefined) updateData.description = promotionData.description
      if (promotionData.type) updateData.type = promotionData.type.toUpperCase().replace('_', '_')
      if (promotionData.value !== undefined) updateData.value = promotionData.value
      if (promotionData.minOrderAmount !== undefined) updateData.minOrderAmount = promotionData.minOrderAmount
      if (promotionData.maxDiscount !== undefined) updateData.maxDiscount = promotionData.maxDiscount
      if (promotionData.usageLimit !== undefined) updateData.usageLimit = promotionData.usageLimit
      if (promotionData.isActive !== undefined) updateData.isActive = promotionData.isActive
      if (promotionData.startDate) updateData.startsAt = promotionData.startDate
      if (promotionData.endDate) updateData.expiresAt = promotionData.endDate
      if (promotionData.categories) updateData.categories = promotionData.categories
      if (promotionData.products) updateData.products = promotionData.products
      if (promotionData.customerSegments) updateData.customerSegments = promotionData.customerSegments

      const response = await apiClient.updatePromotion(id, updateData)

      if (response.success) {
        await fetchPromotions() // Refresh list
        toast.success(response.message || "Đã cập nhật chương trình khuyến mãi")
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Không thể cập nhật chương trình khuyến mãi"
      console.error('Error updating promotion:', error)
      toast.error(message)
      throw error
    }
  }, [fetchPromotions])

  // Delete promotion
  const deletePromotion = useCallback(async (id: string) => {
    try {
      const response = await apiClient.deletePromotion(id)

      if (response.success) {
        await fetchPromotions() // Refresh list
        toast.success(response.message || "Đã xóa chương trình khuyến mãi")
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Không thể xóa chương trình khuyến mãi"
      console.error('Error deleting promotion:', error)
      toast.error(message)
      throw error
    }
  }, [fetchPromotions])

  // Duplicate promotion
  const duplicatePromotion = useCallback(async (id: string) => {
    try {
      const response = await apiClient.duplicatePromotion(id)

      if (response.success) {
        await fetchPromotions() // Refresh list
        toast.success(response.message || "Đã sao chép chương trình khuyến mãi")
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Không thể sao chép chương trình khuyến mãi"
      console.error('Error duplicating promotion:', error)
      toast.error(message)
      throw error
    }
  }, [fetchPromotions])

  // Toggle promotion status
  const togglePromotion = useCallback(async (id: string) => {
    try {
      const response = await apiClient.togglePromotionStatus(id)

      if (response.success) {
        await fetchPromotions() // Refresh list
        toast.success(response.message || "Đã cập nhật trạng thái khuyến mãi")
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Không thể cập nhật trạng thái khuyến mãi"
      console.error('Error toggling promotion:', error)
      toast.error(message)
      throw error
    }
  }, [fetchPromotions])

  // Get promotion by code
  const getPromotionByCode = useCallback(async (code: string) => {
    try {
      const response = await apiClient.getPromotionByCode(code)

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (error) {
      console.error('Error getting promotion by code:', error)
      return null
    }
  }, [])

  // Validate promotion
  const validatePromotion = useCallback(async (code: string, orderAmount: number = 0) => {
    try {
      const result = await apiClient.validatePromotionCode(code, orderAmount)
      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Mã khuyến mãi không hợp lệ"
      console.error('Error validating promotion:', error)
      return { valid: false, error: message }
    }
  }, [])

  // Calculate discount
  const calculateDiscount = useCallback((promotion: Promotion, orderAmount: number) => {
    let discount = 0

    switch (promotion.type) {
      case "percentage":
        discount = orderAmount * (promotion.value / 100)
        if (promotion.maxDiscount) {
          discount = Math.min(discount, promotion.maxDiscount)
        }
        break
      case "fixed_amount":
        discount = promotion.value
        break
      case "free_shipping":
        // This would be handled separately in shipping calculation
        discount = 0
        break
      case "buy_x_get_y":
        // This would be handled in cart logic
        discount = 0
        break
    }

    return Math.min(discount, orderAmount)
  }, [])

  // Initial load
  useEffect(() => {
    fetchPromotions()
  }, [fetchPromotions])

  return {
    promotions,
    stats,
    loading,
    createPromotion,
    updatePromotion,
    deletePromotion,
    duplicatePromotion,
    togglePromotion,
    getPromotionByCode,
    validatePromotion,
    calculateDiscount,
    refreshPromotions: fetchPromotions
  }
}
