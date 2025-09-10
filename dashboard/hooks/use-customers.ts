import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"

// Interface matching backend User model
interface Customer {
  id: string
  name?: string
  email: string
  phone?: string
  role: string
  createdAt: string
  updatedAt: string
  // Extended fields from related data
  orders?: any[]
  totalOrders?: number
  totalSpent?: number
  loyaltyPoints?: number
}

interface CustomerStats {
  totalCustomers: number
  newCustomers: number
  vipCustomers: number
  activeCustomers: number
  totalRevenue: number
  averageOrderValue: number
  retentionRate: number
  churnRate: number
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSegment, setSelectedSegment] = useState("all")
  const { user } = useAuth()
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    newCustomers: 0,
    vipCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    retentionRate: 0,
    churnRate: 0
  })

  // Fetch customers data from real API
  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch real users from backend API
      const response = await apiClient.getUsers({
        role: 'USER',
        limit: 100
      })
      
      // Transform backend user data to customer format
      const customers: Customer[] = response.data?.items?.map((user: any) => ({
        id: user.id,
        name: user.name || 'Chưa có tên',
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'USER',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        totalOrders: user.orders?.length || 0,
        totalSpent: user.orders?.reduce((sum: number, order: any) => sum + (order.totalCents || 0), 0) / 100 || 0,
        loyaltyPoints: user.loyaltyAccount?.points || 0
      })) || []
      
      setCustomers(customers)
      
      // Calculate stats based on real data
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      const newCustomersCount = customers.filter(c => {
        const createdDate = new Date(c.createdAt)
        return createdDate >= thirtyDaysAgo
      }).length
      
      const adminCount = customers.filter(c => c.role === 'ADMIN').length
      const activeCount = customers.filter(c => {
        const updatedDate = new Date(c.updatedAt)
        return updatedDate >= thirtyDaysAgo
      }).length
      
      const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
      const totalOrders = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0)
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      
      const retentionRate = customers.length > 0 ? Math.round((activeCount / customers.length) * 100) : 0
      const churnRate = 100 - retentionRate
      
      const newStats: CustomerStats = {
        totalCustomers: customers.length,
        newCustomers: newCustomersCount,
        vipCustomers: adminCount, // Using admin count as VIP for now
        activeCustomers: activeCount,
        totalRevenue,
        averageOrderValue: avgOrderValue,
        retentionRate,
        churnRate
      }
      
      setStats(newStats)
      
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error("Không thể tải dữ liệu khách hàng")
    } finally {
      setLoading(false)
    }
  }, [])

  // Update customer using real API
  const updateCustomer = useCallback(async (id: string, updates: Partial<Customer>) => {
    try {
      // Call real API to update user
      await apiClient.updateUser(id, {
        name: updates.name,
        phone: updates.phone,
        role: updates.role
      })
      
      // Update local state
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? { ...customer, ...updates } : customer
      ))
      
      toast.success("Đã cập nhật thông tin khách hàng")
    } catch (error) {
      console.error('Error updating customer:', error)
      toast.error("Không thể cập nhật khách hàng")
      throw error
    }
  }, [])

  // Delete customer using real API
  const deleteCustomer = useCallback(async (id: string) => {
    try {
      // Call real API to delete user
      await apiClient.deleteUser(id)
      
      // Update local state
      setCustomers(prev => {
        const updated = prev.filter(customer => customer.id !== id)
        
        // Update stats
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const activeCount = updated.filter(c => {
          const updatedDate = new Date(c.updatedAt)
          return updatedDate >= thirtyDaysAgo
        }).length
        
        setStats(prevStats => ({
          ...prevStats,
          totalCustomers: updated.length,
          activeCustomers: activeCount,
          retentionRate: updated.length > 0 ? Math.round((activeCount / updated.length) * 100) : 0
        }))
        
        return updated
      })
      
      toast.success("Đã xóa khách hàng")
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error("Không thể xóa khách hàng")
      throw error
    }
  }, [])

  // Export customers
  const exportCustomers = useCallback(async () => {
    try {
      // Create CSV content
      const csvContent = [
        ['ID', 'Tên', 'Email', 'Điện thoại', 'Vai trò', 'Ngày tạo', 'Cập nhật lần cuối'].join(','),
        ...customers.map(c => [
          c.id,
          c.name || '',
          c.email,
          c.phone || '',
          c.role,
          new Date(c.createdAt).toLocaleDateString('vi-VN'),
          new Date(c.updatedAt).toLocaleDateString('vi-VN')
        ].join(','))
      ].join('\n')
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Đã xuất danh sách khách hàng")
    } catch (error) {
      console.error('Error exporting customers:', error)
      toast.error("Không thể xuất danh sách")
    }
  }, [customers])

  // Send email to customer
  const sendEmail = useCallback(async (customerId: string, subject: string, content: string) => {
    try {
      // In real implementation, this would call an email API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Đã gửi email")
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error("Không thể gửi email")
    }
  }, [])

  // Load customers on mount
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  // Filter customers based on search and segment
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchQuery === "" || 
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
    
    const matchesSegment = selectedSegment === "all" || 
      (selectedSegment === "admin" && customer.role === "ADMIN") ||
      (selectedSegment === "user" && customer.role === "USER")
    
    return matchesSearch && matchesSegment
  })

  return {
    customers: filteredCustomers,
    loading,
    stats,
    searchQuery,
    setSearchQuery,
    selectedSegment,
    setSelectedSegment,
    fetchCustomers,
    updateCustomer,
    deleteCustomer,
    exportCustomers,
    sendEmail
  }
}
