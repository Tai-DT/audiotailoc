import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, ApiResponse, PaginatedResponse } from '@/lib/api-client'
import { toast } from 'react-hot-toast'

// User hooks
export function useUsers(params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => apiClient.getUsers(params),
    staleTime: 30000, // 30 seconds
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => apiClient.getUser(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: any) => apiClient.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create user')
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('User updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user')
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user')
    },
  })
}

// Product hooks
export function useProducts(params?: {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => apiClient.getProducts(params),
    staleTime: 30000,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => apiClient.getProduct(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productData: any) => apiClient.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product')
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
      toast.success('Product updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product')
    },
  })
}

// Order hooks
export function useOrders(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
  paymentStatus?: string
  dateFrom?: string
  dateTo?: string
}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => apiClient.getOrders(params),
    staleTime: 30000,
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => apiClient.getOrder(id),
    enabled: !!id,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order'] })
      toast.success('Order status updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status')
    },
  })
}

// System hooks
export function useSystemHealth() {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: () => apiClient.healthCheck(),
    refetchInterval: 60000, // 1 minute
    staleTime: 30000,
  })
}

export function useSystemMetrics() {
  return useQuery({
    queryKey: ['system-metrics'],
    queryFn: () => apiClient.getSystemMetrics(),
    refetchInterval: 30000, // 30 seconds
    staleTime: 15000,
  })
}

// Backup hooks
export function useBackupInfo() {
  return useQuery({
    queryKey: ['backup-info'],
    queryFn: () => apiClient.getBackupInfo(),
    staleTime: 300000, // 5 minutes
  })
}

export function useBackupHistory() {
  return useQuery({
    queryKey: ['backup-history'],
    queryFn: () => apiClient.getBackupHistory(),
    staleTime: 60000, // 1 minute
  })
}

export function useCreateBackup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (type: 'full' | 'incremental' = 'full') =>
      apiClient.createBackup(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backup-history'] })
      toast.success('Backup created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create backup')
    },
  })
}

export function useRestoreBackup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (backupId: string) => apiClient.restoreBackup(backupId),
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Backup restored successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to restore backup')
    },
  })
}

// Security hooks
export function useSecurityEvents(params?: {
  page?: number
  limit?: number
  severity?: string
  type?: string
  dateFrom?: string
  dateTo?: string
}) {
  return useQuery({
    queryKey: ['security-events', params],
    queryFn: () => apiClient.getSecurityEvents(params),
    staleTime: 30000,
  })
}

export function useSecurityStats() {
  return useQuery({
    queryKey: ['security-stats'],
    queryFn: () => apiClient.getSecurityStats(),
    staleTime: 60000, // 1 minute
  })
}

// Logs hooks
export function useSystemLogs(params?: {
  page?: number
  limit?: number
  level?: string
  service?: string
  dateFrom?: string
  dateTo?: string
}) {
  return useQuery({
    queryKey: ['system-logs', params],
    queryFn: () => apiClient.getSystemLogs(params),
    staleTime: 30000,
  })
}

// Email Management hooks
export function useEmailTemplates(params?: {
  type?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['email-templates', params],
    queryFn: () => apiClient.get(`/email/templates`, params),
    staleTime: 300000, // 5 minutes
  })
}

export function useEmailTemplate(id: string) {
  return useQuery({
    queryKey: ['email-template', id],
    queryFn: () => apiClient.get(`/email/templates/${id}`),
    enabled: !!id,
  })
}

export function useCreateEmailTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/email/templates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] })
      toast.success('Email template created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create email template')
    },
  })
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.put(`/email/templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] })
      queryClient.invalidateQueries({ queryKey: ['email-template'] })
      toast.success('Email template updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update email template')
    },
  })
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/email/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] })
      toast.success('Email template deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete email template')
    },
  })
}

export function useEmailHistory(params?: {
  status?: string;
  type?: string;
  template?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['email-history', params],
    queryFn: () => apiClient.get('/email/history', params),
    staleTime: 30000, // 30 seconds
  })
}

export function useEmailStats(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['email-stats', params],
    queryFn: () => apiClient.get('/email/stats', params),
    staleTime: 60000, // 1 minute
  })
}

export function useSendEmail() {
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/email/send', data),
    onSuccess: () => {
      toast.success('Email sent successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send email')
    },
  })
}

export function useEmailSettings() {
  return useQuery({
    queryKey: ['email-settings'],
    queryFn: () => apiClient.get('/email/settings'),
    staleTime: 300000, // 5 minutes
  })
}

export function useUpdateEmailSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: any) => apiClient.put('/email/settings', settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-settings'] })
      toast.success('Email settings updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update email settings')
    },
  })
}

// API Documentation hooks
export function useApiDocs() {
  return useQuery({
    queryKey: ['api-docs'],
    queryFn: () => apiClient.getApiDocs(),
    staleTime: 300000, // 5 minutes
  })
}

// Utility hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Combine multiple API calls for dashboard overview
      const [users, products, orders] = await Promise.all([
        apiClient.getUsers({ limit: 1 }), // Just get count
        apiClient.getProducts({ limit: 1 }),
        apiClient.getOrders({ limit: 1 }),
      ])

      return {
        totalUsers: users.meta?.total || 0,
        totalProducts: products.meta?.total || 0,
        totalOrders: orders.meta?.total || 0,
      }
    },
    staleTime: 60000, // 1 minute
  })
}
