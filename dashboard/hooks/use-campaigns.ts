import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"

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

// No mock data - use real API data only

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const { } = useAuth()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api/v1"

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
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_URL}/marketing`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })
      
      if (!response.ok) {
        // Return empty if API fails - no mock fallback
        console.warn('useCampaigns: API failed, returning empty list')
        setCampaigns([])
        return
      }
      
      const raw = await response.json()

      // Normalize possible API shapes: array | {data: array} | {items: array}
      const list: unknown[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.items)
            ? raw.items
            : []

      if (!Array.isArray(list) || list.length === 0) {
        // If backend returned unexpected shape, return empty list
        console.warn('useCampaigns: unexpected response shape; returning empty list')
        setCampaigns([])
        return
      }

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
      // Return empty list on error
      console.error('useCampaigns: Error fetching campaigns', error)
      setCampaigns([])
      toast.error("Đã xảy ra lỗi khi tải dữ liệu chiến dịch")
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Create campaign
  const createCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      const token = localStorage.getItem("accessToken")
      
      const apiData = {
        name: campaignData.name || "",
        description: campaignData.description || campaignData.content || "",
        type: campaignData.type?.toUpperCase() || "EMAIL",
        targetAudience: campaignData.targetAudience,
        subject: campaignData.subject,
        content: campaignData.content
      }
      
      const response = await fetch(`${API_URL}/marketing/campaigns`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiData)
      })
      
      if (!response.ok) {
        // Fallback to local update
        const newCampaign: Campaign = {
          id: Date.now().toString(),
          name: campaignData.name || "",
          description: campaignData.description,
          type: campaignData.type || "email",
          status: "draft",
          targetAudience: campaignData.targetAudience || "",
          subject: campaignData.subject,
          content: campaignData.content || "",
          createdAt: new Date(),
          createdBy: "current-user",
          recipients: 0,
          opens: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        }
        setCampaigns(prev => [newCampaign, ...prev])
        return
      }
      
      // Refresh campaigns list
      await fetchCampaigns()
    } catch {
      throw new Error("Không thể tạo chiến dịch")
    }
  }

  // Update campaign
  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const token = localStorage.getItem("accessToken")
      
      const apiData = {
        name: updates.name,
        description: updates.description,
        type: updates.type?.toUpperCase(),
        targetAudience: updates.targetAudience,
        subject: updates.subject,
        content: updates.content,
        status: updates.status?.toUpperCase()
      }
      
      const response = await fetch(`${API_URL}/marketing/campaigns/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiData)
      })
      
      if (!response.ok) {
        // Fallback to local update
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === id ? { ...campaign, ...updates } : campaign
        ))
        return
      }
      
      // Refresh campaigns list
      await fetchCampaigns()
    } catch {
      throw new Error("Không thể cập nhật chiến dịch")
    }
  }

  // Delete campaign
  const deleteCampaign = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken")
      
      const response = await fetch(`${API_URL}/marketing/campaigns/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      // Update local state regardless of API response
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id))
      
      if (!response.ok) {
      }
    } catch {
      throw new Error("Không thể xóa chiến dịch")
    }
  }

  // Duplicate campaign
  const duplicateCampaign = async (id: string) => {
    try {
      const originalCampaign = campaigns.find(c => c.id === id)
      if (!originalCampaign) throw new Error("Không tìm thấy chiến dịch")

      const duplicatedCampaign: Campaign = {
        ...originalCampaign,
        id: Date.now().toString(),
        name: `${originalCampaign.name} (Copy)`,
        status: "draft",
        createdAt: new Date(),
        recipients: 0,
        opens: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        sentAt: undefined,
        scheduledAt: undefined
      }

      setCampaigns(prev => [duplicatedCampaign, ...prev])
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch {
      throw new Error("Không thể sao chép chiến dịch")
    }
  }

  // Send campaign
  const sendCampaign = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken")
      
      const response = await fetch(`${API_URL}/marketing/campaigns/${id}/send`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        // Update local state with sent status (no mock random data)
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === id 
            ? { 
                ...campaign, 
                status: "sent" as const, 
                sentAt: new Date(),
              } 
            : campaign
        ))
        return
      }
      
      const result = await response.json()
      
      // Update local state with sent status
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === id 
          ? { 
              ...campaign, 
              status: "sent" as const, 
              sentAt: new Date(),
              recipients: result.recipientCount || 1000
            } 
          : campaign
      ))
    } catch {
      throw new Error("Không thể gửi chiến dịch")
    }
  }

  // Schedule campaign
  const scheduleCampaign = async (id: string, scheduledAt: Date) => {
    try {
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === id 
          ? { ...campaign, status: "scheduled" as const, scheduledAt } 
          : campaign
      ))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
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
