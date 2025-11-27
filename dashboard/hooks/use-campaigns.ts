import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

interface Campaign {
  id: string
  name: string
  description?: string
  type: "email" | "sms" | "push" | "social"
  status: "draft" | "scheduled" | "sent" | "cancelled"
  targetAudience: string
  subject?: string
  content: string
  sentAt?: Date
  scheduledAt?: Date
  createdAt: Date
  createdBy: string
  recipients: number
  opens: number
  clicks: number
  conversions: number
  revenue: number
}

interface CampaignStats {
  totalCampaigns: number
  activeCampaigns: number
  sentCampaigns: number
  totalRecipients: number
  averageOpenRate: number
  averageClickRate: number
  totalRevenue: number
  conversionRate: number
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate stats
  const stats: CampaignStats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === "sent" || c.status === "scheduled").length,
    sentCampaigns: campaigns.filter(c => c.status === "sent").length,
    totalRecipients: campaigns.reduce((sum, c) => sum + c.recipients, 0),
    averageOpenRate: campaigns.filter(c => c.status === "sent").length > 0
      ? campaigns.filter(c => c.status === "sent").reduce((sum, c) => {
        return sum + (c.recipients > 0 ? (c.opens / c.recipients) * 100 : 0)
      }, 0) / campaigns.filter(c => c.status === "sent").length
      : 0,
    averageClickRate: campaigns.filter(c => c.status === "sent").length > 0
      ? campaigns.filter(c => c.status === "sent").reduce((sum, c) => {
        return sum + (c.recipients > 0 ? (c.clicks / c.recipients) * 100 : 0)
      }, 0) / campaigns.filter(c => c.status === "sent").length
      : 0,
    totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
    conversionRate: campaigns.filter(c => c.status === "sent").length > 0
      ? campaigns.filter(c => c.status === "sent").reduce((sum, c) => {
        return sum + (c.recipients > 0 ? (c.conversions / c.recipients) * 100 : 0)
      }, 0) / campaigns.filter(c => c.status === "sent").length
      : 0
  }

  // Fetch campaigns from API
  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiClient.getCampaigns()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = response.data as any

      // Normalize possible API shapes: array | {data: array} | {items: array}
      const list: unknown[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.items)
            ? raw.items
            : []

      // Transform API data to match frontend interface
      const transformedCampaigns = list.map((campaign: unknown) => {
        const campaignData = campaign as {
          id: string;
          name: string;
          description?: string;
          type?: string;
          status?: string;
          targetAudience?: string;
          subject?: string;
          content?: string;
          sentAt?: string;
          scheduledAt?: string;
          createdAt?: string;
          updatedAt?: string;
          createdBy?: string;
          stats?: {
            sent?: number;
            delivered?: number;
            opened?: number;
            clicked?: number;
            bounced?: number;
          };
        };
        const normalizedType = (campaignData.type ? campaignData.type.toLowerCase() : 'email') as Campaign['type'];
        const normalizedStatus = (campaignData.status ? campaignData.status.toLowerCase() : 'draft') as Campaign['status'];

        return {
          id: campaignData.id,
          name: campaignData.name,
          description: campaignData.description,
          type: normalizedType,
          status: normalizedStatus,
          targetAudience: campaignData.targetAudience || "Tất cả khách hàng",
          subject: campaignData.subject,
          content: campaignData.content || campaignData.description || '',
          sentAt: campaignData.sentAt ? new Date(campaignData.sentAt) : undefined,
          scheduledAt: campaignData.scheduledAt ? new Date(campaignData.scheduledAt) : undefined,
          createdAt: new Date(campaignData.createdAt || new Date()),
          createdBy: campaignData.createdBy || "admin",
          recipients: campaignData.stats?.sent || 0,
          opens: campaignData.stats?.opened || 0,
          clicks: campaignData.stats?.clicked || 0,
          conversions: campaignData.stats?.bounced || 0,
          revenue: 0
        };
      })

      setCampaigns(transformedCampaigns)
    } catch (error) {
      console.error("Failed to fetch campaigns:", error)
      toast.error("Không thể tải danh sách chiến dịch")
    } finally {
      setLoading(false)
    }
  }, [])

  // Create campaign
  const createCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      const apiData = {
        name: campaignData.name || "",
        description: campaignData.description || campaignData.content || "",
        type: campaignData.type?.toUpperCase() || "EMAIL",
        targetAudience: campaignData.targetAudience,
        subject: campaignData.subject,
        content: campaignData.content
      }

      await apiClient.createCampaign(apiData)

      // Refresh campaigns list
      await fetchCampaigns()
      toast.success("Tạo chiến dịch thành công")
    } catch {
      throw new Error("Không thể tạo chiến dịch")
    }
  }

  // Update campaign
  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const apiData = {
        name: updates.name,
        description: updates.description,
        type: updates.type?.toUpperCase(),
        targetAudience: updates.targetAudience,
        subject: updates.subject,
        content: updates.content,
        status: updates.status?.toUpperCase()
      }

      await apiClient.updateCampaign(id, apiData)

      // Refresh campaigns list
      await fetchCampaigns()
      toast.success("Cập nhật chiến dịch thành công")
    } catch {
      throw new Error("Không thể cập nhật chiến dịch")
    }
  }

  // Delete campaign
  const deleteCampaign = async (id: string) => {
    try {
      await apiClient.deleteCampaign(id)

      // Update local state
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id))
      toast.success("Xóa chiến dịch thành công")
    } catch {
      throw new Error("Không thể xóa chiến dịch")
    }
  }

  // Duplicate campaign
  const duplicateCampaign = async (id: string) => {
    try {
      const originalCampaign = campaigns.find(c => c.id === id)
      if (!originalCampaign) throw new Error("Không tìm thấy chiến dịch")

      const apiData = {
        name: `${originalCampaign.name} (Copy)`,
        description: originalCampaign.description,
        type: originalCampaign.type.toUpperCase(),
        targetAudience: originalCampaign.targetAudience,
        subject: originalCampaign.subject,
        content: originalCampaign.content
      }

      await apiClient.createCampaign(apiData)
      await fetchCampaigns()
      toast.success("Sao chép chiến dịch thành công")
    } catch {
      throw new Error("Không thể sao chép chiến dịch")
    }
  }

  // Send campaign
  const sendCampaign = async (id: string) => {
    try {
      await apiClient.sendCampaign(id)

      await fetchCampaigns()
      toast.success("Gửi chiến dịch thành công")
    } catch {
      throw new Error("Không thể gửi chiến dịch")
    }
  }

  // Schedule campaign
  const scheduleCampaign = async (id: string, scheduledAt: Date) => {
    try {
      // Currently backend might not support scheduling directly via a separate endpoint,
      // but we can update the campaign with a scheduled date.
      // Assuming updateCampaign handles this or we need a specific endpoint.
      // For now, let's use updateCampaign.
      await apiClient.updateCampaign(id, {
        scheduledAt: scheduledAt.toISOString(),
        status: 'SCHEDULED'
      } as any)

      await fetchCampaigns()
      toast.success("Lên lịch chiến dịch thành công")
    } catch {
      throw new Error("Không thể lên lịch chiến dịch")
    }
  }

  // Load campaigns on mount
  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  return {
    campaigns,
    stats: {
      ...stats,
      averageOpenRate: Number(stats.averageOpenRate.toFixed(1)),
      averageClickRate: Number(stats.averageClickRate.toFixed(1)),
      conversionRate: Number(stats.conversionRate.toFixed(1))
    },
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    sendCampaign,
    scheduleCampaign,
    refetch: fetchCampaigns
  }
}
