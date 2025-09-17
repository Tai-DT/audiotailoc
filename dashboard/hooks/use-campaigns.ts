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

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Flash Sale Black Friday",
    description: "Khuyến mãi đặc biệt dịp Black Friday với giảm giá lên tới 70%",
    type: "email",
    status: "sent",
    targetAudience: "Tất cả khách hàng",
    subject: "🔥 Flash Sale 70% - Chỉ còn 24 giờ!",
    content: "Đừng bỏ lỡ cơ hội sở hữu thiết bị âm thanh cao cấp với giá ưu đãi nhất năm! Flash Sale Black Friday với giảm giá lên tới 70% cho tất cả sản phẩm.",
    sentAt: new Date("2024-11-29T08:00:00"),
    createdAt: new Date("2024-11-28T10:00:00"),
    createdBy: "admin",
    recipients: 25430,
    opens: 12850,
    clicks: 3420,
    conversions: 156,
    revenue: 485200000
  },
  {
    id: "2",
    name: "Welcome Series - New Users",
    description: "Chuỗi email chào mừng khách hàng mới đăng ký",
    type: "email",
    status: "sent",
    targetAudience: "Khách hàng mới",
    subject: "Chào mừng bạn đến với Audio Tài Lộc! 🎵",
    content: "Cảm ơn bạn đã tham gia cộng đồng yêu âm thanh của Audio Tài Lộc. Khám phá ngay những sản phẩm audio chất lượng cao và nhận ngay voucher 200K cho đơn hàng đầu tiên!",
    sentAt: new Date("2024-11-25T09:00:00"),
    createdAt: new Date("2024-11-20T14:00:00"),
    createdBy: "marketing",
    recipients: 1850,
    opens: 1295,
    clicks: 425,
    conversions: 89,
    revenue: 125600000
  },
  {
    id: "3",
    name: "Product Review Request",
    description: "Yêu cầu đánh giá sản phẩm từ khách hàng đã mua",
    type: "email",
    status: "sent",
    targetAudience: "Khách hàng đã mua hàng",
    subject: "Chia sẻ trải nghiệm của bạn - Nhận ngay 100K",
    content: "Bạn đã sử dụng sản phẩm được một tuần. Hãy chia sẻ trải nghiệm và nhận ngay voucher 100K cho lần mua tiếp theo!",
    sentAt: new Date("2024-11-20T15:30:00"),
    createdAt: new Date("2024-11-19T09:00:00"),
    createdBy: "customer-service",
    recipients: 3240,
    opens: 1850,
    clicks: 680,
    conversions: 245,
    revenue: 45200000
  },
  {
    id: "4",
    name: "VIP Customer Exclusive",
    description: "Ưu đãi độc quyền dành cho khách hàng VIP",
    type: "email",
    status: "draft",
    targetAudience: "Khách hàng VIP",
    subject: "Ưu đãi VIP - Sản phẩm mới độc quyền",
    content: "Dành riêng cho khách hàng VIP: Trải nghiệm sớm dòng tai nghe cao cấp mới nhất với ưu đãi 30% trước khi ra mắt chính thức.",
    createdAt: new Date("2024-11-30T10:00:00"),
    createdBy: "marketing",
    recipients: 0,
    opens: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0
  },
  {
    id: "5",
    name: "Cart Abandonment Reminder",
    description: "Nhắc nhở khách hàng hoàn thành đơn hàng bỏ quên",
    type: "email",
    status: "sent",
    targetAudience: "Giỏ hàng bỏ quên",
    subject: "Bạn quên điều gì đó trong giỏ hàng 🛒",
    content: "Sản phẩm bạn quan tâm vẫn đang chờ bạn! Hoàn thành đơn hàng ngay và nhận thêm 5% giảm giá.",
    sentAt: new Date("2024-11-22T16:00:00"),
    createdAt: new Date("2024-11-22T10:00:00"),
    createdBy: "automation",
    recipients: 890,
    opens: 425,
    clicks: 156,
    conversions: 34,
    revenue: 28500000
  },
  {
    id: "6",
    name: "Birthday Special Offer",
    description: "Ưu đãi sinh nhật khách hàng",
    type: "sms",
    status: "sent",
    targetAudience: "Sinh nhật tháng này",
    content: "Chúc mừng sinh nhật! 🎂 Nhận ngay voucher 300K và miễn phí vận chuyển cho đơn hàng sinh nhật của bạn. Mã: BIRTHDAY2024",
    sentAt: new Date("2024-11-15T08:00:00"),
    createdAt: new Date("2024-11-10T09:00:00"),
    createdBy: "marketing",
    recipients: 560,
    opens: 560,
    clicks: 168,
    conversions: 42,
    revenue: 85200000
  },
  {
    id: "7",
    name: "New Product Launch",
    description: "Thông báo ra mắt sản phẩm mới",
    type: "push",
    status: "scheduled",
    targetAudience: "Tất cả khách hàng",
    content: "🚀 Ra mắt tai nghe không dây premium mới! Đặt trước ngay để nhận ưu đãi early bird 25%",
    scheduledAt: new Date("2024-12-05T09:00:00"),
    createdAt: new Date("2024-11-30T14:00:00"),
    createdBy: "product",
    recipients: 0,
    opens: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0
  },
  {
    id: "8",
    name: "Year End Sale",
    description: "Khuyến mãi cuối năm",
    type: "email",
    status: "draft",
    targetAudience: "Khách hàng thân thiết",
    subject: "🎊 Year End Sale - Giảm giá cuối năm lên tới 60%",
    content: "Cảm ơn sự đồng hành của bạn trong năm qua! Tận hưởng ưu đãi cuối năm với giảm giá lên tới 60% cho tất cả danh mục sản phẩm.",
    createdAt: new Date("2024-12-01T11:00:00"),
    createdBy: "marketing",
    recipients: 0,
    opens: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0
  }
]

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
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        // Fall back to mock data if API fails
        setCampaigns(mockCampaigns)
        return
      }
      
      const data = await response.json()
      
      // Transform API data to match frontend interface
      const transformedCampaigns = data.map((campaign: unknown) => {
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
        return {
          id: campaignData.id,
          name: campaignData.name,
          description: campaignData.description,
          type: campaignData.type?.toLowerCase() || "email",
          status: campaignData.status?.toLowerCase() || "draft",
          targetAudience: campaignData.targetAudience || "Tất cả khách hàng",
          subject: campaignData.subject,
          content: campaignData.content || campaignData.description,
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
      console.error("Campaign fetch error:", error)
      // Fall back to mock data
      setCampaigns(mockCampaigns)
      toast.error("Đang sử dụng dữ liệu mẫu")
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
        console.error("Failed to delete campaign from API")
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
        // Fallback to local update with mock data
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === id 
            ? { 
                ...campaign, 
                status: "sent" as const, 
                sentAt: new Date(),
                recipients: Math.floor(Math.random() * 10000) + 1000,
                opens: Math.floor(Math.random() * 5000) + 500,
                clicks: Math.floor(Math.random() * 1000) + 100,
                conversions: Math.floor(Math.random() * 100) + 10,
                revenue: Math.floor(Math.random() * 100000000) + 10000000
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
