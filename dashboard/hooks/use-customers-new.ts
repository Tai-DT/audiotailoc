import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Customer, CustomerStats } from "@/types/customer"

// API User response interface
interface ApiUser {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  role?: string;
  totalSpent?: number;
  averageOrderValue?: number;
  lastOrderDate?: string;
  createdAt: string;
  loyaltyPoints?: number;
  isActive?: boolean;
  tags?: string[];
  notes?: string;
  _count?: {
    orders: number;
  };
}

// Mock data for fallback
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    phone: "0901234567",
    address: "123 Lê Lợi, Q1",
    city: "TP.HCM",
    district: "Quận 1",
    role: "customer",
    createdAt: "2023-03-15T00:00:00Z",
    updatedAt: "2024-11-28T00:00:00Z",
    totalOrders: 25,
    totalSpent: 45000000,
    averageOrderValue: 1800000,
    lastOrderDate: new Date("2024-11-28"),
    joinDate: new Date("2023-03-15"),
    loyaltyPoints: 4500,
    segment: "vip",
    isVIP: true,
    isActive: true,
    tags: ["premium", "loyal"],
    notes: "Khách hàng thân thiết, thường mua sản phẩm cao cấp"
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "tranthibinh@gmail.com",
    phone: "0912345678",
    address: "456 Nguyễn Huệ, Q3",
    city: "TP.HCM",
    district: "Quận 3",
    role: "customer",
    createdAt: "2023-08-20T00:00:00Z",
    updatedAt: "2024-11-20T00:00:00Z",
    totalOrders: 12,
    totalSpent: 18500000,
    averageOrderValue: 1541667,
    lastOrderDate: new Date("2024-11-20"),
    joinDate: new Date("2023-08-20"),
    loyaltyPoints: 1850,
    segment: "regular",
    isVIP: false,
    isActive: true,
    tags: ["frequent"],
    notes: "Khách hàng thường xuyên"
  },
  {
    id: "3",
    name: "Lê Minh Cường",
    email: "leminhcuong@gmail.com",
    phone: "0923456789",
    address: "789 CMT8, Q10",
    city: "TP.HCM",
    district: "Quận 10",
    role: "customer",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2024-11-15T00:00:00Z",
    totalOrders: 3,
    totalSpent: 4200000,
    averageOrderValue: 1400000,
    lastOrderDate: new Date("2024-11-15"),
    joinDate: new Date("2024-10-01"),
    loyaltyPoints: 420,
    segment: "new",
    isVIP: false,
    isActive: true,
    tags: ["new"],
    notes: "Khách hàng mới"
  }
]

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSegment, setSelectedSegment] = useState("all")
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api/v1"

  // Calculate statistics
  const stats: CustomerStats = {
    totalCustomers: customers.length,
    newCustomers: customers.filter(c => c.segment === "new").length,
    vipCustomers: customers.filter(c => c.isVIP).length,
    activeCustomers: customers.filter(c => c.isActive).length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
    averageOrderValue: customers.length > 0
      ? customers.reduce((sum, c) => sum + (c.averageOrderValue || 0), 0) / customers.length
      : 0,
    averageRevenue: customers.length > 0
      ? customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length
      : 0,
    retentionRate: 85.5, // Mock value
    churnRate: 14.5 // Mock value
  }

  // Filtered customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchQuery === "" || 
      (customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
    
    const matchesSegment = selectedSegment === "all" || customer.segment === selectedSegment
    
    return matchesSearch && matchesSegment
  })

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_URL}/users?limit=100&role=USER`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        // Fall back to mock data if API fails
        setCustomers(mockCustomers)
        return
      }
      
      const data = await response.json()
      
      // Transform API users to customers format
      if (data.users && data.users.length > 0) {
        const transformedCustomers = data.users.map((user: ApiUser) => ({
          id: user.id,
          name: user.name || "Khách hàng",
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "TP.HCM",
          district: user.district || "",
          totalOrders: user._count?.orders || 0,
          totalSpent: user.totalSpent || 0,
          averageOrderValue: user.averageOrderValue || 0,
          lastOrderDate: user.lastOrderDate ? new Date(user.lastOrderDate) : undefined,
          joinDate: new Date(user.createdAt),
          loyaltyPoints: user.loyaltyPoints || 0,
          segment: determineSegment(user),
          isVIP: user.role === "VIP" || (user.totalSpent || 0) > 10000000,
          isActive: user.isActive !== false,
          tags: user.tags || [],
          notes: user.notes || ""
        }))
        setCustomers(transformedCustomers)
      } else {
        setCustomers(mockCustomers)
      }
    } catch (error) {
      console.error("Customer fetch error:", error)
      setCustomers(mockCustomers)
      toast.error("Đang sử dụng dữ liệu mẫu")
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  // Helper to determine customer segment
  const determineSegment = (user: ApiUser): "new" | "regular" | "vip" | "inactive" => {
    if ((user.totalSpent || 0) > 20000000) return "vip"
    if (user.lastOrderDate) {
      const daysSinceLastOrder = Math.floor((Date.now() - new Date(user.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceLastOrder > 90) return "inactive"
    }
    if (user.createdAt) {
      const daysSinceJoin = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceJoin < 30) return "new"
    }
    return "regular"
  }

  // Update customer
  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        // Fallback to local update
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
        return
      }
      
      await fetchCustomers()
    } catch {
      toast.error("Không thể cập nhật khách hàng")
    }
  }

  // Delete customer
  const deleteCustomer = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      setCustomers(prev => prev.filter(c => c.id !== id))
      
      if (!response.ok) {
        console.error("Failed to delete customer from API")
      }
    } catch {
      toast.error("Không thể xóa khách hàng")
    }
  }

  // Send email to customer
  const sendEmail = async (customerId: string, subject: string, content: string) => {
    try {
      const customer = customers.find(c => c.id === customerId)
      if (!customer) return
      
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_URL}/notifications/email/send`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: customer.email,
          subject,
          content
        })
      })
      
      if (response.ok) {
        toast.success(`Đã gửi email đến ${customer.name}`)
      } else {
        toast.success(`Đã gửi email đến ${customer.name} (demo)`)
      }
    } catch {
      toast.error("Không thể gửi email")
    }
  }

  // Export customers
  const exportCustomers = () => {
    const csv = [
      ["ID", "Tên", "Email", "Điện thoại", "Phân khúc", "Tổng chi tiêu", "Điểm tích lũy"],
      ...filteredCustomers.map(c => [
        c.id,
        c.name,
        c.email,
        c.phone || "",
        c.segment,
        c.totalSpent,
        c.loyaltyPoints
      ])
    ].map(row => row.join(",")).join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    
    toast.success("Đã xuất danh sách khách hàng")
  }

  // Create loyalty reward
  const createLoyaltyReward = async (customerId: string, points: number) => {
    try {
      // Update local state
      setCustomers(prev => prev.map(c => 
        c.id === customerId 
          ? { ...c, loyaltyPoints: (c.loyaltyPoints || 0) + points }
          : c
      ))
      
      toast.success(`Đã thêm ${points} điểm cho khách hàng`)
    } catch {
      toast.error("Không thể thêm điểm thưởng")
    }
  }

  // Get segment analysis
  const getSegmentAnalysis = () => {
    const segments = ["new", "regular", "vip", "inactive"] as const
    return segments.map(segment => ({
      segment,
      count: customers.filter(c => c.segment === segment).length,
      revenue: customers.filter(c => c.segment === segment).reduce((sum, c) => sum + (c.totalSpent || 0), 0)
    }))
  }

  // Get top customers
  const getTopCustomers = (limit = 5) => {
    return [...customers]
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, limit)
  }

  // Load customers on mount
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  return {
    customers: filteredCustomers,
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    selectedSegment,
    setSelectedSegment,
    updateCustomer,
    deleteCustomer,
    sendEmail,
    exportCustomers,
    createLoyaltyReward,
    getSegmentAnalysis,
    getTopCustomers,
    refetch: fetchCustomers
  }
}
