"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { Wrench, Clock, DollarSign, Calendar, TrendingUp } from "lucide-react"
import Image from "next/image"
import { Service, ServiceType } from "@/types/service";

interface ServiceDetailDialogProps {
  serviceId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  types: ServiceType[]
}

export function ServiceDetailDialog({ serviceId, open, onOpenChange, types }: ServiceDetailDialogProps) {
  const { token } = useAuth()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServiceDetail = useCallback(async () => {
    if (!serviceId) return

    try {
      setLoading(true)
      apiClient.setToken(token!)
      const response = await apiClient.getService(serviceId)
      setService(response.data as Service)
    } catch (error) {
      console.error('Failed to fetch service detail:', error)
    } finally {
      setLoading(false)
    }
  }, [serviceId, token])

  useEffect(() => {
    if (serviceId && open && token) {
      fetchServiceDetail()
    }
  }, [serviceId, open, token, fetchServiceDetail])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount / 100)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours} giờ ${mins} phút`
    }
    return `${mins} phút`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!service && !loading) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Chi tiết dịch vụ
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về dịch vụ
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : service ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {service.images?.length || service.imageUrl ? (
                  <Image
                    src={service.images?.[0] || service.imageUrl || ''}
                    alt={service.name}
                    width={120}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-30 h-30 rounded-lg bg-muted flex items-center justify-center">
                    <Wrench className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Loại dịch vụ:</span>
                  <Badge variant="outline">
                    {service.serviceType?.name || types.find(t => t.id === service.typeId)?.name || 'Không xác định'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{formatCurrency(service.basePriceCents)}</div>
                <div className="text-sm text-muted-foreground">Giá dịch vụ</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{formatDuration(service.duration)}</div>
                <div className="text-sm text-muted-foreground">Thời gian</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{service._count?.bookings || 0}</div>
                <div className="text-sm text-muted-foreground">Lượt đặt lịch</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{service.viewCount}</div>
                <div className="text-sm text-muted-foreground">Lượt xem</div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {service.description && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Mô tả</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{service.description}</p>
              </div>
            )}

            {/* Features */}
            {service.features && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Tính năng</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{service.features}</p>
              </div>
            )}

            {/* Requirements */}
            {service.requirements && (
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Lượt xem:</span>
                  <span>{service.viewCount || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Ngày tạo:</span>
                  <span>{new Date(service.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                {service.viewCount > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Lượt xem hôm nay:</span>
                    <span>{service.viewCount}</span>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Ngày tạo:</span>
                <p className="text-muted-foreground">{formatDate(service.createdAt)}</p>
              </div>
              <div>
                <span className="font-medium">Cập nhật:</span>
                <p className="text-muted-foreground">{formatDate(service.updatedAt)}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}