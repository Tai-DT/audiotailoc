import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

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

  // Fetch promotions data
  const fetchPromotions = useCallback(async () => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockPromotions: Promotion[] = [
        {
          id: "promo-1",
          code: "FLASH50",
          name: "Flash Sale 50%",
          description: "Giảm 50% cho toàn bộ sản phẩm trong 24 giờ",
          type: "percentage",
          value: 50,
          minOrderAmount: 500000,
          maxDiscount: 2000000,
          usageLimit: 100,
          usageCount: 87,
          isActive: true,
          startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          createdBy: "Admin"
        },
        {
          id: "promo-2", 
          code: "FREESHIP",
          name: "Miễn phí vận chuyển",
          description: "Free ship cho đơn hàng trên 300,000đ",
          type: "free_shipping",
          value: 0,
          minOrderAmount: 300000,
          usageCount: 234,
          isActive: true,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          createdBy: "Manager"
        },
        {
          id: "promo-3",
          code: "NEWBIE20",
          name: "Khách hàng mới giảm 20%",
          description: "Dành cho khách hàng đăng ký lần đầu",
          type: "percentage",
          value: 20,
          maxDiscount: 500000,
          usageLimit: 500,
          usageCount: 156,
          isActive: true,
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          customerSegments: ["new_customer"],
          createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
          createdBy: "Admin"
        },
        {
          id: "promo-4",
          code: "COMBO25",
          name: "Combo Deal 25%",
          description: "Mua combo tai nghe + loa giảm 25%",
          type: "percentage",
          value: 25,
          minOrderAmount: 1000000,
          usageCount: 45,
          isActive: true,
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          categories: ["headphones", "speakers"],
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          createdBy: "Manager"
        },
        {
          id: "promo-5",
          code: "FIXED100K",
          name: "Giảm 100,000đ",
          description: "Giảm cố định 100,000đ cho đơn hàng trên 2 triệu",
          type: "fixed_amount",
          value: 100000,
          minOrderAmount: 2000000,
          usageLimit: 50,
          usageCount: 23,
          isActive: true,
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          createdBy: "Admin"
        },
        {
          id: "promo-6",
          code: "BUY2GET1",
          name: "Mua 2 tặng 1",
          description: "Mua 2 phụ kiện tặng 1 phụ kiện cùng loại",
          type: "buy_x_get_y",
          value: 2,
          usageCount: 78,
          isActive: false,
          startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          categories: ["accessories"],
          createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
          createdBy: "Manager"
        },
        {
          id: "promo-7",
          code: "SUMMER30",
          name: "Summer Sale 30%",
          description: "Khuyến mãi hè giảm 30% tất cả sản phẩm",
          type: "percentage",
          value: 30,
          maxDiscount: 1500000,
          usageLimit: 200,
          usageCount: 189,
          isActive: false,
          startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
          createdBy: "Admin"
        },
        {
          id: "promo-8",
          code: "BIRTHDAY40",
          name: "Sinh nhật giảm 40%",
          description: "Ưu đãi đặc biệt trong tháng sinh nhật",
          type: "percentage",
          value: 40,
          maxDiscount: 1000000,
          usageCount: 67,
          isActive: true,
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          customerSegments: ["birthday_month"],
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          createdBy: "Manager"
        }
      ]
      
      setPromotions(mockPromotions)
      
      // Calculate stats
      const now = new Date()
      const activePromotions = mockPromotions.filter(p => 
        p.isActive && p.startDate <= now && p.endDate >= now
      ).length
      
      const expiredPromotions = mockPromotions.filter(p => 
        p.endDate < now
      ).length
      
      const totalUsage = mockPromotions.reduce((sum, p) => sum + p.usageCount, 0)
      const totalSavings = mockPromotions.reduce((sum, p) => {
        if (p.type === "percentage") {
          // Estimate savings based on usage and average order value
          return sum + (p.usageCount * 1500000 * p.value / 100)
        } else if (p.type === "fixed_amount") {
          return sum + (p.usageCount * p.value)
        }
        return sum
      }, 0)
      
      const newStats: PromotionStats = {
        totalPromotions: mockPromotions.length,
        activePromotions,
        expiredPromotions,
        totalSavings,
        totalUsage,
        conversionRate: Math.round((totalUsage / (mockPromotions.length * 100)) * 100) // Mock conversion rate
      }
      
      setStats(newStats)
      
    } catch (error) {
      toast.error("Không thể tải dữ liệu khuyến mãi")
    } finally {
      setLoading(false)
    }
  }, [])

  // Create promotion
  const createPromotion = useCallback(async (promotionData: Partial<Promotion>) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newPromotion: Promotion = {
        id: `promo-${Date.now()}`,
        code: promotionData.code || "",
        name: promotionData.name || "",
        description: promotionData.description,
        type: promotionData.type || "percentage",
        value: promotionData.value || 0,
        minOrderAmount: promotionData.minOrderAmount,
        maxDiscount: promotionData.maxDiscount,
        usageLimit: promotionData.usageLimit,
        usageCount: 0,
        isActive: promotionData.isActive ?? true,
        startDate: promotionData.startDate || new Date(),
        endDate: promotionData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        categories: promotionData.categories,
        products: promotionData.products,
        customerSegments: promotionData.customerSegments,
        createdAt: new Date(),
        createdBy: "Admin"
      }
      
      setPromotions(prev => [newPromotion, ...prev])
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPromotions: prev.totalPromotions + 1,
        activePromotions: newPromotion.isActive ? prev.activePromotions + 1 : prev.activePromotions
      }))
      
    } catch (error) {
      throw new Error("Failed to create promotion")
    }
  }, [])

  // Update promotion
  const updatePromotion = useCallback(async (id: string, promotionData: Partial<Promotion>) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPromotions(prev => prev.map(promo => 
        promo.id === id ? { ...promo, ...promotionData } : promo
      ))
      
    } catch (error) {
      throw new Error("Failed to update promotion")
    }
  }, [])

  // Delete promotion
  const deletePromotion = useCallback(async (id: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPromotions(prev => {
        const updated = prev.filter(promo => promo.id !== id)
        
        // Update stats
        const now = new Date()
        const activeCount = updated.filter(p => 
          p.isActive && p.startDate <= now && p.endDate >= now
        ).length
        
        setStats(prevStats => ({
          ...prevStats,
          totalPromotions: updated.length,
          activePromotions: activeCount
        }))
        
        return updated
      })
      
    } catch (error) {
      throw new Error("Failed to delete promotion")
    }
  }, [])

  // Duplicate promotion
  const duplicatePromotion = useCallback(async (id: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const original = promotions.find(p => p.id === id)
      if (!original) throw new Error("Promotion not found")
      
      const duplicated: Promotion = {
        ...original,
        id: `promo-${Date.now()}`,
        code: `${original.code}_COPY`,
        name: `${original.name} (Copy)`,
        usageCount: 0,
        createdAt: new Date(),
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
      
      setPromotions(prev => [duplicated, ...prev])
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPromotions: prev.totalPromotions + 1,
        activePromotions: duplicated.isActive ? prev.activePromotions + 1 : prev.activePromotions
      }))
      
    } catch (error) {
      throw new Error("Failed to duplicate promotion")
    }
  }, [promotions])

  // Toggle promotion status
  const togglePromotion = useCallback(async (id: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setPromotions(prev => prev.map(promo => {
        if (promo.id === id) {
          const updated = { ...promo, isActive: !promo.isActive }
          
          // Update stats
          setStats(prevStats => ({
            ...prevStats,
            activePromotions: updated.isActive 
              ? prevStats.activePromotions + 1 
              : prevStats.activePromotions - 1
          }))
          
          return updated
        }
        return promo
      }))
      
    } catch (error) {
      throw new Error("Failed to toggle promotion")
    }
  }, [])

  // Get promotion by code
  const getPromotionByCode = useCallback((code: string) => {
    return promotions.find(p => p.code === code && p.isActive)
  }, [promotions])

  // Validate promotion
  const validatePromotion = useCallback((code: string, orderAmount: number = 0) => {
    const promotion = getPromotionByCode(code)
    
    if (!promotion) {
      return { valid: false, error: "Mã khuyến mãi không tồn tại hoặc đã hết hạn" }
    }
    
    const now = new Date()
    if (promotion.startDate > now) {
      return { valid: false, error: "Mã khuyến mãi chưa có hiệu lực" }
    }
    
    if (promotion.endDate < now) {
      return { valid: false, error: "Mã khuyến mãi đã hết hạn" }
    }
    
    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return { valid: false, error: "Mã khuyến mãi đã được sử dụng hết" }
    }
    
    if (promotion.minOrderAmount && orderAmount < promotion.minOrderAmount) {
      return { 
        valid: false, 
        error: `Đơn hàng tối thiểu ${promotion.minOrderAmount.toLocaleString('vi-VN')}đ để sử dụng mã này` 
      }
    }
    
    return { valid: true, promotion }
  }, [getPromotionByCode])

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
