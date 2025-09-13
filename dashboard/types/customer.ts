export interface Customer {
  id: string
  name?: string
  email: string
  phone?: string
  avatar?: string
  address?: string
  city?: string
  district?: string
  role?: string
  createdAt?: string
  updatedAt?: string
  registeredAt?: string
  lastLogin?: string
  // Extended fields from related data
  orders?: Record<string, unknown>[]
  totalOrders?: number
  totalSpent?: number
  averageOrderValue?: number
  loyaltyPoints?: number
  segment?: "new" | "regular" | "vip" | "inactive"
  isVIP?: boolean
  isActive?: boolean
  tags?: string[]
  notes?: string
  joinDate?: Date
  lastOrderDate?: Date
}

export interface CustomerStats {
  totalCustomers: number
  newCustomers: number
  vipCustomers: number
  activeCustomers: number
  totalRevenue: number
  averageOrderValue: number
  averageRevenue?: number
  retentionRate: number
  churnRate: number
}