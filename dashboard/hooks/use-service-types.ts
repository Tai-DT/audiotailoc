import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

export interface ServiceType {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export function useServiceTypes() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServiceTypes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get<ServiceType[]>('/service-types')
      console.log('[useServiceTypes] GET /service-types response:', response)
      setServiceTypes(response.data || [])
    } catch (err) {
      setError('Không thể tải danh sách loại dịch vụ')
      toast.error('Không thể tải danh sách loại dịch vụ')
    } finally {
      setLoading(false)
    }
  }

  const createServiceType = async (data: Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiClient.post<ServiceType>('/service-types', data)
      console.log('[useServiceTypes] POST /service-types response:', response)
      setServiceTypes(prev => [...prev, response.data])
      toast.success('Tạo loại dịch vụ thành công')
      return response.data
    } catch (err) {
      const error = err as { status?: number; response?: unknown }
      const status = error?.status
      const dataResp = error?.response
      // normalize to axios-like error shape
      throw { response: { status, data: dataResp } }
    }
  }

  const updateServiceType = async (id: string, data: Partial<ServiceType>) => {
    try {
      const response = await apiClient.patch<ServiceType>(`/service-types/${id}`, data)
      console.log('[useServiceTypes] PATCH /service-types/:id response:', response)
      setServiceTypes(prev => prev.map(type => type.id === id ? response.data : type))
      toast.success('Cập nhật loại dịch vụ thành công')
      return response.data
    } catch (err) {
      const error = err as { status?: number; response?: unknown }
      const status = error?.status
      const dataResp = error?.response
      throw { response: { status, data: dataResp } }
    }
  }

  const deleteServiceType = async (id: string) => {
    try {
      await apiClient.delete(`/service-types/${id}`)
      setServiceTypes(prev => prev.filter(type => type.id !== id))
      toast.success('Xóa loại dịch vụ thành công')
    } catch (err) {
      const error = err as { status?: number; response?: unknown }
      const status = error?.status
      const dataResp = error?.response
      throw { response: { status, data: dataResp } }
    }
  }

  const toggleServiceTypeStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await apiClient.patch<ServiceType>(`/service-types/${id}`, {
        isActive: !isActive
      })
      console.log('[useServiceTypes] PATCH /service-types/:id response:', response)
      setServiceTypes(prev => prev.map(type => type.id === id ? response.data : type))
      toast.success(`Loại dịch vụ đã ${!isActive ? 'kích hoạt' : 'ngừng hoạt động'}`)
      return response.data
    } catch (err) {
      const error = err as { status?: number; response?: unknown }
      const status = error?.status
      const dataResp = error?.response
      throw { response: { status, data: dataResp } }
    }
  }

  const refresh = () => {
    fetchServiceTypes()
  }

  useEffect(() => {
    fetchServiceTypes()
  }, [])

  return {
    serviceTypes,
    loading,
    error,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    toggleServiceTypeStatus,
    refresh
  }
}