"use client"

import { useState, useEffect } from "react"
import { BannerList } from "@/components/banners/BannerList"
import { BannerForm } from "@/components/banners/BannerForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api-client"
import { Banner, BannerListResponse } from "@/types/banner"
import { Plus, RefreshCw } from "lucide-react"

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [total, setTotal] = useState(0)
  const { toast } = useToast()

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getBanners()
      const data = response.data as BannerListResponse
      setBanners(data.items || [])
      setTotal(data.total || 0)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách banner",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleCreate = () => {
    setEditingBanner(null)
    setIsFormOpen(true)
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteBanner(id)
      toast({
        title: "Thành công",
        description: "Đã xóa banner"
      })
      fetchBanners()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa banner",
        variant: "destructive"
      })
    }
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingBanner) {
        await apiClient.updateBanner(editingBanner.id, data)
        toast({
          title: "Thành công",
          description: "Đã cập nhật banner"
        })
      } else {
        await apiClient.createBanner(data)
        toast({
          title: "Thành công", 
          description: "Đã tạo banner mới"
        })
      }
      setIsFormOpen(false)
      fetchBanners()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: editingBanner ? "Không thể cập nhật banner" : "Không thể tạo banner",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý Banner</h2>
            <p className="text-muted-foreground">
              Quản lý banner hiển thị trên website
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBanners}
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm banner
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng số banner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Banner hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {banners.filter(b => b.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Trang chủ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {banners.filter(b => b.page === 'home').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Trang khác
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {banners.filter(b => b.page !== 'home').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Banner</CardTitle>
            <CardDescription>
              Quản lý tất cả banner trên website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BannerList
              banners={banners}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        {isFormOpen && (
          <BannerForm
            banner={editingBanner}
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
  )
}
